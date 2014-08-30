"use strict";

Object.seal(Object.defineProperties(exports, {
  default: {
    get: function() {
      return ready$$default;
    },

    enumerable: true
  }
}));

var asap$$ = require("./asap");

/**
 * @param {function()} fn
 */
var ready = (function() {
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
      asap$$.default(cb = flushHandlers)
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
var ready$$default = ready;

//# sourceMappingURL=ready.js.map