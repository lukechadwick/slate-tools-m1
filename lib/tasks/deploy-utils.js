'use strict';

/* eslint-disable no-sync,no-process-env */

var gulp = require('gulp');
var Promise = require('bluebird');
var fs = require('fs');
var debug = require('debug')('slate-tools:deploy');
var open = Promise.promisify(require('open'));
var yaml = require('js-yaml');
var themekit = require('@shopify/themekit');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

/**
 * simple promise factory wrapper for deploys
 * @param env - the environment to deploy to
 * @returns {Promise}
 * @private
 */
function deploy(env) {
  return new Promise(function (resolve, reject) {
    debug('themekit cwd to: ' + config.dist.root);

    themekit.command({
      args: ['replace', '--env', env],
      cwd: config.dist.root
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }).catch(function (err) {
    messages.logTransferFailed(err);
  });
}

/**
 * Validate theme_id used for the environment
 * @param {Object} - settings of theme_id and environment
 * @returns {Promise}
 * @private
 */
function validateId(settings) {
  return new Promise(function (resolve, reject) {
    // Only string allowed is "live"
    if (settings.themeId === 'live') {
      resolve();
    }

    var id = Number(settings.themeId);

    if (isNaN(id)) {
      reject(settings);
    } else {
      resolve();
    }
  });
}

/**
 * Validate the config.yml theme_id is an integer or "live"
 * @function validate:id
 * @memberof slate-cli.tasks.watch, slate-cli.tasks.deploy
 * @private
 */
gulp.task('validate:id', function () {
  var file = void 0;

  try {
    file = fs.readFileSync(config.tkConfig, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw new Error(err);
    }

    messages.configError();

    return process.exit(2);
  }

  var tkConfig = yaml.safeLoad(file);
  var envObj = void 0;

  var environments = config.environment.split(/\s*,\s*|\s+/);
  var promises = [];

  environments.forEach(function (environment) {
    function factory() {
      envObj = tkConfig[environment];
      var envSettings = {
        themeId: envObj.theme_id,
        environment: environment
      };

      return validateId(envSettings);
    }
    promises.push(factory);
  });

  return utils.promiseSeries(promises).catch(function (result) {
    // stop process to prevent deploy defaulting to published theme
    messages.invalidThemeId(result.themeId, result.environment);
    return process.exit(2);
  });
});

/**
 * Replace your existing theme using ThemeKit.
 *
 * @function deploy:replace
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:replace', function () {
  debug('environments ' + config.environment);

  var environments = config.environment.split(/\s*,\s*|\s+/);
  var promises = [];

  environments.forEach(function (environment) {
    function factory() {
      messages.deployTo(environment);
      return deploy(environment);
    }

    promises.push(factory);
  });

  return utils.promiseSeries(promises).then(function () {
    return messages.allDeploysComplete();
  });
});

/**
 * Opens the Store in the default browser (for manual upgrade/deployment)
 *
 * @function open:admin
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:admin', function () {
  var file = fs.readFileSync(config.tkConfig, 'utf8');
  var tkConfig = yaml.safeLoad(file);
  var envObj = void 0;

  var environments = config.environment.split(/\s*,\s*|\s+/);
  var promises = [];

  environments.forEach(function (environment) {
    function factory() {
      envObj = tkConfig[environment];
      return open('https://' + envObj.store + '/admin/themes');
    }
    promises.push(factory);
  });

  return utils.promiseSeries(promises);
});

/**
 * Opens the Zip file in the file browser
 *
 * @function open:zip
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:zip', function () {
  return open('upload');
});