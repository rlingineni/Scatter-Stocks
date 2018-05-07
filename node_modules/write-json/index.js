/*!
 * write-json <https://github.com/jonschlinkert/write-json>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('isobject');
var writeFile = require('write');

/**
 * Calls `JSON.stringify` on the given `value` then asynchronously writes the
 * result to a file, replacing the file if it already exists and creating any
 * intermediate directories if they don't already exist. Returns a promise if
 * a callback function is not passed.
 *
 * ```js
 * var writeJson = require('write');
 * var pkg = {name: 'write-json'};
 *
 * writeJson('foo.json', pkg, function(err) {
 *   if (err) console.log(err);
 * });
 *
 * // pass options to JSON.stringify explicitly
 * writeJson('foo.json', pkg, null, 2, function(err) {
 *   if (err) console.log(err);
 * });
 *
 * // pass options to JSON.stringify as an object
 * // (since this method returns a promise if no callback is passed,
 * // if you want to pass a replacer function to JSON.stringify, it
 * // must be passed on an options object)
 * writeJson('foo.json', pkg, {
 *   indent: 2,
 *   replacer: function(value) {
 *     // filter out properties
 *     if (typeof value === 'string') {
 *       return undefined;
 *     }
 *     return value;
 *   }
 * }, function(err) {
 *   if (err) console.log(err);
 * });
 * ```
 * @name writeJson
 * @param  {string} `filepath` Destination file path
 * @param  {object} `value` Value to stringify.
 * @param  {object} `options` Options to pass to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
 * @param  {Function} `callback` (optional) If no callback is provided, a promise is returned.
 * @return {undefined}
 * @api public
 */

function writeJson(filepath, value, cb) {
  var args = [].slice.call(arguments, 1);
  if (typeof args[args.length - 1] === 'function') {
    cb = args.pop();
  }
  return writeFile(filepath, stringify.apply(null, args), cb);
}

/**
 * The promise version of [writeFile](#writefile). Returns a promise.
 *
 * ```js
 * var writeJson = require('write');
 * writeJson.promise('package.json', {name: 'write-json'})
 *   .then(function() {
 *     // do stuff
 *   });
 * ```
 * @name .promise
 * @param  {String} `filepath` Destination file path
 * @param  {any} `value` The value to stringify
 * @param  {object} `options` Options to pass to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
 * @return {Promise}
 * @api public
 */

writeJson.promise = function(filepath, value) {
  var args = [].slice.call(arguments, 1);
  return writeFile.promise(filepath, stringify.apply(null, args));
};

/**
 * The synchronous version of [writeFile](#writefile). Returns undefined.
 *
 * ```js
 * var writeJson = require('write');
 * writeJson.sync('package.json', {name: 'write-json'});
 * ```
 * @name .sync
 * @param  {String} `filepath` Destination file path
 * @param  {any} `value` The value to stringify
 * @param  {object} `options` Options to pass to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
 * @return {undefined}
 * @api public
 */

writeJson.sync = function(filepath, value) {
  var args = [].slice.call(arguments, 1);
  writeFile.sync(filepath, stringify.apply(null, args));
};

/**
 * The stream version of [writeFile](#writefile). Returns a new
 * [WriteStream] object.
 *
 * ```js
 * var fs = require('fs');
 * var writeJson = require('write');
 * fs.createReadStream('defaults.json')
 *   .pipe(writeJson.stream('package.json'))
 *   .on('close', function() {
 *     // do stuff
 *   });
 * ```
 * @name .stream
 * @param {string|Buffer|integer} `filepath` filepath or file descriptor.
 * @param {object} `options` Options to pass to [mkdirp][] and [fs.createWriteStream][fs]{#fs_fs_createwritestream_path_options}
 * @return {Stream} Returns a new [WriteStream] object. (See [Writable Stream](https://nodejs.org/api/stream.html#stream_class_stream_writable)).
 * @api public
 */

writeJson.stream = function(filepath, options) {
  var args = [].slice.call(arguments, 1);
  return writeFile.stream(filepath, stringify.apply(null, args));
};

/**
 * Utility function for stringifying the given value, ensuring that
 * options are correctly passed to `JSON.stringify`.
 *
 * @param {any} `value`
 * @param {Function|Object} `replacer` Function or options object
 * @param {String|Number} `indent` The actual value to use for spacing, or the number of spaces to use.
 * @return {String}
 */

function stringify(value, replacer, indent) {
  if (isObject(replacer)) {
    var opts = replacer;
    replacer = opts.replacer;
    indent = opts.indent;
  }
  if (indent == null) {
    indent = 2;
  }
  return JSON.stringify(value, replacer, indent);
}

/**
 * Expose `writeJson`
 */

module.exports = writeJson;
