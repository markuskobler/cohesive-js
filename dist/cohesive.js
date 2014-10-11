(function() {
    "use strict";
    var base$$_win = typeof window !== 'undefined' && window;
    var base$$_perf = base$$_win && (base$$_win.performance || base$$_win["msPerformance"]);
    var base$$_perfStart = base$$_perf && base$$_perf.timing && base$$_perf.timing.domLoading;
    var base$$_start = base$$_perfStart || new Date().getTime();
    var base$$_slice = Array.prototype.slice;

    /**
     * @param {*} value
     * @return {boolean}
     */
    function base$$isUndefined(value) {
      return value === void 0
    }

    /**
     * @param {*} value
     * @return {boolean}
     */
    function base$$isString(value) {
      return typeof value === 'string'
    }

    /**
     * @param {*} value
     * @return {boolean}
     */
    function base$$isNumber(value) {
      return typeof value === 'number'
    }

    /**
     * @param {*} val
     * @return {boolean}
     */
    function base$$isObject(val) {
      var type = typeof val
      return (type === 'object' && val !== null || type === 'function')
    }

    /**
     * @param {*} val
     * @return {boolean}
     */
    function base$$isFunction(val) {
      var className = Object.prototype.toString.call(/** @type {Object} */(val))
      return className === '[object Function]' || !!(val && typeof val.call !== 'undefined' &&
                                                     typeof val.propertyIsEnumerable !== 'undefined' &&
                                                     !val.propertyIsEnumerable('call'))
    }

    /**
     * @param {*} value
     * @return {boolean}
     */
    var base$$isArray = typeof Array.isArray === 'function' ?
      Array.isArray : function base$isArray(value) {
        return '[object Array]' === Object.prototype.toString.call(/** @type {Object} */ (value))
      }

    /**
     * @param {*} val
     * @return {boolean}
     */
    function base$$isArrayLike(val) {
      var type = typeof val
      return type === 'array' || ((type === 'object' && val !== null || type === 'function') && typeof val.length === 'number')
    }

    /**
     */
    function base$$noop() {}

    /**
     * @param {?function(this:T, ...)} fn
     * @param {T} selfObj
     * @param {...*} var_args
     * @return {!Function}
     * @template T
     */
    var base$$bind = Function.prototype.bind ?
      function $bind(fn, selfObj, var_args) {
        return /** @type {!Function} */(fn.call.apply(fn.bind, arguments))
      } : function $$bind(fn, selfObj, var_args) {
        if (arguments.length < 3) return function(){ return fn.apply(selfObj, arguments) }
        var args = base$$_slice.call(arguments, 2)
        return function() {
          var newArgs = base$$_slice.call(arguments, 0)
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
    function base$$curry(fn, opt_obj, opt_arity) {
      var len = (+opt_arity || fn.length)
      function curry$accumulator(args, newArgs) {
        if (newArgs.length === 0) return function() { return curry$accumulator(args, arguments) }
        args = base$$_slice.call(args, 0)
        args.push.apply(args, newArgs)
        return args.length >= len ?
          fn.apply(opt_obj, base$$_slice.call(args, 0, len)) :
          function() { return curry$accumulator(args, arguments) }
      }
      return function $curry() { return curry$accumulator([], arguments) }
    }

    /**
     * @param {!function(?):?} fn
     * @param {...*} var_args
     * @return {!function(?):?}
     */
    function base$$partial(fn, var_args) {
      var args = base$$_slice.call(arguments, 1)
      return function $partial() {
        var newArgs = base$$_slice.call(args, 0)
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
    function base$$bindPartial(fn, selfObj, var_args) {
      var args = base$$_slice.call(arguments, 2)
      return function $bindPartial() {
        var newArgs = base$$_slice.call(args, 0)
        newArgs.push.apply(newArgs, arguments)
        return fn.apply(selfObj, newArgs)
      }
    }

    /**
     * @param {!function(?):?} fn
     * @param {...*} var_args
     * @return {!function(?):?}
     */
    function base$$partialRight(fn, var_args) {
      var args = base$$_slice.call(arguments, 1)
      return function $partialRight() {
        var newArgs = base$$_slice.call(arguments, 0)
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
    function base$$compose(fn1, fn2, var_args) {
      var funcs = arguments
      return function $compose() {
        var len = funcs.length, args = arguments
        while (len--) args = [funcs[len].apply(this, args)]
        return args
      }
    }

    /** @const */
    var base$$_waiting = {}

    /**
     * @param {?function(...)} fn
     * @param {...*} var_args
     * @return {!Function}
     */
    function base$$once(fn, var_args) {
      var args = base$$_slice.call(arguments, 1), result = base$$_waiting
      return function $once() {
        if (result !== base$$_waiting) return result
        args.push.apply(args, arguments)
        result = fn.apply(this, args)
        fn = base$$once
        args = void 0
        return /** @type {Function}*/(result)
      }
    }

    /**
     * @param {!Array|NodeList|Arguments|{length: number}} object
     * @return {!Array}
     */
    function base$$toArray(object) {
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
    var base$$indexOf = Array.prototype.indexOf ?
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
    var base$$forEach = Array.prototype.forEach ?
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
    var base$$bindForEach = Array.prototype.forEach ?
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
    function base$$find(fn, value) {
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
    function base$$extend(target, var_args) {
      var key, source, i, j
      for (i = 1; i < arguments.length; i++) {
        source = arguments[i]
        for (key in source) {
          if (key in source) target[key] = source[key]
        }
        for (j = 0; j < base$$_OBJECT_PROTOTYPE_FIELDS.length; j++) {
          key = base$$_OBJECT_PROTOTYPE_FIELDS[j]
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
    var base$$filter = Array.prototype.filter ?
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
    var base$$bindFilter = Array.prototype.filter ?
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
    var base$$map = Array.prototype.map ?
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
    var base$$bindMap = Array.prototype.map ?
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
    function base$$overrideStart(time, opt_ifDate) {
      if (!(opt_ifDate && base$$_perfStart)) base$$_start = time
    }

    /**
     * @return {!number}
     */
    function base$$start() { return base$$_start }

    /**
     * @return {number} Current time in milliseconds since the epoch.
     */
    var base$$now = Date.now || function $now() { return new Date().getTime() }

    /**
     * @param {number=} opt_time
     * @return {number}
     */
    function base$$since(opt_time) {
      return base$$now() -(opt_time || base$$_start)
    }

    /**
     * @param {number=} opt_start
     * @final
     * @constructor
     */
    function base$$Timer(opt_start) {
      this._start = opt_start || base$$Timer.now()
    }

    /**
     * @type {number}
     * @private
     */
    base$$Timer.prototype._start = 0;

    /**
     * @type {number}
     * @private
     */
    base$$Timer.prototype._stop = -1;

    /** @return {!number} */
    base$$Timer.prototype.since = function() {
      return (~this._stop ? this._stop : base$$Timer.now())  - this._start
    }

    /** @return {!number} */
    base$$Timer.prototype.stop = function() {
      return (this._stop = base$$Timer.now()) - this._start
    }

    /**
     * @param {number=} opt_start
     */
    base$$Timer.prototype.reset = function(opt_start) {
      this._start = opt_start || base$$Timer.now()
      this._stop = -1
    }

    /**
     * @return {!number}
     */
    base$$Timer.now = base$$_perf && base$$_perf.now ?
      function() { return base$$_perf.now() } : function() { return base$$now() - base$$_start }

    /** @const */
    var base$$htmlEscapes = {
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
    function base$$escapeHTML(value) {
      return !value ? '' : String(value).replace(/[&<>"']/g, function escapeHTMLChar(match) {
        return base$$htmlEscapes[match]
      })
    }

    /** @const */
    var base$$htmlUnescapes = {
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
    function base$$unescapeHTML(value) {
      return !value ? '' : String(value).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;)/g, function unescapeHTMLChar(match) {
        return base$$htmlUnescapes[match]
      })
    }

    /**
     * @type {Array.<string>}
     * @private
     */
    var base$$_OBJECT_PROTOTYPE_FIELDS = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ];

    var asap$$_slice = Array.prototype.slice;
    var asap$$_win = typeof window !== 'undefined' && window;
    var asap$$_Observer = asap$$_win && (asap$$_win['MutationObserver'] || asap$$_win['WebKitMutationObserver']);
    var asap$$_delay = (typeof process !== 'undefined' && process.nextTick) ||
                 (typeof setTimeout !== 'undefined' && setTimeout);

    /**
     * @param {Function} fn
     * @param {...Object} var_args
     */
    var asap$$asap = asap$$_Observer ? (function() {
      var t = [], i = 0, n = document.createTextNode('')
      new asap$$_Observer(function asapFlush() {
        var a = t.shift()
        if (t.length > 0) n.data = (++i % 2) ? '1' : ''
        switch (a.length) {
        case 1: a[0](); break;
        case 2: a[0](a[1]); break;
        default: a[0].apply(void 0, asap$$_slice.call(a, 1))
        }
      }).observe(n,{characterData:true})
      return function(fn, var_args) {
        t.push(asap$$_slice.call(arguments, 0))
        if (t.length === 1) n.data = (++i % 2) ? '1' : ''
      }
    }()) : (asap$$_delay ? (function() {
      return function(fn, var_args) {
        var a = asap$$_slice.call(arguments, 1)
        asap$$_delay(function(){
          switch (a.length) {
          case 0: fn(); break;
          case 1: fn(a[0]); break;
          default: fn.apply(void 0, a)
          }
          a = void 0
        })
      }
    }()) : function(fn, var_args) {
      switch (arguments.length) {
      case 1: fn(); break;
      case 2: fn(arguments[1]); break;
      default: fn.apply(void 0, asap$$_slice.call(arguments, 1))
      }
    });

    var asap$$default = asap$$asap;

    /**
     * @param {Element|Window} el
     * @param {string} type
     * @param {!function(!Event): (boolean|undefined)} fn
     * @return {!function(!Event): (boolean|undefined)}
     */
    function event$$listen(el, type, fn) {
      if (el.addEventListener) {
        event$$applyListener(type, function(t) { el.addEventListener(t, fn, false) })
      } else if (el.detachEvent) {
        event$$applyListener(type, function(t) { el.attachEvent('on' + t, fn) })
      } else {
        throw new Error("Could not attach listener")
      }
      return fn
    }

    /**
     * @param {string} type
     * @param {!function(!Event): (boolean|undefined)} fn
     * @return {!function(!Event): (boolean|undefined)}
     */
    function event$$listenOnce(el, type, fn) {
      var detach;
      if (el.addEventListener) {
        event$$applyListener(type, function(t) {
          detach = function(evt){ el.removeEventListener(t, detach, false); return fn(evt) }
          el.addEventListener(t, detach, false)
        })
      } else if (el.detachEvent) {
        event$$applyListener(type, function(t) {
          detach = function(evt){ el.detachEvent('on' + t, fn); return fn(evt) }
          el.attachEvent('on' + t, detach)
        })
      } else {
        throw new Error("Could not attach listener")
      }
      return detach
    }


    /**
     * @param {Element|Window} el
     * @param {string|Array.<string>} type
     * @param {!function(!Event): (boolean|undefined)} fn
     */
    function event$$unlisten(el, type, fn) {
      if (el.addEventListener) {
        event$$applyListener(type, function(t) { el.removeEventListener(t, fn, false) })
      } else if (el.detachEvent) {
        event$$applyListener(type, function(t) { el.detachEvent('on' + t, fn) })
      } else {
        throw new Error("Could not deattach listener")
      }
    }

    /**
     * @param {string|Array.<string>} type
     * @param {!function(string)} fn
     * @private
     */
    function event$$applyListener(type, fn) {
      if (base$$isArray(type)) {
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
    function event$$Event(type, opt_target) {
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
    event$$Event.prototype.stopPropagation = function() {
      this._stopped = true;
    }


    /**
     * TODO Extract into mixin's
     * @param {EventTarget=} opt_parent
     * @param {Object=} opt_scope
     * @constructor
     */
    function event$$EventTarget(opt_parent, opt_scope) {
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
    event$$EventTarget.prototype.getParentEventTarget = function() {
      return this._parent;
    }

    /**
     * @param {EventTarget} parent
     */
    event$$EventTarget.prototype.setParentEventTarget = function(parent) {
      this._parent = parent || null;
    }

    /**
     *
     */
    event$$EventTarget.prototype.bindEventListeners = function(scope) {
      this._scope = scope;
    }

    /**
     * @param {string|Array.<string>} type
     * @param {!function(!Event): (boolean|undefined)} fn
     * @param {T=} opt_scope
     * @return {EventTarget}
     * @template T
     */
    event$$EventTarget.prototype.listen = function(type, fn, opt_scope) {
      if (base$$isArray(type)) {
        for (var i=0; i < type.length; i++) {
          event$$addListener(this._listeners, type[i].toString(), false, fn, opt_scope)
        }
      } else {
        event$$addListener(this._listeners, type.toString(), false, fn, opt_scope)
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
    event$$EventTarget.prototype.listenOnce = function(type, fn, opt_scope) {
      event$$addListener(this._listeners, type.toString(), true, fn, opt_scope)
      return this
    }

    /**
     * @param {string|Array.<string>} type
     * @param {!function(!Event): (boolean|undefined)} fn
     * @param {T=} opt_scope
     * @return {EventTarget}
     * @template T
     */
    event$$EventTarget.prototype.unlisten = function(type, fn, opt_scope) {
      if (base$$isArray(type)) {
        for (var i=0; i < type.length; i++) {
          event$$removeListener(this._listeners, type[i].toString(), false, fn, opt_scope)
        }
      } else {
        event$$removeListener(this._listeners, type.toString(), false, fn, opt_scope)
      }
      return this
    }

    /**
     * @param {string} type
     * @param {!function(!Event): (boolean|undefined)} listener
     */
    event$$EventTarget.prototype.addEventListener = function(type, listener) {
      this.listen(type, listener)
    }

    /**
     * @param {string} type
     * @param {!function(!Event): (boolean|undefined)} listener
     */
    event$$EventTarget.prototype.removeEventListener = function(type, listener) {
      this.unlisten(type, listener)
    }

    /**
     * @param {string|Object|Event} evt
     * @return {boolean}
     */
    event$$EventTarget.prototype.dispatchEvent = function(evt) {
      var ct = this, rv = true, type = evt.type || /** @type {string} */ (evt);
      if (base$$isString(evt)) {
        evt = new event$$Event(/** @type {string} */(evt), this);
      } else if (!(evt instanceof event$$Event)) {
        evt = /** @type {Event} */(base$$extend(new event$$Event(type, this), /** @type {Object}*/(evt)));
      } else {
        evt.target = evt.target || this;
        evt.currentTarget = this;
      }

      rv = event$$fireListeners(type, evt) && rv;
      for (; !evt._stopped && (ct = evt.currentTarget = ct.getParentEventTarget()); ) {
        rv = event$$fireListeners(type, evt) && rv;
      }
      return rv
    }

    /**
     * @param {string=} opt_type
     * @return {number}
     */
    event$$EventTarget.prototype.removeAllListeners = function(opt_type) {
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
    event$$EventTarget.prototype.handleEvent = function(evt) {
      this.dispatchEvent(evt)
    }

    /**
     *
     */
    event$$EventTarget.prototype.dispose = function() {
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
    function event$$Listener(once, fn, opt_scope) {
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
    event$$Listener.prototype.dispose = function() {
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
    function event$$addListener(listeners, type, once, fn, opt_scope) {
      var l, tl = listeners[type];
      if (!tl) {
        listeners[type] = [new event$$Listener(once, fn, opt_scope)]
        return fn
      }
      l = event$$lookupListener();
      if (!l) {
        tl.push(new event$$Listener(once, fn, opt_scope));
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
    function event$$removeListener(listeners, type, once, fn, opt_scope) {
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
    function event$$lookupListener(listeners, fn, opt_scope) {
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
    function event$$fireListeners(type, evt) {
      var l, i=0, rv = true, src = evt.currentTarget, tl = src._listeners[type.toString()];
      if (!tl) return true
      tl = Array.prototype.slice.call(tl, 0);
      for (l = tl[i]; i < tl.length; l = tl[++i]) {
        if (l._fn) {
          rv = l._fn.call(l._scope || src._scope, evt) !== false && rv;
          if (l._once) event$$removeListener(src._listeners, type, true, l._fn, l._scope)
        }
      }
      return rv;
    }

    var promise$$PENDING   = void 0;
    var promise$$SEALED    = 0;
    var promise$$FULFILLED = 1;
    var promise$$REJECTED  = 2;

    /**
     * @see http://dom.spec.whatwg.org/#futures
     * @param {function(function((TYPE|IThenable.<TYPE>|Thenable)),function(*))} resolver
     * @constructor
     * @implements {IThenable.<TYPE>}
     * @template TYPE
     */
    var promise$$Promise = function(resolver) {
      /** @type {number|undefined} */
      this._state       = promise$$PENDING

      this._subscribers = void 0

      this._detail      = void 0

      if (base$$noop === resolver) return
      if (!base$$isFunction(resolver)) throw new TypeError("requires a resolver function")
      if (!(this instanceof promise$$Promise)) throw new TypeError("Promise needs new")

      promise$$invokeResolver(resolver, this)
    }
    promise$$Promise.prototype.constructor = promise$$Promise;

    function promise$$invokeResolver(resolver, promise) {
      try {
        resolver(function resolvePromise(value) {
          promise$$resolve(promise, value)
        }, function rejectPromise(reason) {
          promise$$reject(promise, reason)
        })
      } catch(e) {
        promise$$reject(promise, e)
      }
    }

    /**
     * @param {(function(TYPE):(RESULT|IThenable.<RESULT>|Thenable))=} opt_success
     * @param {(function(*): *)=} opt_errback
     * @param {(function(*): *)=} opt_progress
     * @return {IThenable.<RESULT>}
     * @template RESULT
     */
    promise$$Promise.prototype.then = function(opt_success, opt_errback, opt_progress) {
      var state = this._state, child, detail

      if (state === promise$$FULFILLED && !opt_success || state === promise$$REJECTED && !opt_errback) return this

      child = new promise$$Promise(base$$noop)
      if (state) {
        detail = this._detail
        asap$$default(function invokePromiseCallback() {
          promise$$invokeCallback(state, child, (state - 1) ? opt_errback : opt_success, detail)
        })
      } else {
        promise$$subscribe(this, child, opt_success, opt_errback)
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
    promise$$Promise.prototype.fulfilled = function(success, opt_scope, var_args) {
      switch (arguments.length) {
      case 0:
      case 1: return this.then(success, void 0, void 0)
      case 2: return this.then(base$$bind(success, opt_scope), void 0, void 0)
      default: return this.then(base$$bindPartial.apply(null, arguments), void 0, void 0)
      }
    }

    /**
     * @param {!function(*):?} errback
     * @param {*=} opt_scope
     * @param {...*} var_args
     * @return {IThenable.<RESULT>}
     * @template RESULT
     */
    promise$$Promise.prototype.caught = function(errback, opt_scope, var_args) {
      switch (arguments.length) {
      case 0:
      case 1: return this.then(void 0, errback, void 0)
      case 2: return this.then(void 0, base$$bind(errback, opt_scope), void 0)
      default: return this.then(void 0, base$$bindPartial.apply(null, arguments), void 0)
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
    promise$$Promise.prototype.progressed = function(callback, opt_scope, var_args) {
      switch (arguments.length) {
      case 0:
      case 1: return this.then(void 0, void 0, callback)
      case 2: return this.then(void 0, void 0, base$$bind(callback, opt_scope))
      default: return this.then(void 0, void 0, base$$bindPartial.apply(null, arguments))
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
    promise$$Promise.prototype.lastly = function(callback, opt_scope, var_args) {
      if (!callback) return this.then(void 0, void 0, void 0)
      var fn
      switch (arguments.length) {
      case 1:  fn = callback; break
      case 2:  fn = base$$bind(callback, opt_scope); break
      default: fn = base$$bindPartial.apply(null, arguments)
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

    promise$$Promise.prototype.abort = function() {
      if (this._state !== promise$$PENDING) return;
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
    promise$$Promise.resolve = function(opt_value) {
      return new promise$$Promise(function(resolve){ resolve(opt_value) })
    }

    /**
     * @param {*=} opt_error
     * @return {!Promise}
     */
    promise$$Promise.reject = function(opt_error) {
      return new promise$$Promise(function(_, reject){ reject(opt_error) })
    }


    function promise$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers || (parent._subscribers = []), length = subscribers.length
      subscribers[length] = child;
      subscribers[length + promise$$FULFILLED] = onFulfillment;
      subscribers[length + promise$$REJECTED]  = onRejection;
    }

    function promise$$publish(promise, settled) {
      var child, callback, subscribers = promise._subscribers, detail = promise._detail;
      if (!subscribers) return

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];
        if (child) {
          promise$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail)
        }
      }

      promise._subscribers = void 0;
    }

    function promise$$invokeCallback(settled, promise, callback, detail) {
      var value, error, succeeded, failed, hasCallback = base$$isFunction(callback)

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
          promise$$reject(promise, new TypeError('Same promise returned'))
          return
        }
      } else {
        value = detail
        succeeded = true
      }

      if (promise._state !== promise$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        promise$$resolve(promise, value);
      } else if (failed) {
        promise$$reject(promise, error);
      } else if (settled === promise$$FULFILLED) {
        promise$$fulfill(promise, value);
      } else if (settled === promise$$REJECTED) {
        promise$$reject(promise, value);
      }
    }

    function promise$$resolve(promise, value) {
      if (promise === value) {
        promise$$fulfill(promise, value);
      } else if (base$$isObject(value)) {
        promise$$handleMaybeThenable(promise, value);
      } else {
        promise$$fulfill(promise, value);
      }
    }

    function promise$$ErrorObject() {
      this.error = null;
    }

    var promise$$GET_THEN_ERROR = new promise$$ErrorObject();

    function promise$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        promise$$GET_THEN_ERROR.error = error;
        return promise$$GET_THEN_ERROR;
      }
    }


    function promise$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise$$Promise) {
        promise$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = promise$$getThen(maybeThenable);
        if (then === promise$$GET_THEN_ERROR) {
          promise$$reject(promise, promise$$GET_THEN_ERROR.error);
        } else if (then === void 0) {
          promise$$fulfill(promise, maybeThenable);
        } else if (base$$isFunction(then)) {
          promise$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          promise$$fulfill(promise, maybeThenable);
        }
      }
    }

    function promise$$handleOwnThenable(promise, thenable) {
      if (thenable._state === promise$$FULFILLED) {
        promise$$fulfill(promise, thenable._detail);
      } else if (promise._state === promise$$REJECTED) {
        promise$$reject(promise, thenable._detail);
      } else {
        promise$$subscribe(thenable, void 0, function(value) {
          if (thenable !== value) {
            promise$$resolve(promise, value);
          } else {
            promise$$fulfill(promise, value);
          }
        }, function(reason) {
          promise$$reject(promise, reason);
        });
      }
    }

    function promise$$handleForeignThenable(promise, thenable, then) {
      asap$$default(function(promise) {
        var sealed = false;
        var error = promise$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            promise$$resolve(promise, value);
          } else {
            promise$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          promise$$reject(promise, reason);
        });

        if (!sealed && error) {
          sealed = true;
          promise$$reject(promise, error);
        }
      }, promise);
    }

    function promise$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function promise$$fulfill(promise, value) {
      if (promise._state !== promise$$PENDING) return
      promise._state = promise$$SEALED;
      promise._detail = value;
      asap$$default(promise$$publishFulfillment, promise);
    }

    function promise$$reject(promise, reason) {
      if (promise._state !== promise$$PENDING) return
      promise._state = promise$$SEALED;
      promise._detail = reason;
      asap$$default(promise$$publishRejection, promise);
    }

    function promise$$publishFulfillment(promise) {
      promise$$publish(promise, promise._state = promise$$FULFILLED);
    }

    function promise$$publishRejection(promise) {
      promise$$publish(promise, promise._state = promise$$REJECTED);
    }

    var promise$$default = promise$$Promise;

    var dom$$_hasClassList = !!window['domTokenList'];

    /**
     * @param {Element} el
     * @return {!{length:number}}
     */
    var dom$$listClasses = dom$$_hasClassList ?
      function (el) {
        return el.classList
      } : function (el) {
        var className = el.className
        return typeof className === 'string' && className.match(/\S+/g) || []
      }

    /**
     * @param {Element} el
     * @param {string} value
     */
    var dom$$containsClass = dom$$_hasClassList ?
      function(el, value) {
        return el.classList.contains(value)
      } : function(el, value) {
        return ~base$$indexOf(dom$$listClasses(el), value)
      }

    /**
     * @param {Element} el
     * @param {string} value
     */
    function dom$$setClass(el, value) {
      el.className = value
    }

    /**
     * @param {Element} el
     * @param {string} value
     */
    var dom$$addClass = dom$$_hasClassList ?
      function(el, value) {
        el.classList.add(value)
      } : function(el, value) {
        var classes = dom$$listClasses(el)
        if ( base$$indexOf(classes,value) < 0 ) {
          classes.push(value)
          el.className = classes.join(' ')
        }
      }

    /**
     * @param {Element} el
     * @param {Array.<string>} values
     */
    var dom$$addClasses =dom$$_hasClassList ?
      function(el, values) {
        base$$forEach(function(value) { el.classList.add(value) }, values)
      } : function(el, values) {
        var classMap = {}, v
        function setTrue(value) { classMap[value] = true }
        base$$forEach(setTrue, dom$$listClasses(el))
        base$$forEach(setTrue, values)
        el.className = ''
        for (v in classMap) {
          if (v in classMap) {
            el.className += el.className.length > 0 ? (' ' + v) : v
          }
        }
      }


    /**
     * @param {Element} el
     * @param {string} value
     */
    var dom$$removeClass = dom$$_hasClassList ?
      function(el, value) {
        el.classList.remove(value)
      } : function(el, value) {
        var classes = dom$$listClasses(el), index = base$$indexOf(classes, value)
        if ( ~index ) el.className = classes.splice(index, 1).join(' ')
      }

    /**
     * @param {Element} el
     * @param {Array.<string>} values
     */
    var dom$$removeClasses = dom$$_hasClassList ?
      function(el, values) {
        base$$forEach(function(value) { el.classList.remove(value) }, values)
      } : function(el, values) {
        el.className = base$$filter(function(value) { return base$$indexOf(values, value) < 0 }, dom$$listClasses(el)).join(' ')
      }

    /**
     * @param {Element} el
     * @param {string} value
     */
    var dom$$toggleClass = dom$$_hasClassList ?
      function(el, value) {
        el.classList.toggle(value)
      } : function(el, value) {
        var classes = el.className.split(/\S+/g), index = base$$indexOf(classes, value)
        el.className = (~index ? classes.splice(index, 1) : classes.push(value)).join(' ')
      }


    /**
     * @param {Element} el
     * @param {string} value
     * @param {boolean=} opt_enabled
     */
    var dom$$enableClass = function(el, value, opt_enabled) {
      if (opt_enabled || opt_enabled === void 0) {
        dom$$addClass(el, value)
      } else {
        dom$$removeClass(el, value)
      }
    }

    /**
     * @param {Element} el
     * @param {Object} properties
     */
    function dom$$setProperties(el, properties) {
      for (var key in properties) {
        if (key in properties) {
          var val = properties[key]
          if (key === 'style') {
            el.style.cssText = val
          } else if (key === 'class') {
            el.className = val
          } else if (key === 'for') {
            el.htmlFor = val
          } else if (key in dom$$DIRECT_ATTRIBUTE_MAP) {
            el.setAttribute(dom$$DIRECT_ATTRIBUTE_MAP[key], val)
          } else if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
            el.setAttribute(key, val)
          } else {
            el[key] = val
          }
        }
      }
    }

    /**
     * @type {Object}
     */
    var dom$$DIRECT_ATTRIBUTE_MAP = {
      'cellpadding': 'cellPadding',
      'cellspacing': 'cellSpacing',
      'colspan': 'colSpan',
      'frameborder': 'frameBorder',
      'height': 'height',
      'maxlength': 'maxLength',
      'role': 'role',
      'rowspan': 'rowSpan',
      'type': 'type',
      'usemap': 'useMap',
      'valign': 'vAlign',
      'width': 'width'
    }

    /**
     * @param {Node} node
     * @param {string|number} text
     */
    function dom$$setText(node, text) {
      if ('textContent' in node) {
        node.textContent = text;
      } else if (node.nodeType === 3) { // TextNode
        node.data = text;
      } else if (node.firstChild && node.firstChild.nodeType === 3) { // TextNode
        while (node.lastChild !== node.firstChild) {
          node.removeChild(node.lastChild);
        }
        node.firstChild.data = text;
      } else {
        var child;
        while ((child = node.firstChild)) {
          node.removeChild(child);
        }
        node.appendChild(node.ownerDocument.createTextNode(String(text)));
      }
      return node
    }

    /**
     * @param {Element} el
     * @param {string} key
     * @param {string} value
     */
    function dom$$setData(el, key, value) {
      if (el.dataset) {
        el.dataset[key] = value;
      } else {
        el.setAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase(), value);
      }
    }

    /**
     * @param {Element} el
     * @param {string} key
     * @return {?string}
     */
    function dom$$getData(el, key) {
      if (el.dataset) {
        return el.dataset[key];
      } else {
        return el.getAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase());
      }
    }

    /**
     * @param {Element} el
     * @param {string} key
     */
    function dom$$removeData(el, key) {
      if (el.dataset) {
        delete el.dataset[key];
      } else {
        el.removeAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase());
      }
    }

    /**
     * @param {Element} el
     * @param {string} key
     * @return {boolean}
     */
    function dom$$hasData(el, key) {
      if (el.dataset) {
        return key in el.dataset;
      } else if (el.hasAttribute) {
        return el.hasAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase());
      } else {
        return !!(el.getAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase()));
      }
    }

    /**
     * @param {!Element} el
     * @return {!Object}
     */
    function dom$$getAllData(el) {
      if (el.dataset) {
        return el.dataset;
      } else {
        var dataset = {}, attributes = el.attributes, i;
        for (i = 0; i < attributes.length; ++i) {
          var attribute = attributes[i];
          if (~base$$indexOf(attribute.name, 'data-')) {
            dataset[attribute.name.substr(5).replace(/\-([a-z])/g, dom$$uppercaseData)] = attribute.value;
          }
        }
        return dataset;
      }
    }

    function dom$$uppercaseData(_, match) {
      return match.toUpperCase();
    }

    /**
     * TODO: Needs work
     * @param {string} className
     * @param {Document|Element=} opt_parent
     * @return {{length: number}}
     */
    function dom$$queryByClass(className, opt_parent) {
      var parent = opt_parent || document, results, el, name, sNames, len, l, i, c, elements
      if (parent.getElementsByClassName) return parent.getElementsByClassName(className)

      results = {}
      c = 0
      i = 0
      elements = parent.getElementsByTagName('*')

      while ((el = elements[i++])) {
        name = el.className
        if (typeof name.split === 'function') {
          sNames = name.split(/\s+/)
          l = -1
          len = sNames.length
          while (++l < len) {
            if (sNames[l] === className) {
              results[c++] = el
              break
            }
          }
        }
      }
      results.length = c
      return results
    }

    /**
     */
    function dom$$queryParentsByClass(el, className) {
      while(el) {
        if( dom$$containsClass(el, className) ) return el
        el = el.parentElement
      }
    }

    /**
     * @param {Document|Element} el
     * @return {boolean}
     */
    function dom$$focus(el) {
      var f = el && !el.disabled && el.style.display !== 'none' && el.style.visibility !== 'hidden'
      if (f) el.focus()
      return f
    }

    var dom$$_rafCallbacks, dom$$_raf, dom$$_caf;
    if(!/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)) {
      (function() {
        var vp, v = ['webkit','moz']
        dom$$_raf = window.requestAnimationFrame
        dom$$_caf = window.cancelAnimationFrame || window.cancelRequestAnimationFrame
        while(!dom$$_raf && (vp = v.pop())) {
          dom$$_raf = window[vp + 'RequestAnimationFrame']
          dom$$_caf = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']
        }
      })()
    }

    /**
     * @param {function(number)} cb
     * @return {number}
     */
    var dom$$requestAnimationFrame = dom$$_raf ? dom$$_raf.bind(window) : (function() {
      var l = 0, id = 0;
      dom$$_rafCallbacks = []
      return function(cb) {
        var n = base$$now(), f = dom$$_rafCallbacks.length === 0, d = 16-(n-l)
        if (d < 0) d = 0
        if (f) {
          dom$$_rafCallbacks.push(setTimeout(function() {
            l=n+d
            for(var i=2; i<dom$$_rafCallbacks.length; i+=2) dom$$_rafCallbacks[i](l)
            dom$$_rafCallbacks.length = 0
          }, d))
        }
        dom$$_rafCallbacks.push(++id)
        dom$$_rafCallbacks.push(cb)
        return id
      }
    })();

    /**
     * @param {number} id
     */
    var dom$$cancelAnimationFrame = dom$$_caf ? dom$$_caf.bind(window) : function(id) {
      for(var i=dom$$_rafCallbacks.length-2; i>2; i-=2) {
        if (id === dom$$_rafCallbacks[i]) {
          dom$$_rafCallbacks.splice(i, 2)
          break
        }
      }
      if (dom$$_rafCallbacks.length===1) clearTimeout(dom$$_rafCallbacks.pop());
    }

    /**
     * @param {Element} el
     * @param {string} type
     * @param {?function(this:T, ...)} cb
     * @param {T=} opt_selfObj
     * @return {!Function}
     * @template T
     */
    function dom$$listener(el, type, cb, opt_selfObj) {
      var fn = function dom$listener(e){ return cb.call(opt_selfObj || window, e || window['event']) }
      if (el.addEventListener) {
        el.addEventListener(type, fn, false)
      } else if (el.detachEvent) {
        el.attachEvent('on' + type, fn)
      }
      fn.destroy = function() {
        if (el.addEventListener) {
          el.removeEventListener(type, fn, false)
        } else if (el.detachEvent) {
          el.detachEvent('on' + type, fn)
        }
      }
      return fn
    }

    /**
     * @param {Element} el
     * @param {!string} type
     * @param {?function(this:T, ...)} cb
     * @param {T=} opt_selfObj
     * @return {!Function}
     * @template T
     */
    function dom$$throttledListener(el, type, cb, opt_selfObj) {
      var evt, id, fn = function dom$throttledListener(e) {
        evt = e || window['event'];
        if(!id) {
          id = dom$$requestAnimationFrame(function(t){
            var e = evt; evt = id = void 0
            cb.call(opt_selfObj, t, e)
          })
        }
      }
      if (el.addEventListener) {
        el.addEventListener(type, fn, false)
      } else if (el.detachEvent) {
        el.attachEvent('on' + type, fn)
      }
      fn.destroy = function(){
        if(id) dom$$cancelAnimationFrame(id)
        if (el.addEventListener) {
          el.removeEventListener(type, fn, false)
        } else if (el.detachEvent) {
          el.detachEvent('on' + type, fn)
        }
      }
      return fn
    }

    /** @return {!XMLHttpRequest} */
    var xhr$$xhrRequest = typeof XMLHttpRequest !== 'undefined' ?
      function() { return new XMLHttpRequest() } :
      function() { return new ActiveXObject('Microsoft.XMLHTTP') }

    /** @type {number} */
    var xhr$$_requestCount = 0;

    /** @type {{
     *   headers: (Object.<string>|undefined),
     *   mimeType: (string|undefined),
     *   withCredentials: (boolean|undefined),
     *   timeout: (number|undefined),
     *   xssiPrefix: (string|undefined)
     * }|undefined} */
    var xhr$$_opts;

    /**
     * @param {string} method
     * @param {string} url
     * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null=} opt_data
     * @param {{
     *   headers: (Object.<string>|undefined),
     *   mimeType: (string|undefined),
     *   withCredentials: (boolean|undefined),
     *   timeout: (number|undefined),
     *   xssiPrefix: (string|undefined)
     * }=} opt_options
     * @return {!Promise}
     */
    function xhr$$send(method, url, opt_data, opt_options) {
      var id = (xhr$$_requestCount++)
        // TODO should this be handled here?
        // if (opt_data) { // TODO check if urlencoded?
        //     opt_data = toQueryString(opt_data);
        // }

        // TODO create a scope object which is bound to promise
        // {  method:
        //    url:...
        //    data:...
        //    xhr:...
        //    timing:...
        // }

      var req = xhr$$xhrRequest()
      var p  = new promise$$default(function(resolve, reject) {
        var scope = {xhr:req} // todo check??
        xhr$$sendRequest(req, method, url, opt_data, opt_options, resolve, reject, scope)
      })
      return p
    }

    /**
     * note null or undefined clears options
     * @param {{
     *   headers: (Object.<string>|undefined),
     *   mimeType: (string|undefined),
     *   withCredentials: (boolean|undefined),
     *   timeout: (number|undefined),
     *   xssiPrefix: (string|undefined)
     * }=} o
     */
    xhr$$send.setDefaults = function (o) {
      xhr$$_opts = o && /** @type {xhr.Options} */(base$$extend(xhr$$_opts || {}, o))
    }


    /**
     * @param {string} url
     * @param {Object|string} data
     * @return {string}
     */
    xhr$$send.encodeURL = function(url, data) {
      if (data) url += (url.indexOf('?') < 0 ? '?' : '&') + xhr$$toQueryString(data)
      return url
    }


    /**
     * @param {string} url
     * @param {Object=} opt_data
     * @param {xhr.Options=} opt_options
     * @return {!Promise}
     */
    function xhr$$GET(url, opt_data, opt_options) {
      return xhr$$send('GET', opt_data ? xhr$$send.encodeURL(url, opt_data) : url, void 0, opt_options)
    }

    /**
     * @param {string} url
     * @param {Object=} opt_data
     * @param {xhr.Options=} opt_options
     * @return {!Promise}
     */
    function xhr$$HEAD(url, opt_data, opt_options) {
      return xhr$$send('HEAD', opt_data ? xhr$$send.encodeURL(url, opt_data) : url, void 0, opt_options)
    }

    /**
     * @param {string} url
     * @param {Object=} opt_data
     * @param {xhr.Options=} opt_options
     * @return {!Promise}
     */
    function xhr$$DELETE(url, opt_data, opt_options) {
      return xhr$$send('DELETE', opt_data ? xhr$$send.encodeURL(url, opt_data) : url, void 0, opt_options)
    }

    /**
     * @param {string} url
     * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null} data
     * @param {xhr.Options=} opt_options
     * @return {!Promise}
     */
    function xhr$$POST(url, data, opt_options) {
      return xhr$$send('POST', url, data, opt_options)
    }

    /**
     * @param {string} url
     * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null} data
     * @param {xhr.Options=} opt_options
     * @return {!Promise}
     */
    function xhr$$PUT(url, data, opt_options) {
      return xhr$$send('PUT', url, data, opt_options)
    }

    /**
     * @param {string} url
     * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null} data
     * @param {xhr.Options=} opt_options
     * @return {!Promise}
     */
    function xhr$$PATCH(url, data, opt_options) {
      return xhr$$send('PATCH', url, data, opt_options)
    }

    /**
     * @param {string} method
     * @param {string} url
     * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null=} opt_data
     * @param {xhr.Options=} opt_options
     * @param {function(?)=} opt_callback
     * @param {function(xhr.Error)=} opt_errback
     * @param {*=} opt_scope
     * @return {!XMLHttpRequest}
     */
    function xhr$$request(method, url, opt_data, opt_options, opt_callback, opt_errback, opt_scope) {
      var req = xhr$$xhrRequest();
      xhr$$sendRequest(req, method, url, opt_data, opt_options, opt_callback, opt_errback, req);
      return req;
    }

    /**
     * @param {!XMLHttpRequest} req
     * @param {string} method
     * @param {string} url
     * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null=} opt_data
     * @param {xhr.Options=} opt_options
     * @param {function(?)=} opt_callback
     * @param {function(xhr.Error)=} opt_errback
     * @param {*=} opt_scope
     * @private
     */
    function xhr$$sendRequest(req, method, url, opt_data, opt_options, opt_callback, opt_errback, opt_scope) {
      var timer, /** @type {*} */scope, /** @type {xhr.Options|undefined} */ options, hasContentType = false;

      if (xhr$$_opts || opt_options) options = /** @type {xhr.Options|undefined} */(base$$extend({}, xhr$$_opts, opt_options))

      method = method.toUpperCase();

      req.onreadystatechange = function() {
    //        todo handle each type of event
    //        console.log(req.readyState, arguments)
        if (req.readyState === 4) { // complete
          clearTimeout(timer);
          if (xhr$$_isSuccess(req.status)) {
            var response, prefix = options && options.xssiPrefix;
            if (prefix && req.responseText.indexOf(prefix) === 0) {
              response = req.responseText.slice(prefix.length)
            } else {
              response = req.response
            }
            if (opt_callback) opt_callback.call(scope, response);
          } else if (opt_errback) {
            opt_errback.call(scope, new xhr$$HTTPError(req.status, method, url, req));
          }
        }
      }

      try {
        req.open(method, url, true);
      } catch (/** @type {Error}*/ e1) {
        if (opt_errback) opt_errback.call(scope, new xhr$$XHRError('Open failed: ' + e1.message, method, url, req));
        return
      }

      if (options) {
        var key, headers = options.headers;
        if (headers) {
          for (key in headers) {
            if (key in headers)
              req.setRequestHeader(key, headers[key]);
          }
          hasContentType = 'Content-Type' in headers;
        }

        if (options.withCredentials) req.withCredentials = options.withCredentials
        if (options.mimeType) req.overrideMimeType(options.mimeType)

        if (options.timeout > 0) {
          timer = setTimeout(function() {
            req.onreadystatechange = base$$noop;
            req.abort();
            if (opt_errback) opt_errback.call(scope, new xhr$$TimeoutError(method, url, req));
          }, options.timeout);
        }
      }

      // todo make extendable through an interceptor
      if( opt_data ) {
        // todo is this the right way of soloving this?
        if (!hasContentType) {
          req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          opt_data = xhr$$toQueryString(opt_data);
        }
      }

      try {
        req.send(opt_data)
      } catch (/** @type {Error}*/ e2) {
        req.onreadystatechange = base$$noop;
        clearTimeout(timer);
        if (opt_errback) opt_errback.call(scope, new xhr$$XHRError('Send failed: ' + e2.message, method, url, req));
      }
    }

    /**
     * @param {Object|string} o
     * @return {string}
     */
    function xhr$$toQueryString(o) {
      var prefix, i, a, /** @type {string} */s = ""

      /**
       * @param {string} key
       * @param {function():string|string} value
       */
      function add(key, value) {
        s.length > 0 && (s += "&")
        s += encodeURIComponent(key);
        if ('function' === typeof value) value = value()
        if (value) s += '=' + encodeURIComponent(value)
      }

      /**
       * @param {string} prefix
       * @param {*} obj
       */
      function buildParams(prefix, obj) {
        var name, a, i, v;
        if (base$$isArray(obj)) {
          a = /** @type {Array.<*>} */(obj)
          for (i = 0; a && i < a.length; i++) {
            v = a[i]
            buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v)
          }
        } else if (base$$isObject(obj)) {
          for (name in obj) {
            if (name in obj)
              buildParams(prefix + '[' + name + ']', obj[name])
          }
        } else {
          add(prefix, /** @type {string}*/(obj))
        }
      }

      if (base$$isArray(o)) {
        a = /** @type {Array.<*>} */(o)
        for (i = 0; i < a.length; i++) {
          add(o[i]['name'], a[i]['value']) // assumes inputs
        }
      } else {
        for (prefix in o) {
          if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix])
        }
      }
      return s
    }

    /**
     * @param {string} message
     * @param {string} method
     * @param {string} url
     * @param {!XMLHttpRequest} req
     * @extends {Error}
     * @constructor
     */
    function xhr$$XHRError(message, method, url, req) {
      /** @type {string} */
      this.method = method;

      /** @type {string} */
      this.url = url;

      /** @type {!XMLHttpRequest} */
      this.xhr = req;

      this.name = this.constructor.name
      this.message = message + ', ' + method + ' ' + url
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor)
      } else {
        this.stack = (new Error()).stack;
      }
    }
    xhr$$XHRError.prototype = Error.prototype;
    xhr$$XHRError.prototype.constructor = xhr$$XHRError;
    xhr$$XHRError.prototype.toString = function() { return this.name + ': ' + this.message }

    /**
     * @param {number} status
     * @param {string} method
     * @param {string} url
     * @param {!XMLHttpRequest} req
     * @extends {xhr.Error}
     * @constructor
     */
    function xhr$$HTTPError(status, method, url, req) {
      xhr$$XHRError.call(this, 'Request Failed, ' + status, method, url, req)
      /** @type {number} */
      this.status = status;
    }
    xhr$$HTTPError.prototype = xhr$$XHRError.prototype;
    xhr$$HTTPError.prototype.constructor = xhr$$HTTPError;

    /**
     * @param {string} method
     * @param {string} url
     * @param {!XMLHttpRequest} req
     * @extends {xhr.Error}
     * @constructor
     */
    function xhr$$TimeoutError(method, url, req) {
      xhr$$XHRError.call(this, 'Timeout', method, url, req)
    }
    xhr$$TimeoutError.prototype = xhr$$XHRError.prototype;
    xhr$$TimeoutError.prototype.constructor = xhr$$TimeoutError;

    /**
     * @param {string} method
     * @param {string} url
     * @param {!XMLHttpRequest} req
     * @extends {xhr.Error}
     * @constructor
     */
    function xhr$$AbortError(method, url, req) {
      xhr$$XHRError.call(this, 'Abort', method, url, req)
    }
    xhr$$AbortError.prototype = xhr$$XHRError.prototype;
    xhr$$AbortError.prototype.constructor = xhr$$AbortError;

    /**
     * @param {number} status
     * @return {boolean}
     * @private
     */
    function xhr$$_isSuccess(status) {
      switch (status) {
      case 200: // ok
      case 201: // created
      case 202: // accepted
      case 204: // no content
      case 206: // partial
      case 304: // not modified
      case 1223: // ie...
        return true;
      }
      return false;
    }

    var analytics$$GA_ENDPOINT = '//www.google-analytics.com/collect?v=1';

    /**
     * @param {string} trackingID
     * @param {string=} opt_uid
     * @constructor
     */
    function analytics$$GA(trackingID, opt_uid) {
      this._tid = trackingID
      this._next = ''
      this._endpoint = analytics$$GA_ENDPOINT+'&tid='+this._tid+'&cid='+analytics$$cohesiveUUID()
      if(opt_uid) this._endpoint += '&uid='+encodeURIComponent(opt_uid)
    }

    /**
     * @param {string=} opt_page
     * @param {string=} opt_title
     * @param {string=} opt_description
     * @param {boolean=} opt_nonIteraction
     */
    analytics$$GA.prototype.page = function(opt_page, opt_title, opt_description, opt_nonIteraction) {
      var url, loc = window.location, path = loc.pathname //, viewport, screen = window.screen
      url  = '&dl='+encodeURIComponent(opt_page || loc.protocol + '//' + loc.hostname + ('/' !== path.charAt(0) ? '/'+path : path) + loc.search)
      url += '&dt='+encodeURIComponent(opt_title || document.title)
      if(document.referrer && document.referrer.indexOf('//'+loc.hostname) < 0) url += '&dr='+encodeURIComponent(document.referrer)
      url += '&de='+(document.characterSet || document.charset)
      url += '&ul='+(navigator['language'] || navigator['userLanguage'])
      if (opt_description) url += '&cd='+encodeURIComponent(opt_description)
      // TODO: preventing a forced layout on display dimentions
      //    url += '&sd='+screen.colorDepth + '-bit'
      //    url += '&sr='+screen.width + 'x' + screen.height
      //    viewport = ('CSS1Compat' === document.compatMode) ? document.documentElement : document.body
      //    url += '&vp='+(viewport && (viewport.clientWidth +'x'+viewport.clientHeight) || '')
      this._send('pageview', url, opt_nonIteraction)
    }

    /**
     * @param {string} category
     * @param {string} action
     * @param {string=} opt_label
     * @param {string=} opt_value
     * @param {boolean=} opt_nonIteraction
     */
    analytics$$GA.prototype.event = function(category, action, opt_label, opt_value, opt_nonIteraction) {
      var url = '&ec='+encodeURIComponent(category)
      url += '&ea='+encodeURIComponent(action)
      if(opt_label) url += '&el='+encodeURIComponent(opt_label)
      if(opt_value) url += '&ev='+encodeURIComponent(opt_value)
      this._send('event', url, opt_nonIteraction !== void 0 ? opt_nonIteraction : true)
    }

    analytics$$GA.prototype.social = function(network, action, target, opt_nonIteraction) {
      var url = '&sn='+encodeURIComponent(network)
      url += '&sa='+encodeURIComponent(action)
      url += '&st='+encodeURIComponent(target)
      this._send('social', url, opt_nonIteraction !== void 0 ? opt_nonIteraction : true)
    }

    analytics$$GA.prototype.setCampaign = function(name, source, medium, keyword, content) {
      var campaign = ''
      if(name) campaign += '&cn='+encodeURIComponent(name)
      if(source) campaign += '&cs='+encodeURIComponent(source)
      if(medium) campaign += '&cm='+encodeURIComponent(medium)
      if(keyword) campaign += '&ck='+encodeURIComponent(keyword)
      if(content) campaign += '&cc='+encodeURIComponent(content)
      this._next += campaign
    }

    analytics$$GA.prototype.setCustomDimension = function(id, value) {
      this._next += '&cd'+id+'='+encodeURIComponent(value);
    }

    analytics$$GA.prototype.setCustomMetric = function(id, value) {
      this._next += '&cm'+id+'='+value;
    }

    // TODO: support beacon api
    //   https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon
    //   https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/Beacon/Overview.html
    // TODO fallback to XHR POST if larger than IE max 2000
    analytics$$GA.prototype._send = function(type, args, opt_nonIteraction) {
      var img = new Image();
      var url = this._endpoint +'&t='+type + args
      if(opt_nonIteraction) url += '&ni=1'
      if(this._next.length > 0) {
        url += this._next
        this._next = ''
      }
      img.width = img.height = 1;
      img.src = url +'&z='+ (Math.random() * 0x7fffffff << 0)
      // todo check response code != 2xx
      // img.onload = img.onerror = function() {
      //   img.onload = img.onerror = null
      //   callback()
      // }
    }

    var analytics$$cohesiveUUID = base$$once(function() {
      var m = /__c=([\w-_]*);?/.exec(document.cookie)
      if (!m) return void 0
      function to16(v,from,to) {
        var n = parseInt(v.substring(from,to), 32).toString(16)
        return (n.length < 5) ? '0000'.substring(0,5-n.length)+n : n
      }
      var v = m[1]
      return to16(v,1,5)+'000-0000-4'+v[0]+'00-8000-00'+to16(v,5,9)+to16(v,9,13)
    });

    /**
     * @param {function()} fn
     */
    var $$ready$$ready = (function() {
      var isReady = false, handlers, cb;
      function flushHandlers() {
        var h;
        isReady = true
        cb = void 0
        if (handlers) while(!!(h = handlers.shift())) h()
        handlers = void 0
      }
      return function cohesive$ready(fn) {
        var top
        if (isReady) fn()
        if (handlers) {
          handlers.push(fn)
        } else {
          handlers = [fn]
        }
        if (cb) return
        if (document.body && document.readyState === 'complete') {
          asap$$default(cb = flushHandlers)
          return
        }
        cb = function() {
          if (document.addEventListener) {
            document.removeEventListener('domContentLoaded', cb, false)
            window.removeEventListener('load', cb, false)
          } else if (document.attachEvent) {
                document.detachEvent( 'onreadystatechange', cb )
            window.detachEvent('onload', cb)
          }
          flushHandlers()
        }
        if (document.addEventListener) {
          document.addEventListener('domContentLoaded', cb, false)
          window.addEventListener('load', cb, false)
        } else if (document.attachEvent) {
              document.attachEvent( 'onreadystatechange', cb )
          window.attachEvent('onload', cb)
                try { top = !window.frameElement && document.documentElement } catch(e) {}
                if ( top && top.doScroll ) {
                    (function scrollCheck() {
                        if(!isReady) {
                            try {
                  top.doScroll('left');
                            } catch(e) {
                                return setTimeout(scrollCheck, 50);
                            }
                        }
                    })();
                }
        }
      }
    })();
    var $$ready$$default = $$ready$$ready;

    var browser$$cohesive = {
      isUndefined:base$$isUndefined,
      isString:base$$isString,
      isNumber:base$$isNumber,
      isObject:base$$isObject,
      isFunction:base$$isFunction,
      isArray:base$$isArray,
      isArrayLike:base$$isArrayLike,
      noop:base$$noop,

      bind:base$$bind,
      curry:base$$curry,
      partial:base$$partial,
      bindPartial:base$$bindPartial,
      partialRight:base$$partialRight,
      compose:base$$compose,
      once:base$$once,
      filter:base$$filter,
      bindFilter:base$$bindFilter,
      map:base$$map,
      bindMap:base$$bindMap,
      forEach:base$$forEach,
      bindForEach:base$$bindForEach,
      find:base$$find,
      toArray:base$$toArray,
      indexOf:base$$indexOf,

      extend:base$$extend,
      overrideStart:base$$overrideStart,
      start:base$$start,

      now:base$$now,
      since:base$$since,
      Timer:base$$Timer,

      escapeHTML:base$$escapeHTML,
      unescapeHTML:base$$unescapeHTML
    }

    browser$$cohesive.asap = asap$$default;

    browser$$cohesive.event = {
      listen: event$$listen,
      unlisten: event$$unlisten,
      listenOnce: event$$listenOnce,
      Event: event$$Event,
      EventTarget: event$$EventTarget,
      Listener: event$$Listener
    }

    browser$$cohesive.Promise = promise$$default;

    browser$$cohesive.dom = {
      listClasses:dom$$listClasses,
      containsClass:dom$$containsClass,
      setClass:dom$$setClass,
      addClasses:dom$$addClasses,
      removeClasses:dom$$removeClasses,
      toggleClass:dom$$toggleClass,
      enableClass:dom$$enableClass,
      setProperties:dom$$setProperties,
      setText:dom$$setText,
      setData:dom$$setData,
      getData:dom$$getData,
      getAllData:dom$$getAllData,
      hasData:dom$$hasData,
      removeData:dom$$removeData,
      queryByClass:dom$$queryByClass,
      queryParentsByClass:dom$$queryParentsByClass,
      focus:dom$$focus,
      requestAnimationFrame:dom$$requestAnimationFrame,
      cancelAnimationFrame:dom$$cancelAnimationFrame,
      listener:dom$$listener,
      throttledListener:dom$$throttledListener
    }

    xhr$$send.GET     = xhr$$GET;
    xhr$$send.HEAD    = xhr$$HEAD;
    xhr$$send.DELETE  = xhr$$DELETE;
    xhr$$send.POST    = xhr$$POST;
    xhr$$send.PUT     = xhr$$PUT;
    xhr$$send.PATCH   = xhr$$PATCH;
    xhr$$send.request = xhr$$request;
    browser$$cohesive.xhr = xhr$$send;

    browser$$cohesive.ready = $$ready$$default;

    var browser$$default = browser$$cohesive;

    if (typeof define === 'function' && define.amd) {
      define(function() { return browser$$cohesive; })
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = browser$$cohesive
    } else if (this !== void 0) {
      this['cohesive'] = browser$$cohesive
    }
}).call(this);

//# sourceMappingURL=cohesive.js.map