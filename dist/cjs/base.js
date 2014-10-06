"use strict";
;
var _win = typeof window !== 'undefined' && window;
var _perf = _win && (_win.performance || _win["msPerformance"]);
var _perfStart = _perf && _perf.timing && _perf.timing.domLoading;
var _start = _perfStart || new Date().getTime();
var _slice = Array.prototype.slice;

/**
 * @param {*} value
 * @return {boolean}
 */
function isUndefined(value) {
  return value === void 0
}

/**
 * @param {*} value
 * @return {boolean}
 */
function isString(value) {
  return typeof value === 'string'
}

/**
 * @param {*} value
 * @return {boolean}
 */
function isNumber(value) {
  return typeof value === 'number'
}

/**
 * @param {*} val
 * @return {boolean}
 */
function isObject(val) {
  var type = typeof val
  return (type === 'object' && val !== null || type === 'function')
}

/**
 * @param {*} val
 * @return {boolean}
 */
function isFunction(val) {
  var className = Object.prototype.toString.call(/** @type {Object} */(val))
  return className === '[object Function]' || !!(val && typeof val.call !== 'undefined' &&
                                                 typeof val.propertyIsEnumerable !== 'undefined' &&
                                                 !val.propertyIsEnumerable('call'))
}

/**
 * @param {*} value
 * @return {boolean}
 */
var isArray = typeof Array.isArray === 'function' ?
  Array.isArray : function base$isArray(value) {
    return '[object Array]' === Object.prototype.toString.call(/** @type {Object} */ (value))
  }

/**
 * @param {*} val
 * @return {boolean}
 */
function isArrayLike(val) {
  var type = typeof val
  return type === 'array' || ((type === 'object' && val !== null || type === 'function') && typeof val.length === 'number')
}

/**
 */
function noop() {}

/**
 * @param {?function(this:T, ...)} fn
 * @param {T} selfObj
 * @param {...*} var_args
 * @return {!Function}
 * @template T
 */
var bind = Function.prototype.bind ?
  function $bind(fn, selfObj, var_args) {
    return /** @type {!Function} */(fn.call.apply(fn.bind, arguments))
  } : function $$bind(fn, selfObj, var_args) {
    if (arguments.length < 3) return function(){ return fn.apply(selfObj, arguments) }
    var args = _slice.call(arguments, 2)
    return function() {
      var newArgs = _slice.call(arguments, 0)
      Array.prototype.unshift.apply(newArgs, args)
      return fn.apply(selfObj, newArgs)
    }
  }

/**
 * @param {!function(this:S, ?): ?} fn
 * @param {S=} opt_obj
 * @param {number=} opt_arity
 * @return {!function(?):?}
 * @template S
 */
function curry(fn, opt_obj, opt_arity) {
  var len = (+opt_arity || fn.length)
  function curry$accumulator(args, newArgs) {
    if (newArgs.length === 0) return function() { return curry$accumulator(args, arguments) }
    args = _slice.call(args, 0)
    args.push.apply(args, newArgs)
    return args.length >= len ?
      fn.apply(opt_obj, _slice.call(args, 0, len)) :
      function() { return curry$accumulator(args, arguments) }
  }
  return function $curry() { return curry$accumulator([], arguments) }
}

/**
 * @param {!function(?):?} fn
 * @param {...*} var_args
 * @return {!function(?):?}
 */
