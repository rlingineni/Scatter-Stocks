/*!
 * write-data <https://github.com/jonschlinkert/write-data>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var path = require('path');
var json = require('write-json');
var yaml = require('write-yaml');
var extend = require('extend-shallow');
var isObject = require('isobject');

/**
 * Asynchronously write JSON or YAML to disk, creating any
 * intermediary directories if they don't exist. Data
 * type is determined by the `dest` file extension.
 *
 * ```js
 * writeData('foo.yml', {foo: "bar"}, function(err) {
 *   // do stuff with err
 * });
 * ```
 * @param  {String} `dest` (required) Destination filepath.
 * @param  {Object} `data` (required) The data object to write.
 * @param  {Options} `options` (optional)
 * @param  {Function} `cb` (required) Callback function
 */

module.exports = function(dest, data, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }
  if (typeof dest !== 'string') {
    cb(new TypeError('expected dest path to be a string'));
    return;
  }
  if (!isObject(data)) {
    cb(new TypeError('expected data to be an object'));
    return;
  }

  var opts = extend({ indent: 2, safe: true }, options);
  var ext = opts.ext || path.extname(dest);

  if (ext.charAt(0) !== '.') {
    ext = '.' + ext;
  }

  switch (ext) {
    case '.yml':
    case '.yaml':
      yaml(dest, data, opts, cb);
      break;
    case '.json':
      json(dest, data, opts, cb);
      break;
    default: {
      cb(new Error('unsupported file extension: ' + ext));
      break;
    }
  }
};

/**
 * Synchronously write JSON or YAML to disk, creating any
 * intermediary directories if they don't exist. Data
 * type is determined by the `dest` file extension.
 *
 * ```js
 * writeData.sync('foo.yml', {foo: "bar"});
 * ```
 * @param  {String} `dest` (required) Destination filepath.
 * @param  {Object} `data` (required) The data object to write.
 * @param  {Options} `options` (optional)
 */

module.exports.sync = function(dest, data, options) {
  if (typeof dest !== 'string') {
    throw new TypeError('expected dest path to be a string');
  }
  if (!isObject(data)) {
    throw new TypeError('expected data to be an object');
  }

  var opts = extend({ indent: 2, safe: true }, options);
  var ext = opts.ext || path.extname(dest);

  if (ext.charAt(0) !== '.') {
    ext = '.' + ext;
  }

  switch (ext) {
    case '.yml':
    case '.yaml':
      return yaml.sync(dest, data, opts);
    case '.json':
      return json.sync(dest, data, opts);
    default: {
      throw new Error('unsupported file extension: ' + ext);
    }
  }
};
