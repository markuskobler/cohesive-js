"use strict";

Object.seal(Object.defineProperties(exports, {
  default: {
    get: function() {
      return index$$default;
    },

    enumerable: true
  }
}));

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
  EventTarget: event$$.EventTarget
}

if (typeof window !== 'undefined') {
  // import {
  //   containsClass,
  //   setClass,
  //   addClasses,
  //   removeClasses,
  //   toggleClass,
  //   enableClass,
  //   setProperties,
  //   setText,
  //   setData,
  //   getData,
  //   getAllData,
  //   hasData,
  //   removeData,
  //   queryByClass,
  //   queryParentsByClass,
  //   focus,
  //   requestAnimationFrame,
  //   cancelAnimationFrame,
  //   listener,
  //   throttledListener
  // } from "./dom";
  // cohesive.dom = {
  //   containsClass:containsClass,
  //   setClass:setClass,
  //   addClasses:addClasses,
  //   removeClasses:removeClasses,
  //   toggleClass:toggleClass,
  //   enableClass:enableClass,
  //   setProperties:setProperties,
  //   setText:setText,
  //   setData:setData,
  //   getData:getData,
  //   getAllData:getAllData,
  //   hasData:hasData,
  //   removeData:removeData,
  //   queryByClass:queryByClass,
  //   queryParentsByClass:queryParentsByClass,
  //   focus:focus,
  //   requestAnimationFrame:requestAnimationFrame,
  //   cancelAnimationFrame:cancelAnimationFrame,
  //   listener:listener,
  //   throttledListener:throttledListener
  // }

  // import ready from "./ready";
  // cohesive.ready = ready;
}

var index$$default = cohesive;

if (typeof define === 'function' && define.amd) {
  define(function() { return cohesive; });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = cohesive;
} else if (typeof this !== 'undefined') {
  this['cohesive'] = cohesive;
}

//# sourceMappingURL=index.js.map