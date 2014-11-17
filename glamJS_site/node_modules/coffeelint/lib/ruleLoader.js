(function() {
  var path, resolve;

  path = require('path');

  resolve = require('resolve').sync;

  module.exports = {
    loadFromConfig: function(coffeelint, config) {
      var data, ruleName, _results;
      _results = [];
      for (ruleName in config) {
        data = config[ruleName];
        if ((data != null ? data.module : void 0) != null) {
          _results.push(this.loadRule(coffeelint, data.module, ruleName));
        }
      }
      return _results;
    },
    loadRule: function(coffeelint, moduleName, ruleName) {
      var e, rule, ruleModule, rulePath, _i, _len, _results;
      if (ruleName == null) {
        ruleName = void 0;
      }
      try {
        try {
          rulePath = resolve(moduleName, {
            basedir: process.cwd()
          });
          ruleModule = require(rulePath);
        } catch (_error) {}
        try {
          if (ruleModule == null) {
            ruleModule = require(moduleName);
          }
        } catch (_error) {}
        if (ruleModule == null) {
          ruleModule = require(path.resolve(process.cwd(), moduleName));
        }
        if (typeof ruleModule === 'function') {
          return coffeelint.registerRule(ruleModule, ruleName);
        } else {
          _results = [];
          for (_i = 0, _len = ruleModule.length; _i < _len; _i++) {
            rule = ruleModule[_i];
            _results.push(coffeelint.registerRule(rule));
          }
          return _results;
        }
      } catch (_error) {
        e = _error;
        console.error("Error loading " + moduleName);
        throw e;
      }
    }
  };

}).call(this);
