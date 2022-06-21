'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var size = require('gulp-size');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');
var messages = require('./includes/messages.js');

var assetsPaths = [config.src.assets, config.src.templates, config.src.sections, config.src.snippets, config.src.locales, config.src.config, config.src.layout];

/**
 * Copies assets to the `/dist` directory
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processAssets(files) {
  messages.logProcessFiles('build:assets');
  return gulp.src(files, { base: config.src.root }).pipe(plumber(utils.errorHandler)).pipe(size({
    showFiles: true,
    pretty: true
  })).pipe(gulp.dest(config.dist.root));
}

/**
 * Deletes specified files
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function removeAssets(files) {
  messages.logProcessFiles('remove:assets');

  var mapFiles = files.map(function (file) {
    var distFile = file.replace(config.src.root, config.dist.root);
    return distFile;
  });

  return gulp.src(mapFiles).pipe(plumber(utils.errorHandler)).pipe(vinylPaths(del)).pipe(size({
    showFiles: true,
    pretty: true
  }));
}

/**
 * Copies assets to the `/dist` directory
 *
 * @function build:assets
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:assets', function () {
  return processAssets(assetsPaths);
});

/**
 * Watches assets in the `/src` directory
 *
 * @function watch:assets
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:assets', function () {
  var eventCache = utils.createEventCache();

  chokidar.watch(assetsPaths, {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true
  }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    eventCache.addEvent(event, path);
    utils.processCache(eventCache, processAssets, removeAssets);
  });
});