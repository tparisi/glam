(function() {
  var RawReporter;

  module.exports = RawReporter = (function() {
    function RawReporter(errorReport, options) {
      this.errorReport = errorReport;
      if (options == null) {
        options = {};
      }
    }

    RawReporter.prototype.print = function(message) {
      return console.log(message);
    };

    RawReporter.prototype.publish = function() {
      return this.print(JSON.stringify(this.errorReport.paths, void 0, 2));
    };

    return RawReporter;

  })();

}).call(this);
