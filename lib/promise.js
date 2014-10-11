/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 *
 * TODO work and progress
 *
 * @fileoverview Promise
 */
import {isFunction, isObject, noop, bind, bindPartial} from "./base";
import asap from "./asap";

var PENDING   = void 0
var SEALED    = 0
var FULFILLED = 1
var REJECTED  = 2

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

  if (noop === resolver) return
  if (!isFunction(resolver)) throw new TypeError("requires a resolver function")
  if (!(this instanceof Promise)) throw new TypeError("Promise needs new")

  invokeResolver(resolver, this)
}
Promise.prototype.constructor = Promise

function invokeResolver(resolver, promise) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value)
    }, function rejectPromise(reason) {
      reject(promise, reason)
    })
  } catch(e) {
    reject(promise, e)
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
  var state = this._state, child, detail

  if (state === FULFILLED && !opt_success || state === REJECTED && !opt_errback) return this

  child = new Promise(noop)
  if (state) {
    detail = this._detail
    asap(function invokePromiseCallback() {
      invokeCallback(state, child, (state - 1) ? opt_errback : opt_success, detail)
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
  case 2: return this.then(bind(success, opt_scope), void 0, void 0)
  default: return this.then(bindPartial.apply(null, arguments), void 0, void 0)
  }
}

/**
 * @param {!function(*):?} errback
 * @param {*=} opt_scope
 * @param {...*} var_args
 * @return {IThenable.<RESULT>}
 * @template RESULT
 */
Promise.prototype.caught = function(errback, opt_scope, var_args) {
  switch (arguments.length) {
  case 0:
  case 1: return this.then(void 0, errback, void 0)
  case 2: return this.then(void 0, bind(errback, opt_scope), void 0)
  default: return this.then(void 0, bindPartial.apply(null, arguments), void 0)
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
  case 2: return this.then(void 0, void 0, bind(callback, opt_scope))
  default: return this.then(void 0, void 0, bindPartial.apply(null, arguments))
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
Promise.prototype.lastly = function(callback, opt_scope, var_args) {
  if (!callback) return this.then(void 0, void 0, void 0)
  var fn
  switch (arguments.length) {
  case 1:  fn = callback; break
  case 2:  fn = bind(callback, opt_scope); break
  default: fn = bindPartial.apply(null, arguments)
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
Promise.resolve = function(opt_value) {
  return new Promise(function(resolve){ resolve(opt_value) })
}

/**
 * @param {*=} opt_error
 * @return {!Promise}
 */
Promise.reject = function(opt_error) {
  return new Promise(function(_, reject){ reject(opt_error) })
}


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
    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail)
    }
  }

  promise._subscribers = void 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var value, error, succeeded, failed, hasCallback = isFunction(callback)

  if (hasCallback) {
    // TODO optimise tryCatch https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#2-unsupported-syntax
    try {
      value = callback(detail)
      succeeded = true
    } catch(e) {
      failed = true
      error = e
    }

    if (value === promise) {
      reject(promise, new TypeError('Same promise returned'))
      return
    }
  } else {
    value = detail
    succeeded = true
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (isObject(value)) {
    handleMaybeThenable(promise, value);
  } else {
    fulfill(promise, value);
  }
}

function ErrorObject() {
  this.error = null;
}

var GET_THEN_ERROR = new ErrorObject();

function getThen(promise) {
  try {
    return promise.then;
  } catch(error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}


function handleMaybeThenable(promise, maybeThenable) {
  if (maybeThenable.constructor === Promise) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    var then = getThen(maybeThenable);
    if (then === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
    } else if (then === void 0) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then)) {
      handleForeignThenable(promise, maybeThenable, then);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._detail);
  } else if (promise._state === REJECTED) {
    reject(promise, thenable._detail);
  } else {
    subscribe(thenable, void 0, function(value) {
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function(reason) {
      reject(promise, reason);
    });
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function(promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function(value) {
      if (sealed) { return; }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function(reason) {
      if (sealed) { return; }
      sealed = true;

      reject(promise, reason);
    });

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch(e) {
    return e;
  }
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) return
  promise._state = SEALED;
  promise._detail = value;
  asap(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) return
  promise._state = SEALED;
  promise._detail = reason;
  asap(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

export default Promise;
