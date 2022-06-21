'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var debug = require('debug')('slate-tools:watchers');
var chokidar = require('chokidar');
var fs = require('fs');
var themekit = require('@shopify/themekit');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');
var messages = require('./includes/messages.js');

var cache = utils.createEventCache();
var environment = config.environment.split(/\s*,\s*|\s+/)[0];
// prevent early execution on multi-file events
var debouncedDeployStatus = _.debounce(checkDeployStatus, 320);

var activeDeploy = false;

/**
 * If no deploy is active, call {@link deploy} passing files stored in
 *
 * @private
 */
function checkDeployStatus() {
  if (activeDeploy) {
    return;
  }

  if (cache.change.length) {
    deploy('upload', cache.change, environment);
    cache.change = [];
  } else if (cache.unlink.length) {
    deploy('remove', cache.unlink, environment);
    cache.unlink = [];
  }
}

/**
 * Executes a deployment (wrapped in a promise).  When the initial deploy
 * resolves, executes a call to {@link deployStatus}, recursively iterating
 * through subsequent cached files and deploying until no changes remain.
 *
 * @param {String|Array} cmd - the ThemeKit command to run (upload|remove)
 * @param {Array} files - an array of files to upload or remove @ the remote
 *   server
 * @private
 */
function deploy(cmd, files, env) {
  messages.logChildProcess(cmd);
  activeDeploy = true;

  return new Promise(function (resolve, reject) {
    debug('themekit cwd to: ' + config.dist.root);

    themekit.command({
      args: [cmd, '--env', env].concat(files),
      cwd: config.dist.root
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }).then(function () {
    activeDeploy = false;
    fs.appendFileSync(config.deployLog, messages.logDeploys(cmd, files)); // eslint-disable-line no-sync
    return checkDeployStatus();
  }).catch(function (err) {
    activeDeploy = false;
    messages.logTransferFailed(err);
    fs.appendFileSync(config.deployLog, messages.logDeployErrors(cmd, files, err)); // eslint-disable-line no-sync
    return checkDeployStatus();
  });
}

/**
 * Aggregate task watching for file changes in `src` and
 * building/cleaning/updating `dist` accordingly.  *Made up of individual tasks
 * referenced in other files
 *
 * @function watch:src
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:src', ['watch:assets', 'watch:config', 'watch:svg', 'watch:css', 'watch:js', 'watch:vendor-js']);

/**
 * Watches for changes in the `./dist` folder and passes event data to the
 * `cache` via {@link pushToCache}. A debounced {@link deployStatus} is also
 * called to pass files updated to the remote server through {@link deploy}
 * when any active deploy completes.
 *
 * @function watch:dist
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:dist', function () {
  var watcher = chokidar.watch(['./', '!config.yml'], {
    cwd: config.dist.root,
    ignored: /(^|[/\\])\../,
    ignoreInitial: true
  });

  watcher.on('all', function (event, path) {
    messages.logFileEvent(event, path);
    cache.addEvent(event, path);
    messages.deployTo(environment);
    debouncedDeployStatus();
  });
});