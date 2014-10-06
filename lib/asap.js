/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 * @fileoverview asap
 */
var _slice = Array.prototype.slice;
var _win = typeof window !== 'undefined' && window
var _Observer = _win && (_win['MutationObserver'] || _win['WebKitMutationObserver'])
var _delay = (typeof process !== 'undefined' && process.nextTick) ||
             (typeof setTimeout !== 'undefined' && setTimeout)

/**
 * @param {Function} fn
 * @param {...Object} var_args
 */
var asap = _Observer ? (function() {
  var t = [], i = 0, n = document.createTextNode('')
  new _Observer(function asapFlush() {
    var a = t.shift()
    if (t.length > 0) n.data = (++i % 2) ? '1' : ''
    switch (a.length) {
    case 1: a[0](); break;
    case 2: a[0](a[1]); break;
    default: a[0].apply(void 0, _slice.call(a, 1))
    }
  }).observe(n,{characterData:true})
  return function(fn, var_args) {
    t.push(_slice.call(arguments, 0))
    if (t.length === 1) n.data = (++i % 2) ? '1' : ''
  }
}()) : (_delay ? (function() {
  return function(fn, var_args) {
    var a = _slice.call(arguments, 1)
    _delay(function(){
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
  default: fn.apply(void 0, _slice.call(arguments, 1))
  }
});

export default asap;
