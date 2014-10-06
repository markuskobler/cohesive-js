"use strict";
;
var base$$ = require("./base"), asap$$ = require("./asap");

var PENDING   = void 0;
var SEALED    = 0;
var FULFILLED = 1;
var REJECTED  = 2;

/**
 * @see http://dom.spec.whatwg.org/#futures
 * @param {function(function((TYPE|IThenable.<TYPE>|Thenable)),function(*))} resolver
 * @constructor
 * @implements {IThenable.<TYPE>}
 * @template TYPE
 */
var Promise = function(resolver) {
  /** @type {number|undefined} */
  this._state       = PENDING
  this._subscribers = void 0
  this._detail      = void 0
  invokeResolver(resolver, this)
};

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value)
  }

  function rejectPromise(reason) {
    reject(promise, reason)
  }

  try {
    resolver(resolvePromise, rejectPromise)
  } catch(e) {
    rejectPromise(e)
  }
}

/**
 * @param {(function(TYPE):(RESULT|IThenable.<RESULT>|Thenable))=} opt_success
 * @param {(function(*): *)=} opt_errback
 * @param {(function(*): *)=} opt_progress
 * @return {IThenable.<RESULT>}
 * @template RESULT
 */
Promise.prototype.then = function(opt_success, opt_errback, opt_progress) {
  var child = new Promise(base$$.noop), parent = this, callbacks = arguments
  if (this._state) {
    asap$$.default(function invokePromiseCallback() {
      var state = parent._state - 1
      invokeCallback(parent._state, child, callbacks[state], parent._detail)
    })
  } else {
    subscribe(this, child, opt_success, opt_errback)
  }
  return child
}

/**
 * @param {!function(*):?} success
 * @param {*=} opt_scope
 * @param {...*} var_args
 * @return {IThenable.<RESULT>}
 * @template RESULT
 */
Promise.prototype.fulfilled = function(success, opt_scope, var_args) {
  switch (arguments.length) {
  case 0:
  case 1: return this.then(success, void 0, void 0)
  case 2: return this.then(base$$.bind(success, opt_scope), void 0, void 0)
  default: return this.then(base$$.bindPartial.apply(null, arguments), void 0, void 0)
  }
}

/**
 * @param {!function(*):?} errback
 * @param {*=} opt_scope
 * @param {...*} var_args
 * @return {IThenable.<RESULT>}
 * @template RESULT
 */
Promise.prototype.caught =
Promise.prototype['catch'] = function(errback, opt_scope, var_args) {
  switch (arguments.length) {
  case 0:
  case 1: return this.then(void 0, errback, void 0)
  case 2: return this.then(void 0, base$$.bind(errback, opt_scope), void 0)
  default: return this.then(void 0, base$$.bindPartial.apply(null, arguments), void 0)
  }
}

/**
 * TODO look carefully at what happens in event of error? (maybe abort?)
 * @param {!function(*)} callback
 * @param {*=} opt_scope
 * @param {...*} var_args
 * @return {IThenable.<RESULT>}
 * @template RESULT
 */
Promise.prototype.progressed = function(callback, opt_scope, var_args) {
  switch (arguments.length) {
  case 0:
  case 1: return this.then(void 0, void 0, callback)
  case 2: return this.then(void 0, void 0, base$$.bind(callback, opt_scope))
  default: return this.then(void 0, void 0, base$$.bindPartial.apply(null, arguments))
  }
}

/**
 * todo check if thenable is similar enough to standard implementations?
 * TODO implement similar tap method?
 * @param {!function(*)} callback
 * @param {*=} opt_scope
 * @param {...*} var_args
 * @return {IThenable.<RESULT>}
 * @template RESULT
 */
Promise.prototype.lastly =
Promise.prototype['finally'] = function(callback, opt_scope, var_args) {
  if (!callback) return this.then(void 0, void 0, void 0)
  var fn
  switch (arguments.length) {
  case 1:  fn = callback; break
  case 2:  fn = base$$.bind(callback, opt_scope); break
  default: fn = base$$.bindPartial.apply(null, arguments)
  }
  function successWrapper(v) {
    fn(v);
    return v;
  }
  function errbackWrapper(v) {
    fn(v);
    throw v;
  }
  return this.then(successWrapper, errbackWrapper, void 0);
}

Promise.prototype.abort = function() {
  if (this._state !== PENDING) return;
  // reject(this, new xhr.AbortError("", "", this._xhr)); // todo move up
  // if (this._xhr ) {
  //     this._xhr.abort();
  //     this._xhr.onreadystatechange = noop;
  // }
}


/**
 * @param {(TYPE|IThenable.<TYPE>)=} opt_value
 * @return {!Promise.<TYPE>}
 * @template TYPE
 */
Promise.resolve = function(opt_value) {}


/**
 * @param {*=} opt_error
 * @return {!Promise}
 */
Promise.reject = function(opt_error) {}


function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers || (parent._subscribers = []), length = subscribers.length
  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;
}

function publish(promise, settled) {
  var child, callback, subscribers = promise._subscribers, detail = promise._detail;
  if (!subscribers) return

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];
    invokeCallback(settled, child, callback, detail);
  }

  promise._subscribers = void 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var value, error, succeeded, failed, hasCallback = base$$.isFunction(callback)

  if (hasCallback) {
    try {
      value = callback(detail);
      succeeded = true;
    } catch(e) {
      failed = true;
      error = e;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    resolve(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function resolve(promise, value) {
  if (promise._state !== PENDING) return;
  promise._state = SEALED;
  promise._detail = value;
  asap$$.default(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) return;
  promise._state = SEALED;
  promise._detail = reason;
  asap$$.default(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

exports["default"] = Promise;
;

//# sourceMappingURL=promise.js.map