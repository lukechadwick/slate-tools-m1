'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _fs = require('fs');

var _findRoot = require('find-root');

var _findRoot2 = _interopRequireDefault(_findRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var workingDirectory = process.cwd();
var currentDirectory = __dirname;

var themeRoot = (0, _findRoot2.default)(workingDirectory);
var defaultGulpPath = (0, _path.join)(themeRoot, (0, _path.normalize)('node_modules/.bin/gulp'));
// Legacy path for older versions of Node.
var legacyGulpPath = (0, _path.join)(themeRoot, (0, _path.normalize)('node_modules/@shopify/slate-tools/node_modules/.bin/gulp'));

var config = {
  gulpFile: (0, _path.join)(currentDirectory, 'gulpfile.js'),
  gulp: (0, _fs.existsSync)(defaultGulpPath) ? defaultGulpPath : legacyGulpPath,
  themeRoot: themeRoot
};

exports.default = config;