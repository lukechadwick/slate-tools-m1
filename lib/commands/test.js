'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (program) {
  program.command('test').description('Runs translation tests for a theme\'s locale files (<theme>/src/locales/).').action(function () {
    logger('--gulpfile ' + _config2.default.gulpFile);
    logger('--cwd ' + _config2.default.themeRoot);

    (0, _crossSpawn2.default)(_config2.default.gulp, ['test', '--gulpfile', _config2.default.gulpFile, '--cwd', _config2.default.themeRoot], {
      detached: false,
      stdio: 'inherit'
    }).on('close', function (code) {
      if (code === 0) {
        return;
      }

      process.exit(2);
    });
  });
};

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _debug2.default)('slate-tools:test');