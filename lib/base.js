/**
 * cohesive.js | Copyright 2014 Markus Kobler | Apache, Version 2.0
 * @fileoverview Base utils for cohesive.js
 */
var _win = typeof window !== 'undefined' && window
var _perf = _win && (_win.performance || _win["msPerformance"])
var _perfStart = _perf && _perf.timing && _perf.timing.domLoading
var _start = _perfStart || +new Date()

var cohesive = {};
export {cohesive};

/**
 * @param {*} value
 * @return {boolean}
 */
cohesive.isString = function(value) {
  return typeof value === 'string'
};

/**
 * @param {*} value
 * @return {boolean}
 */
cohesive.isNumber = function(value) {
  return typeof value === 'number'
};

/**
 * @param {*} val
 * @return {boolean}
 */
cohesive.isObject = function(val) {
  var type = typeof val
  return (type == 'object' && val !== null || type == 'function')
};

/**
 * @param {*} val
 * @return {boolean}
 */
cohesive.isFunction = function(val) {
  var className = Object.prototype.toString.call(/** @type {Object} */ (val))
  if ((className === '[object Function]' ||
      typeof val.call != 'undefined' &&
      typeof val.propertyIsEnumerable != 'undefined' &&
      !val.propertyIsEnumerable('call'))) {
    return true;
  }
  return false
};

/**
 * @param {*} value
 * @return {boolean}
 */
cohesive.isArray = typeof Array.isArray === 'function' ?
  Array.isArray :
  function $$isArray(value) {
    return '[object Array]' === Object.prototype.toString.call(/** @type {Object} */ (value))
  };

/**
 * @param {*} val
 * @return {boolean}
 */
cohesive.isArrayLike = function(val) {
  var type = typeof val
  return type == 'array' || ((type == 'object' && val !== null || type == 'function') && typeof val.length == 'number')
};



/**
 * @param {!function(this:T, ?):?} fn
 * @param {T} selfObj
 * @param {...*} var_args
 * @return {!function(?): ?}
 * @template T
 */
cohesive.bind = Function.prototype.bind ?
  function $bind(fn, selfObj, var_args) {
    return fn.call.apply(fn.bind, arguments)
  } :
  function $$bind(fn, selfObj, var_args) {
    if (typeof fn !== "function") throw new Error()
    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2)
      return function() {
        var newArgs = Array.prototype.slice.call(arguments, 0)
        Array.prototype.unshift.apply(newArgs, args)
        return fn.apply(selfObj, newArgs)
      }
    } else {
      return function $$bind() {
        return fn.apply(selfObj, arguments)
      }
    }
  };

/**
 * @param {!function(this:S, ?): ?} fn
 * @param {S=} opt_obj
 * @param {number=} opt_arity
 * @return {!function(?):?}
 * @template S
 */
cohesive.curry = function(fn, opt_obj, opt_arity) {
  var len = (+opt_arity || fn.length)
  function accumulator(args, opt_newArgs) {
    if (!opt_newArgs) {
      return function $curry() {
        return accumulator(args, arguments)
      }
    }
    args = Array.prototype.slice.call(args, 0)
    args.push.apply(args, opt_newArgs)
    return (args.length >= len) ?
      fn.apply(opt_obj, Array.prototype.slice.call(args, 0, len)) :
      function $curry() {
        return accumulator(args, arguments)
      }
  }
  return function $curry() {
    return accumulator([], arguments)
  }
};

/**
 * @param {!function(?):?} fn
 * @param {...*} var_args
 * @return {!function(?):?}
 */
cohesive.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function $partial() {
    var newArgs = Array.prototype.slice.call(args, 0)
    newArgs.push.apply(newArgs, arguments)
    return fn.apply(null, newArgs)
  }
};

/**
 * @param {!function(this:T,?): ?} fn
 * @param {!T} selfObj
 * @param {...*} var_args
 * @return {!function(?):?}
 * @template T
 */
cohesive.bindPartial = function(fn, selfObj, var_args) {
  var args = Array.prototype.slice.call(arguments, 2)
  return function $bindPartial() {
    var newArgs = Array.prototype.slice.call(args, 0)
    newArgs.push.apply(newArgs, arguments)
    return fn.apply(selfObj, newArgs)
  }
};

