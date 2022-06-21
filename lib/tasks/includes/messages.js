'use strict';

var gutil = require('gulp-util');

/**
 * Separates filename and directory from a path string. Returns an object containing both.
 *
 * @param path {String} - a string representing the path to a file
 * @returns {Object} - an object with separated `file` (the filename) and `dir` (path minus filename) properties
 * @private
 */
function separatePath(path) {
  var tmp = path.split('/');

  return {
    file: tmp.pop(),
    dir: tmp.join('/')
  };
}

var messages = {
  logFileEvent: function logFileEvent(event, path) {
    var pathObject = separatePath(path);

    gutil.log('change in', gutil.colors.magenta(pathObject.dir), gutil.colors.white('-'), gutil.colors.cyan(event), gutil.colors.yellow(pathObject.file));
  },

  logTransferDone: function logTransferDone() {
    gutil.log('Transfer Complete:', gutil.colors.green('File changes successfully synced to store'));
  },

  logTransferFailed: function logTransferFailed(errMsg) {
    gutil.log('Transfer Failed:', gutil.colors.yellow('' + (typeof errMsg === 'string' ? errMsg : 'File(s) failed to upload to store. See log notes above.')));
  },

  logProcessFiles: function logProcessFiles(processName) {
    gutil.log('running task', gutil.colors.white('-'), gutil.colors.cyan(processName));
  },

  logChildProcess: function logChildProcess(cmd) {
    gutil.log('running task', gutil.colors.bold('[child process]'), gutil.colors.white('-'), gutil.colors.cyan('theme', cmd));
  },

  logDeploys: function logDeploys(cmd, files) {
    var timestamp = 'Deploy complete @ ' + new Date() + '. ';
    var action = cmd === 'upload' ? 'added/changed ' : 'removed ';
    var amount = files.length + ' file(s): ';
    var fileList = files.join(', ') + '.\n';

    return timestamp + action + amount + fileList;
  },

  logBundleJs: function logBundleJs() {
    gutil.log('Updating JS Bundle...');
  },

  configChange: function configChange() {
    return 'Changes to ThemeKit Config Detected: You may need to quit <slate watch>' + ' and run a full <slate deploy> as a result.';
  },

  translationsFailed: function translationsFailed() {
    return 'Translation errors detected.';
  },

  invalidThemeId: function invalidThemeId(themeId, env) {
    gutil.log('Invalid theme id for', gutil.colors.cyan(env + ': ' + themeId), gutil.colors.yellow('`theme_id` must be an integer or "live".'));
  },

  configError: function configError() {
    gutil.log('File missing:', gutil.colors.yellow('`config.yml` does not exist. You need to add a config file before you can make changes to your Shopify store.'));
  },

  deployTo: function deployTo(environment) {
    gutil.log('Initiating deploy to', gutil.colors.bold(environment));
  },

  allDeploysComplete: function allDeploysComplete() {
    gutil.log('Multiple environments:', gutil.colors.green('Deploy completed for all environments in series'));
  }

};

module.exports = messages;