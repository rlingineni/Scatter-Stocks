# write-json [![NPM version](https://img.shields.io/npm/v/write-json.svg?style=flat)](https://www.npmjs.com/package/write-json) [![NPM monthly downloads](https://img.shields.io/npm/dm/write-json.svg?style=flat)](https://npmjs.org/package/write-json) [![NPM total downloads](https://img.shields.io/npm/dt/write-json.svg?style=flat)](https://npmjs.org/package/write-json) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/write-json.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/write-json)

> Write a JSON file to disk, also creates intermediate directories in the destination path if they don't already exist.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save write-json
```

## Usage

```js
var writeJson = require('write-json'); 

// async
writeJson('foo.json', {abc: 'xyz'}, function(err) {
  // do stuff with err
});

// sync
writeJson.sync('foo.json', {abc: 'xyz'});
```

<details>
<summary><strong>JSON.stringify</strong></summary>

### arguments

All methods support the same arguments as [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) (note that if you want to pass a [replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter) function to `writeJson` - the main export, you must pass the replacer on an [options](#options) object)

```js
// async
writeJson('foo.json', {abc: 'xyz'}, null, 2, function(err) {
  if (err) console.log(err);
});

// sync
writeJson.sync('foo.json', {abc: 'xyz'}, null, 2);
```

### options

Or as an options object:

```js
var options = {
  replacer: function(key, value) {
    // filter out properties
    if (typeof value === 'string') {
      return undefined;
    }
    return value;
  },
  indent: 2
};

// async
writeJson('foo.json', {abc: 'xyz'}, options, function(err) {
  if (err) console.log(err);
});

// sync
writeJson.sync('actual/test.json', expected, options);
```

</details>

## API

### [writeJson](index.js#L58)

Calls `JSON.stringify` on the given `value` then asynchronously writes the result to a file, replacing the file if it already exists and creating any intermediate directories if they don't already exist. Returns a promise if a callback function is not passed.

**Params**

* `filepath` **{string}**: Destination file path
* `value` **{object}**: Value to stringify.
* `options` **{object}**: Options to pass to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
* `callback` **{Function}**: (optional) If no callback is provided, a promise is returned.
* `returns` **{undefined}**

**Example**

```js
var writeJson = require('write');
var pkg = {name: 'write-json'};

writeJson('foo.json', pkg, function(err) {
  if (err) console.log(err);
});

// pass options to JSON.stringify explicitly
writeJson('foo.json', pkg, null, 2, function(err) {
  if (err) console.log(err);
});

// pass options to JSON.stringify as an object
// (since this method returns a promise if no callback is passed,
// if you want to pass a replacer function to JSON.stringify, it
// must be passed on an options object)
writeJson('foo.json', pkg, {
  indent: 2,
  replacer: function(value) {
    // filter out properties
    if (typeof value === 'string') {
      return undefined;
    }
    return value;
  }
}, function(err) {
  if (err) console.log(err);
});
```

### [.promise](index.js#L84)

The promise version of [writeFile](#writefile). Returns a promise.

**Params**

* `filepath` **{String}**: Destination file path
* `value` **{any}**: The value to stringify
* `options` **{object}**: Options to pass to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
* `returns` **{Promise}**

**Example**

```js
var writeJson = require('write');
writeJson.promise('package.json', {name: 'write-json'})
  .then(function() {
    // do stuff
  });
```

### [.sync](index.js#L104)

The synchronous version of [writeFile](#writefile). Returns undefined.

**Params**

* `filepath` **{String}**: Destination file path
* `value` **{any}**: The value to stringify
* `options` **{object}**: Options to pass to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
* `returns` **{undefined}**

**Example**

```js
var writeJson = require('write');
writeJson.sync('package.json', {name: 'write-json'});
```

### [.stream](index.js#L129)

The stream version of [writeFile](#writefile). Returns a new [WriteStream](https://nodejs.org/api/fs.html#fs_class_fs_writestream) object.

**Params**

* `filepath` **{string|Buffer|integer}**: filepath or file descriptor.
* `options` **{object}**: Options to pass to [mkdirp](https://github.com/substack/node-mkdirp) and [fs.createWriteStream][fs]{#fs_fs_createwritestream_path_options}
* `returns` **{Stream}**: Returns a new [WriteStream](https://nodejs.org/api/fs.html#fs_class_fs_writestream) object. (See [Writable Stream](https://nodejs.org/api/stream.html#stream_class_stream_writable)).

**Example**

```js
var fs = require('fs');
var writeJson = require('write');
fs.createReadStream('defaults.json')
  .pipe(writeJson.stream('package.json'))
  .on('close', function() {
    // do stuff
  });
```

## Release history

### v2.0.0 - 2017-07-10

**Changed**

* The main function now returns a promise if no callback is passed

**Added**

* adds [promise support](#promise)
* adds [stream support](#stream)

### v1.0.0 - 2017-04-12

**Fixed**

* Make sure `JSON.stringify` receives all intended arguments

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [delete](https://www.npmjs.com/package/delete): Delete files and folders and any intermediate directories if they exist (sync and async). | [homepage](https://github.com/jonschlinkert/delete "Delete files and folders and any intermediate directories if they exist (sync and async).")
* [read-data](https://www.npmjs.com/package/read-data): Read JSON or YAML files. | [homepage](https://github.com/jonschlinkert/read-data "Read JSON or YAML files.")
* [read-yaml](https://www.npmjs.com/package/read-yaml): Very thin wrapper around js-yaml for directly reading in YAML files. | [homepage](https://github.com/jonschlinkert/read-yaml "Very thin wrapper around js-yaml for directly reading in YAML files.")
* [write-data](https://www.npmjs.com/package/write-data): Write a YAML or JSON file to disk. Automatically detects the format to write based… [more](https://github.com/jonschlinkert/write-data) | [homepage](https://github.com/jonschlinkert/write-data "Write a YAML or JSON file to disk. Automatically detects the format to write based on extension. Or pass `ext` on the options.")
* [write-yaml](https://www.npmjs.com/package/write-yaml): Write YAML. Converts JSON to YAML writes it to the specified file. | [homepage](https://github.com/jonschlinkert/write-yaml "Write YAML. Converts JSON to YAML writes it to the specified file.")
* [write](https://www.npmjs.com/package/write): Write data to a file, replacing the file if it already exists and creating any… [more](https://github.com/jonschlinkert/write) | [homepage](https://github.com/jonschlinkert/write "Write data to a file, replacing the file if it already exists and creating any intermediate directories if they don't already exist. Thin wrapper around node's native fs methods.")

### Author

**Jon Schlinkert**

* [linkedin/in/jonschlinkert](https://linkedin.com/in/jonschlinkert)
* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on January 26, 2018._