
/*
CoffeeLint

Copyright (c) 2011 Matthew Perpick.
CoffeeLint is freely distributable under the MIT license.
 */

(function() {
  var Cache, CoffeeScript, coffeelint, config, configfinder, coreReporters, data, deprecatedReporter, errorReport, findCoffeeScripts, fs, getFallbackConfig, glob, ignore, lintFiles, lintSource, optimist, options, os, path, paths, read, reportAndExit, resolve, ruleLoader, scripts, stdin, thisdir;

  resolve = require('resolve').sync;

  path = require("path");

  fs = require("fs");

  os = require("os");

  glob = require("glob");

  optimist = require("optimist");

  ignore = require('ignore');

  thisdir = path.dirname(fs.realpathSync(__filename));

  coffeelint = require(path.join(thisdir, "coffeelint"));

  configfinder = require(path.join(thisdir, "configfinder"));

  ruleLoader = require(path.join(thisdir, 'ruleLoader'));

  Cache = require(path.join(thisdir, "cache"));

  CoffeeScript = require('coffee-script');

  CoffeeScript.register();

  read = function(path) {
    var realPath;
    realPath = fs.realpathSync(path);
    return fs.readFileSync(realPath).toString();
  };

  findCoffeeScripts = function(paths) {
    var files, p, _i, _len;
    files = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      p = paths[_i];
      if (fs.statSync(p).isDirectory()) {
        files = files.concat(glob.sync("" + p + "/**/*.coffee"));
      } else {
        files.push(p);
      }
    }
    return files;
  };

  lintFiles = function(files, config) {
    var errorReport, file, fileConfig, literate, source, _i, _len;
    errorReport = new coffeelint.getErrorReport();
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      source = read(file);
      literate = CoffeeScript.helpers.isLiterate(file);
      fileConfig = config ? config : getFallbackConfig(file);
      errorReport.lint(file, source, fileConfig, literate);
    }
    return errorReport;
  };

  lintSource = function(source, config, literate) {
    var errorReport;
    if (literate == null) {
      literate = false;
    }
    errorReport = new coffeelint.getErrorReport();
    config || (config = getFallbackConfig());
    errorReport.lint("stdin", source, config, literate);
    return errorReport;
  };

  getFallbackConfig = function(filename) {
    if (filename == null) {
      filename = null;
    }
    if (!options.argv.noconfig) {
      return configfinder.getConfig(filename);
    }
  };

  deprecatedReporter = function(errorReport, reporter) {
    var _base;
    if ((_base = errorReport.paths)['coffeelint_fake_file.coffee'] == null) {
      _base['coffeelint_fake_file.coffee'] = [];
    }
    errorReport.paths['coffeelint_fake_file.coffee'].push({
      "level": "warn",
      "rule": "commandline",
      "message": "parameter --" + reporter + " is deprecated. Use --reporter " + reporter + " instead",
      "lineNumber": 0
    });
    return reporter;
  };

  coreReporters = {
    "default": require(path.join(thisdir, 'reporters', 'default')),
    csv: require(path.join(thisdir, 'reporters', 'csv')),
    jslint: require(path.join(thisdir, 'reporters', 'jslint')),
    checkstyle: require(path.join(thisdir, 'reporters', 'checkstyle')),
    raw: require(path.join(thisdir, 'reporters', 'raw'))
  };

  reportAndExit = function(errorReport, options) {
    var SelectedReporter, colorize, reporter, strReporter, _base, _ref;
    strReporter = options.argv.jslint ? deprecatedReporter(errorReport, 'jslint') : options.argv.csv ? deprecatedReporter(errorReport, 'csv') : options.argv.checkstyle ? deprecatedReporter(errorReport, 'checkstyle') : options.argv.reporter;
    if (strReporter == null) {
      strReporter = 'default';
    }
    SelectedReporter = (_ref = coreReporters[strReporter]) != null ? _ref : (function() {
      var reporterPath;
      try {
        reporterPath = resolve(strReporter, {
          basedir: process.cwd()
        });
      } catch (_error) {
        reporterPath = strReporter;
      }
      return require(reporterPath);
    })();
    if ((_base = options.argv).color == null) {
      _base.color = options.argv.nocolor ? "never" : "auto";
    }
    colorize = (function() {
      switch (options.argv.color) {
        case "always":
          return true;
        case "never":
          return false;
        default:
          return process.stdout.isTTY;
      }
    })();
    reporter = new SelectedReporter(errorReport, {
      colorize: colorize,
      quiet: options.argv.q
    });
    reporter.publish();
    return process.on('exit', function() {
      return process.exit(errorReport.getExitCode());
    });
  };

  options = optimist.usage("Usage: coffeelint [options] source [...]").alias("f", "file").alias("h", "help").alias("v", "version").alias("s", "stdin").alias("q", "quiet").alias("c", "cache").describe("f", "Specify a custom configuration file.").describe("rules", "Specify a custom rule or directory of rules.").describe("makeconfig", "Prints a default config file").describe("noconfig", "Ignores the environment variable COFFEELINT_CONFIG.").describe("h", "Print help information.").describe("v", "Print current version number.").describe("r", "(not used, but left for backward compatibility)").describe('reporter', 'built in reporter (default, csv, jslint, checkstyle, raw), or module, or path to reporter file.').describe("csv", "[deprecated] use --reporter csv").describe("jslint", "[deprecated] use --reporter jslint").describe("nocolor", "[deprecated] use --color=never").describe("checkstyle", "[deprecated] use --reporter checkstyle").describe("color=<when>", "When to colorize the output. <when> can be one of always, never, or auto.").describe("s", "Lint the source from stdin").describe("q", "Only print errors.").describe("literate", "Used with --stdin to process as Literate CoffeeScript").describe("c", "Cache linting results").boolean("csv").boolean("jslint").boolean("checkstyle").boolean("nocolor").boolean("noconfig").boolean("makeconfig").boolean("literate").boolean("r").boolean("s").boolean("q", "Print errors only.").boolean("c");

  if (options.argv.v) {
    console.log(coffeelint.VERSION);
    process.exit(0);
  } else if (options.argv.h) {
    options.showHelp();
    process.exit(0);
  } else if (options.argv.makeconfig) {
    console.log(JSON.stringify(coffeelint.getRules(), (function(k, v) {
      if (k !== 'message' && k !== 'description' && k !== 'name') {
        return v;
      }
    }), 4));
  } else if (options.argv._.length < 1 && !options.argv.s) {
    options.showHelp();
    process.exit(1);
  } else {
    if (options.argv.cache) {
      coffeelint.setCache(new Cache(path.join(os.tmpdir(), 'coffeelint')));
    }
    config = null;
    if (!options.argv.noconfig) {
      if (options.argv.f) {
        config = JSON.parse(read(options.argv.f));
        if (config.coffeelintConfig) {
          config = config.coffeelintConfig;
        }
      } else if (process.env.COFFEELINT_CONFIG && fs.existsSync(process.env.COFFEELINT_CONFIG)) {
        config = JSON.parse(read(process.env.COFFEELINT_CONFIG));
      }
    }
    if (options.argv.rules) {
      ruleLoader.loadRule(coffeelint, options.argv.rules);
    }
    if (options.argv.s) {
      data = '';
      stdin = process.openStdin();
      stdin.on('data', function(buffer) {
        if (buffer) {
          return data += buffer.toString();
        }
      });
      stdin.on('end', function() {
        var errorReport;
        errorReport = lintSource(data, config, options.argv.literate);
        return reportAndExit(errorReport, options);
      });
    } else {
      paths = options.argv._;
      scripts = findCoffeeScripts(paths);
      scripts = ignore().addIgnoreFile('.coffeelintignore').filter(scripts);
      errorReport = lintFiles(scripts, config, options.argv.literate);
      reportAndExit(errorReport, options);
    }
  }

}).call(this);
