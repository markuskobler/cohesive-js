/**
 * cohesive.js | Copyright 2014 Markus Kobler | 3-clause BSD license
 * @fileoverview analytics
 */
import {once} from "./base";

var GA_ENDPOINT = '//www.google-analytics.com/collect?v=1'

/**
 * @param {string} trackingID
 * @param {string=} opt_uid
 * @constructor
 */
export function GA(trackingID, opt_uid) {
  this._tid = trackingID
  this._next = ''
  this._endpoint = GA_ENDPOINT+'&tid='+this._tid+'&cid='+cohesiveUUID()
  if(opt_uid) this._endpoint += '&uid='+encodeURIComponent(opt_uid)
}

/**
 * @param {string=} opt_page
 * @param {string=} opt_title
 * @param {string=} opt_description
 * @param {boolean=} opt_nonIteraction
 */
GA.prototype.page = function(opt_page, opt_title, opt_description, opt_nonIteraction) {
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
GA.prototype.event = function(category, action, opt_label, opt_value, opt_nonIteraction) {
  var url = '&ec='+encodeURIComponent(category)
  url += '&ea='+encodeURIComponent(action)
  if(opt_label) url += '&el='+encodeURIComponent(opt_label)
  if(opt_value) url += '&ev='+encodeURIComponent(opt_value)
  this._send('event', url, opt_nonIteraction !== void 0 ? opt_nonIteraction : true)
}

GA.prototype.social = function(network, action, target, opt_nonIteraction) {
  var url = '&sn='+encodeURIComponent(network)
  url += '&sa='+encodeURIComponent(action)
  url += '&st='+encodeURIComponent(target)
  this._send('social', url, opt_nonIteraction !== void 0 ? opt_nonIteraction : true)
}

GA.prototype.setCampaign = function(name, source, medium, keyword, content) {
  var campaign = ''
  if(name) campaign += '&cn='+encodeURIComponent(name)
  if(source) campaign += '&cs='+encodeURIComponent(source)
  if(medium) campaign += '&cm='+encodeURIComponent(medium)
  if(keyword) campaign += '&ck='+encodeURIComponent(keyword)
  if(content) campaign += '&cc='+encodeURIComponent(content)
  this._next += campaign
}

GA.prototype.setCustomDimension = function(id, value) {
  this._next += '&cd'+id+'='+encodeURIComponent(value);
}

GA.prototype.setCustomMetric = function(id, value) {
  this._next += '&cm'+id+'='+value;
}

// TODO: support beacon api
//   https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon
//   https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/Beacon/Overview.html
// TODO fallback to XHR POST if larger than IE max 2000
GA.prototype._send = function(type, args, opt_nonIteraction) {
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

var cohesiveUUID = once(function() {
  var m = /__c=([\w-_]*);?/.exec(document.cookie)
  if (!m) return void 0
  function to16(v,from,to) {
    var n = parseInt(v.substring(from,to), 32).toString(16)
    return (n.length < 5) ? '0000'.substring(0,5-n.length)+n : n
  }
  var v = m[1]
  return to16(v,1,5)+'000-0000-4'+v[0]+'00-8000-00'+to16(v,5,9)+to16(v,9,13)
})

// fallback id?
// function uniqueID() {
//   return ((now() & 0x7fffe000) | (Math.random() * 0x1fff << 0)).toString(36)
// }


