"use strict";

Object.seal(Object.defineProperties(exports, {
  listClasses: {
    get: function() {
      return listClasses;
    },

    enumerable: true
  },

  containsClass: {
    get: function() {
      return containsClass;
    },

    enumerable: true
  },

  setClass: {
    get: function() {
      return setClass;
    },

    enumerable: true
  },

  addClass: {
    get: function() {
      return addClass;
    },

    enumerable: true
  },

  addClasses: {
    get: function() {
      return addClasses;
    },

    enumerable: true
  },

  removeClass: {
    get: function() {
      return removeClass;
    },

    enumerable: true
  },

  removeClasses: {
    get: function() {
      return removeClasses;
    },

    enumerable: true
  },

  toggleClass: {
    get: function() {
      return toggleClass;
    },

    enumerable: true
  },

  enableClass: {
    get: function() {
      return enableClass;
    },

    enumerable: true
  },

  setProperties: {
    get: function() {
      return setProperties;
    },

    enumerable: true
  },

  setText: {
    get: function() {
      return setText;
    },

    enumerable: true
  },

  setData: {
    get: function() {
      return setData;
    },

    enumerable: true
  },

  getData: {
    get: function() {
      return getData;
    },

    enumerable: true
  },

  removeData: {
    get: function() {
      return removeData;
    },

    enumerable: true
  },

  hasData: {
    get: function() {
      return hasData;
    },

    enumerable: true
  },

  getAllData: {
    get: function() {
      return getAllData;
    },

    enumerable: true
  },

  queryByClass: {
    get: function() {
      return queryByClass;
    },

    enumerable: true
  },

  queryParentsByClass: {
    get: function() {
      return queryParentsByClass;
    },

    enumerable: true
  },

  focus: {
    get: function() {
      return focus;
    },

    enumerable: true
  },

  requestAnimationFrame: {
    get: function() {
      return requestAnimationFrame;
    },

    enumerable: true
  },

  cancelAnimationFrame: {
    get: function() {
      return cancelAnimationFrame;
    },

    enumerable: true
  },

  listener: {
    get: function() {
      return listener;
    },

    enumerable: true
  },

  throttledListener: {
    get: function() {
      return throttledListener;
    },

    enumerable: true
  }
}));

var base$$ = require("./base");

var _hasClassList = !!window['domTokenList'];

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

/**
 * @param {Element} el
 * @param {string} value
 */
var containsClass = _hasClassList ?
  function(el, value) {
    return el.classList.contains(value)
  } : function(el, value) {
    return ~base$$.indexOf(listClasses(el), value)
  }
function setClass(el, value) {
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
    if ( base$$.indexOf(classes,value) < 0 ) {
      classes.push(value)
      el.className = classes.join(' ')
    }
  }

/**
 * @param {Element} el
 * @param {Array.<string>} values
 */
var addClasses =_hasClassList ?
  function(el, values) {
    base$$.forEach(function(value) { el.classList.add(value) }, values)
  } : function(el, values) {
    var classMap = {}, v
    function setTrue(value) { classMap[value] = true }
    base$$.forEach(setTrue, listClasses(el))
    base$$.forEach(setTrue, values)
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
var removeClass = _hasClassList ?
  function(el, value) {
    el.classList.remove(value)
  } : function(el, value) {
    var classes = listClasses(el), index = base$$.indexOf(classes, value)
    if ( ~index ) el.className = classes.splice(index, 1).join(' ')
  }

/**
 * @param {Element} el
 * @param {Array.<string>} values
 */
var removeClasses = _hasClassList ?
  function(el, values) {
    base$$.forEach(function(value) { el.classList.remove(value) }, values)
  } : function(el, values) {
    el.className = base$$.filter(function(value) { return base$$.indexOf(values, value) < 0 }, listClasses(el)).join(' ')
  }

/**
 * @param {Element} el
 * @param {string} value
 */
var toggleClass = _hasClassList ?
  function(el, value) {
    el.classList.toggle(value)
  } : function(el, value) {
    var classes = el.className.split(/\S+/g), index = base$$.indexOf(classes, value)
    el.className = (~index ? classes.splice(index, 1) : classes.push(value)).join(' ')
  }


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
function setProperties(el, properties) {
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

function setText(node, text) {
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

function setData(el, key, value) {
  if (el.dataset) {
    el.dataset[key] = value;
  } else {
    el.setAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase(), value);
  }
}

function getData(el, key) {
  if (el.dataset) {
    return el.dataset[key];
  } else {
    return el.getAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase());
  }
}

function removeData(el, key) {
  if (el.dataset) {
    delete el.dataset[key];
  } else {
    el.removeAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase());
  }
}

function hasData(el, key) {
  if (el.dataset) {
    return key in el.dataset;
  } else if (el.hasAttribute) {
    return el.hasAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase());
  } else {
    return !!(el.getAttribute('data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase()));
  }
}

function getAllData(el) {
  if (el.dataset) {
    return el.dataset;
  } else {
    var dataset = {}, attributes = el.attributes, i;
    for (i = 0; i < attributes.length; ++i) {
      var attribute = attributes[i];
      if (~base$$.indexOf(attribute.name, 'data-')) {
        dataset[attribute.name.substr(5).replace(/\-([a-z])/g, uppercaseData)] = attribute.value;
      }
    }
    return dataset;
  }
}

function uppercaseData(_, match) {
  return match.toUpperCase();
}

function queryByClass(className, opt_parent) {
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

function queryParentsByClass(el, className) {
  while(el) {
    if( containsClass(el, className) ) return el
    el = el.parentElement
  }
}

function focus(el) {
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
    var n = base$$.now(), f = _rafCallbacks.length === 0, d = 16-(n-l)
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
})();

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
function listener(cb, selfObj, handlerBaseName, el) {
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

function throttledListener(cb, selfObj, handlerBaseName, el) {
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

//# sourceMappingURL=dom.js.map