/*!
 * read-yaml <https://github.com/jonschlinkert/read-yaml>
 *
 * Copyright (c) 2014, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */
'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var extend = require('extend-shallow');

/**
 * Read yaml file asynchronously and parse content as JSON.
 *
 * ```js
 * var readYaml = require('read-yaml');
 * readYaml('config.yml', function(err, data) {
 *   if (err) throw err;
 *   console.log(data);
 * });
 * ```
 * @param {String} `filepath` Path of the file to read.
 * @param {Object|String} `options` to pass to [js-yaml][]
 * @param {Function} `cb` Callback function `
 * @api public
 */

function readYaml(filepath, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = extend({}, options, {filename: filepath});

  fs.readFile(filepath, options, function(err, buf) {
    if (err) {
      cb(err);
      return;
    }

    var data;

    try {
      data = yaml.safeLoad(buf, opts);
    } catch (err) {
      cb(err);
      return;
    }

    cb(null, data);
  });
}

/**
 * Read yaml file synchronously and parse content as JSON.
 *
 * ```js
 * var read = require('read-yaml');
 * var config = read.sync('config.yml');
 * ```
 * @param {String} `filepath` Path of the file to read.
 * @param {Object|String} `options` to pass to [js-yaml][].
 * @return {Object} JSON
 * @api public
 */

readYaml.sync = function readYamlSync(filepath, options) {
  var str = fs.readFileSync(filepath, options);
  var opts = extend({}, options, {filename: filepath});
  return yaml.safeLoad(str, opts);
};

/**
 * Expose `readYaml`
 */

module.exports = readYaml;
