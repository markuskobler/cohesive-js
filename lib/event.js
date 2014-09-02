/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 * @fileoverview event listeners and EventTarget
 */
import {isString, isArray, extend} from "./base";

/**
 * @param {Element|Window} el
 * @param {string} type
 * @param {!function(!Event): (boolean|undefined)} fn
 * @return {!function(!Event): (boolean|undefined)}
 */
export function listen(el, type, fn) {
  if (el.addEventListener) {
    applyListener(type, function(t) { el.addEventListener(t, fn, false) })
  } else if (el.detachEvent) {
    applyListener(type, function(t) { el.attachEvent('on' + t, fn) })
  } else {
    throw Error("Could not attach listener")
  }
  return fn
}

/**
 * @param {string} type
 * @param {!function(!Event): (boolean|undefined)} fn
 * @return {!function(!Event): (boolean|undefined)}
 */
export function listenOnce(el, type, fn) {
  var detach;
  if (el.addEventListener) {
    applyListener(type, function(t) {
      detach = function(evt){ el.removeEventListener(t, detach, false); return fn(evt) }
      el.addEventListener(t, detach, false)
    })
  } else if (el.detachEvent) {
    applyListener(type, function(t) {
      detach = function(evt){ el.detachEvent('on' + t, fn); return fn(evt) }
      el.attachEvent('on' + t, detach)
    })
  } else {
    throw Error("Could not attach listener")
  }
  return detach
}


/**
 * @param {Element|Window} el
 * @param {string|Array.<string>} type
 * @param {!function(!Event): (boolean|undefined)} fn
 */
export function unlisten(el, type, fn) {
  if (el.addEventListener) {
    applyListener(type, function(t) { el.removeEventListener(t, fn, false) })
  } else if (el.detachEvent) {
    applyListener(type, function(t) { el.detachEvent('on' + t, fn) })
  } else {
    throw Error("Could not deattach listener")
  }
}

/**
 * @param {string|Array.<string>} type
 * @param {!function(string)} fn
 * @private
 */
function applyListener(type, fn) {
  if (isArray(type)) {
    for (var i=0; i < type.length; i++) fn(type[i])
  } else {
    fn(/** @type {string}*/(type))
  }
}

/**
 * @param {string} type
 * @param {Object=} opt_target
 * @constructor
 */
export function Event(type, opt_target) {
  /** @type {string} */
  this.type = String(type);

  /** @type {EventTarget|Object|null} */
  this.target = opt_target || null;

  /** @type {Object|undefined} */
  this.currentTarget = this.target;

  /**
   * @type {boolean}
   * @protected
   */
  this._stopped = false;
}

/**
 */
Event.prototype.stopPropagation = function() {
  this._stopped = true;
}


/**
 * TODO Extract into mixin's
 * @param {EventTarget=} opt_parent
 * @param {Object=} opt_scope
 * @constructor
 */
export function EventTarget(opt_parent, opt_scope) {
  /**
   * @type {EventTarget|undefined}
   * @private
   */
  this._parent = opt_parent;

  /**
   * @type {Object.<string, !Array.<!function(?):?|{handleEvent:function(?):?}>>}
   * @private
   */
  this._listeners = {};

  /**
   * @type {Object}
   */
  this._scope = opt_scope || this;
}

/**
 * @return {EventTarget|undefined}
 */
EventTarget.prototype.getParentEventTarget = function() {
  return this._parent;
}

/**
 * @param {EventTarget} parent
 */
EventTarget.prototype.setParentEventTarget = function(parent) {
  this._parent = parent || null;
}

/**
 *
 */
EventTarget.prototype.bindEventListeners = function(scope) {
  this._scope = scope;
}

/**
 * @param {string|Array.<string>} type
 * @param {!function(!Event): (boolean|undefined)} fn
 * @param {T=} opt_scope
 * @return {EventTarget}
 * @template T
 */
EventTarget.prototype.listen = function(type, fn, opt_scope) {
  if (isArray(type)) {
    for (var i=0; i < type.length; i++) {
      addListener(this._listeners, type[i].toString(), false, fn, opt_scope)
    }
  } else {
    addListener(this._listeners, type.toString(), false, fn, opt_scope)
  }
  return this
}

/**
 * @param {string|Array.<string>} type
 * @param {!function(!Event): (boolean|undefined)} fn
 * @param {T=} opt_scope
 * @return {EventTarget}
 * @template T
 */
EventTarget.prototype.listenOnce = function(type, fn, opt_scope) {
  addListener(this._listeners, type.toString(), true, fn, opt_scope)
  return this
}

/**
 * @param {string|Array.<string>} type
 * @param {!function(!Event): (boolean|undefined)} fn
 * @param {T=} opt_scope
 * @return {EventTarget}
 * @template T
 */
EventTarget.prototype.unlisten = function(type, fn, opt_scope) {
  if (isArray(type)) {
    for (var i=0; i < type.length; i++) {
      removeListener(this._listeners, type[i].toString(), false, fn, opt_scope)
    }
  } else {
    removeListener(this._listeners, type.toString(), false, fn, opt_scope)
  }
  return this
}

