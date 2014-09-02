/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 * @fileoverview Base utils
 */
var _win = typeof window !== 'undefined' && window
var _perf = _win && (_win.performance || _win["msPerformance"])
var _perfStart = _perf && _perf.timing && _perf.timing.domLoading
var _start = _perfStart || new Date().getTime()
var _slice = Array.prototype.slice;

/**
 * @param {*} value
 * @return {boolean}
 */
export function isUndefined(value) {
  return value === void 0
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function isString(value) {
  return typeof value === 'string'
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function isNumber(value) {
  return typeof value === 'number'
}

/**
 * @param {*} val
 * @return {boolean}
 */
export function isObject(val) {
  var type = typeof val
  return (type === 'object' && val !== null || type === 'function')
}

/**
 * @param {*} val
 * @return {boolean}
 */
export function isFunction(val) {
  var className = Object.prototype.toString.call(/** @type {Object} */(val))
  return className === '[object Function]' || !!(val && typeof val.call !== 'undefined' && typeof val.propertyIsEnumerable !== 'undefined' && !val.propertyIsEnumerable('call'))
}

/**
 * @param {*} value
 * @return {boolean}
 */
var isArray = typeof Array.isArray === 'function' ?
  Array.isArray : function cohesive$isArray(value) {
    return '[object Array]' === Object.prototype.toString.call(/** @type {Object} */ (value))
  }
export {isArray};

/**
 * @param {*} val
 * @return {boolean}
 */
export function isArrayLike(val) {
  var type = typeof val
  return type === 'array' || ((type === 'object' && val !== null || type === 'function') && typeof val.length === 'number')
}

/**
 */
export function noop() {}

/**
 * @param {?function(this:T, ...)} fn
 * @param {T} selfObj
 * @param {...*} var_args
 * @return {!Function}
 * @template T
 */
var bind = Function.prototype.bind ?
  function cohesive$bind(fn, selfObj, var_args) {
    return /** @type {!Function} */(fn.call.apply(fn.bind, arguments))
  } : function cohesive$$bind(fn, selfObj, var_args) {
    if (arguments.length < 3) return function(){ return fn.apply(selfObj, arguments) }
    var args = _slice.call(arguments, 2)
    return function() {
      var newArgs = _slice.call(arguments, 0)
      Array.prototype.unshift.apply(newArgs, args)
      return fn.apply(selfObj, newArgs)
    }
  }
export {bind}

/**
 * @param {!function(this:S, ?): ?} fn
 * @param {S=} opt_obj
 * @param {number=} opt_arity
 * @return {!function(?):?}
 * @template S
 */
export function curry(fn, opt_obj, opt_arity) {
  var len = (+opt_arity || fn.length)
  function accumulator(args, opt_newArgs) {
    if (!opt_newArgs) return function() { return accumulator(args, arguments) }
    args = _slice.call(args, 0)
    args.push.apply(args, opt_newArgs)
    return args.length >= len ?
      fn.apply(opt_obj, _slice.call(args, 0, len)) :
      function() { return accumulator(args, arguments) }
  }
  return function cohesive$curry() { return accumulator([], arguments) }
}

/**
 * @param {!function(?):?} fn
 * @param {...*} var_args
 * @return {!function(?):?}
 */
export function partial(fn, var_args) {
  var args = _slice.call(arguments, 1)
  return function cohesive$partial() {
    var newArgs = _slice.call(args, 0)
    newArgs.push.apply(newArgs, arguments)
    return fn.apply(this, newArgs)
  }
}

/**
 * @param {!function(this:T,?): ?} fn
 * @param {!T} selfObj
 * @param {...*} var_args
 * @return {!function(?):?}
 * @template T
 */
export function bindPartial(fn, selfObj, var_args) {
  var args = _slice.call(arguments, 2)
  return function cohesive$bindPartial() {
    var newArgs = _slice.call(args, 0)
    newArgs.push.apply(newArgs, arguments)
    return fn.apply(selfObj, newArgs)
  }
}

/**
 * @param {!function(?):?} fn
 * @param {...*} var_args
 * @return {!function(?):?}
 */
export function partialRight(fn, var_args) {
  var args = _slice.call(arguments, 1)
  return function cohesive$partialRight() {
    var newArgs = _slice.call(arguments, 0)
    newArgs.push.apply(newArgs, args)
    return fn.apply(this, newArgs)
  }
}

/**
 * @param {!function(?):*} fn1
 * @param {!function(?):*} fn2
 * @param {...function(?):*} var_args
 * @return {!function(?):*}
 */
export function compose(fn1, fn2, var_args) {
  var funcs = arguments
  return function cohesive$compose() {
    var len = funcs.length, args = arguments
    while (len--) args = [funcs[len].apply(this, args)]
    return args
  }
}

/** @const */
var _waiting = {}

/**
 * @param {?function(...)} fn
 * @param {...*} var_args
 * @return {!Function}
 */
export function once(fn, var_args) {
  var args = _slice.call(arguments, 1), result = _waiting
  return function cohesive$once() {
    if (result !== _waiting) return result
    args.push.apply(args, arguments)
    result = fn.apply(this, args)
    fn = once
    args = void 0
    return /** @type {Function}*/(result)
  }
}

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {!function(T, number, ?):boolean} fn
 * @param {Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T
 */
var filter = Array.prototype.filter ?
  function cohesive$filter(fn, value) {
    return Array.prototype.filter.call(value, fn)
  } : function cohesive$$filter(fn, value) {
    var i = -1, resultLen = 0, result = [], len = value.length >>> 0, val
    while (++i < len) {
      if (i in value) {
        val = value[i]
        if (fn(val, i, value)) result[resultLen++] = val
      }
    }
    return result
  }
export {filter}

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {!function(this:S, T, number, ?):boolean} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T,S
 */
var bindFilter = Array.prototype.filter ?
  function cohesive$bindFilter(fn, selfObj, value) {
    return Array.prototype.filter.call(value, fn, selfObj)
  } : function cohesive$$bindFilter(fn, selfObj, value) {
    var i = -1, resultLen = 0, len = value.length >>> 0, result = [], val
    while (++i < len) {
      if (i in value) {
        val = value[i]
        if (fn.call(selfObj, val, i, value)) result[resultLen++] = val
      }
    }
    return result
  }
export {bindFilter}

// TODO add reduce
/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 * @param {!function(T, number, ?):?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T
 */
var map = Array.prototype.map ?
  function cohesive$map(fn, value) {
    return Array.prototype.map.call(value, fn)
  } : function cohesive$$map(fn, value) {
    var i = -1, len = value.length >>> 0, result = new Array(len)
    while (++i < len) result[i] = fn(value[i], i, value)
    return result
  }
export {map}

/**
 * @param {!function(this:S, T, number, ?):?} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T,S
 */
var bindMap = Array.prototype.map ?
  function cohesive$bindMap(fn, selfObj, value) {
    return Array.prototype.map.call(value, fn, selfObj)
  } : function cohesive$$bindMap(fn, selfObj, value) {
    var i = -1, len = value.length >>> 0, result = new Array(len)
    while (++i < len) result[i] = fn.call(selfObj, value[i], i, value)
    return result
  }
export {bindMap}

/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
 *
 * @param {!function(T, number, ?): ?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @template T
 */
var forEach = Array.prototype.forEach ?
  function cohesive$forEach(fn, value) {
    Array.prototype.forEach.call(value, fn)
  } : function cohesive$$forEach(fn, value) {
    var i = -1, len = value.length >>> 0
    while (++i < len) {
      if (i in value) fn(value[i], i, value)
    }
  }
export {forEach}

/**
 * @param {!function(this: S, T, number, ?): ?} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @template T,S
 */
var bindForEach = Array.prototype.forEach ?
  function cohesive$bindForEach(fn, selfObj, value) {
    Array.prototype.forEach.call(value, fn, selfObj)
  } : function cohesive$$bindForEach(fn, selfObj, value) {
    var i = -1, len = value.length >>> 0
    while (++i < len) {
      if (i in value) fn.call(selfObj, value[i], i, value)
    }
  }
export {bindForEach}

/**
 * @param {!function(T, number, ?): ?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {*}
 * @template T
 */
export function find(fn, value) {
  var i = -1, len = value.length >>> 0, tag
  while (++i < len) {
    if (i in value) {
      if (fn(tag = value[i], i, value)) return tag
    }
  }
}

/**
 * @param {!Array|NodeList|Arguments|{length: number}} object
 * @return {!Array}
 */
export function toArray(object) {
  var len = object.length >>> 0, rv = new Array(len), i
  if (len > 0) {
    for (i = 0; i < len; i++) rv[i] = object[i]
  }
  return rv
}

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 * @param {!Array|NodeList|Arguments|{length: number}} value
 * @param {*} search
 * @param {number=} opt_fromIndex
 * @return {number}
 */
var indexOf = Array.prototype.indexOf ?
  function $indexOf(value, search, opt_fromIndex) {
    return Array.prototype.indexOf.call(value, search, opt_fromIndex)
  } : function $$indexOf(value, search, opt_fromIndex) {
    var length = value.length >>> 0, fromIndex = +opt_fromIndex || 0
    if (fromIndex < 0) {
      fromIndex += length
      if (fromIndex < 0) fromIndex = 0
    }
    for (;fromIndex < length; fromIndex++) {
      if (value[fromIndex] === search) return fromIndex
    }
    return -1
  }
export {indexOf}

/**
 * @param {Object} target
 * @param {...Object} var_args
 * @return {Object}
 */
export function extend(target, var_args) {
  var key, source, i, j
  for (i = 1; i < arguments.length; i++) {
    source = arguments[i]
    for (key in source) {
      if (key in source) target[key] = source[key]
    }
    for (j = 0; j < _OBJECT_PROTOTYPE_FIELDS.length; j++) {
      key = _OBJECT_PROTOTYPE_FIELDS[j]
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

/**
 * @param {!number} time
 * @param {boolean=} opt_ifDate
 */
export function overrideStart(time, opt_ifDate) {
  if (!(opt_ifDate && _perfStart)) _start = time
}

/**
 * @return {!number}
 */
export function start() { return _start }

/**
 * @return {number} Current time in milliseconds since the epoch.
 */
var now = Date.now || function cohesive$now() { return new Date().getTime() }
export {now}

/**
 * @param {number=} opt_time
 * @return {number}
 */
export function since(opt_time) {
  return now() -(opt_time || _start)
}

/**
 * @param {number=} opt_start
 * @final
 * @constructor
 */
export function Timer(opt_start) {
  this._start = opt_start || Timer.now()
}

/**
 * @type {number}
 * @private
 */
Timer.prototype._start = 0

/**
 * @type {number}
 * @private
 */
Timer.prototype._stop = -1

/** @return {!number} */
Timer.prototype.since = function() {
  return (~this._stop ? this._stop : Timer.now())  - this._start
}

/** @return {!number} */
Timer.prototype.stop = function() {
  return (this._stop = Timer.now()) - this._start
}

/**
 * @param {number=} opt_start
 */
Timer.prototype.reset = function(opt_start) {
  this._start = opt_start || Timer.now()
  this._stop = -1
}

/**
 * @return {!number}
 */
Timer.now = _perf && _perf.now ?
  function() { return _perf.now() } : function() { return now() - _start }

/** @const */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

/**
 * @param {string} value
 * @returns {string}
 */
export function escapeHTML(value) {
  return !value ? '' : String(value).replace(/[&<>"']/g, function escapeHTMLChar(match) {
    return htmlEscapes[match]
  })
}

/** @const */
var htmlUnescapes = {
  '&amp;':  '&',
  '&lt;':   '<',
  '&gt;':   '>',
  '&quot;': '"',
  '&#39;':  "'"
}

/**
 * @param {string} value
 * @returns {string}
 */
export function unescapeHTML(value) {
  return !value ? '' : String(value).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;)/g, function unescapeHTMLChar(match) {
    return htmlUnescapes[match]
  })
}

/**
 * @type {Array.<string>}
 * @private
 */
var _OBJECT_PROTOTYPE_FIELDS = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
]
