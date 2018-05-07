/*!
 * read-data <https://github.com/jonschlinkert/read-data>
 *
 * Copyright (c) 2014-2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var yaml = require('read-yaml');
var extend = require('extend-shallow');

/**
 * Asynchronously read a JSON or YAML file, automatically determining the
 * reader based on extension.
 *
 * ```js
 * var read = require('read-data');
 *
 * read('foo.json', function(err, data) {
 *   if (err) throw err;
 *   console.log(data);
 * });
 *
 * read('foo.yml', function(err, data) {
 *   if (err) throw err;
 *   console.log(data);
 * });
 * ```
 *
 * @name read
 * @param {String} `filepath` path of the file to read.
 * @param {Object|String} `options` to pass to [js-yaml]
 * @param {Function} `cb` callback function
 * @return {Object} JSON
 * @api public
 */

var read = module.exports = function read(filepath, options, cb) {
  if (options && typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = extend({}, options);
  var ext = extname(opts.lang || path.extname(filepath));
  read[ext](filepath, options, cb);
};

/**
 * Synchronously read a `.json` or `.(yaml|yml)` file, automatically determining the
 * reader based on extension.
 *
 * ```js
 * var data = require('read-data').data;
 *
 * var yaml = data.sync('foo.yml');
 * var json = data.sync('foo.json');
 * ```
 *
 * @name .sync
 * @param {String} `filepath` path of the file to read.
 * @param {Object|String} `options` to pass to [js-yaml]
 * @return {Object} JSON
 * @api public
 */

read.sync = function(filepath, options) {
  var opts = extend({}, options);
  var ext = extname(opts.lang || path.extname(filepath));
  return read[ext].sync(filepath, options);
};

/**
 * Asynchronously read a YAML file.
 *
 * ```js
 * var yaml = require('read-data').yaml;
 *
 * yaml('foo.yml', function(err, data) {
 *   if (err) throw err;
 *   console.log(data);
 * });
 * ```
 *
 * @name .yaml
 * @param {String} `filepath` path of the file to read.
 * @param {Object|String} `options` to pass to [js-yaml]
 * @param {Function} `cb` callback function
 * @return {Object} JSON
 * @api public
 */

read.yaml = yaml;

/**
 * Synchronously read a YAML file.
 *
 * ```js
 * var yaml = require('read-data').yaml;
 * var data = yaml.sync('foo.yml');
 * ```
 *
 * @name ..yaml.sync
 * @param {String} `filepath` path of the file to read.
 * @param {Object|String} `options` to pass to [js-yaml]
 * @return {Object} JSON
 * @api public
 */

read.yaml.sync = yaml.sync;

/**
 * Asynchronously read a JSON file.
 *
 * ```js
 * var json = require('read-data');
 *
 * json('foo.json', function(err, data) {
 *   if (err) throw err;
 *   console.log(data);
 * });
 * ```
 *
 * @name .json
 * @param {String} `filepath` path of the file to read.
 * @param {Function} `callback` callback function
 * @return {Object} JSON
 * @api public
 */

read.json = function json(filepath, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  // opts param exists to maintain the same arity as the
  // yaml method, so we can dynamically choose the reader
  fs.readFile(filepath, options, function(err, buf) {
    if (err) {
      cb(err);
      return;
    }

    cb(null, JSON.parse(buf.toString()));
  });
};

/**
 * Synchronously read a JSON file.
 *
 * ```js
 * var json = require('read-data').json;
 * var data = json.sync('foo.json');
 * ```
 *
 * @name .json.sync
 * @param {String} `filepath` path of the file to read.
 * @return {Object} JSON
 * @api public
 */

read.json.sync = function jsonSync(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (err) {
    err.message = 'read-data failed to parse "' + filepath + '": ' + err.message;
    throw err;
  }
};

/**
 * Get the extname without leading `.`
 */

function extname(ext) {
  var str = ext.charAt(0) === '.' ? ext.slice(1) : ext;
  if (str === 'yml') str = 'yaml';
  return str;
}
