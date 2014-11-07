(function() {
  var CSVReporter;

  module.exports = CSVReporter = (function() {
    function CSVReporter(errorReport, options) {
      this.errorReport = errorReport;
      if (options == null) {
        options = {};
      }
    }

    CSVReporter.prototype.print = function(message) {
      return console.log(message);
    };

    CSVReporter.prototype.publish = function() {
      var e, errors, f, header, path, _ref, _results;
      header = ["path", "lineNumber", "lineNumberEnd", "level", "message"];
      this.print(header.join(","));
      _ref = this.errorReport.paths;
      _results = [];
      for (path in _ref) {
        errors = _ref[path];
        _results.push((function() {
          var _i, _len, _ref1, _results1;
          _results1 = [];
          for (_i = 0, _len = errors.length; _i < _len; _i++) {
            e = errors[_i];
            if (e.context) {
              e.message += " " + e.context + ".";
            }
            f = [path, e.lineNumber, (_ref1 = e.lineNumberEnd) != null ? _ref1 : e.lineNumberEnd, e.level, e.message];
            _results1.push(this.print(f.join(",")));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return CSVReporter;

  })();

}).call(this);
