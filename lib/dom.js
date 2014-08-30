/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 * @fileoverview dom utils
 */
import {forEach, indexOf, filter, now} from "./base";

var _hasClassList = !!window['domTokenList']

/**
 * @param {Element} el
 * @return {!{length:number}}
 */
var listClasses = _hasClassList ?
  function (el) {
    return el.classList
  } : function (el) {
    var className = el.className
    return typeof className === 'string' && className.match(/\S+/g) || []
  }
export {listClasses}

/**
 * @param {Element} el
 * @param {string} value
 */
var containsClass = _hasClassList ?
  function(el, value) {
    return el.classList.contains(value)
  } : function(el, value) {
    return ~indexOf(listClasses(el), value)
  }
export {containsClass}

/**
 * @param {Element} el
 * @param {string} value
 */
export function setClass(el, value) {
  el.className = value
}

/**
 * @param {Element} el
 * @param {string} value
 */
var addClass = _hasClassList ?
  function(el, value) {
    el.classList.add(value)
  } : function(el, value) {
    var classes = listClasses(el)
    if ( indexOf(classes,value) < 0 ) {
      classes.push(value)
      el.className = classes.join(' ')
    }
  }
export {addClass}

/**
 * @param {Element} el
 * @param {Array.<string>} values
 */
var addClasses =_hasClassList ?
  function(el, values) {
    forEach(function(value) { el.classList.add(value) }, values)
  } : function(el, values) {
    var classMap = {}, v
    function setTrue(value) { classMap[value] = true }
    forEach(setTrue, listClasses(el))
    forEach(setTrue, values)
    el.className = ''
    for (v in classMap) {
      if (v in classMap) {
        el.className += el.className.length > 0 ? (' ' + v) : v
      }
    }
  }
export {addClasses}


/**
 * @param {Element} el
 * @param {string} value
 */
var removeClass = _hasClassList ?
  function(el, value) {
    el.classList.remove(value)
  } : function(el, value) {
    var classes = listClasses(el), index = indexOf(classes, value)
    if ( ~index ) el.className = classes.splice(index, 1).join(' ')
  }
export {removeClass}

/**
 * @param {Element} el
 * @param {Array.<string>} values
 */
var removeClasses = _hasClassList ?
  function(el, values) {
    forEach(function(value) { el.classList.remove(value) }, values)
  } : function(el, values) {
    el.className = filter(function(value) { return indexOf(values, value) < 0 }, listClasses(el)).join(' ')
  }
export {removeClasses}

/**
 * @param {Element} el
 * @param {string} value
 */
var toggleClass = _hasClassList ?
  function(el, value) {
    el.classList.toggle(value)
  } : function(el, value) {
    var classes = el.className.split(/\S+/g), index = indexOf(classes, value)
    el.className = (~index ? classes.splice(index, 1) : classes.push(value)).join(' ')
  }
export {toggleClass}


/**
 * @param {Element} el
 * @param {string} value
 * @param {boolean=} opt_enabled
 */
var enableClass = function(el, value, opt_enabled) {
  if (opt_enabled || opt_enabled === void 0) {
    addClass(el, value)
  } else {
    removeClass(el, value)
  }
}
export {enableClass}

/**
 * @param {Element} el
 * @param {Object} properties
 */
