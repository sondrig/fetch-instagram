"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.media = exports.user = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require("es6-promise/auto");

require("isomorphic-fetch");

var _ramda = require("ramda");

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Constants
 */


/**
 * Flow types
 */
var DEFAULT_ENDPOINT = "/users/";
var DEFAULT_ORIGIN = "https://api.instagram.com";
var DEFAULT_SIZE = 0;
var DEFAULT_USER = "self";
var DEFAULT_VERSION = "v1";

/**
 * Error handling
 */
var handleErrors = function handleErrors(res) {
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res;
};

/**
 * Core query
 */
var query = function query(_ref) {
  var _ref$accessToken = _ref.accessToken,
      accessToken = _ref$accessToken === undefined ? "" : _ref$accessToken,
      _ref$endpoint = _ref.endpoint,
      endpoint = _ref$endpoint === undefined ? DEFAULT_ENDPOINT + DEFAULT_USER : _ref$endpoint,
      _ref$origin = _ref.origin,
      origin = _ref$origin === undefined ? DEFAULT_ORIGIN : _ref$origin,
      _ref$size = _ref.size,
      size = _ref$size === undefined ? DEFAULT_SIZE : _ref$size,
      _ref$version = _ref.version,
      version = _ref$version === undefined ? DEFAULT_VERSION : _ref$version,
      _ref$fetchOptions = _ref.fetchOptions,
      fetchOptions = _ref$fetchOptions === undefined ? {} : _ref$fetchOptions;

  var count = size ? "&count=" + size : "";

  return fetch(origin + "/" + version + endpoint + "?access_token=" + accessToken + count, _extends({}, fetchOptions)).then(handleErrors).then(function (res) {
    return res.json();
  });
};

/**
 * Enhancers
 */

var withFetchOptions = function withFetchOptions() {
  var fetchOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (fn) {
    return function (_ref2) {
      var options = _objectWithoutProperties(_ref2, []);

      return fn(_extends({}, options, { fetchOptions: fetchOptions }));
    };
  };
};

var withUserId = function withUserId() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_USER;
  return function (fn) {
    return function (_ref3) {
      var options = _objectWithoutProperties(_ref3, []);

      return fn(_extends({}, options, { endpoint: DEFAULT_ENDPOINT + id }));
    };
  };
};

var withAccessToken = function withAccessToken() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return function (fn) {
    return function (_ref4) {
      var options = _objectWithoutProperties(_ref4, []);

      return fn(_extends({}, options, { accessToken: accessToken }));
    };
  };
};

var withMedia = function withMedia() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "recent";
  return function (fn) {
    return function () {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _ref5$endpoint = _ref5.endpoint,
          endpoint = _ref5$endpoint === undefined ? DEFAULT_ENDPOINT + DEFAULT_USER : _ref5$endpoint,
          options = _objectWithoutProperties(_ref5, ["endpoint"]);

      return fn(_extends({}, options, { endpoint: endpoint + "/media/" + type }));
    };
  };
};

var withCount = function withCount() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function (fn) {
    return function (_ref6) {
      var options = _objectWithoutProperties(_ref6, []);

      return fn(_extends({}, options, {
        count: count
      }));
    };
  };
};

/**
 * Public API
 */
var user = exports.user = function user(_ref7) {
  var accessToken = _ref7.accessToken,
      id = _ref7.id,
      _ref7$fetchOptions = _ref7.fetchOptions,
      fetchOptions = _ref7$fetchOptions === undefined ? {} : _ref7$fetchOptions;
  return (0, _ramda.compose)(withFetchOptions(fetchOptions), withUserId(id), withAccessToken(accessToken))(query)();
};

var media = exports.media = function media(_ref8) {
  var accessToken = _ref8.accessToken,
      type = _ref8.type,
      id = _ref8.id,
      _ref8$size = _ref8.size,
      size = _ref8$size === undefined ? 10 : _ref8$size,
      _ref8$fetchOptions = _ref8.fetchOptions,
      fetchOptions = _ref8$fetchOptions === undefined ? {} : _ref8$fetchOptions;
  return (0, _ramda.compose)(withFetchOptions(fetchOptions), withUserId(id), withAccessToken(accessToken), withCount(size), withMedia(type))(query)();
};

var createInstagramInstance = function createInstagramInstance(options) {
  if (!options || (typeof options === "undefined" ? "undefined" : _typeof(options)) !== "object" || typeof options.accessToken !== "string") {
    throw new Error("Couldn't find instagram accessToken.\n      Did you pass the accessToken correctly?\n      Should be like `instagram({ accessToken: 'MY_TOKEN' })`");
  }
  var accessToken = options.accessToken;


  return {
    media: (0, _ramda.compose)(withAccessToken(accessToken))(media),
    user: (0, _ramda.compose)(withAccessToken(accessToken))(user)
  };
};

exports.default = createInstagramInstance;