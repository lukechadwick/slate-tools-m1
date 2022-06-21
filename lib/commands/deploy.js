'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (program) {
  program.command('deploy').alias('d').description('Runs a full deploy of your theme\'s code to a Shopify store specified in config.yml. Existing files will be overwritten.').option('-e, --env <environment>[,<environment>...]', 'Shopify store(s) to deploy code to (specified in config.yml - default: development)', 'development').option('-m, --manual', 'outputs the compiled theme files to <theme>/upload/<theme>.zip for manual deployment').action(function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    logger('--gulpfile ' + _config2.default.gulpFile);
    logger('--cwd ' + _config2.default.themeRoot);

    var args = options.manual ? ['deploy:manual'] : ['deploy', '--environment', options.env];

    (0, _crossSpawn2.default)(_config2.default.gulp, args.concat(['--gulpfile', _config2.default.gulpFile, '--cwd', _config2.default.themeRoot]), {
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

var logger = (0, _debug2.default)('slate-tools:deploy');