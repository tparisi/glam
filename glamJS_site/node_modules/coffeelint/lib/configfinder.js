
/*
Helpers for finding CoffeeLint config in standard locations, similar to how
JSHint does.
 */

(function() {
  var findFile, findFileResults, fs, loadJSON, loadNpmConfig, path;

  fs = require('fs');

  path = require('path');

  findFileResults = {};

  findFile = function(name, dir) {
    var filename, parent;
    dir = dir || process.cwd();
    filename = path.normalize(path.join(dir, name));
    if (findFileResults[filename]) {
      return findFileResults[filename];
    }
    parent = path.resolve(dir, "../");
    if (fs.existsSync(filename)) {
      return findFileResults[filename] = filename;
    } else if (dir === parent) {
      return findFileResults[filename] = null;
    } else {
      return findFile(name, parent);
    }
  };

  loadNpmConfig = function(dir) {
    var fp;
    fp = findFile("package.json", dir);
    if (fp) {
      return loadJSON(fp).coffeelintConfig;
    }
  };

  loadJSON = function(filename) {
    var e;
    try {
      return JSON.parse(fs.readFileSync(filename).toString());
    } catch (_error) {
      e = _error;
      process.stderr.write("Could not load JSON file '" + filename + "': " + e);
      return null;
    }
  };

  exports.getConfig = function(filename) {
    var dir, envs, home, npmConfig, projConfig;
    if (filename == null) {
      filename = null;
    }
    if (filename) {
      dir = path.dirname(path.resolve(filename));
    } else {
      dir = process.cwd();
    }
    npmConfig = loadNpmConfig(dir);
    if (npmConfig) {
      return npmConfig;
    }
    projConfig = findFile("coffeelint.json", dir);
    if (projConfig) {
      return loadJSON(projConfig);
    }
    envs = process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
    home = path.normalize(path.join(envs, "coffeelint.json"));
    if (fs.existsSync(home)) {
      return loadJSON(home);
    }
  };

}).call(this);