function partial(fn, var_args) {
  var args = _slice.call(arguments, 1)
  return function $partial() {
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
function bindPartial(fn, selfObj, var_args) {
  var args = _slice.call(arguments, 2)
  return function $bindPartial() {
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
function partialRight(fn, var_args) {
  var args = _slice.call(arguments, 1)
  return function $partialRight() {
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
function compose(fn1, fn2, var_args) {
  var funcs = arguments
  return function $compose() {
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
function once(fn, var_args) {
  var args = _slice.call(arguments, 1), result = _waiting
  return function $once() {
    if (result !== _waiting) return result
    args.push.apply(args, arguments)
    result = fn.apply(this, args)
    fn = once
    args = void 0
    return /** @type {Function}*/(result)
  }
}

/**
 * @param {!Array|NodeList|Arguments|{length: number}} object
 * @return {!Array}
 */
function toArray(object) {
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
  function $$indexOf(value, search, opt_fromIndex) {
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


/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
 *
 * @param {!function(T, number, ?): ?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @template T
 */
var forEach = Array.prototype.forEach ?
  function $forEach(fn, value) {
    Array.prototype.forEach.call(value, fn)
  } : function $$forEach(fn, value) {
    var i = -1, len = value.length >>> 0
    while (++i < len) {
      if (i in value) fn(value[i], i, value)
    }
  }

/**
 * @param {!function(this: S, T, number, ?): ?} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @template T,S
 */
var bindForEach = Array.prototype.forEach ?
  function $bindForEach(fn, selfObj, value) {
    Array.prototype.forEach.call(value, fn, selfObj)
  } : function $bindForEach(fn, selfObj, value) {
    var i = -1, len = value.length >>> 0
    while (++i < len) {
      if (i in value) fn.call(selfObj, value[i], i, value)
    }
  }

/**
 * @param {!function(T, number, ?): ?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {*}
 * @template T
 */
function find(fn, value) {
  var i = -1, len = value.length >>> 0, tag
  while (++i < len) {
    if (i in value) {
      if (fn(tag = value[i], i, value)) return tag
    }
  }
}

/**
 * @param {Object} target
 * @param {...Object} var_args
 * @return {Object}
 */
function extend(target, var_args) {
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
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {!function(T, number, ?):boolean} fn
 * @param {Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T
 */
var filter = Array.prototype.filter ?
  function $filter(fn, value) {
    return Array.prototype.filter.call(value, fn)
  } : function $$filter(fn, value) {
    var i = -1, resultLen = 0, result = [], len = value.length >>> 0, val
    while (++i < len) {
      if (i in value) {
        val = value[i]
        if (fn(val, i, value)) result[resultLen++] = val
      }
    }
    return result
  }

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
  function $bindFilter(fn, selfObj, value) {
    return Array.prototype.filter.call(value, fn, selfObj)
  } : function $bindFilter(fn, selfObj, value) {
    var i = -1, resultLen = 0, len = value.length >>> 0, result = [], val
    while (++i < len) {
      if (i in value) {
        val = value[i]
        if (fn.call(selfObj, val, i, value)) result[resultLen++] = val
      }
    }
    return result
  }

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 * @param {!function(T, number, ?):?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T
 */
var map = Array.prototype.map ?
  function $map(fn, value) {
    return Array.prototype.map.call(value, fn)
  } : function $map(fn, value) {
    var i = -1, len = value.length >>> 0, result = new Array(len)
    while (++i < len) result[i] = fn(value[i], i, value)
    return result
  }

/**
 * @param {!function(this:S, T, number, ?):?} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T,S
 */
var bindMap = Array.prototype.map ?
  function $bindMap(fn, selfObj, value) {
    return Array.prototype.map.call(value, fn, selfObj)
  } : function $bindMap(fn, selfObj, value) {
    var i = -1, len = value.length >>> 0, result = new Array(len)
    while (++i < len) result[i] = fn.call(selfObj, value[i], i, value)
    return result
  }

// TODO add reduce

/**
 * @param {!number} time
 * @param {boolean=} opt_ifDate
 */
function overrideStart(time, opt_ifDate) {
  if (!(opt_ifDate && _perfStart)) _start = time
}

/**
 * @return {!number}
 */
function start() { return _start }

/**
 * @return {number} Current time in milliseconds since the epoch.
 */
var now = Date.now || function $now() { return new Date().getTime() }

/**
 * @param {number=} opt_time
 * @return {number}
 */
function since(opt_time) {
  return now() -(opt_time || _start)
}

/**
 * @param {number=} opt_start
 * @final
 * @constructor
 */
function Timer(opt_start) {
  this._start = opt_start || Timer.now()
}

/**
 * @type {number}
 * @private
 */
Timer.prototype._start = 0;

/**
 * @type {number}
 * @private
 */
Timer.prototype._stop = -1;

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
function escapeHTML(value) {
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
function unescapeHTML(value) {
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
];

exports.isUndefined = isUndefined, exports.isString = isString, exports.isNumber = isNumber, exports.isObject = isObject, exports.isFunction = isFunction, exports.isArray = isArray, exports.isArrayLike = isArrayLike, exports.noop = noop, exports.bind = bind, exports.curry = curry, exports.partial = partial, exports.bindPartial = bindPartial, exports.partialRight = partialRight, exports.compose = compose, exports.once = once, exports.filter = filter, exports.bindFilter = bindFilter, exports.map = map, exports.bindMap = bindMap, exports.forEach = forEach, exports.bindForEach = bindForEach, exports.find = find, exports.toArray = toArray, exports.indexOf = indexOf, exports.extend = extend, exports.overrideStart = overrideStart, exports.start = start, exports.now = now, exports.since = since, exports.Timer = Timer, exports.escapeHTML = escapeHTML, exports.unescapeHTML = unescapeHTML;

//# sourceMappingURL=base.js.map