/**
 * @param {string} type
 * @param {!function(!Event): (boolean|undefined)} listener
 */
EventTarget.prototype.addEventListener = function(type, listener) {
  this.listen(type, listener)
}

/**
 * @param {string} type
 * @param {!function(!Event): (boolean|undefined)} listener
 */
EventTarget.prototype.removeEventListener = function(type, listener) {
  this.unlisten(type, listener)
}

/**
 * @param {string|Object|Event} evt
 * @return {boolean}
 */
EventTarget.prototype.dispatchEvent = function(evt) {
  var ct = this, rv = true, type = evt.type || /** @type {string} */ (evt);
  if (isString(evt)) {
    evt = new Event(/** @type {string} */(evt), this);
  } else if (!(evt instanceof Event)) {
    evt = /** @type {Event} */(extend(new Event(type, this), /** @type {Object}*/(evt)));
  } else {
    evt.target = evt.target || this;
    evt.currentTarget = this;
  }

  rv = fireListeners(type, evt) && rv;
  for (; !evt._stopped && (ct = evt.currentTarget = ct.getParentEventTarget()); ) {
    rv = fireListeners(type, evt) && rv;
  }
  return rv
}

/**
 * @param {string=} opt_type
 * @return {number}
 */
EventTarget.prototype.removeAllListeners = function(opt_type) {
  var i, t, tl, count = 0, type = opt_type && opt_type.toString();
  for (t in this._listeners) {
    if (!type || t === type) {
      tl = this._listeners[t];
      for (i = 0; i < tl.length; i++, count++) {
        tl[i].dispose();
      }
      delete this._listeners[t];
    }
  }
  return count;
}

/**
 * TODO make sure closure compiler does not squash method name
 * http://www.w3.org/TR/DOM-Level-2-Events/eventss.html#Events-EventListener
 * @param {Event} evt
 */
EventTarget.prototype.handleEvent = function(evt) {
  this.dispatchEvent(evt)
}

/**
 *
 */
EventTarget.prototype.dispose = function() {
  this.removeAllListeners();
  this._parent = null;
  this._scope = null;
}


/**
 * @param {boolean} once
 * @param {!function(this:T,?):?|{handleEvent: function (?): ?}} fn
 * @param {T=} opt_scope
 * @template T
 * @private
 * @constructor
 */
function Listener(once, fn, opt_scope) {
  /**
   *
   */
  this._fn = fn;

  /**
   * @type {boolean}
   */
  this._once = !!once;

  /**
   *
   */
  this._scope = opt_scope;
}

/**
 *
 */
Listener.prototype.dispose = function() {
  this._fn = null;
  this._once = false;
  this._scope = null;
}

/**
 * @param {Object.<string, !Array.<!Listener>>} listeners
 * @param {string} type
 * @param {boolean} once
 * @param {!function(this:T,?):?|{handleEvent: function (?): ?}} fn
 * @param {T=} opt_scope
 * @template T
 * @private
 */
function addListener(listeners, type, once, fn, opt_scope) {
  var l, tl = listeners[type];
  if (!tl) {
    listeners[type] = [new Listener(once, fn, opt_scope)]
    return fn
  }
  l = lookupListener();
  if (!l) {
    tl.push(new Listener(once, fn, opt_scope));
  } else if (!once) {
    l._once = false;
  }
  return fn
}

/**
 * @param {Object.<string, !Array.<!Listener>>} listeners
 * @param {string} type
 * @param {boolean} once
 * @param {!function(this:T,?):?|{handleEvent: function (?): ?}} fn
 * @param {T=} opt_scope
 * @template T
 * @private
 */
function removeListener(listeners, type, once, fn, opt_scope) {
  var i, l, tl = listeners[type];
  if (!tl) return false
  for (i = 0; i < tl.length; ++i) {
    l = tl[i];
    if (l._fn === fn && l._scope === opt_scope) {
      l.dispose()
      tl.splice(i, 1)
      if (tl.length === 0) {
        delete listeners[type]
      }
      return true
    }
  }
  return false
}

/**
 * @param {!Array.<!Listener>} listeners
 * @param {!function(this:T,?):?|{handleEvent: function (?): ?}} fn
 * @param {T=} opt_scope
 * @private
 * @template T
 */
function lookupListener(listeners, fn, opt_scope) {
  for (var i = 0; i < listeners.length; ++i) {
    var l = listeners[i];
    if (l._fn === fn && l._scope === opt_scope) {
      return l;
    }
  }
}

/**
 * @param {string} type
 * @param {Event} evt
 * @private
 */
function fireListeners(type, evt) {
  var l, i=0, rv = true, src = evt.currentTarget, tl = src._listeners[type.toString()];
  if (!tl) return true
  tl = Array.prototype.slice.call(tl, 0);
  for (l = tl[i]; i < tl.length; l = tl[++i]) {
    if (l._fn) {
      if (l._once) removeListener(src._listeners, type, true, l._fn, l._scope)
      rv = l._fn.call(l._scope || src._scope, evt) !== false && rv;
    }
  }
  return rv;
}