export function setProperties(el, properties) {
  for (var key in properties) {
    if (key in properties) {
      var val = properties[key]
      if (key === 'style') {
        el.style.cssText = val
      } else if (key === 'class') {
        el.className = val
      } else if (key === 'for') {
        el.htmlFor = val
      } else if (key in DIRECT_ATTRIBUTE_MAP) {
        el.setAttribute(DIRECT_ATTRIBUTE_MAP[key], val)
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
var DIRECT_ATTRIBUTE_MAP = {
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
export function setText(node, text) {
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
export function setData(el, key, value) {
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
export function getData(el, key) {
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
export function removeData(el, key) {
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
export function hasData(el, key) {
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
export function getAllData(el) {
  if (el.dataset) {
    return el.dataset;
  } else {
    var dataset = {}, attributes = el.attributes, i;
    for (i = 0; i < attributes.length; ++i) {
      var attribute = attributes[i];
      if (~indexOf(attribute.name, 'data-')) {
        dataset[attribute.name.substr(5).replace(/\-([a-z])/g, uppercaseData)] = attribute.value;
      }
    }
    return dataset;
  }
}

function uppercaseData(_, match) {
  return match.toUpperCase();
}

/**
 * TODO: Needs work
 * @param {string} className
 * @param {Document|Element=} opt_parent
 * @return {{length: number}}
 */
export function queryByClass(className, opt_parent) {
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
export function queryParentsByClass(el, className) {
  while(el) {
    if( containsClass(el, className) ) return el
    el = el.parentElement
  }
}

/**
 * @rturn {boolean}
 */
export function focus(el) {
  var f = el && !el.disabled && el.style.display !== 'none' && el.style.visibility !== 'hidden'
  if (f) el.focus()
  return f
}

var _rafCallbacks, _raf, _caf;
if(!/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)) {
  (function() {
    var vp, v = ['webkit','moz']
    _raf = window.requestAnimationFrame
    _caf = window.cancelAnimationFrame || window.cancelRequestAnimationFrame
    while(!_raf && (vp = v.pop())) {
      _raf = window[vp + 'RequestAnimationFrame']
      _caf = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']
    }
  })()
}

/**
 * @param {function(number)} cb
 * @return {number}
 */
var requestAnimationFrame = _raf ? _raf.bind(window) : (function() {
  var l = 0, id = 0;
  _rafCallbacks = []
  return function(cb) {
    var n = now(), f = _rafCallbacks.length === 0, d = 16-(n-l)
    if (d < 0) d = 0
    if (f) {
      _rafCallbacks.push(setTimeout(function() {
        l=n+d
        for(var i=2; i<_rafCallbacks.length; i+=2) _rafCallbacks[i](l)
        _rafCallbacks.length = 0
      }, d))
    }
    _rafCallbacks.push(++id)
    _rafCallbacks.push(cb)
    return id
  }
})()
export {requestAnimationFrame}

/**
 * @param {number} id
 */
var cancelAnimationFrame = _caf ? _caf.bind(window) : function(id) {
  for(var i=_rafCallbacks.length-2; i>2; i-=2) {
    if (id === _rafCallbacks[i]) {
      _rafCallbacks.splice(i, 2)
      break
    }
  }
  if (_rafCallbacks.length===1) clearTimeout(_rafCallbacks.pop());
}
export {cancelAnimationFrame}

/**
 * TODO remove self object...
 * @param {?function(this:T, ...)} cb
 * @param {T} selfObj
 * @param {string} handlerBaseName
 * @param {Element} el
 * @return {!Function}
 * @template T
 */
export function listener(cb, selfObj, handlerBaseName, el) {
  if (!el) el = (selfObj || window);
  var fn = function dom$listener(e){ return cb.call(selfObj || window, e || window['event']) }
  if (el.addEventListener) {
    el.addEventListener(handlerBaseName, fn, false)
  } else if (el.detachEvent) {
    el.attachEvent('on' + handlerBaseName, fn)
  }
  fn.destroy = function() {
    if (el.addEventListener) {
      el.removeEventListener(handlerBaseName, fn, false)
    } else if (el.detachEvent) {
      el.detachEvent('on' + handlerBaseName, fn)
    }
  }
  return fn
}

/**
 * @param {?function(this:T, ...)} cb
 * @param {T} selfObj
 * @param {string|Array.<string>} handlerBaseName
 * @param {Element} el
 * @return {!Function}
 * @template T
 */
export function throttledListener(cb, selfObj, handlerBaseName, el) {
  if (!el) el = (selfObj || window);
  var evt, id, fn = function dom$throttledListener(e) {
    evt = e || window['event'];
    if(!id) {
      id = requestAnimationFrame(function(t){
        var e = evt; evt = id = void 0
        cb.call(selfObj, t, e)
      })
    }
  }
  if (el.addEventListener) {
    el.addEventListener(handlerBaseName, fn, false)
  } else if (el.detachEvent) {
    el.attachEvent('on' + handlerBaseName, fn)
  }
  fn.destroy = function(){
    if(id) cancelAnimationFrame(id)
    if (el.addEventListener) {
      el.removeEventListener(handlerBaseName, fn, false)
    } else if (el.detachEvent) {
      el.detachEvent('on' + handlerBaseName, fn)
    }
  }
  return fn
}
