'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (program) {
  program.command('watch').alias('w').description('Watches files for code changes and immediately deploys updates to your store as they occur. ' + 'By default, this command also runs a live-reload proxy that refreshes your store URL in-browser when changes are successfully deployed.').option('-e, --env <environment>', 'Shopify store to deploy code to (specified in config.yml - default: development)', 'development').option('-n, --nosync', 'disable live-reload functionality').action(function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    logger('--gulpfile ' + _config2.default.gulpFile);
    logger('--cwd ' + _config2.default.themeRoot);

    var args = ['watch', '--gulpfile', _config2.default.gulpFile, '--cwd', _config2.default.themeRoot, '--environment', options.env];

    if (options.nosync) {
      args.push('--nosync');
    }

    (0, _crossSpawn2.default)(_config2.default.gulp, args, {
      detached: false,
      stdio: 'inherit'
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

var logger = (0, _debug2.default)('slate-tools:watch');