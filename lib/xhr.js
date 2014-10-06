/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 *
 * TODO work in progress
 *  - add support IE CORS XDomainRequest
 *  - add interceptors (request, requestError, response, responseError)
 *  - make injector friendly?
 *  - parse request string inserting expressions
 *  - global error handlers and csrf header?
 *  - mock xhr service for testing
 *
 * @fileoverview xhr
 */
import {isFunction, isArray, isObject, bind, bindPartial, extend, noop} from "./base";
import Promise from "./promise";

/** @return {!XMLHttpRequest} */
var xhrRequest = typeof XMLHttpRequest !== 'undefined' ?
  function() { return new XMLHttpRequest() } :
  function() { return new ActiveXObject('Microsoft.XMLHTTP') }

/** @type {number} */
var _requestCount = 0;

/** @type {{
 *   headers: (Object.<string>|undefined),
 *   mimeType: (string|undefined),
 *   withCredentials: (boolean|undefined),
 *   timeout: (number|undefined),
 *   xssiPrefix: (string|undefined)
 * }|undefined} */
var _opts;

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
function send(method, url, opt_data, opt_options) {
  var id = (_requestCount++)
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

  var req = xhrRequest()
  var p  = new Promise(function(resolve, reject) {
    var scope = {xhr:req} // todo check??
    sendRequest(req, method, url, opt_data, opt_options, resolve, reject, scope)
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
send.setDefaults = function (o) {
  _opts = o && /** @type {xhr.Options} */(extend(_opts || {}, o))
}


/**
 * @param {string} url
 * @param {Object|string} data
 * @return {string}
 */
send.encodeURL = function(url, data) {
  if (data) url += (url.indexOf('?') < 0 ? '?' : '&') + toQueryString(data)
  return url
}


/**
 * @param {string} url
 * @param {Object=} opt_data
 * @param {xhr.Options=} opt_options
 * @return {!Promise}
 */
function GET(url, opt_data, opt_options) {
  return send('GET', opt_data ? send.encodeURL(url, opt_data) : url, void 0, opt_options)
}

/**
 * @param {string} url
 * @param {Object=} opt_data
 * @param {xhr.Options=} opt_options
 * @return {!Promise}
 */
function HEAD(url, opt_data, opt_options) {
  return send('HEAD', opt_data ? send.encodeURL(url, opt_data) : url, void 0, opt_options)
}

/**
 * @param {string} url
 * @param {Object=} opt_data
 * @param {xhr.Options=} opt_options
 * @return {!Promise}
 */
function DELETE(url, opt_data, opt_options) {
  return send('DELETE', opt_data ? send.encodeURL(url, opt_data) : url, void 0, opt_options)
}

/**
 * @param {string} url
 * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null} data
 * @param {xhr.Options=} opt_options
 * @return {!Promise}
 */
function POST(url, data, opt_options) {
  return send('POST', url, data, opt_options)
}

/**
 * @param {string} url
 * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null} data
 * @param {xhr.Options=} opt_options
 * @return {!Promise}
 */
function PUT(url, data, opt_options) {
  return send('PUT', url, data, opt_options)
}

/**
 * @param {string} url
 * @param {ArrayBuffer|Blob|Document|FormData|Object|string|null} data
 * @param {xhr.Options=} opt_options
 * @return {!Promise}
 */
function PATCH(url, data, opt_options) {
  return send('PATCH', url, data, opt_options)
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
function request(method, url, opt_data, opt_options, opt_callback, opt_errback, opt_scope) {
  var req = xhrRequest();
  sendRequest(req, method, url, opt_data, opt_options, opt_callback, opt_errback, req);
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
function sendRequest(req, method, url, opt_data, opt_options, opt_callback, opt_errback, opt_scope) {
  var timer, /** @type {*} */scope, /** @type {xhr.Options|undefined} */ options, hasContentType = false;

  if (_opts || opt_options) options = /** @type {xhr.Options|undefined} */(extend({}, _opts, opt_options))

  method = method.toUpperCase();

  req.onreadystatechange = function() {
//        todo handle each type of event
//        console.log(req.readyState, arguments)
    if (req.readyState === 4) { // complete
      clearTimeout(timer);
      if (_isSuccess(req.status)) {
        var response, prefix = options && options.xssiPrefix;
        if (prefix && req.responseText.indexOf(prefix) === 0) {
          response = req.responseText.slice(prefix.length)
        } else {
          response = req.response
        }
        if (opt_callback) opt_callback.call(scope, response);
      } else if (opt_errback) {
        opt_errback.call(scope, new HTTPError(req.status, method, url, req));
      }
    }
  }

  try {
    req.open(method, url, true);
  } catch (/** @type {Error}*/ e1) {
    if (opt_errback) opt_errback.call(scope, new XHRError('Open failed: ' + e1.message, method, url, req));
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
        req.onreadystatechange = noop;
        req.abort();
        if (opt_errback) opt_errback.call(scope, new TimeoutError(method, url, req));
      }, options.timeout);
    }
  }

  // todo make extendable through an interceptor
  if( opt_data ) {
    // todo is this the right way of soloving this?
    if (!hasContentType) {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      opt_data = toQueryString(opt_data);
    }
  }

  try {
    req.send(opt_data)
  } catch (/** @type {Error}*/ e2) {
    req.onreadystatechange = noop;
    clearTimeout(timer);
    if (opt_errback) opt_errback.call(scope, new XHRError('Send failed: ' + e2.message, method, url, req));
  }
}

/**
 * @param {Object|string} o
 * @return {string}
 */
function toQueryString(o) {
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
    if (isArray(obj)) {
      a = /** @type {Array.<*>} */(obj)
      for (i = 0; a && i < a.length; i++) {
        v = a[i]
        buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v)
      }
    } else if (isObject(obj)) {
      for (name in obj) {
        if (name in obj)
          buildParams(prefix + '[' + name + ']', obj[name])
      }
    } else {
      add(prefix, /** @type {string}*/(obj))
    }
  }

  if (isArray(o)) {
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
function XHRError(message, method, url, req) {
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
XHRError.prototype = Error.prototype;
XHRError.prototype.constructor = XHRError;
XHRError.prototype.toString = function() { return this.name + ': ' + this.message }

/**
 * @param {number} status
 * @param {string} method
 * @param {string} url
 * @param {!XMLHttpRequest} req
 * @extends {xhr.Error}
 * @constructor
 */
function HTTPError(status, method, url, req) {
  XHRError.call(this, 'Request Failed, ' + status, method, url, req)
  /** @type {number} */
  this.status = status;
}
HTTPError.prototype = XHRError.prototype;
HTTPError.prototype.constructor = HTTPError;

/**
 * @param {string} method
 * @param {string} url
 * @param {!XMLHttpRequest} req
 * @extends {xhr.Error}
 * @constructor
 */
function TimeoutError(method, url, req) {
  XHRError.call(this, 'Timeout', method, url, req)
}
TimeoutError.prototype = XHRError.prototype;
TimeoutError.prototype.constructor = TimeoutError;

/**
 * @param {string} method
 * @param {string} url
 * @param {!XMLHttpRequest} req
 * @extends {xhr.Error}
 * @constructor
 */
function AbortError(method, url, req) {
  XHRError.call(this, 'Abort', method, url, req)
}
AbortError.prototype = XHRError.prototype;
AbortError.prototype.constructor = AbortError;

/**
 * @param {number} status
 * @return {boolean}
 * @private
 */
function _isSuccess(status) {
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

export {
  GET,
  HEAD,
  DELETE,
  POST,
  PUT,
  PATCH,
  request,
  send
}
