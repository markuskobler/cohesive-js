"use strict";
;
var base$$ = require("./base"), asap$$ = require("./asap"), event$$ = require("./event");

var cohesive = {
  isUndefined:base$$.isUndefined,
  isString:base$$.isString,
  isNumber:base$$.isNumber,
  isObject:base$$.isObject,
  isFunction:base$$.isFunction,
  isArray:base$$.isArray,
  isArrayLike:base$$.isArrayLike,
  noop:base$$.noop,

  bind:base$$.bind,
  curry:base$$.curry,
  partial:base$$.partial,
  bindPartial:base$$.bindPartial,
  partialRight:base$$.partialRight,
  compose:base$$.compose,
  once:base$$.once,
  filter:base$$.filter,
  bindFilter:base$$.bindFilter,
  map:base$$.map,
  bindMap:base$$.bindMap,
  forEach:base$$.forEach,
  bindForEach:base$$.bindForEach,
  find:base$$.find,
  toArray:base$$.toArray,
  indexOf:base$$.indexOf,

  extend:base$$.extend,
  overrideStart:base$$.overrideStart,
  start:base$$.start,

  now:base$$.now,
  since:base$$.since,
  Timer:base$$.Timer,

  escapeHTML:base$$.escapeHTML,
  unescapeHTML:base$$.unescapeHTML
}

cohesive.asap = asap$$.default;

cohesive.event = {
  listen: event$$.listen,
  unlisten: event$$.unlisten,
  listenOnce: event$$.listenOnce,
  Event: event$$.Event,
  EventTarget: event$$.EventTarget,
  Listener: event$$.Listener
}

exports["default"] = cohesive;

if (typeof define === 'function' && define.amd) {
  define(function() { return cohesive; })
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = cohesive
} else if (this !== void 0) {
  this['cohesive'] = cohesive
}
;

//# sourceMappingURL=node.js.map