(function() {
  var CheckstyleReporter, JsLintReporter;

  JsLintReporter = require('./jslint');

  module.exports = CheckstyleReporter = (function() {
    function CheckstyleReporter(errorReport, options) {
      this.errorReport = errorReport;
      if (options == null) {
        options = {};
      }
    }

    CheckstyleReporter.prototype.print = function(message) {
      return console.log(message);
    };

    CheckstyleReporter.prototype.escape = JsLintReporter.prototype.escape;

    CheckstyleReporter.prototype.publish = function() {
      var context, e, errors, level, path, _i, _len, _ref, _ref1;
      this.print("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
      this.print("<checkstyle version=\"4.3\">");
      _ref = this.errorReport.paths;
      for (path in _ref) {
        errors = _ref[path];
        if (errors.length) {
          this.print("<file name=\"" + path + "\">");
          for (_i = 0, _len = errors.length; _i < _len; _i++) {
            e = errors[_i];
            level = e.level;
            if (level === 'warn') {
              level = 'warning';
            }
            context = (_ref1 = e.context) != null ? _ref1 : "";
            this.print("<error line=\"" + e.lineNumber + "\"\n    severity=\"" + (this.escape(level)) + "\"\n    message=\"" + (this.escape(e.message + '; context: ' + context)) + "\"\n    source=\"coffeelint\"/>");
          }
          this.print("</file>");
        }
      }
      return this.print("</checkstyle>");
    };

    return CheckstyleReporter;

  })();

}).call(this);
