/** 
 * cohesive.js | Copyright 2014 Markus Kobler | Apache, Version 2.0
 *
 * @fileoverview DOM utils for cohesive.js
 */
import cohesive from "cohesive";
import {forEach, indexOf, filter} from "cohesive";

var DOM = cohesive.DOM = {}

/** @const */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * @param {string} value
 * @returns {string}
 */
DOM.escapeHTML = function(value) {
  return value === null ? '' : String(value).replace(/[&<>"']/g,
    function escapeHTMLChar(match) {
      return htmlEscapes[match];
    });
};

/** @const */
var htmlUnescapes = {
  '&amp;':  '&',
  '&lt;':   '<',
  '&gt;':   '>',
  '&quot;': '"',
  '&#39;':  "'"
};

/**
 * @param {string} value
 * @returns {string}
 */
DOM.unescapeHTML = function(value) {
  return value === null ? '' : String(value).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    function unescapeHTMLChar(match) {
      return htmlUnescapes[match];
    });
}

///////////////////////////////////////////////////////////////////////////////////////

var hasClassList = !!window['DOMTokenList']

/**
 * @param {Element} element
 * @return {!{length:number}}
 */
DOM.listClasses = hasClassList ?
  function (element) {
    return element.classList;
  } :
  function (element) {
    var className = element.className;
    return typeof className === "string" && className.match(/\S+/g) || [];
  };

/**
 * @param {Element} el
 * @param {string} value
 */
DOM.containsClass = hasClassList ?
  function(el, value) {
    return el.classList.contains(value);
  } : function(el, value) {
    return ~indexOf(DOM.listClasses(el), value);
  };

/**
 * @param {Element} el
 * @param {string} value
 */
DOM.setClass = function(el, value) {
  el.className = value;
};

/**
 * @param {Element} el
 * @param {string} value
 */
DOM.addClass = hasClassList ?
  function(el, value) {
    el.classList.add(value)
  } : function(el, value) {
    var classes = DOM.listClasses(el);

    if ( indexOf(classes,value) < 0 ) {
      classes.push(value)
      el.className = classes.join(' ')
    }
  };

/**
 * @param {Element} el
 * @param {Array.<string>} values
 */
DOM.addClasses = hasClassList ?
    function(el, values) {
      forEach(function(value) {
        el.classList.add(value);
      }, values);
    } :
    function(el, values) {
      var classMap = {};

      function setTrue(value) {
        classMap[value] = true
      }
      forEach(setTrue, DOM.listClasses(el));
      forEach(setTrue, values);

      el.className = '';
      for (var value in classMap) {
        el.className += el.className.length > 0 ? (' ' + value) : value;
      }
    };


/**
 * @param {Element} el
 * @param {string} value
 */
DOM.removeClass = hasClassList ?
  function(el, value) {
    el.classList.remove(value)
  } : function(el, value) {
    var classes = DOM.listClasses(el),
        index = indexOf(classes, value);
    if ( ~index ) {
      el.className = classes.splice(index, 1).join(' ')
    }
  };

/**
 * @param {Element} el
 * @param {Array.<string>} values
 */
DOM.removeClasses = hasClassList ?
  function(el, values) {
    forEach(function(value) {
      el.classList.remove(value)
    }, values)
  } : function(el, values) {
    el.className = filter(function(value) { return indexOf(values, value) < 0 },
                          DOM.listClasses(el)).join(' ')
  };


/**
 * @param {Element} el
 * @param {string} value
 */
DOM.toggleClass = hasClassList ?
  function(el, value) {
    el.classList.toggle(value)
  } : function(el, value) {

    var classes = el.className.split(/\S+/g),
        index = indexOf(classes, value);

    el.className = (~index ? classes.splice(index, 1) : classes.push(value)).join(' ')
  };


/**
 * @param {Element} el
 * @param {string} value
 * @param {boolean=} opt_enabled
 */
DOM.enableClass = function(el, value, opt_enabled) {
  if (opt_enabled || opt_enabled == void 0) {
    DOM.addClass(el, value);
  } else {
    DOM.removeClass(el, value);
  }
};


/**
 * @param {string} className
 * @param {Document|Element=} opt_parent
 * @return {{length: number}}
 */
DOM.queryByClass = function (className, opt_parent) {
  var parent = opt_parent || document;

  if (parent.getElementsByClassName) {
    return parent.getElementsByClassName(className);
  }

  var results, el, name, sNames, n, len, l, i, c, elements;

  results = {}
  c = 0
  i = 0
  elements = parent.getElementsByTagName('*')

  while ((el = elements[i++])) {
    name = el.className;
    if (typeof name.split == 'function') {
      sNames = name.split(/\s+/)
      l = -1
      len = sNames.length
      while (++l < len) {
        if (sNames[l] === className) {
          results[c++] = el;
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
DOM.queryParentsByClass = function(el, className) {
  while(el) {
    if( DOM.containsClass(el, className) ) return el;
    el = el.parentElement
  }
  return;
}


/**
 * @param {Element} el
 * @param {Object} properties
 */
DOM.setProperties = function setProperties(el, properties) {
  for (var key in properties) {
    var val = properties[key]
    if (key == 'style') {
      el.style.cssText = val;
    } else if (key == 'class') {
      el.className = val;
    } else if (key == 'for') {
      el.htmlFor = val;
    } else if (key in DIRECT_ATTRIBUTE_MAP) {
      el.setAttribute(DIRECT_ATTRIBUTE_MAP[key], val);
    } else if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
      el.setAttribute(key, val);
    } else {
      el[key] = val;
    }
  }
};

/**
 */
DOM.focus = function(el) {
  var focus = el && !el.disabled && el.style.display != 'none' && el.style.visibility != 'hidden'
  if (focus) el.focus();
  return focus;
}

/**
 * @param {?function(this:T, ...)} cb
 * @param {T} selfObj
 * @param {Element} el
 * @param {string} handlerBaseName
 * @return {!Function}
 * @template T
 */
DOM.listener = function(cb, selfObj, el, handlerBaseName) {
  var fn = function DOM$listener(e) {
    return cb.call(selfObj || window, e || window['event'])
  }
  if (el.addEventListener) {
    el.addEventListener(handlerBaseName, fn, false);
  } else if (el.detachEvent) {
    el.attachEvent('on' + handlerBaseName, fn);
  }
  fn.destroy = function() {
    if (el.addEventListener) {
      el.removeEventListener(handlerBaseName, fn, false);
    } else if (el.detachEvent) {
      el.detachEvent('on' + handlerBaseName, fn);
    }
  }
  return fn
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
};
