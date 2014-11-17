(function() {
  var JSLintReporter;

  module.exports = JSLintReporter = (function() {
    function JSLintReporter(errorReport, options) {
      this.errorReport = errorReport;
      if (options == null) {
        options = {};
      }
    }

    JSLintReporter.prototype.print = function(message) {
      return console.log(message);
    };

    JSLintReporter.prototype.publish = function() {
      var e, errors, path, _i, _len, _ref, _ref1;
      this.print("<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint>");
      _ref = this.errorReport.paths;
      for (path in _ref) {
        errors = _ref[path];
        if (errors.length) {
          this.print("<file name=\"" + path + "\">");
          for (_i = 0, _len = errors.length; _i < _len; _i++) {
            e = errors[_i];
            this.print("<issue line=\"" + e.lineNumber + "\"\n        lineEnd=\"" + ((_ref1 = e.lineNumberEnd) != null ? _ref1 : e.lineNumber) + "\"\n        reason=\"[" + (this.escape(e.level)) + "] " + (this.escape(e.message)) + "\"\n        evidence=\"" + (this.escape(e.context)) + "\"/>");
          }
          this.print("</file>");
        }
      }
      return this.print("</jslint>");
    };

    JSLintReporter.prototype.escape = function(msg) {
      var r, replacements, _i, _len;
      msg = "" + msg;
      if (!msg) {
        return;
      }
      replacements = [[/&/g, "&amp;"], [/"/g, "&quot;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/'/g, "&apos;"]];
      for (_i = 0, _len = replacements.length; _i < _len; _i++) {
        r = replacements[_i];
        msg = msg.replace(r[0], r[1]);
      }
      return msg;
    };

    return JSLintReporter;

  })();

}).call(this);
