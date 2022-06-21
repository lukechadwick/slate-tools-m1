'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gutil = require('gulp-util');
var _ = require('lodash');

var messages = require('./messages.js');

/** Class representing a custom reporter for @shopify/theme-lint */

var Reporter = function () {
  function Reporter() {
    _classCallCheck(this, Reporter);

    this.successes = [];
    this.failures = [];
  }

  /**
   * Pushes a valid message onto successes.
   *
   * @param {String} message
   * @param {String} file
   */


  _createClass(Reporter, [{
    key: 'success',
    value: function success(message) {
      var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.successes.push([message, file, index]);
    }

    /**
     * Pushes an invalid message onto failures.
     *
     * @param {String} message
     * @param {String} file
     */

  }, {
    key: 'failure',
    value: function failure(message) {
      var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.failures.push([message, file, index]);
    }

    /**
     * Builds string output for translation tests
     * depending on successes and failures.
     */

  }, {
    key: 'output',
    value: function output() {
      var testsRun = this.failures.length + this.successes.length;

      if (this.failures.length === 0) {
        gutil.log('Translation tests complete:', gutil.colors.green('Success (' + testsRun + ' checks run)'));
      } else {
        gutil.log('Translation tests complete:', gutil.colors.red('Failed (' + testsRun + ' checks run)'));

        var failureGroups = _.groupBy(this.failures, function (failure) {
          return failure[1];
        });

        _.forOwn(failureGroups, function (failures, file) {
          gutil.log(gutil.colors.red(file + ':'));

          failures.map(function (failure) {
            return gutil.log(failure[0]);
          });
        });

        throw new Error(messages.translationsFailed());
      }

      this.successes = this.failures = [];
    }
  }]);

  return Reporter;
}();

exports.default = Reporter;