/**
 * @param {!function(?):?} fn
 * @param {...*} var_args
 * @return {!function(?):?}
 */
cohesive.partialRight = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function $partialRight() {
    var newArgs = Array.prototype.slice.call(arguments, 0)
    newArgs.push.apply(newArgs, args)
    return fn.apply(null, newArgs)
  }
};

/**
 * @param {!function(?):*} fn1
 * @param {!function(?):*} fn2
 * @param {...function(?):*} var_args
 * @return {!function(?):*}
 */
cohesive.compose = function(fn1, fn2, var_args) {
  var funcs = arguments
  return function $compose() {
    var len = funcs.length
    var args = arguments
    while (len--) {
      args = [funcs[len].apply(this, args)];
    }
    return args
  }
};


/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {!function(T, number, ?):boolean} fn
 * @param {Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T
 */
cohesive.filter = Array.prototype.filter ?
  function $filter(fn, value) {
    return Array.prototype.filter.call(value, fn)
  } :
  function $$filter(fn, value) {
    var i = -1, resultLen = 0, len, result, val

    len = value.length >>> 0
    result = []

    while (++i < len) {
      if (i in value) {
        val = value[i]
        if (fn(val, i, value)) {
          result[resultLen++] = val
        }
      }
    }
    return result
  };

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {!function(this:S, T, number, ?):boolean} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T,S
 */
cohesive.bindFilter = Array.prototype.filter ?
  function $bindFilter(fn, selfObj, value) {
    return Array.prototype.filter.call(value, fn, selfObj)
  } :
  function $$bindFilter(fn, selfObj, value) {
    var i = -1, resultLen = 0, len, result, val

    len = value.length >>> 0
    result = []

    while (++i < len) {
      if (i in value) {
        val = value[i]
        if (fn.call(selfObj, val, i, value)) {
          result[resultLen++] = val
        }
      }
    }
    return result
  };

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 * @param {!function(T, number, ?):?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T
 */
cohesive.map = Array.prototype.map ?
  function $map(fn, value) {
    return Array.prototype.map.call(value, fn);
  } :
  function $$map(fn, value) {
    var i = -1, len, result

    len = value.length >>> 0
    result = Array(len)

    while (++i < len) {
      result[i] = fn(value[i], i, value);
    }
    return result;
  };

/**
 * @param {!function(this:S, T, number, ?):?} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @return {!Array}
 * @template T,S
 */
cohesive.bindMap = Array.prototype.map ?
  function $bindMap(fn, selfObj, value) {
    return Array.prototype.map.call(value, fn, selfObj)
  } :
  function $$bindMap(fn, selfObj, value) {
    var i = -1, len, result

    len = value.length >>> 0
    result = Array(len)

    while (++i < len) {
      result[i] = fn.call(selfObj, value[i], i, value);
    }
    return result;
  };

/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
 *
 * @param {!function(T, number, ?): ?} fn
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @template T
 */
cohesive.forEach = Array.prototype.forEach ?
  function $forEach(fn, value) {
    Array.prototype.forEach.call(value, fn)
  } :
  function $$forEach(fn, value) {
    var i = -1, len = value.length >>> 0
    while (++i < len) {
      if (i in value) {
        fn(value[i], i, value)
      }
    }
  };

/**
 * @param {!function(this: S, T, number, ?): ?} fn
 * @param {!S} selfObj
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @template T,S
 */
cohesive.bindForEach = Array.prototype.forEach ?
  function $bindForEach(fn, selfObj, value) {
    Array.prototype.forEach.call(value, fn, selfObj)
  } :
  function $$bindForEach(fn, selfObj, value) {
    var i = -1, len = value.length >>> 0
    while (++i < len) {
      if (i in value) {
        fn.call(selfObj, value[i], i, value)
      }
    }
  };

/**
 * @param {!Array|NodeList|Arguments|{length: number}} object
 * @return {!Array}
 */
cohesive.toArray = function(object) {
  var len = object.length >>> 0;
  if (len > 0) {
    var rv = new Array(len);
    for (var i = 0; i < len; i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
};

/**
 * @param {!Array.<T>|NodeList|Arguments|{length: number}} value
 * @param {number} start
 * @param {number=} opt_end
 * @return {!Array.<T>}
 * @template T
 */
cohesive.slice = function(value, start, opt_end) {
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(value, +start)
  } else {
    return Array.prototype.slice.call(value, +start, opt_end)
  }
};

/**
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 * @param {!Array|NodeList|Arguments|{length: number}} value
 * @param {*} search
 * @param {number=} opt_fromIndex
 * @return {number}
 */
cohesive.indexOf = Array.prototype.indexOf ?
  function $indexOf(value, search, opt_fromIndex) {
    return Array.prototype.indexOf.call(value, search, opt_fromIndex)
  } :
  function $$indexOf(value, search, opt_fromIndex) {
    var length = value.length >>> 0;
    var fromIndex = +opt_fromIndex || 0;

    if (Math.abs(fromIndex) === Infinity) {
      fromIndex = 0
    }

    if (fromIndex < 0) {
      fromIndex += length;
      if (fromIndex < 0) {
        fromIndex = 0
      }
    }

    for (;fromIndex < length; fromIndex++) {
      if (value[fromIndex] === search) {
        return fromIndex
      }
    }

    return -1;
  };

/**
 * @param {Object} target
 * @param {...Object} var_args
 */
cohesive.extend = function(target, var_args) {
  var key, source
  for (var i = 1; i < arguments.length; i++) {
    source = arguments[i]
    for (key in source) {
      target[key] = source[key]
    }
    for (var j = 0; j < _OBJECT_PROTOTYPE_FIELDS.length; j++) {
      key = _OBJECT_PROTOTYPE_FIELDS[j]
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
  return target
};


/**
 * @param {!function(?):?} fn
 * @param {string} handlerBaseName
 * @param {!Element} el
 * @return {!function(?):?}
 */
cohesive.listen = function(fn, handlerBaseName, el) {
  if (el.addEventListener) {
    el.addEventListener(handlerBaseName, fn, false);
  } else if (el.detachEvent) {
    el.attachEvent('on' + handlerBaseName, fn);
  }
  return fn
};

/**
 * @param {!function(?):?} fn
 * @param {string} handlerBaseName
 * @param {Element} el
 */
cohesive.unlisten = function(fn, handlerBaseName, el) {
  if (el.addEventListener) {
    el.removeEventListener(handlerBaseName, fn, false);
  } else if (el.detachEvent) {
    el.detachEvent('on' + handlerBaseName, fn);
  }
};



/**
 * @param {!number} time
 * @param {boolean=} opt_ifDate
 */
cohesive.overrideStart = function(time, opt_ifDate) {
  if (!(opt_ifDate && _perfStart)) {
    _start = time
  }
};

/**
 * @return {number} Current time in milliseconds since the epoch.
 */
cohesive.now = (Date.now) || (function $$now() { return +new Date(); });

/**
 * @param {number=} opt_time
 * @return {number}
 */
cohesive.since = function(opt_time) {
  return cohesive.now() -(opt_time || _start)
};

/**
 * @param {number=} opt_start
 * @final
 * @constructor
 */
cohesive.Timer = function(opt_start) {
  this._start = opt_start || cohesive.Timer.now()
};

/**
 * @type {number}
 * @private
 */
cohesive.Timer.prototype._start = 0

/**
 * @type {number}
 * @private
 */
cohesive.Timer.prototype._stop = -1

/** @return {!number} */
cohesive.Timer.prototype.since = function() {
  return (~this._stop ? this._stop : cohesive.Timer.now())  - this._start
}

/** @return {!number} */
cohesive.Timer.prototype.stop = function() {
  return (this._stop = cohesive.Timer.now()) - this._start
}

/**
 * @param {number=} opt_start
 */
cohesive.Timer.prototype.reset = function(opt_start) {
  this._start = opt_start || cohesive.Timer.now()
  this._stop = -1
}

/**
 * @return {!number}
 */
cohesive.Timer.now = (_perf && _perf.now) ? function() {
    return _perf.now()
  } :
  function() {
    return cohesive.now() - _start;
  };


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
