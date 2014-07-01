// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will write out Closure's deps file, unless the
 * global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
 * include their own deps file(s) from different locations.
 *
 */


/**
 * @define {boolean} Overridden to true by the compiler when --closure_pass
 *     or --mark_as_compiled is specified.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is
 * already defined in the current scope before assigning to prevent
 * clobbering if base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {}; // Identifies this file as the Closure base.


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
 * toString() methods should be declared inside an "if (goog.DEBUG)" conditional
 * because they are generally used for debugging purposes and it is difficult
 * for the JSCompiler to statically determine whether they are used.
 */
goog.DEBUG = true;


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
 */
goog.LOCALE = 'en';  // default to en


/**
 * Creates object stubs for a namespace.  The presence of one or more
 * goog.provide() calls indicate that the file defines the given
 * objects/namespaces.  Build tools also scan for provide/require statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 * @see goog.require
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice. This is intended
    // to teach new developers that 'goog.provide' is effectively a variable
    // declaration. And when JSCompiler transforms goog.provide into a real
    // variable declaration, the compiled JS should work the same as the raw
    // JS--even when the raw JS uses goog.provide incorrectly.
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name);
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                opt_message ? ': ' + opt_message : '.');
  }
};


if (!COMPILED) {

  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return !goog.implicitNamespaces_[name] && !!goog.getObjectByName(name);
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares
   * that 'goog' and 'goog.events' must be namespaces.
   *
   * @type {Object}
   * @private
   */
  goog.implicitNamespaces_ = {};
}


/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Returns an object based on its fully qualified external name.  If you are
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {Array} provides An array of strings with the names of the objects
 *                         this file provides.
 * @param {Array} requires An array of strings with the names of the objects
 *                         this file requires.
 */
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {};
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(user): The debug DOM loader was included in base.js as an orignal
// way to do "debug-mode" development.  The dependency system can sometimes
// be confusing, as can the debug DOM loader's asyncronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the
// script will not load until some point after the current script.  If a
// namespace is needed at runtime, it needs to be defined in a previous
// script, or loaded via require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// http://code.google.com/closure/library/docs/depswriter.html
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.ENABLE_DEBUG_LOADER = true;


/**
 * Implements a system for the dynamic resolution of dependencies
 * that works in parallel with the BUILD system. Note that all calls
 * to goog.require will be stripped by the JSCompiler when the
 * --closure_pass option is used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide())
 *     in the form "goog.package.part".
 */
goog.require = function(name) {

  // if the object already exists we do not need do do anything
  // TODO(user): If we start to support require based on file name this has
  //            to change
  // TODO(user): If we allow goog.foo.* this has to change
  // TODO(user): If we implement dynamic load after page load we should probably
  //            not remove this code for the compiled output
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    if (goog.global.console) {
      goog.global.console['error'](errorMessage);
    }


      throw Error(errorMessage);

  }
};


/**
 * Path for included scripts
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default,
 * the deps are written.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * The identity function. Returns its first argument.
 *
 * @param {...*} var_args The arguments of the function.
 * @return {*} The first argument.
 * @deprecated Use goog.functions.identity instead.
 */
goog.identityFunction = function(var_args) {
  return arguments[0];
};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 *
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error
 * will be thrown when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as
 * an argument because that would make it more difficult to obfuscate
 * our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be
 *   overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always return the same instance
 * object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor());
  };
};


if (!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  /**
   * Object used to keep track of urls that have already been added. This
   * record allows the prevention of circular dependencies.
   * @type {Object}
   * @private
   */
  goog.included_ = {};


  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts
   * @private
   * @type {Object}
   */
  goog.dependencies_ = {
    pathToNames: {}, // 1 to many
    nameToPath: {}, // 1 to 1
    requires: {}, // 1 to many
    // used when resolving dependencies to prevent us from
    // visiting the file twice
    visited: {},
    written: {} // used to keep track of script files we have written
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != 'undefined' &&
           'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of the base.js script that bootstraps Closure
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('script');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @private
   */
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script source.
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write(
          '<script type="text/javascript" src="' + src + '"></' + 'script>');
      return true;
    } else {
      return false;
    }
  };


  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @private
   */
  goog.writeScripts_ = function() {
    // the scripts we need to write this time
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // we have already visited this one. We can get here if we have cyclic
      // dependencies
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error('Undefined script input');
      }
    }
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}



//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {*} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }


    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox
    // typeof behaves similarly for HTML{Applet,Embed,Object}Elements
    // and RegExps.  We would like to return object for those and we can
    // detect an invalid function by making sure that the function
    // object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Safe way to test whether a property is enumarable.  It allows testing
 * for enumerable on objects where 'propertyIsEnumerable' is overridden or
 * does not exist (like DOM nodes in IE). Does not use browser native
 * Object.propertyIsEnumerable.
 * @param {Object} object The object to test if the property is enumerable.
 * @param {string} propName The property name to check for.
 * @return {boolean} True if the property is enumarable.
 * @private
 */
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  // KJS in Safari 2 is not ECMAScript compatible and lacks crucial methods
  // such as propertyIsEnumerable.  We therefore use a workaround.
  // Does anyone know a more efficient work around?
  if (propName in object) {
    for (var key in object) {
      if (key == propName &&
          Object.prototype.hasOwnProperty.call(object, propName)) {
        return true;
      }
    }
  }
  return false;
};


/**
 * Safe way to test whether a property is enumarable.  It allows testing
 * for enumerable on objects where 'propertyIsEnumerable' is overridden or
 * does not exist (like DOM nodes in IE).
 * @param {Object} object The object to test if the property is enumerable.
 * @param {string} propName The property name to check for.
 * @return {boolean} True if the property is enumarable.
 * @private
 */
goog.propertyIsEnumerable_ = function(object, propName) {
  // In IE if object is from another window, cannot use propertyIsEnumerable
  // from this window's Object. Will raise a 'JScript object expected' error.
  if (object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName);
  } else {
    return goog.propertyIsEnumerableCustom_(object, propName);
  }
};


/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  return val !== undefined;
};


/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == 'object' || type == 'array' || type == 'function';
};


/**
 * Gets a unique ID for an object. This mutates the object so that further
 * calls with the same object as a parameter returns the same value. The unique
 * ID is guaranteed to be unique across the current session amongst objects that
 * are passed into {@code getUid}. There is no guarantee that the ID is unique
 * or consistent across sessions. It is unsafe to generate unique ID for
 * function prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(user): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(user): Make the type stricter, do not accept null.

  // DOM nodes in IE are not instance of Object and throws exception
  // for delete. Instead we try to use removeAttribute
  if ('removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  /** @preserveTry */
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure javascript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' +
    Math.floor(Math.random() * 2147483648).toString(36);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * Forward declaration for the clone method. This is necessary until the
 * compiler can better support duck-typing constructs as used in
 * goog.cloneObject.
 *
 * TODO(user): Remove once the JSCompiler can infer that the check for
 * proto.clone is safe in goog.cloneObject.
 *
 * @type {Function}
 */
Object.prototype.clone;


/**
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind
 *     is deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| 'pre-specified'.<br><br>
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.<br><br>
 *
 * Also see: {@link #partial}.<br><br>
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default
      // Chrome extension environment. This means that for Chrome extensions,
      // they get the implementation of Function.prototype.bind that
      // calls goog.bind instead of the native one. Even worse, we don't want
      // to introduce a circular dependency between goog.bind and
      // Function.prototype.bind, so we have to hack this to make sure it
      // works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like bind(), except that a 'this object' is not required. Useful when the
 * target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to fn.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Prepend the bound arguments to the current arguments.
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = Date.now || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


/**
 * Evals javascript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _et_ = 1;');
      if (typeof goog.global['_et_'] != 'undefined') {
        delete goog.global['_et_'];
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      var doc = goog.global.document;
      var scriptElt = doc.createElement('script');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @type {Object|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a
 * hyphen and passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which
 * these mappings are used. In the BY_PART style, each part (i.e. in
 * between hyphens) of the passed in css name is rewritten according
 * to the map. In the BY_WHOLE style, the full css name is looked up in
 * the map directly. If a rewrite is not specified by the map, the
 * compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls
 * to goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x= 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed
 * only the modifier will be processed, as it is assumed the first
 * argument was generated as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --closure_pass flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};


/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to goog.setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to goog.getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to goog.getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {Object|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


/**
 * Abstract implementation of goog.getMsg for use with localized messages.
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object=} opt_values Map of place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated,
 * unless they are exported in turn via this function or
 * goog.exportProperty
 *
 * <p>Also handy for making public items that are defined in anonymous
 * closures.
 *
 * ex. goog.exportSymbol('Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction',
 *                       Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   goog.base(this, a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * contructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass
 * the name of the method as the second argument to this function. If
 * you do not, you will get a runtime error. This calls the superclass'
 * method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express
 * inheritance relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the
 * compiler will do macro expansion to remove a lot of
 * the extra overhead that this function introduces. The compiler
 * will also enforce a lot of the assumptions that this function
 * makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }

  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the
 * aliases applied.  In uncompiled code the function is simply run since the
 * aliases as written are valid JavaScript.
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *    (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  fn.call(goog.global);
};


/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.Time');

Vizi.Time = function()
{
	// Freak out if somebody tries to make 2
    if (Vizi.Time.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
}


Vizi.Time.prototype.initialize = function(param)
{
	this.currentTime = Date.now();

	Vizi.Time.instance = this;
}

Vizi.Time.prototype.update = function()
{
	this.currentTime = Date.now();
}

Vizi.Time.instance = null;
	        
/**
 * @author Tony Parisi
 */
goog.provide('Vizi.Service');

/**
 * Interface for a Service.
 *
 * Allows multiple different backends for the same type of service.
 * @interface
 */
Vizi.Service = function() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the Service - Abstract.
 */
Vizi.Service.prototype.initialize = function(param) {};

/**
 * Terminates the Service - Abstract.
 */
Vizi.Service.prototype.terminate = function() {};


/**
 * Updates the Service - Abstract.
 */
Vizi.Service.prototype.update = function() {};/**
 *
 */
goog.require('Vizi.Service');
goog.provide('Vizi.EventService');

/**
 * The EventService.
 *
 * @extends {Vizi.Service}
 */
Vizi.EventService = function() {};

goog.inherits(Vizi.EventService, Vizi.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
Vizi.EventService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
Vizi.EventService.prototype.terminate = function() {};


/**
 * Updates the EventService.
 */
Vizi.EventService.prototype.update = function()
{
	do
	{
		Vizi.EventService.eventsPending = false;
		Vizi.Application.instance.updateObjects();
	}
	while (Vizi.EventService.eventsPending);
}/**
 * @fileoverview EventDispatcher is the base class for any object that sends/receives messages
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.EventDispatcher');
goog.require('Vizi.EventService');
goog.require('Vizi.Time');

/**
 * @constructor
 */
Vizi.EventDispatcher = function() {
    this.eventTypes = {};
    this.timestamps = {};
    this.connections = {};
}

Vizi.EventDispatcher.prototype.addEventListener = function(type, listener) {
    var listeners = this.eventTypes[type];
    if (listeners)
    {
        if (listeners.indexOf(listener) != -1)
        {
            return;
        }
    }
    else
    {
    	listeners = [];
        this.eventTypes[type] = listeners;
        this.timestamps[type] = 0;
    }

    listeners.push(listener);
}

Vizi.EventDispatcher.prototype.removeEventListener =  function(type, listener) {
    if (listener)
    {
        var listeners = this.eventTypes[type];

        if (listeners)
        {
            var i = listeners.indexOf(listener);
            if (i != -1)
            {
            	listeners.splice(i, 1);
            }
        }
    }
    else
    {
        delete this.eventTypes[type];
        delete this.timestamps[type];
    }
}

Vizi.EventDispatcher.prototype.dispatchEvent = function(type) {
    var listeners = this.eventTypes[type];

    if (listeners)
    {
    	var now = Vizi.Time.instance.currentTime;
    	
    	if (this.timestamps[type] < now)
    	{
    		this.timestamps[type] = now;
	    	Vizi.EventService.eventsPending = true;
	    	
    		[].shift.call(arguments);
	    	for (var i = 0; i < listeners.length; i++)
	        {
                listeners[i].apply(this, arguments);
	        }
    	}
    }
}

Vizi.EventDispatcher.prototype.hasEventListener = function (subscribers, subscriber) {
    var listeners = this.eventTypes[type];
    if (listeners)
        return (listeners.indexOf(listener) != -1)
    else
    	return false;
}

Vizi.EventDispatcher.prototype.connect = function(type, target, targetProp) {
    var connections = this.connections[type];
    if (connections)
    {
    	/*
        if (connections.indexOf(target) != -1)
        {
            return;
        }
        */
    }
    else
    {
    	connections = [];
        this.connections[type] = connections;
    }

    var that = this;
    var listener = (function() { return function() { that.handleConnection(null, target, targetProp, arguments); } }) ();
    var connection = { listener : listener, sourceProp : null, target : target, 
    		targetProp : targetProp };
    connections.push(connection);
    var connection = this.addEventListener(type, listener);
}

Vizi.EventDispatcher.prototype.handleConnection = function(sourceProp, target, targetProp, args) {
	var targetValue = target[targetProp];
	
	if (typeof targetValue == "function") {
		targetValue.apply(target, args);
	}
	else if (typeof targetValue == "object") {
		if (targetValue.copy && typeof targetValue.copy == "function") {
			targetValue.copy(sourceProp ? args[0][sourceProp] : args[0]);
			}
	}
	else {
		target[targetProp] = sourceProp ? args[0][sourceProp] : args[0];
	}
}

    /**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.Object');
goog.require('Vizi.EventDispatcher');

/**
 * Creates a new Object.
 * @constructor
 * @extends {Vizi.EventDispatcher}
 */
Vizi.Object = function(param) {
    Vizi.EventDispatcher.call(this);
    
    /**
     * @type {number}
     * @private
     */
    this._id = Vizi.Object.nextId++;

    /**
     * @type {Vizi.Object}
     * @private
     */
    this._parent = null;

    /**
     * @type {Array.<Vizi.Object>}
     * @private
     */
    this._children = [];

    /**
     * @type {Array}
     * @private
     */
    this._components = [];

    /**
     * @type {String}
     * @public
     */
    this.name = "";
 
    
    /**
     * @type {Boolean}
     * @private
     */
    this._realized = false;
    
    // Automatically create a transform component unless the caller says not to 
    var autoCreateTransform = true;
    if (param && param.autoCreateTransform !== undefined)
    	autoCreateTransform = param.autoCreateTransform;
    
	if (autoCreateTransform)
	{
		this.addComponent(new Vizi.Transform(param));
	}
}

goog.inherits(Vizi.Object, Vizi.EventDispatcher);

/**
 * The next identifier to hand out.
 * @type {number}
 * @private
 */
Vizi.Object.nextId = 0;

Vizi.Object.prototype.getID = function() {
    return this._id;
}

//---------------------------------------------------------------------
// Hierarchy methods
//---------------------------------------------------------------------

/**
 * Sets the parent of the Object.
 * @param {Vizi.Object} parent The parent of the Object.
 * @private
 */
Vizi.Object.prototype.setParent = function(parent) {
    this._parent = parent;
}

/**
 * Adds a child to the Object.
 * @param {Vizi.Object} child The child to add.
 */
Vizi.Object.prototype.addChild = function(child) {
    if (!child)
    {
        throw new Error('Cannot add a null child');
    }

    if (child._parent)
    {
        throw new Error('Child is already attached to an Object');
    }

    child.setParent(this);
    this._children.push(child);

    if (this._realized && !child._realized)
    {
    	child.realize();
    }

}

/**
 * Removes a child from the Object
 * @param {Vizi.Object} child The child to remove.
 */
Vizi.Object.prototype.removeChild = function(child) {
    var i = this._children.indexOf(child);

    if (i != -1)
    {
        this._children.splice(i, 1);
        child.removeAllComponents();
        child.setParent(null);
    }
}

/**
 * Removes a child from the Object
 * @param {Vizi.Object} child The child to remove.
 */
Vizi.Object.prototype.getChild = function(index) {
	if (index >= this._children.length)
		return null;
	
	return this._children[index];
}

//---------------------------------------------------------------------
// Component methods
//---------------------------------------------------------------------

/**
 * Adds a Component to the Object.
 * @param {Vizi.Component} component.
 */
Vizi.Object.prototype.addComponent = function(component) {
    if (!component)
    {
        throw new Error('Cannot add a null component');
    }
    
    if (component._object)
    {
        throw new Error('Component is already attached to an Object')
    }

    var proto = Object.getPrototypeOf(component);
    if (proto._componentProperty)
    {
    	if (this[proto._componentProperty])
    	{
    		var t = proto._componentPropertyType;
            Vizi.System.warn('Object already has a ' + t + ' component');
            return;
    	}
    	
    	this[proto._componentProperty] = component;
    }

    if (proto._componentCategory)
    {
    	if (!this[proto._componentCategory])
    		this[proto._componentCategory] = [];
    	
    	this[proto._componentCategory].push(component);
    }
    
    this._components.push(component);
    component.setObject(this);
    
    if (this._realized && !component._realized)
    {
    	component.realize();
    }
}

/**
 * Removes a Component from the Object.
 * @param {Vizi.Component} component.
 */
Vizi.Object.prototype.removeComponent = function(component) {
	if (!component)
		return;
	
    var i = this._components.indexOf(component);

    if (i != -1)
    {
    	if (component.removeFromScene)
    	{
    		component.removeFromScene();
    	}
    	
        this._components.splice(i, 1);
        component.setObject(null);
    }
    
    var proto = Object.getPrototypeOf(component);
    if (proto._componentProperty)
    {
    	this[proto._componentProperty] = null;
    }

    if (proto._componentCategory)
    {
    	if (this[proto._componentCategory]) {
    		var cat = this[proto._componentCategory];
    		i = cat.indexOf(component);
    		if (i != -1)
    			cat.splice(i, 1);
    	}
    }

}

/**
 * Removes all Components from the Object in one call
 * @param {Vizi.Component} component.
 */
Vizi.Object.prototype.removeAllComponents = function() {
    var i, len = this._components.length;

    for (i = 0; i < len; i++)
    {
    	var component = this._components[i];
    	if (component.removeFromScene)
    	{
    		component.removeFromScene();
    	}
    	
        component.setObject(null);
    }
}

/**
 * Retrieves a Component of a given type in the Object.
 * @param {Object} type.
 */
Vizi.Object.prototype.getComponent = function(type) {
	var i, len = this._components.length;
	
	for (i = 0; i < len; i++)
	{
		var component = this._components[i];
		if (component instanceof type)
		{
			return component;
		}
	}
	
	return null;
}

/**
 * Retrieves a Component of a given type in the Object.
 * @param {Object} type.
 */
Vizi.Object.prototype.getComponents = function(type) {
	var i, len = this._components.length;
	
	var components = [];
	
	for (i = 0; i < len; i++)
	{
		var component = this._components[i];
		if (component instanceof type)
		{
			components.push(component);
		}
	}
	
	return components;
}

//---------------------------------------------------------------------
//Initialize methods
//---------------------------------------------------------------------

Vizi.Object.prototype.realize = function() {
    this.realizeComponents();
    this.realizeChildren();
        
    this._realized = true;
}

/**
 * @private
 */
Vizi.Object.prototype.realizeComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._components[i].realize();
    }
}

/**
 * @private
 */
Vizi.Object.prototype.realizeChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._children[i].realize();
    }
}

//---------------------------------------------------------------------
// Update methods
//---------------------------------------------------------------------

Vizi.Object.prototype.update = function() {
    this.updateComponents();
    this.updateChildren();
}

/**
 * @private
 */
Vizi.Object.prototype.updateComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._components[i].update();
    }
}

/**
 * @private
 */
Vizi.Object.prototype.updateChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._children[i].update();
    }
}

//---------------------------------------------------------------------
// Traversal and query methods
//---------------------------------------------------------------------

Vizi.Object.prototype.traverse = function (callback) {

	callback(this);

    var i, count = this._children.length;
	for (i = 0; i < count ; i ++ ) {

		this._children[ i ].traverse( callback );
	}
}

Vizi.Object.prototype.findCallback = function(n, query, found) {
	if (typeof(query) == "string")
	{
		if (n.name == query)
			found.push(n);
	}
	else if (query instanceof RegExp)
	{
		var match  = n.name.match(query);
		if (match && match.length)
			found.push(n);
	}
	else if (query instanceof Function) {
		if (n instanceof query)
			found.push(n);
		else {
			var components = n.getComponents(query);
			var i, len = components.length;
			for (i = 0; i < len; i++)
				found.push(components[i]);
		}
	}
}

Vizi.Object.prototype.findNode = function(str) {
	var that = this;
	var found = [];
	this.traverse(function (o) { that.findCallback(o, str, found); });
	
	return found[0];
}

Vizi.Object.prototype.findNodes = function(query) {
	var that = this;
	var found = [];
	this.traverse(function (o) { that.findCallback(o, query, found); });
	
	return found;
}

Vizi.Object.prototype.map = function(query, callback){
	var found = this.findNodes(query);
	var i, len = found.length;
	
	for (i = 0; i < len; i++) {
		callback(found[i]);
	}
}
/**
 * @fileoverview Component is the base class for defining capabilities used within an Object
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.Component');
goog.require('Vizi.EventDispatcher');

/**
 * Creates a new Component.
 * @constructor
 */
Vizi.Component = function(param) {
    Vizi.EventDispatcher.call(this);
	
	param = param || {};

    /**
     * @type {Vizi.Object}
     * @private
     */
    this._object = null;
    
    /**
     * @type {Boolean}
     * @private
     */
    this._realized = false;
}

goog.inherits(Vizi.Component, Vizi.EventDispatcher);

/**
 * Gets the Object the Component is associated with.
 * @returns {Vizi.Object} The Object the Component is associated with.
 */
Vizi.Component.prototype.getObject = function() {
    return this._object;
}

/**
 * Sets the Object the Component is associated with.
 * @param {Vizi.Object} object
 */
Vizi.Component.prototype.setObject = function(object) {
    this._object = object;
}

Vizi.Component.prototype.realize = function() {
    this._realized = true;
}

Vizi.Component.prototype.update = function() {
}
/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('Vizi.SceneComponent');
goog.require('Vizi.Component');

/**
 * @constructor
 */
Vizi.SceneComponent = function(param)
{	
	param = param || {};

	Vizi.Component.call(this, param);
    
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        position: {
	        get: function() {
	            return this.object.position;
	        }
    	},
        rotation: {
	        get: function() {
	            return this.object.rotation;
	        }
    	},
        scale: {
	        get: function() {
	            return this.object.scale;
	        }
    	},
        quaternion: {
	        get: function() {
	            return this.object.quaternion;
	        }
    	},    	
        up: {
	        get: function() {
	            return this.object.up;
	        },
	        set: function(v) {
	            this.object.up = v;
	        }
    	},    	
        useQuaternion: {
	        get: function() {
	            return this.object.useQuaternion;
	        },
	        set: function(v) {
	            this.object.useQuaternion = v;
	        }
    	},    	
        visible: {
	        get: function() {
	            return this.object.visible;
	        },
	        set: function(v) {
	            this.object.visible = v;
	        }
    	},    	
    	lookAt : {
    		value : function(v) {
    			this.object.lookAt(v);
    		}
    	},
    	translateOnAxis : {
    		value : function(a, d) {
    			this.object.translateOnAxis(a, d);
    		}
    	},
    	translateX : {
    		value : function(d) {
    			this.object.translateX(d);
    		}
    	},
    	translateY : {
    		value : function(d) {
    			this.object.translateY(d);
    		}
    	},
    	translateZ: {
    		value : function(d) {
    			this.object.translateZ(d);
    		}
    	},
    });
    
    this.layer = param.layer;
} ;

goog.inherits(Vizi.SceneComponent, Vizi.Component);

Vizi.SceneComponent.prototype.realize = function()
{
	if (this.object && !this.object.data)
	{
		this.addToScene();
	}
	
	Vizi.Component.prototype.realize.call(this);
}

Vizi.SceneComponent.prototype.update = function()
{	
	Vizi.Component.prototype.update.call(this);
}

Vizi.SceneComponent.prototype.addToScene = function() {
	var scene = this.layer ? this.layer.scene : Vizi.Graphics.instance.scene;
	if (this._object) {
		
		// only add me if the object's transform component actually points
		// to a different Three.js object than mine
		if (this._object.transform.object != this.object) {

			var parent = this._object.transform ? this._object.transform.object : scene;
			
			if (parent) {
				
			    if (parent != this.object.parent)
			    	 parent.add(this.object);
			    
			    this.object.data = this; // backpointer for picking and such
			}
			else {
				// N.B.: throw something?
			}
		}
	}
	else {
		// N.B.: throw something?
	}
}

Vizi.SceneComponent.prototype.removeFromScene = function() {
	var scene = this.layer ? this.layer.scene : Vizi.Graphics.instance.scene;
	if (this._object)
	{
		var parent = this._object.transform ? this._object.transform.object : scene;
		if (parent)
		{
			this.object.data = null;
		    parent.remove(this.object);
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
	
	this._realized = false;
}
goog.provide('Vizi.Camera');
goog.require('Vizi.SceneComponent');

Vizi.Camera = function(param)
{
	param = param || {};
	
	Vizi.SceneComponent.call(this, param);

    // Accessors
    Object.defineProperties(this, {
        active: {
	        get: function() {
	            return this._active;
	        },
	        set: function(v) {
	        	this._active = v;
	        	// N.B.: trying this out for now... TP
	        	if (/*this._realized && */ this._active)
	        	{
	        		Vizi.CameraManager.setActiveCamera(this);
	        	}
	        }
    	},    	

    });
	
	this._active = param.active || false;
	var position = param.position || Vizi.Camera.DEFAULT_POSITION;
    //this.position.copy(position);	
}

goog.inherits(Vizi.Camera, Vizi.SceneComponent);

Vizi.Camera.prototype._componentProperty = "camera";
Vizi.Camera.prototype._componentPropertyType = "Camera";

Vizi.Camera.prototype.realize = function() 
{
	Vizi.SceneComponent.prototype.realize.call(this);
	
	this.addToScene();
	
	Vizi.CameraManager.addCamera(this);
	
	if (this._active && !Vizi.CameraManager.activeCamera)
	{
		Vizi.CameraManager.setActiveCamera(this);
	}
}

Vizi.Camera.prototype.lookAt = function(v) 
{
	this.object.lookAt(v);
}

Vizi.Camera.DEFAULT_POSITION = new THREE.Vector3(0, 0, 10);
Vizi.Camera.DEFAULT_NEAR = 1;
Vizi.Camera.DEFAULT_FAR = 10000;
/**
 * @fileoverview Behavior component - base class for time-based behaviors
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.Script');
goog.require('Vizi.Component');

Vizi.Script = function(param) {
	param = param || {};
    Vizi.Component.call(this, param);
}

goog.inherits(Vizi.Script, Vizi.Component);

Vizi.Script.prototype._componentCategory = "scripts";

Vizi.Script.prototype.realize = function()
{
	Vizi.Component.prototype.realize.call(this);
}

Vizi.Script.prototype.update = function()
{
	if (Vizi.Script.WARN_ON_ABSTRACT)
		Vizi.System.warn("Abstract Script.evaluate called");
}

Vizi.Script.WARN_ON_ABSTRACT = true;
/**
 * @fileoverview Contains prefab assemblies for core Vizi package
 * @author Tony Parisi
 */
goog.provide('Vizi.Prefabs');
goog.require('Vizi.Prefabs');

Vizi.Prefabs.FirstPersonController = function(param)
{
	param = param || {};
	
	var controller = new Vizi.Object(param);
	var controllerScript = new Vizi.FirstPersonControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new Vizi.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('Vizi.FirstPersonControllerScript');
goog.require('Vizi.Script');

Vizi.FirstPersonControllerScript = function(param)
{
	Vizi.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._move = (param.move !== undefined) ? param.move : true;
	this._look = (param.look !== undefined) ? param.look : true;
	this._turn = (param.turn !== undefined) ? param.turn : true;
	this._tilt = (param.tilt !== undefined) ? param.tilt : true;
	this._mouseLook = (param.mouseLook !== undefined) ? param.mouseLook : false;
	
	this.collisionDistance = 10;
	this.moveSpeed = 13;
	this.turnSpeed = 5;
	this.tiltSpeed = 5;
	this.lookSpeed = 1;
	
	this.savedCameraPos = new THREE.Vector3;	
	this.movementVector = new THREE.Vector3;
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
    	move : {
    		get: function() {
    			return this._move;
    		},
    		set: function(v) {
    			this.setMove(v);
    		}
    	},
    	look : {
    		get: function() {
    			return this._look;
    		},
    		set: function(v) {
    			this.setLook(v);
    		}
    	},
    	mouseLook : {
    		get: function() {
    			return this._mouseLook;
    		},
    		set: function(v) {
    			this.setMouseLook(v);
    		}
    	},
        headlightOn: {
	        get: function() {
	            return this._headlightOn;
	        },
	        set:function(v)
	        {
	        	this.setHeadlightOn(v);
	        }
    	},
    });
}

goog.inherits(Vizi.FirstPersonControllerScript, Vizi.Script);

Vizi.FirstPersonControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(Vizi.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

Vizi.FirstPersonControllerScript.prototype.createControls = function(camera)
{
	var controls = new Vizi.FirstPersonControls(camera.object, Vizi.Graphics.instance.container);
	controls.mouseLook = this._mouseLook;
	controls.movementSpeed = this._move ? this.moveSpeed : 0;
	controls.lookSpeed = this._look ? this.lookSpeed  : 0;
	controls.turnSpeed = this._turn ? this.turnSpeed : 0;
	controls.tiltSpeed = this._tilt ? this.tiltSpeed : 0;

	this.clock = new THREE.Clock();
	return controls;
}

Vizi.FirstPersonControllerScript.prototype.update = function()
{
	this.saveCamera();
	this.controls.update(this.clock.getDelta());
	var collide = this.testCollision();
	if (collide && collide.object) {
		this.restoreCamera();
		this.dispatchEvent("collide", collide);
	}
	
	if (this.testTerrain()) {
		this.restoreCamera();
	}
	
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

Vizi.FirstPersonControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

Vizi.FirstPersonControllerScript.prototype.setMove = function(move)
{
	this._move = move;
	this.controls.movementSpeed = move ? this.moveSpeed : 0;
}

Vizi.FirstPersonControllerScript.prototype.setLook = function(look)
{
	this._look = look;
	this.controls.lookSpeed = look ? 1.0 : 0;
}

Vizi.FirstPersonControllerScript.prototype.setMouseLook = function(mouseLook)
{
	this._mouseLook = mouseLook;
	this.controls.mouseLook = mouseLook;
}

Vizi.FirstPersonControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
	this.controls.movementSpeed = this.moveSpeed;
	this.controls.lookSpeed = this._look ?  0.1 : 0;

}

Vizi.FirstPersonControllerScript.prototype.saveCamera = function() {
	this.savedCameraPos.copy(this._camera.position);
}

Vizi.FirstPersonControllerScript.prototype.restoreCamera = function() {
	this._camera.position.copy(this.savedCameraPos);
}

Vizi.FirstPersonControllerScript.prototype.testCollision = function() {
	
	this.movementVector.copy(this._camera.position).sub(this.savedCameraPos);
	if (this.movementVector.length()) {
		
        var collide = Vizi.Graphics.instance.objectFromRay(null, 
        		this.savedCameraPos,
        		this.movementVector, 1, 2);

        if (collide && collide.object) {
        	var dist = this.savedCameraPos.distanceTo(collide.hitPointWorld);
        }
        
        return collide;
	}
	
	return null;
}

Vizi.FirstPersonControllerScript.prototype.testTerrain = function() {
	return false;
}

Vizi.FirstPersonControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.Picker');
goog.require('Vizi.Component');

Vizi.Picker = function(param) {
	param = param || {};
	
    Vizi.Component.call(this, param);
    this.overCursor = param.overCursor;
    this.enabled = (param.enabled !== undefined) ? param.enabled : true;
}

goog.inherits(Vizi.Picker, Vizi.Component);

Vizi.Picker.prototype._componentCategory = "pickers";

Vizi.Picker.prototype.realize = function()
{
	Vizi.Component.prototype.realize.call(this);
	
    this.lastHitPoint = new THREE.Vector3;
    this.lastHitNormal = new THREE.Vector3;
    this.lastHitFace = new THREE.Face3;
}

Vizi.Picker.prototype.update = function()
{
}

Vizi.Picker.prototype.toModelSpace = function(vec)
{
	var modelMat = new THREE.Matrix4;
	modelMat.getInverse(this._object.transform.object.matrixWorld);
	vec.applyMatrix4(modelMat);
}

Vizi.Picker.prototype.onMouseOver = function(event)
{
    this.dispatchEvent("mouseover", event);
}

Vizi.Picker.prototype.onMouseOut = function(event)
{
    this.dispatchEvent("mouseout", event);
}
	        	        
Vizi.Picker.prototype.onMouseMove = function(event)
{
	var mouseOverObject = Vizi.PickManager.objectFromMouse(event);
	if (this._object == Vizi.PickManager.clickedObject || this._object == mouseOverObject)
	{
		if (event.point)
			this.lastHitPoint.copy(event.point);
		if (event.normal)
			this.lastHitNormal.copy(event.normal);
		if (event.face)
			this.lastHitFace = event.face;

		if (event.point) {
			this.dispatchEvent("mousemove", event);
		}
	}
}

Vizi.Picker.prototype.onMouseDown = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;
	
    this.dispatchEvent("mousedown", event);
}

Vizi.Picker.prototype.onMouseUp = function(event)
{
	var mouseOverObject = Vizi.PickManager.objectFromMouse(event);
	if (mouseOverObject != this._object)
	{
		event.point = this.lastHitPoint;
		event.normal = this.lastHitNormal;
		event.face = this.lastHitNormal;
		this.dispatchEvent("mouseout", event);
	}

	this.dispatchEvent("mouseup", event);
}

Vizi.Picker.prototype.onMouseClick = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;

	this.dispatchEvent("click", event);
}
	        
Vizi.Picker.prototype.onMouseDoubleClick = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;

	this.dispatchEvent("dblclick", event);
}
	
Vizi.Picker.prototype.onMouseScroll = function(event)
{
    this.dispatchEvent("mousescroll", event);
}

Vizi.Picker.prototype.onTouchMove = function(event)
{
	this.dispatchEvent("touchmove", event);
}

Vizi.Picker.prototype.onTouchStart = function(event)
{	
    this.dispatchEvent("touchstart", event);
}

Vizi.Picker.prototype.onTouchEnd = function(event)
{
	this.dispatchEvent("touchend", event);
}


/**
 * @fileoverview Picker component - get drag for an object along the surface of a reference object
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.SurfaceDragger');
goog.require('Vizi.Picker');

Vizi.SurfaceDragger = function(param) {
	
	param = param || {};
	
    Vizi.Picker.call(this, param);
    
    this.reference = param.reference;
	this.dragPlane = new THREE.Plane();
}

goog.inherits(Vizi.SurfaceDragger, Vizi.Picker);

Vizi.SurfaceDragger.prototype.realize = function()
{
	Vizi.Picker.prototype.realize.call(this);

}

Vizi.SurfaceDragger.prototype.update = function()
{
}

Vizi.SurfaceDragger.prototype.onMouseDown = function(event)
{
	Vizi.Picker.prototype.onMouseDown.call(this, event);
	
	var visual = this.reference.visuals[0];
	var intersection = Vizi.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, visual.object);
	if (intersection) {

		var hitpoint = intersection.point.clone();
		this.dragOffset = event.point.clone().sub(this._object.transform.position);
        this.dispatchEvent("dragstart", {
            type : "dragstart",
            offset : hitpoint
        });
	}

}

Vizi.SurfaceDragger.prototype.onMouseUp = function(event) {
	Vizi.Picker.prototype.onMouseUp.call(this, event);
    this.dispatchEvent("dragend", {
        type : "dragend",
    });
}

Vizi.SurfaceDragger.prototype.onMouseMove = function(event)
{
	Vizi.Picker.prototype.onMouseMove.call(this, event);
	
	var visual = this.reference.visuals[0];
	var intersection = Vizi.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, visual.object);
	
	if (intersection) {
		var hitpoint = intersection.point.clone();
		var hitnormal = intersection.face.normal.clone();
		var verts = visual.geometry.vertices;
		var v1 = verts[intersection.face.a];
		var v2 = verts[intersection.face.b];
		var v3 = verts[intersection.face.c];

		this.dragPlane = new THREE.Plane().setFromCoplanarPoints(v1, v2, v3);

		//var projectedPoint = hitpoint.clone();
		//projectedPoint.sub(this.dragOffset);
		var offset = hitpoint.clone();; // .sub(this.dragOffset);
		var vec = offset.clone().add(hitnormal);
		var up = new THREE.Vector3(0, hitnormal.z, -hitnormal.y).normalize();
		if (!up.lengthSq())
			up.set(0, hitnormal.x, hitnormal.y).normalize();
		if (hitnormal.x < 0 || hitnormal.z < 0)
			up.negate();
		
		this.dispatchEvent("drag", {
				type : "drag", 
				offset : offset,
				normal : hitnormal,
				up : up,
				lookAt : vec
			}
		);
		
	}
}



/**
 *
 */
goog.provide('Vizi.Mouse');

Vizi.Mouse = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.state = 
	{ x : Vizi.Mouse.NO_POSITION, y: Vizi.Mouse.NO_POSITION,

	buttons : { left : false, middle : false, right : false },
	scroll : 0,
	};

	Vizi.Mouse.instance = this;
};

Vizi.Mouse.prototype.onMouseMove = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
}

Vizi.Mouse.prototype.onMouseDown = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = true;
}

Vizi.Mouse.prototype.onMouseUp = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

Vizi.Mouse.prototype.onMouseClick = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

Vizi.Mouse.prototype.onMouseDoubleClick = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

Vizi.Mouse.prototype.onMouseScroll = function(event, delta)
{
    this.state.scroll = 0; // PUNT!
}


Vizi.Mouse.prototype.getState = function()
{
	return this.state;
}

Vizi.Mouse.instance = null;
Vizi.Mouse.NO_POSITION = Number.MIN_VALUE;
/**
 * @author mrdoob / http://mrdoob.com/
 */

goog.provide('Vizi.PointerLockControls');

Vizi.PointerLockControls = function ( camera ) {

  var scope = this;
  this.speed = 0.05
  this.speedMultiplier = 1;
  this.fly = false;
  this.jumpPower = .1;
  this.gravity = 0.0;

  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add( pitchObject );

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;


  var speedBoost = 10
  var speedSlow = .5

  var velocity = new THREE.Vector3();

  var PI_2 = Math.PI / 2;

  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

  };

  var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
      case 82:
        break;
      case 16:
        this.speedMultiplier = speedBoost;
        break

      case 17:
        this.speedMultiplier = speedSlow;
        break;

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 67: // c
        velocity.y += this.jumpPower;
        break;
      case 32: // space
        velocity.y -= this.jumpPower;
        break;

    }

  };

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {
      case 16:
        this.speedMultiplier = 1;
        break;
      case 17:
        this.speedMultiplier = 1;
        break;
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
      case 32: //space
        velocity.y = 0;
        break;
      case 67: //c
        velocity.y = 0;
        break;

    }

  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown.bind(this), false );
  document.addEventListener( 'keyup', onKeyUp.bind(this), false );

  this.enabled = false;

  this.getObject = function () {

    return yawObject;

  };


  this.getPosition = function() {
    return new THREE.Vector3().copy(yawObject.position)
  }

  this.getDirection = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3( 0, 0, -1 );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return function( ) {
      v = new THREE.Vector3()

      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

      v.copy( direction ).applyEuler( rotation );

      return v;

    }

  }();

  this.update = function ( delta ) {

    if ( scope.enabled === false ) return;

    delta *= 0.1;

    velocity.x += ( - velocity.x ) * 0.08 * delta;
    velocity.z += ( - velocity.z ) * 0.08 * delta;

    velocity.y -= this.gravity * delta;

    if ( moveForward ) velocity.z -= this.speed * delta * this.speedMultiplier;
    if ( moveBackward ) velocity.z += this.speed * delta * this.speedMultiplier;

    if ( moveLeft ) velocity.x -= this.speed * delta * this.speedMultiplier;
    if ( moveRight ) velocity.x += this.speed * delta * this.speedMultiplier;



    yawObject.translateX( velocity.x );
    yawObject.translateY( velocity.y ); 
    yawObject.translateZ( velocity.z );

    if ( yawObject.position.y < 10 ) {

      velocity.y = 0;
      yawObject.position.y = 10;


    }

  };

};
/**
 * @fileoverview Timer - component that generates time events
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.Timer');
goog.require('Vizi.Component');

Vizi.Timer = function(param)
{
    Vizi.Component.call(this);
    param = param || {};
    
    this.currentTime = Vizi.Time.instance.currentTime;
    this.running = false;
    this.duration = param.duration ? param.duration : 0;
    this.loop = (param.loop !== undefined) ? param.loop : false;
    this.lastFraction = 0;
}

goog.inherits(Vizi.Timer, Vizi.Component);

Vizi.Timer.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Vizi.Time.instance.currentTime;
	var deltat = now - this.currentTime;
	
	if (deltat)
	{
	    this.dispatchEvent("time", now);		
	}
	
	if (this.duration)
	{
		var mod = now % this.duration;
		var fract = mod / this.duration;
		
		this.dispatchEvent("fraction", fract);
		
		if (fract < this.lastFraction)
		{
			this.dispatchEvent("cycleTime");
			
			if (!this.loop)
			{
				this.stop();
			}
		}
		
		this.lastFraction = fract;
	}
	
	this.currentTime = now;
	
}

Vizi.Timer.prototype.start = function()
{
	this.running = true;
	this.currentTime = Vizi.Time.instance.currentTime;
}

Vizi.Timer.prototype.stop = function()
{
	this.running = false;
}

/**
 *
 */
goog.provide('Vizi.Transform');
goog.require('Vizi.SceneComponent');

Vizi.Transform = function(param) {
	param = param || {};
    Vizi.SceneComponent.call(this, param);

    if (param.object) {
		this.object = param.object;    	
    }
    else {
    	this.object = new THREE.Object3D();
    }
}

goog.inherits(Vizi.Transform, Vizi.SceneComponent);

Vizi.Transform.prototype._componentProperty = "transform";
Vizi.Transform.prototype._componentPropertyType = "Transform";

Vizi.Transform.prototype.addToScene = function() {
	var scene = this.layer ? this.layer.scene : Vizi.Graphics.instance.scene;
	if (this._object)
	{
		var parent = (this._object._parent && this._object._parent.transform) ? this._object._parent.transform.object : scene;
		if (parent)
		{
		    parent.add(this.object);
		    this.object.data = this; // backpointer for picking and such
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
}

Vizi.Transform.prototype.removeFromScene = function() {
	var scene = this.layer ? this.layer.scene : Vizi.Graphics.instance.scene;
	if (this._object)
	{
		var parent = (this._object._parent && this._object._parent.transform) ? this._object._parent.transform.object : scene;
		if (parent)
		{
			this.object.data = null;
		    parent.remove(this.object);
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
}
/**
 * @fileoverview Behavior component - base class for time-based behaviors
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.Behavior');
goog.require('Vizi.Component');

Vizi.Behavior = function(param) {
	param = param || {};
	this.startTime = 0;
	this.running = false;
	this.loop = (param.loop !== undefined) ? param.loop : false;
	this.autoStart = (param.autoStart !== undefined) ? param.autoStart : false;
    Vizi.Component.call(this, param);
}

goog.inherits(Vizi.Behavior, Vizi.Component);

Vizi.Behavior.prototype._componentCategory = "behaviors";

Vizi.Behavior.prototype.realize = function()
{
	Vizi.Component.prototype.realize.call(this);
	
	if (this.autoStart)
		this.start();
}

Vizi.Behavior.prototype.start = function()
{
	this.startTime = Vizi.Time.instance.currentTime;
	this.running = true;
}

Vizi.Behavior.prototype.stop = function()
{
	this.startTime = 0;
	this.running = false;
}

Vizi.Behavior.prototype.toggle = function()
{
	if (this.running)
		this.stop();
	else
		this.start();
}

Vizi.Behavior.prototype.update = function()
{
	if (this.running)
	{
		// N.B.: soon, add logic to subtract suspend times
		var now = Vizi.Time.instance.currentTime;
		var elapsedTime = (now - this.startTime) / 1000;
		
		this.evaluate(elapsedTime);
	}
}

Vizi.Behavior.prototype.evaluate = function(t)
{
	if (Vizi.Behavior.WARN_ON_ABSTRACT)
		Vizi.System.warn("Abstract Behavior.evaluate called");
}

Vizi.Behavior.WARN_ON_ABSTRACT = true;
/**
 * @fileoverview FadeBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.FadeBehavior');
goog.require('Vizi.Behavior');

Vizi.FadeBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.opacity = (param.opacity !== undefined) ? param.opacity : 0.5;
	this.savedOpacities = [];
	this.savedTransparencies = [];
	this.tween = null;
    Vizi.Behavior.call(this, param);
}

goog.inherits(Vizi.FadeBehavior, Vizi.Behavior);

Vizi.FadeBehavior.prototype.start = function()
{
	if (this.running)
		return;

	if (this._realized && this._object.visuals) {
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			this.savedOpacities.push(visuals[i].material.opacity);
			this.savedTransparencies.push(visuals[i].material.transparent);
			visuals[i].material.transparent = this.opacity < 1 ? true : false;
		}	
	}
	
	this.value = { opacity : this.savedOpacities[0] };
	this.targetValue = { opacity : this.opacity };
	this.tween = new TWEEN.Tween(this.value).to(this.targetValue, this.duration * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();
	
	Vizi.Behavior.prototype.start.call(this);
}

Vizi.FadeBehavior.prototype.evaluate = function(t)
{
	if (t >= this.duration)
	{
		this.stop();
		if (this.loop)
			this.start();
	}
	
	if (this._object.visuals)
	{
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			visuals[i].material.opacity = this.value.opacity;
		}	
	}

}


Vizi.FadeBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();

	Vizi.Behavior.prototype.stop.call(this);
}
goog.provide('Vizi.Light');
goog.require('Vizi.SceneComponent');

Vizi.Light = function(param)
{
	param = param || {};
	Vizi.SceneComponent.call(this, param);
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        color: {
	        get: function() {
	            return this.object.color;
	        }
    	},
        intensity: {
	        get: function() {
	            return this.object.intensity;
	        },
	        set: function(v) {
	        	this.object.intensity = v;
	        }
    	},    	

    });
	
}

goog.inherits(Vizi.Light, Vizi.SceneComponent);

Vizi.Light.prototype._componentProperty = "light";
Vizi.Light.prototype._componentPropertyType = "Light";

Vizi.Light.prototype.realize = function() 
{
	Vizi.SceneComponent.prototype.realize.call(this);
}

Vizi.Light.DEFAULT_COLOR = 0xFFFFFF;
Vizi.Light.DEFAULT_INTENSITY = 1;
Vizi.Light.DEFAULT_RANGE = 10000;goog.provide('Vizi.DirectionalLight');
goog.require('Vizi.Light');

Vizi.DirectionalLight = function(param)
{
	param = param || {};

	this.scaledDir = new THREE.Vector3;
	this.castShadows = ( param.castShadows !== undefined ) ? param.castShadows : Vizi.DirectionalLight.DEFAULT_CAST_SHADOWS;
	
	Vizi.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
		this.direction = param.object.position.clone().normalize().negate();
		this.targetPos = param.object.target.position.clone();
		this.shadowDarkness = param.object.shadowDarkness;
	}
	else {
		this.direction = param.direction || new THREE.Vector3(0, 0, -1);
		this.object = new THREE.DirectionalLight(param.color, param.intensity, 0);
		this.targetPos = new THREE.Vector3;
		this.shadowDarkness = ( param.shadowDarkness !== undefined ) ? param.shadowDarkness : Vizi.DirectionalLight.DEFAULT_SHADOW_DARKNESS;
	}
}

goog.inherits(Vizi.DirectionalLight, Vizi.Light);

Vizi.DirectionalLight.prototype.realize = function() 
{
	Vizi.Light.prototype.realize.call(this);
}

Vizi.DirectionalLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform light directions automatically
	// Really bizarre semantics
	this.position.copy(this.direction).normalize().negate();
	var worldmat = this.object.parent.matrixWorld;
	this.position.applyMatrix4(worldmat);
	this.scaledDir.copy(this.direction);
	this.scaledDir.multiplyScalar(Vizi.Light.DEFAULT_RANGE);
	this.targetPos.copy(this.position);
	this.targetPos.add(this.scaledDir);	
 	this.object.target.position.copy(this.targetPos);

	this.updateShadows();
	
	Vizi.Light.prototype.update.call(this);
}

Vizi.DirectionalLight.prototype.updateShadows = function()
{
	if (this.castShadows)
	{
		this.object.castShadow = true;
		this.object.shadowCameraNear = 1;
		this.object.shadowCameraFar = Vizi.Light.DEFAULT_RANGE;
		this.object.shadowCameraFov = 90;

		// light.shadowCameraVisible = true;

		this.object.shadowBias = 0.0001;
		this.object.shadowDarkness = this.shadowDarkness;

		this.object.shadowMapWidth = 1024;
		this.object.shadowMapHeight = 1024;
		
		Vizi.Graphics.instance.enableShadows(true);
	}	
}


Vizi.DirectionalLight.DEFAULT_CAST_SHADOWS = false;
Vizi.DirectionalLight.DEFAULT_SHADOW_DARKNESS = 0.3;
goog.provide('Vizi.PointLight');
goog.require('Vizi.Light');

Vizi.PointLight = function(param)
{
	param = param || {};
	
	Vizi.Light.call(this, param);
	
	this.positionVec = new THREE.Vector3;
	
	if (param.object) {
		this.object = param.object; 
	}
	else {
		var distance = ( param.distance !== undefined ) ? param.distance : Vizi.PointLight.DEFAULT_DISTANCE;
		this.object = new THREE.PointLight(param.color, param.intensity, distance);
	}
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        distance: {
	        get: function() {
	            return this.object.distance;
	        },
	        set: function(v) {
	        	this.object.distance = v;
	        }
    	},    	

    });

}

goog.inherits(Vizi.PointLight, Vizi.Light);

Vizi.PointLight.prototype.realize = function() 
{
	Vizi.Light.prototype.realize.call(this);
}

Vizi.PointLight.prototype.update = function() 
{
	if (this.object)
	{
		this.positionVec.set(0, 0, 0);
		var worldmat = this.object.parent.matrixWorld;
		this.positionVec.applyMatrix4(worldmat);
		this.position.copy(this.positionVec);
	}
	
	// Update the rest
	Vizi.Light.prototype.update.call(this);
}

Vizi.PointLight.DEFAULT_DISTANCE = 0;

goog.require('Vizi.Prefabs');

Vizi.Prefabs.DeviceOrientationController = function(param)
{
	param = param || {};
	
	var controller = new Vizi.Object(param);
	var controllerScript = new Vizi.DeviceOrientationControllerScript(param);
	controller.addComponent(controllerScript);
	
	return controller;
}

goog.provide('Vizi.DeviceOrientationControllerScript');
goog.require('Vizi.Script');

Vizi.DeviceOrientationControllerScript = function(param)
{
	Vizi.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this.roll = (param.roll !== undefined) ? param.roll : true;
		
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
    });
}

goog.inherits(Vizi.DeviceOrientationControllerScript, Vizi.Script);

Vizi.DeviceOrientationControllerScript.prototype.realize = function()
{
}

Vizi.DeviceOrientationControllerScript.prototype.createControls = function(camera)
{
	var controls = new Vizi.DeviceOrientationControls(camera.object);
	
	if (this._enabled)
		controls.connect();
	
	controls.roll = this.roll;
	return controls;
}

Vizi.DeviceOrientationControllerScript.prototype.update = function()
{
	if (this._enabled)
		this.controls.update();
}

Vizi.DeviceOrientationControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	if (this._enabled)
		this.controls.connect();
	else
		this.controls.disconnect();
}

Vizi.DeviceOrientationControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
}
/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('Vizi.Visual');
goog.require('Vizi.SceneComponent');

/**
 * @constructor
 */
Vizi.Visual = function(param)
{
	param = param || {};
	
	Vizi.SceneComponent.call(this, param);

	if (param.object) {
		this.object = param.object;
		this.geometry = this.object.geometry;
		this.material = this.object.material;
	}
	else {
		this.geometry = param.geometry;
		this.material = param.material;
	}
}

goog.inherits(Vizi.Visual, Vizi.SceneComponent);

// We're going to let this slide until we figure out the glTF mulit-material mesh
//Vizi.Visual.prototype._componentProperty = "visual";
//Vizi.Visual.prototype._componentPropertyType = "Visual";
Vizi.Visual.prototype._componentCategory = "visuals";

Vizi.Visual.prototype.realize = function()
{
	Vizi.SceneComponent.prototype.realize.call(this);
	
	if (!this.object && this.geometry && this.material) {
		this.object = new THREE.Mesh(this.geometry, this.material);
		this.object.ignorePick = false;
	    this.addToScene();
	}	
}

/**
 * @fileoverview A visual containing a model in Collada format
 * @author Tony Parisi
 */
goog.provide('Vizi.SceneVisual');
goog.require('Vizi.Visual');

Vizi.SceneVisual = function(param) 
{
	param = param || {};
	
    Vizi.Visual.call(this, param);

    this.object = param.scene;
}

goog.inherits(Vizi.SceneVisual, Vizi.Visual);

Vizi.SceneVisual.prototype.realize = function()
{
	Vizi.Visual.prototype.realize.call(this);
	
    this.addToScene();
}
/**
 *
 */
goog.provide('Vizi.Keyboard');

Vizi.Keyboard = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	Vizi.Keyboard.instance = this;
}

Vizi.Keyboard.prototype.onKeyDown = function(event)
{
}

Vizi.Keyboard.prototype.onKeyUp = function(event)
{
}

Vizi.Keyboard.prototype.onKeyPress = function(event)
{
}	        

Vizi.Keyboard.instance = null;

/* key codes
37: left
38: up
39: right
40: down
*/
Vizi.Keyboard.KEY_LEFT  = 37;
Vizi.Keyboard.KEY_UP  = 38;
Vizi.Keyboard.KEY_RIGHT  = 39;
Vizi.Keyboard.KEY_DOWN  = 40;
/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.Graphics');

Vizi.Graphics = function()
{
	// Freak out if somebody tries to make 2
    if (Vizi.Graphics.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
	
	Vizi.Graphics.instance = this;
}
	        
Vizi.Graphics.instance = null;
/**
 * @fileoverview MoveBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.MoveBehavior');
goog.require('Vizi.Behavior');

Vizi.MoveBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.moveVector = (param.moveVector !== undefined) ? param.moveVector : new THREE.Vector3(0, 1, 0);
	this.tween = null;
    Vizi.Behavior.call(this, param);
}

goog.inherits(Vizi.MoveBehavior, Vizi.Behavior);

Vizi.MoveBehavior.prototype.start = function()
{
	if (this.running)
		return;

	this.movePosition = new THREE.Vector3;
	this.moveEndPosition = this.moveVector.clone();
	this.prevMovePosition = new THREE.Vector3;
	this.moveDelta = new THREE.Vector3;
	this.tween = new TWEEN.Tween(this.movePosition).to(this.moveEndPosition, this.duration * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();
	
	Vizi.Behavior.prototype.start.call(this);
}

Vizi.MoveBehavior.prototype.evaluate = function(t)
{
	if (t >= this.duration)
	{
		this.stop();
		if (this.loop) {
			this.start();
		}
		else {
			this.dispatchEvent("complete");
		}
	}
	
	this.moveDelta.copy(this.movePosition).sub(this.prevMovePosition);
	this.prevMovePosition.copy(this.movePosition);
	this._object.transform.position.add(this.moveDelta);
}


Vizi.MoveBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();
	
	Vizi.Behavior.prototype.stop.call(this);
}/**
 * @fileoverview Pick Manager - singleton to manage currently picked object(s)
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.PickManager');

Vizi.PickManager.handleMouseMove = function(event)
{
    if (Vizi.PickManager.clickedObject)
    {
    	var pickers = Vizi.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseMove) {
    			pickers[i].onMouseMove(event);
    		}
    	}
    }
    else
    {
        var oldObj = Vizi.PickManager.overObject;
        Vizi.PickManager.overObject = Vizi.PickManager.objectFromMouse(event);

        if (Vizi.PickManager.overObject != oldObj)
        {
    		if (oldObj)
    		{
    			Vizi.Graphics.instance.setCursor(null);

    			event.type = "mouseout";
    	    	var pickers = oldObj.pickers;
    	    	var i, len = pickers.length;
    	    	for (i = 0; i < len; i++) {
    	    		if (pickers[i].enabled && pickers[i].onMouseOut) {
    	    			pickers[i].onMouseOut(event);
    	    		}
    	    	}
    		}

            if (Vizi.PickManager.overObject)
            {            	
        		event.type = "mouseover";
    	    	var pickers = Vizi.PickManager.overObject.pickers;
    	    	var i, len = pickers.length;
    	    	for (i = 0; i < len; i++) {
    	    		
    	    		if (pickers[i].enabled && pickers[i].overCursor) {
    	        		Vizi.Graphics.instance.setCursor(pickers[i].overCursor);
    	    		}
    	    		
    	        	if (pickers[i].enabled && pickers[i].onMouseOver) {
    	        		pickers[i].onMouseOver(event);
    	        	}
    	    	}

            }
        }
        
        if (Vizi.PickManager.overObject) {
	    	var pickers = Vizi.PickManager.overObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		
	    		if (pickers[i].enabled && pickers[i].moveWithoutCapture && pickers[i].onMouseMove) {
	        		event.type = "mousemove";
	    			pickers[i].onMouseMove(event);
	    		}
	    	}
        }
    }
}

Vizi.PickManager.handleMouseDown = function(event)
{
    Vizi.PickManager.clickedObject = Vizi.PickManager.objectFromMouse(event);
    if (Vizi.PickManager.clickedObject)
    {
    	var pickers = Vizi.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseDown) {
    			pickers[i].onMouseDown(event);
    		}
    	}
    }
}

Vizi.PickManager.handleMouseUp = function(event)
{
    if (Vizi.PickManager.clickedObject)
    {
    	var overobject = Vizi.PickManager.objectFromMouse(event);
    	var pickers = Vizi.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseUp) {
    			pickers[i].onMouseUp(event);
    			// Also deliver a click event if we're over the same object as when
    			// the mouse was first pressed
    			if (overobject == Vizi.PickManager.clickedObject) {
    				event.type = "click";
    				pickers[i].onMouseClick(event);
    			}
    		}
    	}
    }

    Vizi.PickManager.clickedObject = null;
}

Vizi.PickManager.handleMouseClick = function(event)
{
	/* N.B.: bailing out here, not sure why, leave this commented out
	return;
	
    Vizi.PickManager.clickedObject = Vizi.PickManager.objectFromMouse(event);
    
    if (Vizi.PickManager.clickedObject)
    {
    	var pickers = Vizi.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseClick) {
    			pickers[i].onMouseClick(event);
    		}
    	}
    }

    Vizi.PickManager.clickedObject = null;
    */
}

Vizi.PickManager.handleMouseDoubleClick = function(event)
{
    Vizi.PickManager.clickedObject = Vizi.PickManager.objectFromMouse(event);
    
    if (Vizi.PickManager.clickedObject)
    {
    	var pickers = Vizi.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseDoubleClick) {
    			pickers[i].onMouseDoubleClick(event);
    		}
    	}
    }

    Vizi.PickManager.clickedObject = null;
}

Vizi.PickManager.handleMouseScroll = function(event)
{
    if (Vizi.PickManager.overObject)
    {
    	var pickers = Vizi.PickManager.overObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseScroll) {
    			pickers[i].onMouseScroll(event);
    		}
    	}
    }

    Vizi.PickManager.clickedObject = null;
}

Vizi.PickManager.handleTouchStart = function(event)
{
	if (event.touches.length > 0) {
		event.screenX = event.touches[0].screenX;
		event.screenY = event.touches[0].screenY;
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
		event.pageX = event.touches[0].pageX;
		event.pageY = event.touches[0].pageY;
		event.elementX = event.touches[0].elementX;
		event.elementY = event.touches[0].elementY;
	    Vizi.PickManager.clickedObject = Vizi.PickManager.objectFromMouse(event);
	    if (Vizi.PickManager.clickedObject)
	    {
	    	var pickers = Vizi.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchStart) {
	    			pickers[i].onTouchStart(event);
	    		}
	    	}
	    }
	}
}

Vizi.PickManager.handleTouchMove = function(event)
{
	if (event.touches.length > 0) {
		event.screenX = event.touches[0].screenX;
		event.screenY = event.touches[0].screenY;
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
		event.pageX = event.touches[0].pageX;
		event.pageY = event.touches[0].pageY;
		event.elementX = event.touches[0].elementX;
		event.elementY = event.touches[0].elementY;

		if (Vizi.PickManager.clickedObject) {
	    	var pickers = Vizi.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchMove) {
	    			pickers[i].onTouchMove(event);
	    		}
	    	}
	    }
	}
}

Vizi.PickManager.handleTouchEnd = function(event)
{
	if (event.changedTouches.length > 0) {
		event.screenX = event.changedTouches[0].screenX;
		event.screenY = event.changedTouches[0].screenY;
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		event.elementX = event.changedTouches[0].elementX;
		event.elementY = event.changedTouches[0].elementY;
	    if (Vizi.PickManager.clickedObject)
	    {
	    	var pickers = Vizi.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchEnd) {
	    			pickers[i].onTouchEnd(event);
	    		}
	    	}
	    }
	    
	    Vizi.PickManager.clickedObject = null;
	}	
}

Vizi.PickManager.objectFromMouse = function(event)
{
	var intersected = Vizi.Graphics.instance.objectFromMouse(event);
	if (intersected.object)
	{
		event.face = intersected.face;
		event.normal = intersected.normal;
		event.point = intersected.point;
		event.object = intersected.object;
		
    	if (intersected.object._object.pickers)
    	{
    		var pickers = intersected.object._object.pickers;
    		var i, len = pickers.length;
    		for (i = 0; i < len; i++) {
    			if (pickers[i].enabled) { // just need one :-)
    				return intersected.object._object;
    			}
    		}
    	}

		return Vizi.PickManager.findObjectPicker(event, intersected.hitPointWorld, intersected.object.object);
	}
	else
	{
		return null;
	}
}

Vizi.PickManager.findObjectPicker = function(event, hitPointWorld, object) {
	while (object) {
		
		if (object.data && object.data._object.pickers) {
    		var pickers = object.data._object.pickers;
    		var i, len = pickers.length;
    		for (i = 0; i < len; i++) {
    			if (pickers[i].enabled) { // just need one :-)
    				// Get the model space units for our event
    				var modelMat = new THREE.Matrix4;
    				modelMat.getInverse(object.matrixWorld);
    				event.point = hitPointWorld.clone();
    				event.point.applyMatrix4(modelMat);
    				return object.data._object;
    			}
    		}
		}

		object = object.parent;
	}
	
	return null;
}


Vizi.PickManager.clickedObject = null;
Vizi.PickManager.overObject  =  null;goog.provide('Vizi.AmbientLight');
goog.require('Vizi.Light');

Vizi.AmbientLight = function(param)
{
	param = param || {};
	
	Vizi.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
	}
	else {
		this.object = new THREE.AmbientLight(param.color);
	}
}

goog.inherits(Vizi.AmbientLight, Vizi.Light);

Vizi.AmbientLight.prototype.realize = function() 
{
	Vizi.Light.prototype.realize.call(this);
}
/**
 *
 */
goog.provide('Vizi.Input');
goog.require('Vizi.Service');
goog.require('Vizi.Mouse');
goog.require('Vizi.Keyboard');

Vizi.Input = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.mouse = new Vizi.Mouse();
	this.keyboard = new Vizi.Keyboard();
	this.gamepad = new Vizi.Gamepad();
	Vizi.Input.instance = this;
}

goog.inherits(Vizi.Input, Vizi.Service);

Vizi.Input.prototype.update = function() {
	if (this.gamepad && this.gamepad.update)
		this.gamepad.update();
}

Vizi.Input.instance = null;/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.CylinderDragger');
goog.require('Vizi.Picker');

Vizi.CylinderDragger = function(param) {
	
	param = param || {};
	
    Vizi.Picker.call(this, param);
    
    this.normal = param.normal || new THREE.Vector3(0, 1, 0);
    this.position = param.position || new THREE.Vector3;
    this.color = 0xaa0000;
}

goog.inherits(Vizi.CylinderDragger, Vizi.Picker);

Vizi.CylinderDragger.prototype.realize = function()
{
	Vizi.Picker.prototype.realize.call(this);

    // And some helpers
    this.dragObject = null;
	this.dragOffset = new THREE.Euler;
	this.currentOffset = new THREE.Euler;
	this.dragHitPoint = new THREE.Vector3;
	this.dragStartPoint = new THREE.Vector3;
	this.dragPlane = this.createDragPlane();
	this.dragPlane.visible = Vizi.CylinderDragger.SHOW_DRAG_PLANE;
	this.dragPlane.ignorePick = true;
	this.dragPlane.ignoreBounds = true;
	this._object.transform.object.add(this.dragPlane);
}

Vizi.CylinderDragger.prototype.createDragPlane = function() {

	var size = 2000;
	var normal = this.normal;
	var position = this.position;
	
	var u = new THREE.Vector3(0, normal.z, -normal.y).normalize().multiplyScalar(size);
	if (!u.lengthSq())
		u = new THREE.Vector3(-normal.z, normal.x, 0).normalize().multiplyScalar(size);

	var v = u.clone().cross(normal).normalize().multiplyScalar(size);
	
	var p1 = position.clone().sub(u).sub(v);
	var p2 = position.clone().add(u).sub(v);
	var p3 = position.clone().add(u).add(v);
	var p4 = position.clone().sub(u).add(v);
	
	var planegeom = new THREE.Geometry();
	planegeom.vertices.push(p1, p2, p3, p4); 
	var planeface = new THREE.Face3( 0, 2, 1 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	var planeface = new THREE.Face3( 0, 3, 2 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	planegeom.computeFaceNormals();
	planegeom.computeCentroids();

	var mat = new THREE.MeshBasicMaterial({color:this.color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	return mesh;
}

Vizi.CylinderDragger.prototype.update = function()
{
}

Vizi.CylinderDragger.prototype.onMouseDown = function(event) {
	Vizi.Picker.prototype.onMouseDown.call(this, event);
	this.handleMouseDown(event);
}

Vizi.CylinderDragger.prototype.handleMouseDown = function(event) {
	
	if (this.dragPlane) {
		
		var intersection = Vizi.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
		
		if (intersection)
		{			
//			this.toModelSpace(intersection.point);
			this.dragStartPoint.copy(intersection.point).normalize();
//			this.dragOffset.copy(this._object.transform.rotation);
			this.dragObject = event.object;
		    this.dispatchEvent("dragstart", {
		        type : "dragstart",
		        offset : intersection.point
		    });
		    
		}
	    
	}
	
	if (Vizi.CylinderDragger.SHOW_DRAG_NORMAL) {
		
		if (this.arrowDecoration)
			this._object.removeComponent(this.arrowDecoration);
		
		var mesh = new THREE.ArrowHelper(this.normal, new THREE.Vector3, 500, 0x00ff00, 5, 5);
		var visual = new Vizi.Decoration({object:mesh});
		this._object.addComponent(visual);
		this.arrowDecoration = visual;
		
	}
}

Vizi.CylinderDragger.prototype.onMouseMove = function(event) {
	Vizi.Picker.prototype.onMouseMove.call(this, event);
	this.handleMouseMove(event);
}

Vizi.CylinderDragger.prototype.handleMouseMove = function(event) {
	
	var intersection = Vizi.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
	if (intersection)
	{
//		this.toModelSpace(intersection.point);
		var projectedPoint = intersection.point.clone().normalize();
		var theta = Math.acos(projectedPoint.dot(this.dragStartPoint));
		var cross = projectedPoint.clone().cross(this.dragStartPoint);
		if (this.normal.dot(cross) > 0)
			theta = -theta;
		
		this.currentOffset.set(this.dragOffset.x + this.normal.x * theta, 
				this.dragOffset.y + this.normal.y * theta,
				this.dragOffset.z + this.normal.z * theta);
			
		this.dispatchEvent("drag", {
				type : "drag", 
				offset : this.currentOffset,
			}
		);
	}
}

Vizi.CylinderDragger.prototype.onMouseUp = function(event) {
	Vizi.Picker.prototype.onMouseUp.call(this, event);
	this.handleMouseUp(event);
}

Vizi.CylinderDragger.prototype.handleMouseUp = function(event) {
	
	if (this.arrowDecoration)
		this._object.removeComponent(this.arrowDecoration);

}

Vizi.CylinderDragger.prototype.onTouchStart = function(event) {
	Vizi.Picker.prototype.onTouchStart.call(this, event);

	this.handleMouseDown(event);
}

Vizi.CylinderDragger.prototype.onTouchMove = function(event) {
	Vizi.Picker.prototype.onTouchMove.call(this, event);

	this.handleMouseMove(event);
}

Vizi.CylinderDragger.prototype.onTouchEnd = function(event) {
	Vizi.Picker.prototype.onTouchEnd.call(this, event);

	this.handleMouseUp(event);
}

Vizi.CylinderDragger.SHOW_DRAG_PLANE = false;
Vizi.CylinderDragger.SHOW_DRAG_NORMAL = false;
/**
 * @fileoverview RotateBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.RotateBehavior');
goog.require('Vizi.Behavior');

Vizi.RotateBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.velocity = (param.velocity !== undefined) ? param.velocity : (Math.PI / 2 / this.duration);
	this.startAngle = 0;
	this.angle = 0;
    Vizi.Behavior.call(this, param);
}

goog.inherits(Vizi.RotateBehavior, Vizi.Behavior);

Vizi.RotateBehavior.prototype.start = function()
{
	this.angle = 0;
	this._object.transform.rotation.y = this._object.transform.rotation.y % (Math.PI * 2);
	this.startAngle = this._object.transform.rotation.y;
	
	Vizi.Behavior.prototype.start.call(this);
}

Vizi.RotateBehavior.prototype.evaluate = function(t)
{
	var twopi = Math.PI * 2;
	this.angle = this.velocity * t;
	if (this.angle >= twopi)
	{
		if (this.once) 
			this.angle = twopi;
		else
			this.angle = this.angle % twopi;
	}
		
	this._object.transform.rotation.y = this.startAngle + this.angle;
	
	if (this.once && this.angle >= twopi)
	{
		this.stop();
	}
}/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

/* Heavily adapted version of Three.js FirstPerson controls for Vizi
 * 
 */

goog.provide('Vizi.FirstPersonControls');

Vizi.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 1.0;

	this.turnSpeed = 5; // degs
	this.tiltSpeed = 5;
	this.turnAngle = 0;
	this.tiltAngle = 0;
	
	this.mouseX = 0;
	this.mouseY = 0;
	this.lastMouseX = 0;
	this.lastMouseY = 0;

	this.touchScreenX = 0;
	this.touchScreenY = 0;
	this.lookTouchId = -1;
	this.moveTouchId = -1;
	
	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.turnRight = false;
	this.turnLeft = false;
	this.tiltUp = false;
	this.tiltDown = false;
	
	this.mouseDragOn = false;
	this.mouseLook = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}
				
		this.lastMouseX = this.mouseX;
		this.lastMouseY = this.mouseY;
		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onTouchStart = function ( event ) {

		event.preventDefault();
		
		if (event.touches.length > 0) {

			if (this.lookTouchId == -1) {
				this.lookTouchId = event.touches[0].identifier;
			
				// synthesize a left mouse button event
				var mouseEvent = {
					'type': 'mousedown',
				    'view': event.view,
				    'bubbles': event.bubbles,
				    'cancelable': event.cancelable,
				    'detail': event.detail,
				    'screenX': event.touches[0].screenX,
				    'screenY': event.touches[0].screenY,
				    'clientX': event.touches[0].clientX,
				    'clientY': event.touches[0].clientY,
				    'pageX': event.touches[0].pageX,
				    'pageY': event.touches[0].pageY,
				    'button': 0,
				    'preventDefault' : event.preventDefault
					};
				
				this.onMouseDown(mouseEvent);
			}
			else {
				// second touch does move
				this.touchScreenX = event.touches[1].screenX; 
				this.touchScreenY = event.touches[1].screenY;
				this.moveTouchId = event.touches[1].identifier;
			}
			
		}
		
	}

	
	this.onTouchMove = function ( event ) {

		event.preventDefault();
		
		var lookTouch = null, moveTouch = null, 
			len = event.changedTouches.length;
		
		for (var i = 0; i < len; i++) {
			
			if (event.changedTouches[i].identifier == this.lookTouchId)
				lookTouch = event.changedTouches[i];
			
			if (event.changedTouches[i].identifier == this.moveTouchId)
				moveTouch = event.changedTouches[i];
				
		}
		
		if (lookTouch) {
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mousemove',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': lookTouch.screenX,
			    'screenY': lookTouch.screenY,
			    'clientX': lookTouch.clientX,
			    'clientY': lookTouch.clientY,
			    'pageX': lookTouch.pageX,
			    'pageY': lookTouch.pageY,
			    'button': 0,
			    'preventDefault' : event.preventDefault
				};
			
			this.onMouseMove(mouseEvent);
		}


		if (moveTouch) {
			// second touch does move
			var deltaX = moveTouch.screenX - this.touchScreenX;
			var deltaY = moveTouch.screenY - this.touchScreenY;
			
			this.touchScreenX = moveTouch.screenX; 
			this.touchScreenY = moveTouch.screenY; 
			
			if (deltaX > 0) {
				this.moveRight = true;
			}
			
			if (deltaX < 0) {
				this.moveLeft = true;
			}

			if (deltaY > 0) {
				this.moveBackward = true;
			}
			
			if (deltaY < 0) {
				this.moveForward = true;
			}

			
		}
	
	}

	
	this.onTouchEnd = function ( event ) {
		
		event.preventDefault();
		
		var lookTouch = null, moveTouch = null, 
		len = event.changedTouches.length;
	
		for (var i = 0; i < len; i++) {
			
			if (event.changedTouches[i].identifier == this.lookTouchId)
				lookTouch = event.changedTouches[i];
			
			if (event.changedTouches[i].identifier == this.moveTouchId)
				moveTouch = event.changedTouches[i];
				
		}

		if (lookTouch) {
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mouseup',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': lookTouch.screenX,
			    'screenY': lookTouch.screenY,
			    'clientX': lookTouch.clientX,
			    'clientY': lookTouch.clientY,
			    'pageX': lookTouch.pageX,
			    'pageY': lookTouch.pageY,
			    'button': 0,
			    'preventDefault' : event.preventDefault
			};
			
			this.onMouseUp(mouseEvent);
			
			this.lookTouchId = -1;
		}
		
		if (moveTouch) {
			// second touch does move
			this.touchScreenX = moveTouch.screenX; 
			this.touchScreenY = moveTouch.screenY; 
			
			this.moveRight = false;		
			this.moveLeft = false;
			this.moveBackward = false;
			this.moveForward = false;
			
			this.moveTouchId = -1;
		}
		
	}
	
	this.onGamepadButtonsChanged = function ( event ) {
	}
	
	var MOVE_VTHRESHOLD = 0.2;
	var MOVE_HTHRESHOLD = 0.5;
	this.onGamepadAxesChanged = function ( event ) {

		var axes = event.changedAxes;
		var i, len = axes.length;
		for (i = 0; i < len; i++) {
			var axis = axes[i];
			
			if (axis.axis == Vizi.Gamepad.AXIS_LEFT_V) {
				// +Y is down
				if (axis.value < -MOVE_VTHRESHOLD) {
					this.moveForward = true;
					this.moveBackward = false;
				}
				else if (axis.value > MOVE_VTHRESHOLD) {
					this.moveBackward = true;
					this.moveForward = false;
				}
				else {
					this.moveBackward = false;
					this.moveForward = false;
				}
			}
			else if (axis.axis == Vizi.Gamepad.AXIS_LEFT_H) {
				// +X is to the right
				if (axis.value > MOVE_HTHRESHOLD) {
					this.moveRight = true;
					this.moveLeft = false;
				}
				else if (axis.value < -MOVE_HTHRESHOLD) {
					this.moveLeft = true;
					this.moveRight = false;
				}
				else {
					this.moveLeft = false;
					this.moveRight = false;
				}
			}
			else if (axis.axis == Vizi.Gamepad.AXIS_RIGHT_V) {
				// +Y is down
				if (axis.value < -MOVE_VTHRESHOLD) {
					this.tiltUp = true;
					this.tiltDown = false;
				}
				else if (axis.value > MOVE_VTHRESHOLD) {
					this.tiltDown = true;
					this.tiltUp = false;
				}
				else {
					this.tiltDown = false;
					this.tiltUp = false;
				}
			}
			else if (axis.axis == Vizi.Gamepad.AXIS_RIGHT_H) {
				if (axis.value > MOVE_HTHRESHOLD) {
					this.turnLeft = true;
					this.turnRight = false;
				}
				else if (axis.value < -MOVE_HTHRESHOLD) {
					this.turnRight = true;
					this.turnLeft = false;
				}
				else {
					this.turnLeft = false;
					this.turnRight = false;
				}
			}
		
		}
	};
	
	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.enabled === false ) return;
		
		this.startY = this.object.position.y;
		
		var actualMoveSpeed = delta * this.movementSpeed;

		if ( this.moveForward ) 
			this.object.translateZ( - actualMoveSpeed );
		if ( this.moveBackward ) 
			this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) 
			this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) 
			this.object.translateX( actualMoveSpeed );

		this.object.position.y = this.startY;
		
		var actualLookSpeed = delta * this.lookSpeed;

		var DRAG_DEAD_ZONE = 1;
		
		if ((this.mouseDragOn || this.mouseLook) && this.lookSpeed) {
			
			var deltax = this.lastMouseX - this.mouseX;
			if (Math.abs(deltax) < DRAG_DEAD_ZONE)
				dlon = 0;
			var dlon = deltax / this.viewHalfX * 900;
			this.lon += dlon * this.lookSpeed;

			var deltay = this.lastMouseY - this.mouseY;
			if (Math.abs(deltay) < DRAG_DEAD_ZONE)
				dlat = 0;
			var dlat = deltay / this.viewHalfY * 900;
			this.lat += dlat * this.lookSpeed;
			
			this.theta = THREE.Math.degToRad( this.lon );

			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = THREE.Math.degToRad( this.lat );

			var targetPosition = this.target,
				position = this.object.position;
	
			targetPosition.x = position.x - Math.sin( this.theta );
			targetPosition.y = position.y + Math.sin( this.phi );
			targetPosition.z = position.z - Math.cos( this.theta );
	
			this.object.lookAt( targetPosition );
			
			this.lastMouseX = this.mouseX;
			this.lastMouseY = this.mouseY;
		}
		
		if (this.turnRight || this.turnLeft || this.tiltUp || this.tiltDown) {
			
			var dlon = 0;
			if (this.turnRight)
				dlon = 1;
			else if (this.turnLeft)
				dlon = -1;
			this.lon += dlon * this.turnSpeed;
			
			var dlat = 0;
			if (this.tiltUp)
				dlat = 1;
			else if (this.tiltDown)
				dlat = -1;

			this.lat += dlat * this.tiltSpeed;

			this.theta = THREE.Math.degToRad( this.lon );

			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = THREE.Math.degToRad( this.lat );

			var targetPosition = this.target,
				position = this.object.position;
	
			if (this.turnSpeed) {
				targetPosition.x = position.x - Math.sin( this.theta );
			}
			
			if (this.tiltSpeed) {
				targetPosition.y = position.y + Math.sin( this.phi );
				targetPosition.z = position.z - Math.cos( this.theta );
			}
			
			if (this.turnSpeed || this.tiltSpeed) {
				this.object.lookAt( targetPosition );
			}
		}
	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), true );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'touchstart', bind( this, this.onTouchStart), false );
	this.domElement.addEventListener( 'touchmove', bind( this, this.onTouchMove), false );
	this.domElement.addEventListener( 'touchend', bind( this, this.onTouchEnd), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );
	this.domElement.addEventListener( 'resize', bind( this, this.handleResize ), false );
	
	var gamepad = Vizi.Gamepad.instance;
	if (gamepad) {
		gamepad.addEventListener( 'buttonsChanged', bind( this, this.onGamepadButtonsChanged ), false );
		gamepad.addEventListener( 'axesChanged', bind( this, this.onGamepadAxesChanged ), false );
	}
	
	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

/* Hacked-up version of Three.js orbit controls for Vizi
 * Adds mode for one-button operation and optional userMinY
 * 
 */

goog.provide('Vizi.OrbitControls');

Vizi.OrbitControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3();

	this.userZoom = true;
	this.userZoomSpeed = 1.0;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.userPan = true;
	this.userPanSpeed = 2.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;
	
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	this.oneButton = false;
	
	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};

	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	this.pan = function ( distance ) {

		distance.transformDirection( this.object.matrix );
		distance.multiplyScalar( scope.userPanSpeed );

		this.object.position.add( distance );
		this.center.add( distance );

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		position.copy( this.center ).add( offset );

		this.object.lookAt( this.center );

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;

		if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 1 / 0.95, scope.userZoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event.preventDefault();

		if ( event.button === 0 || (scope.oneButton && event.button === 2)) {

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === 1 && (scope.userZoom)) {

			state = STATE.ZOOM;

			zoomStart.set( event.clientX, event.clientY );

		} else if ( event.button === 2 && (scope.userPan)) {

			state = STATE.PAN;

		}

		scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.addEventListener( 'mouseup', onMouseUp, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchStart( event ) {
		if ( event.touches.length > 1 ) {
			scope.touchDistance = calcDistance(event.touches[0], event.touches[1]);
			scope.touchId0 = event.touches[0].identifier;
			scope.touchId1 = event.touches[1].identifier;
		}
		else {
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mousedown',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': event.touches[0].screenX,
			    'screenY': event.touches[0].screenY,
			    'clientX': event.touches[0].clientX,
			    'clientY': event.touches[0].clientY,
			    'pageX': event.touches[0].pageX,
			    'pageY': event.touches[0].pageY,
			    'button': 0,
			    'preventDefault' : function() {}
				};
			
			onMouseDown(mouseEvent);
		}
	}
		
	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.ZOOM ) {

			zoomEnd.set( event.clientX, event.clientY );
			zoomDelta.subVectors( zoomEnd, zoomStart );

			if ( zoomDelta.y > 0 ) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy( zoomEnd );

		} else if ( state === STATE.PAN ) {

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

	}

	function onTouchMove( event ) {
		if ( scope.enabled === false ) return;
		
		if ( event.changedTouches.length > 1 ) {
			var touch0 = null;
			var touch1 = null;
			for (var i = 0; i < event.changedTouches.length; i++) {
				if (event.changedTouches[i].identifier == scope.touchId0)
					touch0 = event.changedTouches[i];
				else if (event.changedTouches[i].identifier == scope.touchId1)
					touch1 = event.changedTouches[i];
					
			}
			if (touch0 && touch1 && scope.userZoom) {
				 var touchDistance = calcDistance(touch0, touch1);
				 var deltaDistance = touchDistance - scope.touchDistance;
				 if (deltaDistance > 0) {
					 scope.zoomIn();
				 }
				 else if (deltaDistance < 0) {
					 scope.zoomOut();
				 }
				 scope.touchDistance = touchDistance;
			}
		}
		else if (scope.userRotate){
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mousemove',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': event.changedTouches[0].screenX,
			    'screenY': event.changedTouches[0].screenY,
			    'clientX': event.changedTouches[0].clientX,
			    'clientY': event.changedTouches[0].clientY,
			    'pageX': event.changedTouches[0].pageX,
			    'pageY': event.changedTouches[0].pageY,
			    'button': 0,
			    'preventDefault' : function() {}
				};
			
			onMouseMove(mouseEvent);
		}
	}

	function calcDistance( touch0, touch1 ) {
		var dx = touch1.clientX - touch0.clientX;
		var dy = touch1.clientY - touch0.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );

		state = STATE.NONE;

	}

	
	function onTouchEnd( event ) {
		if ( event.changedTouches.length > 1 ) {
			// nothing to do
		}
		else {
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mouseup',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': event.changedTouches[0].screenX,
			    'screenY': event.changedTouches[0].screenY,
			    'clientX': event.changedTouches[0].clientX,
			    'clientY': event.changedTouches[0].clientY,
			    'pageX': event.changedTouches[0].pageX,
			    'pageY': event.changedTouches[0].pageY,
			    'button': 0,
			    'preventDefault' : function() {}
			};
			
			onMouseUp(mouseEvent);
		}
	}
		
	function onMouseWheel( event ) {

		event.preventDefault();
		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomIn();

		} else {

			scope.zoomOut();

		}

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userPan === false ) return;

		switch ( event.keyCode ) {

			case scope.keys.UP:
				scope.pan( new THREE.Vector3( 0, 1, 0 ) );
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector3( 0, - 1, 0 ) );
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector3( - 1, 0, 0 ) );
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector3( 1, 0, 0 ) );
				break;
		}

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'touchstart', onTouchStart, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	this.domElement.addEventListener( 'keydown', onKeyDown, false );

};

Vizi.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.require('Vizi.Graphics');
goog.provide('Vizi.GraphicsThreeJS');

Vizi.GraphicsThreeJS = function()
{
	Vizi.Graphics.call(this);
}

goog.inherits(Vizi.GraphicsThreeJS, Vizi.Graphics);

Vizi.GraphicsThreeJS.prototype.initialize = function(param)
{
	param = param || {};
	
	// call all the setup functions
	this.initOptions(param);
	this.initPageElements(param);
	this.initScene();
	this.initRenderer(param);
	this.initMouse();
	this.initKeyboard();
	this.addDomHandlers();
}

Vizi.GraphicsThreeJS.prototype.focus = function()
{
	if (this.renderer && this.renderer.domElement)
	{
		this.renderer.domElement.focus();
	}
}

Vizi.GraphicsThreeJS.prototype.initOptions = function(param)
{
	this.displayStats = (param && param.displayStats) ? 
			param.displayStats : Vizi.GraphicsThreeJS.default_display_stats;
}

Vizi.GraphicsThreeJS.prototype.initPageElements = function(param)
{
    if (param.container)
    {
    	this.container = param.container;
    }
   	else
   	{
		this.container = document.createElement( 'div' );
	    document.body.appendChild( this.container );
   	}

    this.saved_cursor = this.container.style.cursor;
    
    if (this.displayStats)
    {
    	if (window.Stats)
    	{
	        var stats = new Stats();
	        stats.domElement.style.position = 'absolute';
	        stats.domElement.style.top = '0px';
	        stats.domElement.style.left = '0px';
	        stats.domElement.style.height = '40px';
	        this.container.appendChild( stats.domElement );
	        this.stats = stats;
    	}
    	else
    	{
    		Vizi.System.warn("No Stats module found. Make sure to include stats.min.js");
    	}
    }
}

Vizi.GraphicsThreeJS.prototype.initScene = function()
{
    var scene = new THREE.Scene();

//    scene.add( new THREE.AmbientLight(0xffffff) ); //  0x505050 ) ); // 
	
    var camera = new THREE.PerspectiveCamera( 45, 
    		this.container.offsetWidth / this.container.offsetHeight, 1, 10000 );
    camera.position.copy(Vizi.Camera.DEFAULT_POSITION);

    scene.add(camera);
    
    this.scene = scene;
	this.camera = camera;
	
	this.backgroundLayer = {};
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, 
    		this.container.offsetWidth / this.container.offsetHeight, 0.01, 10000 );
    camera.position.set( 0, 0, 10 );	
    scene.add(camera);
    
    this.backgroundLayer.scene = scene;
    this.backgroundLayer.camera = camera;
}

Vizi.GraphicsThreeJS.prototype.initRenderer = function(param)
{
	var antialias = (param.antialias !== undefined) ? param.antialias : true;
	var alpha = (param.alpha !== undefined) ? param.alpha : true;
	//var devicePixelRatio = (param.devicePixelRatio !== undefined) ? param.devicePixelRatio : 1;
	
    var renderer = // Vizi.Config.USE_WEBGL ?
    	new THREE.WebGLRenderer( { antialias: antialias, 
    		alpha: alpha,
    		/*devicePixelRatio : devicePixelRatio */ } ); // :
    	// new THREE.CanvasRenderer;
    	
    renderer.sortObjects = false;
    renderer.setSize( this.container.offsetWidth, this.container.offsetHeight );

    if (param && param.backgroundColor)
    {
    	renderer.domElement.style.backgroundColor = param.backgroundColor;
    	renderer.domElement.setAttribute('z-index', -1);
    }
    
    this.container.appendChild( renderer.domElement );

    var projector = new THREE.Projector();

    this.renderer = renderer;
    this.projector = projector;

    this.lastFrameTime = 0;
    
    if (param.riftRender) {
    	  this.riftCam = new THREE.OculusRiftEffect(this.renderer);	
    }
}

Vizi.GraphicsThreeJS.prototype.initMouse = function()
{
	var dom = this.renderer.domElement;
	
	var that = this;
	dom.addEventListener( 'mousemove', 
			function(e) { that.onDocumentMouseMove(e); }, false );
	dom.addEventListener( 'mousedown', 
			function(e) { that.onDocumentMouseDown(e); }, false );
	dom.addEventListener( 'mouseup', 
			function(e) { that.onDocumentMouseUp(e); }, false ); 
 	dom.addEventListener( 'click', 
			function(e) { that.onDocumentMouseClick(e); }, false );
	dom.addEventListener( 'dblclick', 
			function(e) { that.onDocumentMouseDoubleClick(e); }, false );

	dom.addEventListener( 'mousewheel', 
			function(e) { that.onDocumentMouseScroll(e); }, false );
	dom.addEventListener( 'DOMMouseScroll', 
			function(e) { that.onDocumentMouseScroll(e); }, false );
	
	dom.addEventListener( 'touchstart', 
			function(e) { that.onDocumentTouchStart(e); }, false );
	dom.addEventListener( 'touchmove', 
			function(e) { that.onDocumentTouchMove(e); }, false );
	dom.addEventListener( 'touchend', 
			function(e) { that.onDocumentTouchEnd(e); }, false );
}

Vizi.GraphicsThreeJS.prototype.initKeyboard = function()
{
	var dom = this.renderer.domElement;
	
	var that = this;
	dom.addEventListener( 'keydown', 
			function(e) { that.onKeyDown(e); }, false );
	dom.addEventListener( 'keyup', 
			function(e) { that.onKeyUp(e); }, false );
	dom.addEventListener( 'keypress', 
			function(e) { that.onKeyPress(e); }, false );

	// so it can take focus
	dom.setAttribute("tabindex", 1);
    
}

Vizi.GraphicsThreeJS.prototype.addDomHandlers = function()
{
	var that = this;
	window.addEventListener( 'resize', function(event) { that.onWindowResize(event); }, false );
}

Vizi.GraphicsThreeJS.prototype.objectFromMouse = function(event)
{
	var eltx = event.elementX, elty = event.elementY;
	
	// translate client coords into vp x,y
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;
    
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = pos.applyMatrix4(this.camera.matrixWorld);
	
    var raycaster = new THREE.Raycaster( pos, vector.sub( pos ).normalize() );

	var intersects = raycaster.intersectObjects( this.scene.children, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(i < intersects.length && (!intersects[i].object.visible || 
    			intersects[i].object.ignorePick))
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	
    	if (i >= intersects.length)
    	{
        	return { object : null, point : null, normal : null };
    	}
    	
    	return (this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face));        	    	                             
    }
    else
    {
    	return { object : null, point : null, normal : null };
    }
}

Vizi.GraphicsThreeJS.prototype.objectFromRay = function(hierarchy, origin, direction, near, far)
{
    var raycaster = new THREE.Raycaster(origin, direction, near, far);

    var objects = null;
    if (hierarchy) {
    	objects = hierarchy.transform.object.children; 
    }
    else {
    	objects = this.scene.children;
    }
    
	var intersects = raycaster.intersectObjects( objects, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(i < intersects.length && (!intersects[i].object.visible || 
    			intersects[i].object.ignoreCollision))
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	
    	if (i >= intersects.length)
    	{
        	return { object : null, point : null, normal : null };
    	}
    	
    	return (this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face));        	    	                             
    }
    else
    {
    	return { object : null, point : null, normal : null };
    }
}


Vizi.GraphicsThreeJS.prototype.findObjectFromIntersected = function(object, point, face)
{
	if (object.data)
	{
		// The intersect point comes in as world units
		var hitPointWorld = point.clone();
		// Get the model space units for our event
		var modelMat = new THREE.Matrix4;
		modelMat.getInverse(object.matrixWorld);
		point.applyMatrix4(modelMat);
		// Use the intersected face's normal if it's there
		var normal = face ? face.normal : null
		return { object: object.data, point: point, hitPointWorld : hitPointWorld, face: face, normal: normal };
	}
	else if (object.parent)
	{
		return this.findObjectFromIntersected(object.parent, point, face);
	}
	else
	{
		return { object : null, point : null, face : null, normal : null };
	}
}

Vizi.GraphicsThreeJS.prototype.nodeFromMouse = function(event)
{
	// Blerg, this is to support code outside the SB components & picker framework
	// Returns a raw Three.js node
	
	// translate client coords into vp x,y
	var eltx = event.elementX, elty = event.elementY;
	
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;
    
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = pos.applyMatrix4(this.camera.matrixWorld);

    var raycaster = new THREE.Raycaster( pos, vector.sub( pos ).normalize() );

	var intersects = raycaster.intersectObjects( this.scene.children, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(!intersects[i].object.visible)
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	if (intersected)
    	{
    		return { node : intersected.object, 
    				 point : intersected.point, 
    				 normal : intersected.face.normal
    				}
    	}
    	else
    		return null;
    }
    else
    {
    	return null;
    }
}

Vizi.GraphicsThreeJS.prototype.getObjectIntersection = function(x, y, object)
{
	// Translate client coords into viewport x,y
	var vpx = ( x / this.renderer.domElement.offsetWidth ) * 2 - 1;
	var vpy = - ( y / this.renderer.domElement.offsetHeight ) * 2 + 1;
	
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = pos.applyMatrix4(this.camera.matrixWorld);
	
    var raycaster = new THREE.Raycaster( pos, vector.sub( pos ).normalize() );

	var intersects = raycaster.intersectObject( object, true );
	if (intersects.length)
	{
		var intersection = intersects[0];
		var modelMat = new THREE.Matrix4;
		modelMat.getInverse(intersection.object.matrixWorld);
		intersection.point.applyMatrix4(modelMat);
		return intersection;
	}
	else
		return null;
		
}

Vizi.GraphicsThreeJS.prototype.calcElementOffset = function(offset) {

	offset.left = this.renderer.domElement.offsetLeft;
	offset.top = this.renderer.domElement.offsetTop;
	
	var parent = this.renderer.domElement.offsetParent;
	while(parent) {
		offset.left += parent.offsetLeft;
		offset.top += parent.offsetTop;
		parent = parent.offsetParent;
	}
}

Vizi.GraphicsThreeJS.prototype.onDocumentMouseMove = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey };
	
    Vizi.Mouse.instance.onMouseMove(evt);
    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleMouseMove(evt);
    }
    
    Vizi.Application.handleMouseMove(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentMouseDown = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
		
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
	
    Vizi.Mouse.instance.onMouseDown(evt);
    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleMouseDown(evt);
    }
    
    Vizi.Application.handleMouseDown(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentMouseUp = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
    
    Vizi.Mouse.instance.onMouseUp(evt);
    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleMouseUp(evt);
    }	            

    Vizi.Application.handleMouseUp(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentMouseClick = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
    
    Vizi.Mouse.instance.onMouseClick(evt);
    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleMouseClick(evt);
    }	            

    Vizi.Application.handleMouseClick(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentMouseDoubleClick = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
    
    Vizi.Mouse.instance.onMouseDoubleClick(evt);
    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleMouseDoubleClick(evt);
    }	            

    Vizi.Application.handleMouseDoubleClick(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentMouseScroll = function(event)
{
    event.preventDefault();

	var delta = 0;

	if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

		delta = event.wheelDelta;

	} else if ( event.detail ) { // Firefox

		delta = - event.detail;

	}

	var evt = { type : "mousescroll", delta : delta };
    
    Vizi.Mouse.instance.onMouseScroll(evt);

    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleMouseScroll(evt);
    }
    
    Vizi.Application.handleMouseScroll(evt);
}

// Touch events
Vizi.GraphicsThreeJS.prototype.translateTouch = function(touch, offset) {

	var eltx = touch.pageX - offset.left;
	var elty = touch.pageY - offset.top;

	return {
	    'screenX': touch.screenX,
	    'screenY': touch.screenY,
	    'clientX': touch.clientX,
	    'clientY': touch.clientY,
	    'pageX': touch.pageX,
	    'pageY': touch.pageY,
	    'elementX': eltx,
	    'elementY': elty,
	}
}

Vizi.GraphicsThreeJS.prototype.onDocumentTouchStart = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);

	var touches = [];
	var i, len = event.touches.length;
	for (i = 0; i < len; i++) {
		touches.push(this.translateTouch(event.touches[i], offset));
	}

	var evt = { type : event.type, touches : touches };
	
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleTouchStart(evt);
    }
    
    Vizi.Application.handleTouchStart(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentTouchMove = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);
	
	var touches = [];
	var i, len = event.touches.length;
	for (i = 0; i < len; i++) {
		touches.push(this.translateTouch(event.touches[i], offset));
	}

	var changedTouches = [];
	var i, len = event.changedTouches.length;
	for (i = 0; i < len; i++) {
		changedTouches.push(this.translateTouch(event.changedTouches[i], offset));
	}

	var evt = { type : event.type, touches : touches, changedTouches : changedTouches };
		    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleTouchMove(evt);
    }
    
    Vizi.Application.handleTouchMove(evt);
}

Vizi.GraphicsThreeJS.prototype.onDocumentTouchEnd = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var touches = [];
	var i, len = event.touches.length;
	for (i = 0; i < len; i++) {
		touches.push(this.translateTouch(event.touches[i], offset));
	}

	var changedTouches = [];
	var i, len = event.changedTouches.length;
	for (i = 0; i < len; i++) {
		changedTouches.push(this.translateTouch(event.changedTouches[i], offset));
	}

	var evt = { type : event.type, touches : touches, changedTouches : changedTouches };
    
    if (Vizi.PickManager)
    {
    	Vizi.PickManager.handleTouchEnd(evt);
    }	            

    Vizi.Application.handleTouchEnd(evt);
}


Vizi.GraphicsThreeJS.prototype.onKeyDown = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    Vizi.Keyboard.instance.onKeyDown(event);
    
	Vizi.Application.handleKeyDown(event);
}

Vizi.GraphicsThreeJS.prototype.onKeyUp = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    Vizi.Keyboard.instance.onKeyUp(event);
    
	Vizi.Application.handleKeyUp(event);
}
	        
Vizi.GraphicsThreeJS.prototype.onKeyPress = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    Vizi.Keyboard.instance.onKeyPress(event);
    
	Vizi.Application.handleKeyPress(event);
}

Vizi.GraphicsThreeJS.prototype.onWindowResize = function(event)
{
	this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

	if (Vizi.CameraManager && Vizi.CameraManager.handleWindowResize(this.container.offsetWidth, this.container.offsetHeight))
	{		
	}
	else
	{
		this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
		this.camera.updateProjectionMatrix();
	}
}

Vizi.GraphicsThreeJS.prototype.setCursor = function(cursor)
{
	if (!cursor)
		cursor = this.saved_cursor;
	
	this.container.style.cursor = cursor;
}


Vizi.GraphicsThreeJS.prototype.update = function()
{
	// N.B.: start with hack, let's see how it goes...
	if (this.riftCam) {
	    this.riftCam.render(
	        	[ this.backgroundLayer.scene, this.scene ],
	        	[this.backgroundLayer.camera, this.camera]);

	    return;
	}
	
    this.renderer.setClearColor( 0, 0 );
	this.renderer.autoClearColor = true;
    this.renderer.render( this.backgroundLayer.scene, this.backgroundLayer.camera );
    this.renderer.setClearColor( 0, 1 );
	this.renderer.autoClearColor = false;
    this.renderer.render( this.scene, this.camera );

    var frameTime = Date.now();
    var deltat = (frameTime - this.lastFrameTime) / 1000;
    this.frameRate = 1 / deltat;

    this.lastFrameTime = frameTime;
    	
    if (this.stats)
    {
    	this.stats.update();
    }
}

Vizi.GraphicsThreeJS.prototype.enableShadows = function(enable)
{
	this.renderer.shadowMapEnabled = enable;
	this.renderer.shadowMapSoft = enable;
	this.renderer.shadowMapCullFrontFaces = false;
}

Vizi.GraphicsThreeJS.default_display_stats = false;
/**
 *
 */
goog.require('Vizi.Service');
goog.provide('Vizi.TweenService');

/**
 * The TweenService.
 *
 * @extends {Vizi.Service}
 */
Vizi.TweenService = function() {};

goog.inherits(Vizi.TweenService, Vizi.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
Vizi.TweenService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
Vizi.TweenService.prototype.terminate = function() {};


/**
 * Updates the TweenService.
 */
Vizi.TweenService.prototype.update = function()
{
	if (window.TWEEN)
		TWEEN.update();
}
/**
 * @fileoverview Service locator for various game services.
 */
goog.provide('Vizi.Services');
goog.require('Vizi.Time');
goog.require('Vizi.Input');
goog.require('Vizi.TweenService');
goog.require('Vizi.EventService');
goog.require('Vizi.GraphicsThreeJS');

Vizi.Services = {};

Vizi.Services._serviceMap = 
{ 
		"time" : { object : Vizi.Time },
		"input" : { object : Vizi.Input },
		"tween" : { object : Vizi.TweenService },
		"events" : { object : Vizi.EventService },
		"graphics" : { object : Vizi.GraphicsThreeJS },
};

Vizi.Services.create = function(serviceName)
{
	var serviceType = Vizi.Services._serviceMap[serviceName];
	if (serviceType)
	{
		var prop = serviceType.property;
		
		if (Vizi.Services[serviceName])
		{
	        throw new Error('Cannot create two ' + serviceName + ' service instances');
		}
		else
		{
			if (serviceType.object)
			{
				var service = new serviceType.object;
				Vizi.Services[serviceName] = service;

				return service;
			}
			else
			{
		        throw new Error('No object type supplied for creating service ' + serviceName + '; cannot create');
			}
		}
	}
	else
	{
        throw new Error('Unknown service: ' + serviceName + '; cannot create');
	}
}

Vizi.Services.registerService = function(serviceName, object)
{
	if (Vizi.Services._serviceMap[serviceName])
	{
        throw new Error('Service ' + serviceName + 'already registered; cannot register twice');
	}
	else
	{
		var serviceType = { object: object };
		Vizi.Services._serviceMap[serviceName] = serviceType;
	}
}/**
 * @fileoverview The base Application class
 * 
 * @author Tony Parisi
 */
goog.provide('Vizi.Application');
goog.require('Vizi.EventDispatcher');
goog.require('Vizi.Time');
goog.require('Vizi.Input');
goog.require('Vizi.Services');

/**
 * @constructor
 */
Vizi.Application = function(param)
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	Vizi.EventDispatcher.call(this);
	Vizi.Application.instance = this;
	this.initialize(param);
}

goog.inherits(Vizi.Application, Vizi.EventDispatcher);

Vizi.Application.prototype.initialize = function(param)
{
	param = param || {};

	this.running = false;
	this.tabstop = param.tabstop;
	
	this._services = [];
	this._objects = [];

	// Add required services first
	this.addService("time");
	this.addService("input");
	
	// Add optional (game-defined) services next
	this.addOptionalServices();

	// Add events and rendering services last - got to;
	this.addService("tween");
	this.addService("events");
	this.addService("graphics");
	
	// Start all the services
	this.initServices(param);
}

Vizi.Application.prototype.addService = function(serviceName)
{
	var service = Vizi.Services.create(serviceName);
	this._services.push(service);	
}

Vizi.Application.prototype.initServices = function(param)
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].initialize(param);
	}
}

Vizi.Application.prototype.addOptionalServices = function()
{
}

Vizi.Application.prototype.focus = function()
{
	// Hack hack hack should be the input system
	Vizi.Graphics.instance.focus();
}

Vizi.Application.prototype.run = function()
{
    // core game loop here
	this.realizeObjects();
	this.lastFrameTime = Date.now();
	this.running = true;
	this.runloop();
}
	        
Vizi.Application.prototype.runloop = function()
{
	var now = Date.now();
	var deltat = now - this.lastFrameTime;
	
	if (deltat >= Vizi.Application.minFrameTime)
	{
		this.updateServices();
        this.lastFrameTime = now;
	}
	
	var that = this;
    requestAnimationFrame( function() { that.runloop(); } );
}

Vizi.Application.prototype.updateServices = function()
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].update();
	}
}

Vizi.Application.prototype.updateObjects = function()
{
	var i, len = this._objects.length;
	
	for (i = 0; i < len; i++)
	{
		this._objects[i].update();
	}
	
}

Vizi.Application.prototype.addObject = function(o)
{
	this._objects.push(o);
	if (this.running) {
		o.realize();
	}
}

Vizi.Application.prototype.removeObject = function(o) {
    var i = this._objects.indexOf(o);
    if (i != -1) {
    	// N.B.: I suppose we could be paranoid and check to see if I actually own this component
        this._objects.splice(i, 1);
    }
}

Vizi.Application.prototype.realizeObjects = function()
{
	var i, len = this._objects.length;
	
	for (i = 0; i < len; i++)
	{
		this._objects[i].realize();
	}
	
}
	
Vizi.Application.prototype.onMouseMove = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseMove)
	{
		this.mouseDelegate.onMouseMove(event);
	}
}

Vizi.Application.prototype.onMouseDown = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDown)
	{
		this.mouseDelegate.onMouseDown(event);
	}
}

Vizi.Application.prototype.onMouseUp = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseUp)
	{
		this.mouseDelegate.onMouseUp(event);
	}
}

Vizi.Application.prototype.onMouseClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseClick)
	{
		this.mouseDelegate.onMouseClick(event);
	}
}

Vizi.Application.prototype.onMouseDoubleClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDoubleClick)
	{
		this.mouseDelegate.onMouseDoubleClick(event);
	}
}

Vizi.Application.prototype.onMouseScroll = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseScroll)
	{
		this.mouseDelegate.onMouseScroll(event);
	}
}

Vizi.Application.prototype.onKeyDown = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyDown)
	{
		this.keyboardDelegate.onKeyDown(event);
	}
}

Vizi.Application.prototype.onKeyUp = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyUp)
	{
		this.keyboardDelegate.onKeyUp(event);
	}
}

Vizi.Application.prototype.onKeyPress = function(event)
{
	if (this.keyboardDelegate  && this.keyboardDelegate.onKeyPress)
	{
		this.keyboardDelegate.onKeyPress(event);
	}
}	

/* statics */

Vizi.Application.instance = null;
Vizi.Application.curObjectID = 0;
Vizi.Application.minFrameTime = 1;
	    	
Vizi.Application.handleMouseMove = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onMouseMove)
    	Vizi.Application.instance.onMouseMove(event);	            	
}

Vizi.Application.handleMouseDown = function(event)
{
    // Click to focus
    if (Vizi.Application.instance.tabstop)
    	Vizi.Application.instance.focus();
        
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onMouseDown)
    	Vizi.Application.instance.onMouseDown(event);	            	
}

Vizi.Application.handleMouseUp = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onMouseUp)
    	Vizi.Application.instance.onMouseUp(event);	            	
}

Vizi.Application.handleMouseClick = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onMouseClick)
    	Vizi.Application.instance.onMouseClick(event);	            	
}

Vizi.Application.handleMouseDoubleClick = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onMouseDoubleClick)
    	Vizi.Application.instance.onMouseDoubleClick(event);	            	
}

Vizi.Application.handleMouseScroll = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.overObject)
    	return;
    
    if (Vizi.Application.instance.onMouseScroll)
    	Vizi.Application.instance.onMouseScroll(event);	            	
}

Vizi.Application.handleTouchStart = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onTouchStart)
    	Vizi.Application.instance.onTouchStart(event);	            	
}

Vizi.Application.handleTouchMove = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onTouchMove)
    	Vizi.Application.instance.onTouchMove(event);	            	
}

Vizi.Application.handleTouchEnd = function(event)
{
    if (Vizi.PickManager && Vizi.PickManager.clickedObject)
    	return;
    
    if (Vizi.Application.instance.onTouchEnd)
    	Vizi.Application.instance.onTouchEnd(event);	            	
}

Vizi.Application.handleKeyDown = function(event)
{
    if (Vizi.Application.instance.onKeyDown)
    	Vizi.Application.instance.onKeyDown(event);	            	
}

Vizi.Application.handleKeyUp = function(event)
{
    if (Vizi.Application.instance.onKeyUp)
    	Vizi.Application.instance.onKeyUp(event);	            	
}

Vizi.Application.handleKeyPress = function(event)
{
    if (Vizi.Application.instance.onKeyPress)
    	Vizi.Application.instance.onKeyPress(event);	            	
}

Vizi.Application.prototype.onTouchMove = function(event)
{
	if (this.touchDelegate  && this.touchDelegate.onTouchMove)
	{
		this.touchDelegate.onTouchMove(event);
	}
}

Vizi.Application.prototype.onTouchStart = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchStart)
	{
		this.touchDelegate.onTouchStart(event);
	}
}

Vizi.Application.prototype.onTouchEnd = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchEnd)
	{
		this.touchDelegate.onTouchEnd(event);
	}
}

/**
 *
 */
goog.require('Vizi.Service');
goog.provide('Vizi.AnimationService');

/**
 * The AnimationService.
 *
 * @extends {Vizi.Service}
 */
Vizi.AnimationService = function() {};

goog.inherits(Vizi.AnimationService, Vizi.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
Vizi.AnimationService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
Vizi.AnimationService.prototype.terminate = function() {};


/**
 * Updates the AnimationService.
 */
Vizi.AnimationService.prototype.update = function()
{
	if (window.TWEEN)
		THREE.glTFAnimator.update();
}
goog.require('Vizi.Prefabs');

Vizi.Prefabs.ModelController = function(param)
{
	param = param || {};
	
	var controller = new Vizi.Object(param);
	var controllerScript = new Vizi.ModelControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new Vizi.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('Vizi.ModelControllerScript');
goog.require('Vizi.Script');

Vizi.ModelControllerScript = function(param)
{
	Vizi.Script.call(this, param);

	this.radius = param.radius || Vizi.ModelControllerScript.default_radius;
	this.minRadius = param.minRadius || Vizi.ModelControllerScript.default_min_radius;
	this.minAngle = (param.minAngle !== undefined) ? param.minAngle : 
		Vizi.ModelControllerScript.default_min_angle;
	this.maxAngle = (param.maxAngle !== undefined) ? param.maxAngle : 
		Vizi.ModelControllerScript.default_max_angle;
	this.minDistance = (param.minDistance !== undefined) ? param.minDistance : 
		Vizi.ModelControllerScript.default_min_distance;
	this.maxDistance = (param.maxDistance !== undefined) ? param.maxDistance : 
		Vizi.ModelControllerScript.default_max_distance;
	this.allowPan = (param.allowPan !== undefined) ? param.allowPan : true;
	this.allowZoom = (param.allowZoom !== undefined) ? param.allowZoom : true;
	this.allowRotate = (param.allowRotate !== undefined) ? param.allowRotate : true;
	this.oneButton = (param.oneButton !== undefined) ? param.oneButton : true;
	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._headlightOn = param.headlight;
	this.cameras = [];
	this.controlsList = [];
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	center : {
    		get: function() {
    			return this.controls.center;
    		},
    		set: function(c) {
    			this.controls.center.copy(c);
    		}
    	},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
        headlightOn: {
	        get: function() {
	            return this._headlightOn;
	        },
	        set:function(v)
	        {
	        	this.setHeadlightOn(v);
	        }
    	},
    });
}

goog.inherits(Vizi.ModelControllerScript, Vizi.Script);

Vizi.ModelControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(Vizi.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

Vizi.ModelControllerScript.prototype.createControls = function(camera)
{
	var controls = new Vizi.OrbitControls(camera.object, Vizi.Graphics.instance.container);
	controls.userMinY = this.minY;
	controls.userMinZoom = this.minZoom;
	controls.userMaxZoom = this.maxZoom;
	controls.minPolarAngle = this.minAngle;
	controls.maxPolarAngle = this.maxAngle;	
	controls.minDistance = this.minDistance;	
	controls.maxDistance = this.maxDistance;	
	controls.oneButton = this.oneButton;
	controls.userPan = this.allowPan;
	controls.userZoom = this.allowZoom;
	controls.userRotate = this.allowRotate;
	controls.enabled = this._enabled;
	return controls;
}

Vizi.ModelControllerScript.prototype.update = function()
{
	this.controls.update();
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

Vizi.ModelControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this._camera.position.set(0, this.radius / 2, this.radius);
	this.controls = this.createControls(camera);
}

Vizi.ModelControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

Vizi.ModelControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

Vizi.ModelControllerScript.default_radius = 10;
Vizi.ModelControllerScript.default_min_radius = 1;
Vizi.ModelControllerScript.default_min_angle = 0;
Vizi.ModelControllerScript.default_max_angle = Math.PI;
Vizi.ModelControllerScript.default_min_distance = 0;
Vizi.ModelControllerScript.default_max_distance = Infinity;
Vizi.ModelControllerScript.MAX_X_ROTATION = 0; // Math.PI / 12;
Vizi.ModelControllerScript.MIN_X_ROTATION = -Math.PI / 2;
Vizi.ModelControllerScript.MAX_Y_ROTATION = Math.PI * 2;
Vizi.ModelControllerScript.MIN_Y_ROTATION = -Math.PI * 2;
/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('Vizi.Prefabs');

Vizi.Prefabs.Skybox = function(param)
{
	param = param || {};
	
	var box = new Vizi.Object({layer:Vizi.Graphics.instance.backgroundLayer});

	var textureCube = null;

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		side: THREE.BackSide

	} );

	var visual = new Vizi.Visual(
			{ geometry: new THREE.CubeGeometry( 10000, 10000, 10000 ),
				material: material,
			});
	box.addComponent(visual);
	
	var script = new Vizi.SkyboxScript(param);
	box.addComponent(script);
	
	box.realize();

	return box;
}

goog.provide('Vizi.SkyboxScript');
goog.require('Vizi.Script');

Vizi.SkyboxScript = function(param)
{
	Vizi.Script.call(this, param);

	this.maincampos = new THREE.Vector3; 
	this.maincamrot = new THREE.Quaternion; 
	this.maincamscale = new THREE.Vector3; 
	
    Object.defineProperties(this, {
    	texture: {
			get : function() {
				return this.uniforms[ "tCube" ].value;
			},
			set: function(texture) {
				this.uniforms[ "tCube" ].value = texture;
			}
		},
    });
}

goog.inherits(Vizi.SkyboxScript, Vizi.Script);

Vizi.SkyboxScript.prototype.realize = function()
{
	var visual = this._object.getComponent(Vizi.Visual);
	this.uniforms = visual.material.uniforms;

	this.camera = Vizi.Graphics.instance.backgroundLayer.camera;
	this.camera.far = 20000;
	this.camera.position.set(0, 0, 0);
}

Vizi.SkyboxScript.prototype.update = function()
{
	var maincam = Vizi.Graphics.instance.camera;
	maincam.updateMatrixWorld();
	maincam.matrixWorld.decompose(this.maincampos, this.maincamrot, this.maincamscale);
	this.camera.quaternion.copy(this.maincamrot);
}

/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('Vizi.Prefabs');

Vizi.Prefabs.Skysphere = function(param)
{
	param = param || {};
	
	var sphere = new Vizi.Object({layer:Vizi.Graphics.instance.backgroundLayer});

	var material = new THREE.MeshBasicMaterial( {
		color:0xffffff,
//		side: THREE.BackSide

	} );

	var geometry = new THREE.SphereGeometry( 500, 32, 32 );
	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
	var visual = new Vizi.Visual(
			{ geometry: geometry,
				material: material,
			});
	sphere.addComponent(visual);
	
	var script = new Vizi.SkysphereScript(param);
	sphere.addComponent(script);
	
	sphere.realize();

	return sphere;
}

goog.provide('Vizi.SkysphereScript');
goog.require('Vizi.Script');

Vizi.SkysphereScript = function(param)
{
	Vizi.Script.call(this, param);

	this.maincampos = new THREE.Vector3; 
	this.maincamrot = new THREE.Quaternion; 
	this.maincamscale = new THREE.Vector3; 
	
    Object.defineProperties(this, {
    	texture: {
			get : function() {
				return this.material.map;
			},
			set: function(texture) {
				this.material.map = texture;
			}
		},
    });
}

goog.inherits(Vizi.SkysphereScript, Vizi.Script);

Vizi.SkysphereScript.prototype.realize = function()
{
	var visual = this._object.getComponent(Vizi.Visual);
	this.material = visual.material;

	this.camera = Vizi.Graphics.instance.backgroundLayer.camera;
	this.camera.far = 20000;
	this.camera.position.set(0, 0, 0);
}

Vizi.SkysphereScript.prototype.update = function()
{
	var maincam = Vizi.Graphics.instance.camera;
	maincam.updateMatrixWorld();
	maincam.matrixWorld.decompose(this.maincampos, this.maincamrot, this.maincamscale);
	this.camera.quaternion.copy(this.maincamrot);
}

/**
 * @fileoverview General-purpose key frame animation
 * @author Tony Parisi
 */
goog.provide('Vizi.KeyFrameAnimator');
goog.require('Vizi.Component');

// KeyFrameAnimator class
// Construction/initialization
Vizi.KeyFrameAnimator = function(param) 
{
    Vizi.Component.call(this, param);
	    		
	param = param || {};
	
	this.interpdata = param.interps || [];
	this.animationData = param.animations;
	this.running = false;
	this.direction = Vizi.KeyFrameAnimator.FORWARD_DIRECTION;
	this.duration = param.duration ? param.duration : Vizi.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.easing = param.easing;
}

goog.inherits(Vizi.KeyFrameAnimator, Vizi.Component);
	
Vizi.KeyFrameAnimator.prototype.realize = function()
{
	Vizi.Component.prototype.realize.call(this);
	
	if (this.interpdata)
	{
		this.createInterpolators(this.interpdata);
	}
	
	if (this.animationData)
	{
		this.animations = [];
		var i, len = this.animationData.length;
		for (i = 0; i < len; i++)
		{				
			var animdata = this.animationData[i];
			if (animdata instanceof THREE.glTFAnimation) {
				this.animations.push(animdata);
			}
			else {
				
				THREE.AnimationHandler.add(animdata);
				var animation = new THREE.KeyFrameAnimation(animdata.node, animdata.name);
//			animation.timeScale = .01; // why?
				this.animations.push(animation);
			}
		}
	}
}

Vizi.KeyFrameAnimator.prototype.createInterpolators = function(interpdata)
{
	this.interps = [];
	
	var i, len = interpdata.length;
	for (i = 0; i < len; i++)
	{
		var data = interpdata[i];
		var interp = new Vizi.Interpolator({ keys: data.keys, values: data.values, target: data.target });
		interp.realize();
		this.interps.push(interp);
	}
}

// Start/stop
Vizi.KeyFrameAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.lastTime = this.startTime;
	this.running = true;
	
	if (this.animations)
	{
		var i, len = this.animations.length;
		for (i = 0; i < len; i++)
		{
			this.animations[i].loop = this.loop;
			if (this.animations[i] instanceof THREE.glTFAnimation) {
				this.animations[i].direction = 
					(this.direction == Vizi.KeyFrameAnimator.FORWARD_DIRECTION) ?
						THREE.glTFAnimation.FORWARD_DIRECTION : 
						THREE.glTFAnimation.REVERSE_DIRECTION;
			}
			this.animations[i].play(this.loop, 0);
			this.endTime = this.startTime + this.animations[i].endTime / this.animations[i].timeScale;
			if (isNaN(this.endTime))
				this.endTime = this.startTime + this.animations[i].duration * 1000;
		}
	}
}

Vizi.KeyFrameAnimator.prototype.stop = function()
{
	this.running = false;
	this.dispatchEvent("complete");

	if (this.animations)
	{
		var i, len = this.animations.length;
		for (i = 0; i < len; i++)
		{
			this.animations[i].stop();
		}
	}

}

// Update - drive key frame evaluation
Vizi.KeyFrameAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	if (this.animations)
	{
		this.updateAnimations();
		return;
	}
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;
	if (this.easing)
		fract = this.easing(fract);

	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		this.dispatchEvent("complete");
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(1);
		}
		return;
	}
	else
	{
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(fract);
		}
	}
}

Vizi.KeyFrameAnimator.prototype.updateAnimations = function()
{
	var now = Date.now();
	var deltat = now - this.lastTime;
	var complete = false;
	
	var i, len = this.animations.length;
	for (i = 0; i < len; i++)
	{
		this.animations[i].update(deltat);
		if (!this.loop && (now >= this.endTime))
			complete = true;
	}
	this.lastTime = now;	
	
	if (complete)
	{
		this.stop();
	}
}

// Statics
Vizi.KeyFrameAnimator.default_duration = 1000;
Vizi.KeyFrameAnimator.FORWARD_DIRECTION = 0;
Vizi.KeyFrameAnimator.REVERSE_DIRECTION = 1;
goog.require('Vizi.Prefabs');

Vizi.Prefabs.RiftController = function(param)
{
	param = param || {};
	
	var controller = new Vizi.Object(param);
	var controllerScript = new Vizi.RiftControllerScript(param);
	controller.addComponent(controllerScript);
	
	return controller;
}

goog.provide('Vizi.RiftControllerScript');
goog.require('Vizi.Script');

Vizi.RiftControllerScript = function(param)
{
	Vizi.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this.oculusBridge = null;
	this.riftControls = null;
	this.useVRJS = (param.useVRJS !== undefined) ? param.useVRJS : false;
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
    });
}

goog.inherits(Vizi.RiftControllerScript, Vizi.Script);

Vizi.RiftControllerScript.prototype.realize = function()
{
	this.bodyAngle     = 0;
	this.bodyAxis      = new THREE.Vector3(0, 1, 0);
	this.bodyPosition  = new THREE.Vector3(0, 15, 0);
	this.velocity      = new THREE.Vector3();

	var that = this;
	if (this.useVRJS) {
		this.vrstate = null;
		vr.load(function() {
			that.vrstate = new vr.State();
		});
	}
	else {
		var bridgeOrientationUpdated = function(quatValues) {
			that.bridgeOrientationUpdated(quatValues);
		}
		var bridgeConfigUpdated = function(quatValues) {
			that.bridgeConfigUpdated(quatValues);
		}
		var bridgeConnected = function(quatValues) {
			that.bridgeConnected(quatValues);
		}
		var bridgeDisconnected = function(quatValues) {
			that.bridgeDisconnected(quatValues);
		}
		
		this.oculusBridge = new OculusBridge({
			"debug" : true,
			"onOrientationUpdate" : bridgeOrientationUpdated,
			"onConfigUpdate"      : bridgeConfigUpdated,
			"onConnect"           : bridgeConnected,
			"onDisconnect"        : bridgeDisconnected
		});
		
		this.oculusBridge.connect();
	}	
}

Vizi.RiftControllerScript.prototype.update = function()
{
	if (this._enabled) {
		if (this.useVRJS) {
			if (this.vrstate) {
				var polled = vr.pollState(this.vrstate);
				this.riftControls.update(this.clock.getDelta(), polled ? this.vrstate : null );
			}
		}
	}
}

Vizi.RiftControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
}

Vizi.RiftControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	if (this.useVRJS) {
		this.riftControls = this.createControls(camera);
	}
}

Vizi.RiftControllerScript.prototype.createControls = function(camera)
{
	var controls = new Vizi.OculusRiftControls(camera.object);

	this.clock = new THREE.Clock();
	return controls;
}

Vizi.RiftControllerScript.prototype.bridgeOrientationUpdated = function(quatValues) {

	// Do first-person style controls (like the Tuscany demo) using the rift and keyboard.

	// TODO: Don't instantiate new objects in here, these should be re-used to avoid garbage collection.

	// make a quaternion for the the body angle rotated about the Y axis.
	var quat = new THREE.Quaternion();
	quat.setFromAxisAngle(this.bodyAxis, this.bodyAngle);

	// make a quaternion for the current orientation of the Rift
	var quatCam = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

	// multiply the body rotation by the Rift rotation.
	quat.multiply(quatCam);

	// Make a vector pointing along the Z axis and rotate it accoring to the combined look/body angle.
	var xzVector = new THREE.Vector3(0, 0, 1);
	xzVector.applyQuaternion(quat);

	// Compute the X/Z angle based on the combined look/body angle.  This will be used for FPS style movement controls
	// so you can steer with a combination of the keyboard and by moving your head.
	viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

	// Apply the combined look/body angle to the camera.
	this._camera.quaternion.copy(quat);
	
//	console.log("quat", quat);
}

Vizi.RiftControllerScript.prototype.bridgeConnected = function() {
//  document.getElementById("logo").className = "";
}

Vizi.RiftControllerScript.prototype.bridgeDisconnected = function() {
//  document.getElementById("logo").className = "offline";
}

Vizi.RiftControllerScript.prototype.bridgeConfigUpdated = function(config) {
// console.log("Oculus config updated.");
// riftCam.setHMD(config);      
}

/**
 * @fileoverview Interpolator for key frame animation
 * @author Tony Parisi
 */
goog.provide('Vizi.Interpolator');
goog.require('Vizi.EventDispatcher');

//Interpolator class
//Construction/initialization
Vizi.Interpolator = function(param) 
{
	Vizi.EventDispatcher.call(param);
	    		
	param = param || {};
	
	this.keys = param.keys || [];
	this.values = param.values || [];
	this.target = param.target ? param.target : null;
	this.running = false;
}

goog.inherits(Vizi.Interpolator, Vizi.EventDispatcher);
	
Vizi.Interpolator.prototype.realize = function()
{
	if (this.keys && this.values)
	{
		this.setValue(this.keys, this.values);
	}	    		
}

Vizi.Interpolator.prototype.setValue = function(keys, values)
{
	this.keys = [];
	this.values = [];
	if (keys && keys.length && values && values.length)
	{
		this.copyKeys(keys, this.keys);
		this.copyValues(values, this.values);
	}
}

//Copying helper functions
Vizi.Interpolator.prototype.copyKeys = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		to[i] = from[i];
	}
}

Vizi.Interpolator.prototype.copyValues = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		var val = {};
		this.copyValue(from[i], val);
		to[i] = val;
	}
}

Vizi.Interpolator.prototype.copyValue = function(from, to)
{
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		to[ property ] = from[ property ];
	}
}

//Interpolation and tweening methods
Vizi.Interpolator.prototype.interp = function(fract)
{
	var value;
	var i, len = this.keys.length;
	if (fract == this.keys[0])
	{
		value = this.values[0];
	}
	else if (fract >= this.keys[len - 1])
	{
		value = this.values[len - 1];
	}

	for (i = 0; i < len - 1; i++)
	{
		var key1 = this.keys[i];
		var key2 = this.keys[i + 1];

		if (fract >= key1 && fract <= key2)
		{
			var val1 = this.values[i];
			var val2 = this.values[i + 1];
			value = this.tween(val1, val2, (fract - key1) / (key2 - key1));
		}
	}
	
	if (this.target)
	{
		this.copyValue(value, this.target);
	}
	else
	{
		this.publish("value", value);
	}
}

Vizi.Interpolator.prototype.tween = function(from, to, fract)
{
	var value = {};
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		var range = to[property] - from[property];
		var delta = range * fract;
		value[ property ] = from[ property ] + delta;
	}
	
	return value;
}

goog.require('Vizi.Prefabs');

Vizi.Prefabs.PointerLockController = function(param)
{
	param = param || {};
	
	var controller = new Vizi.Object(param);
	var controllerScript = new Vizi.PointerLockControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new Vizi.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('Vizi.PointerLockControllerScript');
goog.require('Vizi.Script');

Vizi.PointerLockControllerScript = function(param)
{
	Vizi.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._move = (param.move !== undefined) ? param.move : true;
	this._look = (param.look !== undefined) ? param.look : true;
	this._turn = (param.turn !== undefined) ? param.turn : true;
	this._tilt = (param.tilt !== undefined) ? param.tilt : true;
	this._mouseLook = (param.mouseLook !== undefined) ? param.mouseLook : false;
	
	this.collisionDistance = 10;
	this.moveSpeed = 13;
	this.turnSpeed = 5;
	this.tiltSpeed = 5;
	this.lookSpeed = 1;
	
	this.savedCameraPos = new THREE.Vector3;	
	this.movementVector = new THREE.Vector3;
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
    	move : {
    		get: function() {
    			return this._move;
    		},
    		set: function(v) {
    			this.setMove(v);
    		}
    	},
    	look : {
    		get: function() {
    			return this._look;
    		},
    		set: function(v) {
    			this.setLook(v);
    		}
    	},
    	mouseLook : {
    		get: function() {
    			return this._mouseLook;
    		},
    		set: function(v) {
    			this.setMouseLook(v);
    		}
    	},
        headlightOn: {
	        get: function() {
	            return this._headlightOn;
	        },
	        set:function(v)
	        {
	        	this.setHeadlightOn(v);
	        }
    	},
    });
}

goog.inherits(Vizi.PointerLockControllerScript, Vizi.Script);

Vizi.PointerLockControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(Vizi.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

Vizi.PointerLockControllerScript.prototype.createControls = function(camera)
{
	var controls = new Vizi.PointerLockControls(camera.object, Vizi.Graphics.instance.container);
	controls.mouseLook = this._mouseLook;
	controls.movementSpeed = this._move ? this.moveSpeed : 0;
	controls.lookSpeed = this._look ? this.lookSpeed  : 0;
	controls.turnSpeed = this._turn ? this.turnSpeed : 0;
	controls.tiltSpeed = this._tilt ? this.tiltSpeed : 0;

	this.clock = new THREE.Clock();
	return controls;
}

Vizi.PointerLockControllerScript.prototype.update = function()
{
	this.saveCamera();
	this.controls.update(this.clock.getDelta());
	var collide = this.testCollision();
	if (collide && collide.object) {
		this.restoreCamera();
		this.dispatchEvent("collide", collide);
	}
	
	if (this.testTerrain()) {
		this.restoreCamera();
	}
	
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

Vizi.PointerLockControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

Vizi.PointerLockControllerScript.prototype.setMove = function(move)
{
	this._move = move;
	this.controls.movementSpeed = move ? this.moveSpeed : 0;
}

Vizi.PointerLockControllerScript.prototype.setLook = function(look)
{
	this._look = look;
	this.controls.lookSpeed = look ? 1.0 : 0;
}

Vizi.PointerLockControllerScript.prototype.setMouseLook = function(mouseLook)
{
	this._mouseLook = mouseLook;
	this.controls.mouseLook = mouseLook;
}

Vizi.PointerLockControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
	this.controls.movementSpeed = this.moveSpeed;
	this.controls.lookSpeed = this._look ?  0.1 : 0;

}

Vizi.PointerLockControllerScript.prototype.saveCamera = function() {
	this.savedCameraPos.copy(this._camera.position);
}

Vizi.PointerLockControllerScript.prototype.restoreCamera = function() {
	this._camera.position.copy(this.savedCameraPos);
}

Vizi.PointerLockControllerScript.prototype.testCollision = function() {
	
	this.movementVector.copy(this._camera.position).sub(this.savedCameraPos);
	if (this.movementVector.length()) {
		
        var collide = Vizi.Graphics.instance.objectFromRay(null, 
        		this.savedCameraPos,
        		this.movementVector, 1, 2);

        if (collide && collide.object) {
        	var dist = this.savedCameraPos.distanceTo(collide.hitPointWorld);
        }
        
        return collide;
	}
	
	return null;
}

Vizi.PointerLockControllerScript.prototype.testTerrain = function() {
	return false;
}

Vizi.PointerLockControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

goog.provide('Vizi.PerspectiveCamera');
goog.require('Vizi.Camera');

Vizi.PerspectiveCamera = function(param) {
	param = param || {};
	
	if (param.object) {
		this.object = param.object;
	}
	else {		
		var fov = param.fov || 45;
		var near = param.near || Vizi.Camera.DEFAULT_NEAR;
		var far = param.far || Vizi.Camera.DEFAULT_FAR;
		var container = Vizi.Graphics.instance.container;
		var aspect = param.aspect || (container.offsetWidth / container.offsetHeight);
		this.updateProjection = false;
		
		this.object = new THREE.PerspectiveCamera( fov, aspect, near, far );
	}
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        fov: {
	        get: function() {
	            return this.object.fov;
	        },
	        set: function(v) {
	        	this.object.fov = v;
	        	this.updateProjection = true;
	        }
		},    	
        aspect: {
	        get: function() {
	            return this.object.aspect;
	        },
	        set: function(v) {
	        	this.object.aspect = v;
	        	this.updateProjection = true;
	        }
    	},    	
        near: {
	        get: function() {
	            return this.object.near;
	        },
	        set: function(v) {
	        	this.object.near = v;
	        	this.updateProjection = true;
	        }
    	},    	
        far: {
	        get: function() {
	            return this.object.far;
	        },
	        set: function(v) {
	        	this.object.far = v;
	        	this.updateProjection = true;
	        }
    	},    	

    });

	Vizi.Camera.call(this, param);
	
    
}

goog.inherits(Vizi.PerspectiveCamera, Vizi.Camera);

Vizi.PerspectiveCamera.prototype.realize = function()  {
	Vizi.Camera.prototype.realize.call(this);	
}

Vizi.PerspectiveCamera.prototype.update = function()  {
	if (this.updateProjection)
	{
		this.object.updateProjectionMatrix();
		this.updateProjection = false;
	}
}
/**
 * @fileoverview Contains prefab assemblies for core Vizi package
 * @author Tony Parisi
 */
goog.provide('Vizi.Helpers');

Vizi.Helpers.BoundingBoxDecoration = function(param) {
	param = param || {};
	if (!param.object) {
		Vizi.warn("Vizi.Helpers.BoundingBoxDecoration requires an object");
		return null;
	}
	
	var object = param.object;
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var bbox = Vizi.SceneUtils.computeBoundingBox(object);
	
	var width = bbox.max.x - bbox.min.x,
		height = bbox.max.y - bbox.min.y,
		depth = bbox.max.z - bbox.min.z;
	
	var mesh = new THREE.BoxHelper();
	mesh.material.color.setHex(color);
	mesh.scale.set(width / 2, height / 2, depth / 2);
	
	var decoration = new Vizi.Decoration({object:mesh});
	
	var center = bbox.max.clone().add(bbox.min).multiplyScalar(0.5);
	decoration.position.add(center);
	
	return decoration;
}

Vizi.Helpers.VectorDecoration = function(param) {

	param = param || {};
	
	var start = param.start || new THREE.Vector3;
	var end = param.end || new THREE.Vector3(0, 1, 0);
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var linegeom = new THREE.Geometry();
	linegeom.vertices.push(start, end); 

	var mat = new THREE.LineBasicMaterial({color:color});

	var mesh = new THREE.Line(linegeom, mat);
	
	var decoration = new Vizi.Decoration({object:mesh});
	return decoration;
}

Vizi.Helpers.PlaneDecoration = function(param) {

	param = param || {};
	
	if (!param.normal && !param.triangle) {
		Vizi.warn("Vizi.Helpers.PlaneDecoration requires either a normal or three coplanar points");
		return null;
	}

	var normal = param.normal;
	if (!normal) {
		// do this later
		Vizi.warn("Vizi.Helpers.PlaneDecoration creating plane from coplanar points not implemented yet");
		return null;
	}
	
	var position = param.position || new THREE.Vector3;	
	var size = param.size || 1;
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var u = new THREE.Vector3(0, normal.z, -normal.y).normalize().multiplyScalar(size);
	var v = u.clone().cross(normal).normalize().multiplyScalar(size);
	
	var p1 = position.clone().sub(u).sub(v);
	var p2 = position.clone().add(u).sub(v);
	var p3 = position.clone().add(u).add(v);
	var p4 = position.clone().sub(u).add(v);
	
	var planegeom = new THREE.Geometry();
	planegeom.vertices.push(p1, p2, p3, p4); 
	var planeface = new THREE.Face3( 0, 1, 2 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	var planeface = new THREE.Face3( 0, 2, 3 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	planegeom.computeFaceNormals();
	planegeom.computeCentroids();

	var mat = new THREE.MeshBasicMaterial({color:color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	var decoration = new Vizi.Decoration({object:mesh});
	return decoration;
}

/**
 * @fileoverview Vizi scene utilities
 * @author Tony Parisi
 */
goog.provide('Vizi.SceneUtils');

// Compute the bounding box of an object or hierarchy of objects
Vizi.SceneUtils.computeBoundingBox = function(obj) {
	
	var computeBoundingBox = function(obj) {
		if (obj instanceof THREE.Mesh && !obj.ignoreBounds) {
			var geometry = obj.geometry;
			if (geometry) {
				if (!geometry.boundingBox) {
					geometry.computeBoundingBox();
				}
				
				var geometryBBox = geometry.boundingBox.clone();
				obj.updateMatrix();
				geometryBBox.applyMatrix4(obj.matrix);
				return geometryBBox;
			}
			else {
				return new THREE.Box3(new THREE.Vector3, new THREE.Vector3);
			}
		}
		else {
			var i, len = obj.children.length;
			
			var boundingBox = new THREE.Box3; // (new THREE.Vector3, new THREE.Vector3);
			
			for (i = 0; i < len; i++) {
				var bbox = computeBoundingBox(obj.children[i]);
				if ( bbox.min.x < boundingBox.min.x ) {

					boundingBox.min.x = bbox.min.x;

				}
				
				if ( bbox.max.x > boundingBox.max.x ) {

					boundingBox.max.x = bbox.max.x;

				}

				if ( bbox.min.y < boundingBox.min.y ) {

					boundingBox.min.y = bbox.min.y;

				}
				
				if ( bbox.max.y > boundingBox.max.y ) {

					boundingBox.max.y = bbox.max.y;

				}

				if ( bbox.min.z < boundingBox.min.z ) {

					boundingBox.min.z = bbox.min.z;

				}
				
				if ( bbox.max.z > boundingBox.max.z ) {

					boundingBox.max.z = bbox.max.z;

				}
			}

			if (isFinite(boundingBox.min.x)) {
				obj.updateMatrix();
				boundingBox.applyMatrix4(obj.matrix);
			}
			return boundingBox;
		}
	}
	
	if (obj instanceof Vizi.Object) {
		return computeBoundingBox(obj.transform.object);
	}
	else if (obj instanceof Vizi.Visual) {
		return computeBoundingBox(obj.object);
	}
	else {
		return new THREE.Box3(new THREE.Vector3, new THREE.Vector3);
	}
}


/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Based on THREE.PointerLockControls by mrdoob.
 * @author benvanik
 */

goog.provide('Vizi.OculusRiftControls');

Vizi.OculusRiftControls = function ( camera ) {

	var scope = this;

	var moveObject = camera; //new THREE.Object3D();
//	moveObject.position.y = 10;
//	moveObject.add( camera );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	this.moveSpeed = 0.12 / 4;
	this.jumpSpeed = 2;

	var _q1 = new THREE.Quaternion();
	var axisX = new THREE.Vector3( 1, 0, 0 );
	var axisZ = new THREE.Vector3( 0, 0, 1 );

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		console.log(movementX, movementY);

		_q1.setFromAxisAngle( axisZ, movementX * 0.002 );
		moveObject.quaternion.multiplySelf( _q1 );
		_q1.setFromAxisAngle( axisX, movementY * 0.002 );
		moveObject.quaternion.multiplySelf( _q1 );
	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += this.jumpSpeed;
				canJump = false;
				break;

		}

	}.bind(this);

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return moveObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.update = function ( delta, vrstate ) {

		//if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		velocity.y -= 0.10 * delta;

		if ( moveForward ) velocity.z -= this.moveSpeed * delta;
		if ( moveBackward ) velocity.z += this.moveSpeed * delta;

		if ( moveLeft ) velocity.x -= this.moveSpeed * delta;
		if ( moveRight ) velocity.x += this.moveSpeed * delta;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		var rotation = new THREE.Quaternion();
		var angles = new THREE.Euler();
		if (vrstate) {
			rotation.set(
					vrstate.hmd.rotation[0],
					vrstate.hmd.rotation[1],
					vrstate.hmd.rotation[2],
					vrstate.hmd.rotation[3]);
			//angles.setFromQuaternion(rotation, 'XYZ');
			// angles.z = 0;
			//rotation.setFromEuler(angles, 'XYZ');
			//rotation.normalize();
			// velocity.applyQuaternion(rotation);
			
			if (!(rotation.x == 0 && 
					rotation.y == 0 &&
					rotation.z == 0 &&
					rotation.w == 0)) {
				
				moveObject.quaternion.copy(rotation);
				
			}
		}

		//moveObject.translateX( velocity.x );
		//moveObject.translateY( velocity.y );
		//moveObject.translateZ( velocity.z );

		if ( moveObject.position.y < 10 ) {

			velocity.y = 0;
			// moveObject.position.y = 10;

			canJump = true;

		}

	};

};
goog.provide("Vizi.System");

Vizi.System = {
	log : function() {
		var args = ["[Vizi] "].concat([].slice.call(arguments));
		console.log.apply(console, args);
	},
	warn : function() {
		var args = ["[Vizi] "].concat([].slice.call(arguments));
		console.warn.apply(console, args);
	},
	error : function() {
		var args = ["[Vizi] "].concat([].slice.call(arguments));
		console.error.apply(console, args);
	}
};/**
 * @fileoverview HighlightBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.HighlightBehavior');
goog.require('Vizi.Behavior');

Vizi.HighlightBehavior = function(param) {
	param = param || {};
	this.highlightColor = (param.highlightColor !== undefined) ? param.highlightColor : 0xffffff;
	this.savedColors = [];
    Vizi.Behavior.call(this, param);
}

goog.inherits(Vizi.HighlightBehavior, Vizi.Behavior);

Vizi.HighlightBehavior.prototype.start = function()
{
	Vizi.Behavior.prototype.start.call(this);
	
	if (this._realized && this._object.visuals) {
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			this.savedColors.push(visuals[i].material.color.getHex());
			visuals[i].material.color.setHex(this.highlightColor);
		}	
	}
}

Vizi.HighlightBehavior.prototype.evaluate = function(t)
{
}

Vizi.HighlightBehavior.prototype.stop = function()
{
	Vizi.Behavior.prototype.stop.call(this);

	if (this._realized && this._object.visuals)
	{
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			visuals[i].material.color.setHex(this.savedColors[i]);
		}	
	}

}

// Alias a few functions - syntactic sugar
Vizi.HighlightBehavior.prototype.on = Vizi.HighlightBehavior.prototype.start;
Vizi.HighlightBehavior.prototype.off = Vizi.HighlightBehavior.prototype.stop;
/**
 * @fileoverview BounceBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.BounceBehavior');
goog.require('Vizi.Behavior');

Vizi.BounceBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.bounceVector = (param.bounceVector !== undefined) ? param.bounceVector : new THREE.Vector3(0, 1, 0);
	this.tweenUp = null;
	this.tweenDown = null;
    Vizi.Behavior.call(this, param);
}

goog.inherits(Vizi.BounceBehavior, Vizi.Behavior);

Vizi.BounceBehavior.prototype.start = function()
{
	if (this.running)
		return;
	
	this.bouncePosition = new THREE.Vector3;
	this.bounceEndPosition = this.bounceVector.clone();
	this.prevBouncePosition = new THREE.Vector3;
	this.bounceDelta = new THREE.Vector3;
	this.tweenUp = new TWEEN.Tween(this.bouncePosition).to(this.bounceEndPosition, this.duration / 2 * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();
	
	Vizi.Behavior.prototype.start.call(this);
}

Vizi.BounceBehavior.prototype.evaluate = function(t)
{
	this.bounceDelta.copy(this.bouncePosition).sub(this.prevBouncePosition);
	this.prevBouncePosition.copy(this.bouncePosition);
	
	this._object.transform.position.add(this.bounceDelta);
	
	if (t >= (this.duration / 2))
	{
		if (this.tweenUp)
		{
			this.tweenUp.stop();
			this.tweenUp = null;
		}

		if (!this.tweenDown)
		{
			this.bouncePosition = this._object.transform.position.clone();
			this.bounceEndPosition = this.bouncePosition.clone().sub(this.bounceVector);
			this.prevBouncePosition = this.bouncePosition.clone();
			this.bounceDelta = new THREE.Vector3;
			this.tweenDown = new TWEEN.Tween(this.bouncePosition).to(this.bounceEndPosition, this.duration / 2 * 1000)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.repeat(0)
			.start();
		}
	}
	
	if (t >= this.duration)
	{
		this.tweenDown.stop();
		this.tweenDown = null;
		this.stop();
		
		if (this.loop)
			this.start();
	}
}/**
 * @fileoverview Camera Manager - singleton to manage cameras, active, resize etc.
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.CameraManager');

Vizi.CameraManager.addCamera = function(camera)
{
	Vizi.CameraManager.cameraList.push(camera);
}

Vizi.CameraManager.removeCamera = function(camera)
{
    var i = Vizi.CameraManager.cameraList.indexOf(camera);

    if (i != -1)
    {
    	Vizi.CameraManager.cameraList.splice(i, 1);
    }
}

Vizi.CameraManager.setActiveCamera = function(camera)
{
	if (Vizi.CameraManager.activeCamera && Vizi.CameraManager.activeCamera != camera)
		Vizi.CameraManager.activeCamera.active = false;
	
	Vizi.CameraManager.activeCamera = camera;
	Vizi.Graphics.instance.camera = camera.object;
}


Vizi.CameraManager.handleWindowResize = function(width, height)
{
	var cameras = Vizi.CameraManager.cameraList;
	
	if (cameras.length == 0)
		return false;

	var i, len = cameras.length;
	for (i = 0; i < len; i++)
	{
		var camera = cameras[i];
		camera.aspect = width / height;
	}

	return true;
}


Vizi.CameraManager.cameraList = [];
Vizi.CameraManager.activeCamera = null;/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('Vizi.Prefabs');

Vizi.Prefabs.HUD = function(param) {

	param = param || {};
	
	var hud = new Vizi.Object();

	var hudScript = new Vizi.HUDScript(param);
	hud.addComponent(hudScript);
	
	return hud;
}

goog.provide('Vizi.HUDScript');
goog.require('Vizi.Script');

Vizi.HUDScript = function(param) {
	
	Vizi.Script.call(this, param);

	this.zDistance = (param.zDistance !== undefined) ? param.zDistance : Vizi.HUDScript.DEFAULT_Z_DISTANCE;
	this.position = new THREE.Vector3(0, 0, -this.zDistance);
	this.scale = new THREE.Vector3;
	this.quaternion = new THREE.Quaternion;
}

goog.inherits(Vizi.HUDScript, Vizi.Script);

Vizi.HUDScript.prototype.realize = function() {
}

Vizi.HUDScript.prototype.update = function() {
	
	var cam = Vizi.Graphics.instance.camera;
	
	cam.updateMatrixWorld();
	
	cam.matrixWorld.decompose(this.position, this.quaternion, this.scale);
	
	this._object.transform.quaternion.copy(this.quaternion);
	this._object.transform.position.copy(this.position);
	this._object.transform.translateZ(-this.zDistance);
}

Vizi.HUDScript.DEFAULT_Z_DISTANCE = 1;

/**
 * @fileoverview Loader - loads level files
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.Loader');
goog.require('Vizi.EventDispatcher');

/**
 * @constructor
 * @extends {Vizi.PubSub}
 */
Vizi.Loader = function()
{
    Vizi.EventDispatcher.call(this);	
}

goog.inherits(Vizi.Loader, Vizi.EventDispatcher);
        
Vizi.Loader.prototype.loadModel = function(url, userData)
{
	var spliturl = url.split('.');
	var len = spliturl.length;
	var ext = '';
	if (len)
	{
		ext = spliturl[len - 1];
	}
	
	if (ext && ext.length)
	{
	}
	else
	{
		return;
	}
	
	var loaderClass;
	
	switch (ext.toUpperCase())
	{
		case 'JS' :
			loaderClass = THREE.JSONLoader;
			break;
		default :
			break;
	}
	
	if (loaderClass)
	{
		var loader = new loaderClass;
		var that = this;
		
		loader.load(url, function (geometry, materials) {
			that.handleModelLoaded(url, userData, geometry, materials);
		});		
	}
}

Vizi.Loader.prototype.handleModelLoaded = function(url, userData, geometry, materials)
{
	// Create a new mesh with per-face materials
	var material = new THREE.MeshFaceMaterial(materials);
	var mesh = new THREE.Mesh( geometry, material  );
	
	var obj = new Vizi.Object;
	var visual = new Vizi.Visual({object:mesh});
	obj.addComponent(visual);

	var result = { scene : obj, cameras: [], lights: [], keyFrameAnimators:[] , userData: userData };
	
	this.dispatchEvent("loaded", result);
}

Vizi.Loader.prototype.loadScene = function(url, userData)
{
	var spliturl = url.split('.');
	var len = spliturl.length;
	var ext = '';
	if (len)
	{
		ext = spliturl[len - 1];
	}
	
	if (ext && ext.length)
	{
	}
	else
	{
		return;
	}
	
	var loaderClass;
	
	switch (ext.toUpperCase())
	{
		case 'DAE' :
			loaderClass = THREE.ColladaLoader;
			break;
		case 'JS' :
			return this.loadModel(url, userData);
			break;
		case 'JSON' :
			loaderClass = THREE.glTFLoader;
			break;
		default :
			break;
	}
	
	if (loaderClass)
	{
		var loader = new loaderClass;
		var that = this;
		
		loader.load(url, 
				function (data) {
					that.handleSceneLoaded(url, data, userData);
				},
				function (data) {
					that.handleSceneProgress(url, data);
				}
		);		
	}
}

Vizi.Loader.prototype.traverseCallback = function(n, result)
{
	// Look for cameras
	if (n instanceof THREE.Camera)
	{
		if (!result.cameras)
			result.cameras = [];
		
		result.cameras.push(n);
	}

	// Look for lights
	if (n instanceof THREE.Light)
	{
		if (!result.lights)
			result.lights = [];
		
		result.lights.push(n);
	}
}

Vizi.Loader.prototype.handleSceneLoaded = function(url, data, userData)
{
	var result = {};
	var success = false;
	
	if (data.scene)
	{
		console.log("In loaded callback for ", url);
		
		var convertedScene = this.convertScene(data.scene);
		result.scene = convertedScene; // new Vizi.SceneVisual({scene:data.scene}); // 
		result.cameras = convertedScene.findNodes(Vizi.Camera);
		result.lights = convertedScene.findNodes(Vizi.Light);
		result.url = url;
		result.userData = userData;
		success = true;
	}
	
	if (data.animations)
	{
		result.keyFrameAnimators = [];
		var i, len = data.animations.length;
		for (i = 0; i < len; i++)
		{
			var animations = [];
			animations.push(data.animations[i]);
			result.keyFrameAnimators.push(new Vizi.KeyFrameAnimator({animations:animations}));
		}
	}
	
	/*
	if (data.skins && data.skins.length)
	{
		// result.meshAnimator = new Vizi.MeshAnimator({skins:data.skins});
	}
	*/
	
	if (success)
		this.dispatchEvent("loaded", result);
}

Vizi.Loader.prototype.handleSceneProgress = function(url, progress)
{
	this.dispatchEvent("progress", progress);
}

Vizi.Loader.prototype.convertScene = function(scene) {

	function convert(n) {
		if (n instanceof THREE.Mesh) {
			// cheap fixes for picking and animation; need to investigate
			// the general case longer-term for glTF loader
			n.matrixAutoUpdate = true;
			n.geometry.dynamic = true;
			var v = new Vizi.Visual({object:n});
			v.name = n.name;
			return v;
		}
		else if (n instanceof THREE.Camera) {
			if (n instanceof THREE.PerspectiveCamera) {
				return new Vizi.PerspectiveCamera({object:n});
			}
		}
		else if (n instanceof THREE.Light) {
			if (n instanceof THREE.AmbientLight) {
				return new Vizi.AmbientLight({object:n});
			}
			else if (n instanceof THREE.DirectionalLight) {
				return new Vizi.DirectionalLight({object:n});
			}
			else if (n instanceof THREE.PointLight) {
				return new Vizi.PointLight({object:n});
			}
			else if (n instanceof THREE.SpotLight) {
				return new Vizi.SpotLight({object:n});
			}
		}
		else if (n.children) {
			var o = new Vizi.Object({autoCreateTransform:false});
			o.addComponent(new Vizi.Transform({object:n}));
			o.name = n.name;
			n.matrixAutoUpdate = true;
			var i, len = n.children.length;
			for (i = 0; i < len; i++) {
				var childNode  = n.children[i];
				var c = convert(childNode);
				if (c instanceof Vizi.Object) {
					o.addChild(c);
				}
				else if (c instanceof Vizi.Component) {
					o.addComponent(c);
				}
				else {
					// N.B.: what???
				}
			}
		}
		
		return o;
	}

	// Pump through updates once so converted scene can pick up all the values
	scene.updateMatrixWorld();

	return convert(scene);
}
/**
 *
 */
goog.provide('Vizi.Gamepad');
goog.require('Vizi.EventDispatcher');

Vizi.Gamepad = function()
{
    Vizi.EventDispatcher.call(this);

    // N.B.: freak out if somebody tries to make 2
	// throw (...)

    this.controllers = {
    };
    
    this.values = {
    };
    
	Vizi.Gamepad.instance = this;
}       

goog.inherits(Vizi.Gamepad, Vizi.EventDispatcher);

Vizi.Gamepad.prototype.update = function() {

	this.scanGamepads();

	var buttonsChangedEvent = {
			changedButtons: [],
	};

	var axesChangedEvent = {
			changedAxes: [],
	};
	
	for (var c in this.controllers) {
	    var controller = this.controllers[c];
	    this.testValues(controller, buttonsChangedEvent, axesChangedEvent);
	    this.saveValues(controller);
	}
	
	if (buttonsChangedEvent.changedButtons.length) {
		this.dispatchEvent("buttonsChanged", buttonsChangedEvent);
	}

	if (axesChangedEvent.changedAxes.length) {
		this.dispatchEvent("axesChanged", axesChangedEvent);
	}
}

Vizi.Gamepad.prototype.testValues = function(gamepad, buttonsChangedEvent, axesChangedEvent) {
	var values = this.values[gamepad.index];
	if (values) {
	    for (var i = 0; i < gamepad.buttons.length; i++) {
	        
	        var val = gamepad.buttons[i];
	        var pressed = val == 1.0;
	        
	        if (typeof(val) == "object") {
	          pressed = val.pressed;
	          val = val.value;
	        }

	        if (pressed != values.buttons[i]) {
//	        	console.log("Pressed: ", i);
	        	buttonsChangedEvent.changedButtons.push({
	        		gamepad : gamepad.index,
	        		button : i,
	        		pressed : pressed,
	        	});
	        }	        	
	      }

	    for (var i = 0; i < gamepad.axes.length; i++) {
	        var val = gamepad.axes[i];
	        if (val != values.axes[i]) {
//	        	console.log("Axis: ", i, val);
	        	axesChangedEvent.changedAxes.push({
	        		gamepad : gamepad.index,
	        		axis : i,
	        		value : val,
	        	});
	        }
	      }		
	}
}

Vizi.Gamepad.prototype.saveValues = function(gamepad) {
	var values = this.values[gamepad.index];
	if (values) {
	    for (var i = 0; i < gamepad.buttons.length; i++) {
	        
	        var val = gamepad.buttons[i];
	        var pressed = val == 1.0;
	        
	        if (typeof(val) == "object") {
	          pressed = val.pressed;
	          val = val.value;
	        }

	        values.buttons[i] = pressed;
	      }

	    for (var i = 0; i < gamepad.axes.length; i++) {
	        var val = gamepad.axes[i];
	        values.axes[i] = val;
	      }		
	}
}

Vizi.Gamepad.prototype.addGamepad = function(gamepad) {
	  this.controllers[gamepad.index] = gamepad;
	  this.values[gamepad.index] = {
			  buttons : [],
			  axes : [],
	  };
	  
	  this.saveValues(gamepad);
	  console.log("Gamepad added! ", gamepad.id);
}

Vizi.Gamepad.prototype.scanGamepads = function() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in this.controllers)) {
    	  this.addGamepad(gamepads[i]);
      } else {
    	  this.controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

Vizi.Gamepad.instance = null;

/* input codes
*/
Vizi.Gamepad.BUTTON_A = Vizi.Gamepad.BUTTON_CROSS 		= 0;
Vizi.Gamepad.BUTTON_B = Vizi.Gamepad.BUTTON_CIRCLE 		= 1;
Vizi.Gamepad.BUTTON_X = Vizi.Gamepad.BUTTON_SQUARE 		= 2;
Vizi.Gamepad.BUTTON_Y = Vizi.Gamepad.BUTTON_TRIANGLE 	= 3;
Vizi.Gamepad.SHOULDER_LEFT 								= 4;
Vizi.Gamepad.SHOULDER_RIGHT 							= 5;
Vizi.Gamepad.TRIGGER_LEFT 								= 6;
Vizi.Gamepad.TRIGGER_RIGHT 								= 7;
Vizi.Gamepad.SELECT = Vizi.Gamepad.BACK 				= 8;
Vizi.Gamepad.START 										= 9;
Vizi.Gamepad.STICK_LEFT 								= 10;
Vizi.Gamepad.STICK_RIGHT 								= 11;
Vizi.Gamepad.DPAD_UP	 								= 12;
Vizi.Gamepad.DPAD_DOWN	 								= 13;
Vizi.Gamepad.DPAD_LEFT	 								= 14;
Vizi.Gamepad.DPAD_RIGHT	 								= 15;
Vizi.Gamepad.HOME = Vizi.Gamepad.MENU					= 16;
Vizi.Gamepad.AXIS_LEFT_H								= 0;
Vizi.Gamepad.AXIS_LEFT_V								= 1;
Vizi.Gamepad.AXIS_RIGHT_H								= 2;
Vizi.Gamepad.AXIS_RIGHT_V								= 3;
/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author Tony Parisi / http://www.tonyparisi.com adapted for Vizi
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

goog.provide('Vizi.DeviceOrientationControls');

Vizi.DeviceOrientationControls = function ( object ) {

	this.object = object;

	this.object.rotation.reorder( "YXZ" );

	this.freeze = true;
	this.roll = true;

	this.deviceOrientation = {};

	this.screenOrientation = 0;

	this.onDeviceOrientationChangeEvent = function( rawEvtData ) {

		this.deviceOrientation = rawEvtData;
//		console.log(rawEvtData);
	};

	this.onScreenOrientationChangeEvent = function() {

		this.screenOrientation = window.orientation || 0;

	};

	this.update = function() {

		var alpha, beta, gamma;

		return function () {

			if ( this.freeze ) return;

			alpha  = this.deviceOrientation.gamma ? THREE.Math.degToRad( this.deviceOrientation.alpha ) : 0; // Z
			beta   = this.deviceOrientation.beta  ? THREE.Math.degToRad( this.deviceOrientation.beta  ) : 0; // X'
			gamma  = this.deviceOrientation.gamma ? THREE.Math.degToRad( this.deviceOrientation.gamma ) : 0; // Y''
			orient = this.screenOrientation       ? THREE.Math.degToRad( this.screenOrientation       ) : 0; // O

			setObjectQuaternion( this.object.quaternion, alpha, beta, gamma, orient );

		}

	}();

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.connect = function() {

		this.onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', bind( this, this.onScreenOrientationChangeEvent ), false );
		window.addEventListener( 'deviceorientation', bind( this, this.onDeviceOrientationChangeEvent ), false );

		this.freeze = false;

	};

	this.disconnect = function() {

		this.freeze = true;

		window.removeEventListener( 'orientationchange', bind( this, this.onScreenOrientationChangeEvent ), false );
		window.removeEventListener( 'deviceorientation', bind( this, this.onDeviceOrientationChangeEvent ), false );

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			if (!this.roll) {
				if (Math.abs(orient) == (Math.PI / 2))
					beta = 0;
				else if (orient != Math.PI)
					gamma = 0;
			}
			
			euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler );                               // orient the device

			quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

		}

	}();

};
/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.PlaneDragger');
goog.require('Vizi.Picker');

Vizi.PlaneDragger = function(param) {
	
	param = param || {};
	
    Vizi.Picker.call(this, param);
    
    this.normal = param.normal || new THREE.Vector3(0, 0, 1);
    this.position = param.position || new THREE.Vector3;
    this.color = 0x0000aa;
}

goog.inherits(Vizi.PlaneDragger, Vizi.Picker);

Vizi.PlaneDragger.prototype.realize = function()
{
	Vizi.Picker.prototype.realize.call(this);

    // And some helpers
    this.dragObject = null;
	this.dragOffset = new THREE.Vector3;
	this.dragHitPoint = new THREE.Vector3;
	this.dragStartPoint = new THREE.Vector3;
	this.dragPlane = this.createDragPlane();
	this.dragPlane.visible = Vizi.PlaneDragger.SHOW_DRAG_PLANE;
	this.dragPlane.ignorePick = true;
	this.dragPlane.ignoreBounds = true;
	this._object._parent.transform.object.add(this.dragPlane);
}

Vizi.PlaneDragger.prototype.createDragPlane = function() {

	var size = 2000;
	var normal = this.normal;
	var position = this.position;
	
	var u = new THREE.Vector3(0, normal.z, -normal.y).normalize().multiplyScalar(size);
	if (!u.lengthSq())
		u = new THREE.Vector3(-normal.z, normal.x, 0).normalize().multiplyScalar(size);

	var v = u.clone().cross(normal).normalize().multiplyScalar(size);
	
	var p1 = position.clone().sub(u).sub(v);
	var p2 = position.clone().add(u).sub(v);
	var p3 = position.clone().add(u).add(v);
	var p4 = position.clone().sub(u).add(v);
	
	var planegeom = new THREE.Geometry();
	planegeom.vertices.push(p1, p2, p3, p4); 
	var planeface = new THREE.Face3( 0, 2, 1 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	var planeface = new THREE.Face3( 0, 3, 2 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	planegeom.computeFaceNormals();
	planegeom.computeCentroids();

	var mat = new THREE.MeshBasicMaterial({color:this.color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	return mesh;
}

Vizi.PlaneDragger.prototype.update = function() {
}

Vizi.PlaneDragger.prototype.onMouseMove = function(event) {
	Vizi.Picker.prototype.onMouseMove.call(this, event);
	this.handleMouseMove(event);
}

Vizi.PlaneDragger.prototype.handleMouseMove = function(event) {
	var intersection = Vizi.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
	if (intersection)
	{
		this.dragHitPoint.copy(intersection.point).sub(this.dragOffset);
		this.dragHitPoint.add(this.dragStartPoint);
		this.dispatchEvent("drag", {
									type : "drag", 
									object : this.dragObject, 
									offset : this.dragHitPoint
									}
		);
	}
}

Vizi.PlaneDragger.prototype.onMouseDown = function(event) {
	Vizi.Picker.prototype.onMouseDown.call(this, event);
	this.handleMouseDown(event);
}

Vizi.PlaneDragger.prototype.handleMouseDown = function(event) {
	var intersection = Vizi.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
	if (intersection)
	{
		this.dragOffset.copy(intersection.point);
		this.dragStartPoint.copy(event.object.position);
		this.dragHitPoint.copy(intersection.point).sub(this.dragOffset);
		this.dragHitPoint.add(this.dragStartPoint);
		this.dragObject = event.object;
		this.dispatchEvent("dragstart", {
			type : "dragstart", 
			object : this.dragObject, 
			offset : this.dragHitPoint
			}
);
	}
}

Vizi.PlaneDragger.prototype.onMouseUp = function(event) {
	Vizi.Picker.prototype.onMouseUp.call(this, event);
	this.handleMouseUp(event);
}

Vizi.PlaneDragger.prototype.handleMouseUp = function(event) {
}


Vizi.PlaneDragger.prototype.onTouchStart = function(event) {
	Vizi.Picker.prototype.onTouchStart.call(this, event);

	this.handleMouseDown(event);
}

Vizi.PlaneDragger.prototype.onTouchMove = function(event) {
	Vizi.Picker.prototype.onTouchMove.call(this, event);

	this.handleMouseMove(event);
}

Vizi.PlaneDragger.prototype.onTouchEnd = function(event) {
	Vizi.Picker.prototype.onTouchEnd.call(this, event);

	this.handleMouseUp(event);
}

Vizi.PlaneDragger.SHOW_DRAG_PLANE = false;
Vizi.PlaneDragger.SHOW_DRAG_NORMAL = false;/**
 * @fileoverview ScaleBehavior - simple scale up/down over time
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.ScaleBehavior');
goog.require('Vizi.Behavior');

Vizi.ScaleBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.startScale = (param.startScale !== undefined) ? param.startScale.clone() : 
		new THREE.Vector3(1, 1, 1);
	this.endScale = (param.endScale !== undefined) ? param.endScale.clone() : 
		new THREE.Vector3(2, 2, 2);
	this.tween = null;
    Vizi.Behavior.call(this, param);
}

goog.inherits(Vizi.ScaleBehavior, Vizi.Behavior);

Vizi.ScaleBehavior.prototype.start = function()
{
	if (this.running)
		return;

	this.scale = this.startScale.clone();
	this.originalScale = this._object.transform.scale.clone();
	this.tween = new TWEEN.Tween(this.scale).to(this.endScale, this.duration * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();
	
	Vizi.Behavior.prototype.start.call(this);
}

Vizi.ScaleBehavior.prototype.evaluate = function(t)
{
	if (t >= this.duration)
	{
		this.stop();
		if (this.loop) {
			this.start();
		}
		else {
			this.dispatchEvent("complete");
		}
	}
	
	var sx = this.originalScale.x * this.scale.x;
	var sy = this.originalScale.y * this.scale.y;
	var sz = this.originalScale.z * this.scale.z;
	
	this._object.transform.scale.set(sx, sy, sz);
}


Vizi.ScaleBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();
	
	Vizi.Behavior.prototype.stop.call(this);
}/**
 * @fileoverview Viewer class - Application Subclass for Model/Scene Viewer
 * @author Tony Parisi / http://www.tonyparisi.com
 */

goog.provide('Vizi.Viewer');

Vizi.Viewer = function(param)
{
	// Chain to superclass
	Vizi.Application.call(this, param);
	
	// Set up stats info
	this.lastFPSUpdateTime = 0;
	
	this.renderStats = { fps : 0 };
	this.sceneStats = { meshCount : 0, faceCount : 0, boundingBox:new THREE.Box3 };
	
	// Tuck away prefs based on param
	this.renderStatsUpdateInterval = (param.renderStatsUpdateInterval !== undefined) ? param.renderStatsUpdateInterval : 1000;
	this.loopAnimations = (param.loopAnimations !== undefined) ? param.loopAnimations : false;
	this.headlightOn = (param.headlight !== undefined) ? param.headlight : true;
	this.headlightIntensity = param.headlightIntensity || Vizi.Viewer.DEFAULT_HEADLIGHT_INTENSITY;
	this.riftController = (param.riftController !== undefined) ? param.riftController : false;
	this.firstPerson = (param.firstPerson !== undefined) ? param.firstPerson : false;
	this.showGrid = (param.showGrid !== undefined) ? param.showGrid : false;
	this.createBoundingBoxes = (param.createBoundingBoxes !== undefined) ? param.createBoundingBoxes : false;
	this.showBoundingBoxes = (param.showBoundingBoxes !== undefined) ? param.showBoundingBoxes : false;
	this.allowPan = (param.allowPan !== undefined) ? param.allowPan : true;
	this.allowZoom = (param.allowZoom !== undefined) ? param.allowZoom : true;
	this.oneButton = (param.oneButton !== undefined) ? param.oneButton : false;
	this.gridSize = param.gridSize || Vizi.Viewer.DEFAULT_GRID_SIZE;
	this.gridStepSize = param.gridStepSize || Vizi.Viewer.DEFAULT_GRID_STEP_SIZE;
	this.flipY = (param.flipY !== undefined) ? param.flipY : false;
	this.highlightedObject = null;
	this.highlightDecoration = null;
	
	// Set up backdrop objects for empty scene
	this.initScene();

	// Set up shadows - maybe make this a pref
	Vizi.Graphics.instance.enableShadows(true);
}

goog.inherits(Vizi.Viewer, Vizi.Application);

Vizi.Viewer.prototype.initScene = function()
{
	this.sceneRoot = new Vizi.Object;
	this.addObject(this.sceneRoot);
	if (this.flipY) {
		this.sceneRoot.transform.rotation.x = -Math.PI / 2;
	}

	this.gridRoot = new Vizi.Object;
	this.addObject(this.gridRoot);
	this.grid = null;	
	this.gridPicker = null;	
	this.createGrid();
	
	if (this.firstPerson) {
		this.controller = Vizi.Prefabs.FirstPersonController({active:true, 
			headlight:true,
			turn: !this.riftController,
			look: !this.riftController,
			});
		this.controllerScript = this.controller.getComponent(Vizi.FirstPersonControllerScript);
	}
	else {
		this.controller = Vizi.Prefabs.ModelController({active:true, headlight:true, 
			allowPan:this.allowPan, allowZoom:this.allowZoom, oneButton:this.oneButton});
		this.controllerScript = this.controller.getComponent(Vizi.ModelControllerScript);
	}
	this.addObject(this.controller);

	var viewpoint = new Vizi.Object;
	this.defaultCamera = new Vizi.PerspectiveCamera({active:true});
	viewpoint.addComponent(this.defaultCamera);
	viewpoint.name = "[default]";
	this.addObject(viewpoint);

	this.controllerScript.camera = this.defaultCamera;
	
	if (this.riftController) {
		var controller = Vizi.Prefabs.RiftController({active:true, 
			headlight:false,
			mouseLook:false,
			useVRJS : true,
		});
		var controllerScript = controller.getComponent(Vizi.RiftControllerScript);
		controllerScript.camera = this.defaultCamera;
		controllerScript.moveSpeed = 6;
		
		this.riftControllerScript = controllerScript;
		this.addObject(controller);
	}
	
	var ambientLightObject = new Vizi.Object;
	this.ambientLight = new Vizi.AmbientLight({color:0xFFFFFF, intensity : this.ambientOn ? 1 : 0 });
	this.addObject(ambientLightObject);
	
	this.scenes = [];
	this.keyFrameAnimators = [];
	this.keyFrameAnimatorNames = [];
	this.cameras = [];
	this.cameraNames = [];
	this.lights = [];
	this.lightNames = [];
	this.lightIntensities = [];
	this.lightColors = [];
}

Vizi.Viewer.prototype.runloop = function()
{
	var updateInterval = this.renderStatsUpdateInterval;
	
	Vizi.Application.prototype.runloop.call(this);
	if (Vizi.Graphics.instance.frameRate)
	{
		var now = Date.now();
		var deltat = now - this.lastFPSUpdateTime;
		if (deltat > updateInterval)
		{
			this.renderStats.fps = Vizi.Graphics.instance.frameRate;
			this.dispatchEvent("renderstats", this.renderStats);
			this.lastFPSUpdateTime = now;
		}
	}
}

Vizi.Viewer.prototype.replaceScene = function(data)
{
	// hack for now - do this for real after computing scene bounds
	
	var i, len = this.sceneRoot._children.length;
	var childrenToRemove = [];
	for (i = 0; i < len; i++)
	{
		var child = this.sceneRoot._children[i];
		childrenToRemove.push(child);
	}
	
	for (i = 0; i < len; i++) {
		this.sceneRoot.removeChild(childrenToRemove[i]);
	}
	
	this.sceneRoot.removeComponent(this.sceneRoot.findNode(Vizi.Decoration));
	
	this.scenes = [data.scene];
	this.sceneRoot.addChild(data.scene);
	
	var bbox = Vizi.SceneUtils.computeBoundingBox(data.scene);
	
	if (this.keyFrameAnimators)
	{
		var i, len = this.keyFrameAnimators.length;
		for (i = 0; i < len; i++)
		{
			this.sceneRoot.removeComponent(this.keyFrameAnimators[i]);
		}
		
		this.keyFrameAnimators = [];
		this.keyFrameAnimatorNames = [];
	}
	
	if (data.keyFrameAnimators)
	{
		var i, len = data.keyFrameAnimators.length;
		for (i = 0; i < len; i++)
		{
			this.sceneRoot.addComponent(data.keyFrameAnimators[i]);
			this.keyFrameAnimators.push(data.keyFrameAnimators[i]);
			this.keyFrameAnimatorNames.push(data.keyFrameAnimators[i].animationData[0].name)
		}		
	}
	
	this.cameras = [];
	this.cameraNames = [];
	this.cameras.push(this.defaultCamera);
	this.camera = this.defaultCamera;
	this.cameraNames.push("[default]");

	this.controllerScript.camera = this.defaultCamera;
	this.controllerScript.camera.active = true;
	
	if (data.cameras)
	{
		var i, len = data.cameras.length;
		for (i = 0; i < len; i++)
		{
			var camera = data.cameras[i];
			camera.aspect = container.offsetWidth / container.offsetHeight;
			
			this.cameras.push(camera);
			this.cameraNames.push(camera._object.name);
		}		
	}
	
	this.lights = [];
	this.lightNames = [];
	this.lightIntensities = [];
	this.lightColors = [];
	
	if (data.lights)
	{
		var i, len = data.lights.length;
		for (i = 0; i < len; i++)
		{
			var light = data.lights[i];
			if (light instanceof THREE.SpotLight)
			{
				light.castShadow = true;
				light.shadowCameraNear = 1;
				light.shadowCameraFar = Vizi.Light.DEFAULT_RANGE;
				light.shadowCameraFov = 90;

				// light.shadowCameraVisible = true;

				light.shadowBias = 0.0001;
				light.shadowDarkness = 0.3;

				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;
				
				light.target.position.set(0, 0, 0);
			}
			
			this.lights.push(data.lights[i]);
			this.lightNames.push(data.lights[i]._object.name);
			this.lightIntensities.push(data.lights[i].intensity);
			this.lightColors.push(data.lights[i].color.clone());
		}
		
		this.controllerScript.headlight.intensity = len ? 0 : this.headlightIntensity;
		this.headlightOn = len <= 0;
	}
	else
	{
		this.controllerScript.headlight.intensity = this.headlightIntensity;
		this.headlightOn = true;
	}
	
	this.initHighlight();
	this.fitToScene();
	this.calcSceneStats();
}

Vizi.Viewer.prototype.addToScene = function(data)
{	
	this.sceneRoot.addChild(data.scene);
	
	if (!this.cameras.length)
	{
		this.cameras = [];
		this.cameraNames = [];
		this.cameras.push(this.defaultCamera);
		this.camera = this.defaultCamera;
		this.cameraNames.push("[default]");

		this.controllerScript.camera = this.defaultCamera;
		this.controllerScript.camera.active = true;
	}
	
	if (data.keyFrameAnimators)
	{
		var i, len = data.keyFrameAnimators.length;
		for (i = 0; i < len; i++)
		{
			this.sceneRoot.addComponent(data.keyFrameAnimators[i]);
			this.keyFrameAnimators.push(data.keyFrameAnimators[i]);
			this.keyFrameAnimatorNames.push(data.keyFrameAnimators[i].animationData[0].name)
		}		
	}
	
	if (data.cameras)
	{
		var i, len = data.cameras.length;
		for (i = 0; i < len; i++)
		{
			var camera = data.cameras[i];
			camera.aspect = container.offsetWidth / container.offsetHeight;
			
			this.cameras.push(camera);
			this.cameraNames.push(camera._object.name);
		}		
	}
	
	if (data.lights)
	{
		var i, len = data.lights.length;
		for (i = 0; i < len; i++)
		{
			var light = data.lights[i];
			if (light instanceof THREE.SpotLight)
			{
				light.castShadow = true;
				light.shadowCameraNear = 1;
				light.shadowCameraFar = Vizi.Light.DEFAULT_RANGE;
				light.shadowCameraFov = 90;

				// light.shadowCameraVisible = true;

				light.shadowBias = 0.0001;
				light.shadowDarkness = 0.3;

				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;
				
				light.target.position.set(0, 0, 0);
			}
			
			this.lights.push(data.lights[i]);
			this.lightNames.push(data.lights[i]._object.name);
			this.lightIntensities.push(data.lights[i].intensity);
			this.lightColors.push(data.lights[i].color.clone());
		}		
	}
	else if (!this.lights.length)
	{
		this.controllerScript.headlight.intensity = this.headlightIntensity;
		this.headlightOn = true;
	}
	
	this.scenes.push(data.scene);
	this.initHighlight();
	this.fitToScene();
	this.calcSceneStats();
}

Vizi.Viewer.prototype.createDefaultCamera = function() {
	
	var cam = this.controllerScript.viewpoint.camera.object;
	cam.updateMatrixWorld();
	var position = new THREE.Vector3;
	var quaternion = new THREE.Quaternion;
	var scale = new THREE.Vector3;
	cam.matrixWorld.decompose(position, quaternion, scale);
	var rotation = new THREE.Euler().setFromQuaternion(quaternion);

	var newCamera = new THREE.PerspectiveCamera(cam.fov, cam.aspect, cam.near, cam.far);
	return new Vizi.PerspectiveCamera({object:newCamera});
}

Vizi.Viewer.prototype.copyCameraValues = function(oldCamera, newCamera)
{
	// for now, assume newCamera is in world space, this is too friggin hard
	var cam = oldCamera.object;
	cam.updateMatrixWorld();
	var position = new THREE.Vector3;
	var quaternion = new THREE.Quaternion;
	var scale = new THREE.Vector3;
	cam.matrixWorld.decompose(position, quaternion, scale);
	var rotation = new THREE.Euler().setFromQuaternion(quaternion);
	
	newCamera.position.copy(position);
	newCamera.rotation.copy(rotation);
	
	newCamera.fov = oldCamera.fov;
	newCamera.aspect = oldCamera.aspect;
	newCamera.near = oldCamera.near;
	newCamera.far = oldCamera.far;	
}

Vizi.Viewer.prototype.useCamera = function(id) {

	var index = id;
	
	if (typeof(id) == "string") {
		var cameraNames = this.cameraNames;
		if (this.cameraNames) {
			index = this.cameraNames.indexOf(id);
		}
	}

	if (index >= 0 && this.cameras && this.cameras[index]) {
		this.cameras[index].active = true;
		this.controllerScript.enabled = (index == 0);
	}
}

Vizi.Viewer.prototype.addCamera = function(camera, id) {

	this.cameras.push(camera);
	this.cameraNames.push(id);

}

Vizi.Viewer.prototype.getCamera = function(id) {

	var index = id;
	
	if (typeof(id) == "string") {
		var cameraNames = this.cameraNames;
		if (this.cameraNames) {
			index = this.cameraNames.indexOf(id);
		}
	}

	if (index >= 0 && this.cameras && this.cameras[index]) {
		return this.cameras[index];
	}
	else {
		return null;
	}
}

Vizi.Viewer.prototype.toggleLight = function(index)
{
	if (this.lights && this.lights[index])
	{
		var light = this.lights[index];
		if (light instanceof Vizi.AmbientLight)
		{
			var color = light.color;
			if (color.r != 0 || color.g != 0 || color.b != 0)
				color.setRGB(0, 0, 0);
			else
				color.copy(this.lightColors[index]);
		}
		else
		{
			var intensity = light.intensity;
			if (intensity)
				light.intensity = 0;
			else
				light.intensity = this.lightIntensities[index];
				
		}
	}
}

Vizi.Viewer.prototype.playAnimation = function(index, loop, reverse)
{
	if (loop === undefined)
		loop = this.loopAnimations;
	
	if (this.keyFrameAnimators && this.keyFrameAnimators[index])
	{
		this.keyFrameAnimators[index].loop = loop;
		if (reverse) {
			this.keyFrameAnimators[index].direction = Vizi.KeyFrameAnimator.REVERSE_DIRECTION;
		}
		else {
			this.keyFrameAnimators[index].direction = Vizi.KeyFrameAnimator.FORWARD_DIRECTION;
		}
		
		if (!loop)
			this.keyFrameAnimators[index].stop();

		this.keyFrameAnimators[index].start();
	}
}

Vizi.Viewer.prototype.stopAnimation = function(index)
{
	if (this.keyFrameAnimators && this.keyFrameAnimators[index])
	{
		this.keyFrameAnimators[index].stop();
	}
}

Vizi.Viewer.prototype.playAllAnimations = function(loop, reverse)
{
	if (loop === undefined)
		loop = this.loopAnimations;
	
	if (this.keyFrameAnimators)
	{
		var i, len = this.keyFrameAnimators.length;
		for (i = 0; i < len; i++)
		{
			this.keyFrameAnimators[i].stop();
			
			if (loop)
				this.keyFrameAnimators[i].loop = true;

			if (reverse) {
				this.keyFrameAnimators[i].direction = Vizi.KeyFrameAnimator.REVERSE_DIRECTION;
			}
			else {
				this.keyFrameAnimators[i].direction = Vizi.KeyFrameAnimator.FORWARD_DIRECTION;
			}
			
			this.keyFrameAnimators[i].start();
		}
	}
}

Vizi.Viewer.prototype.stopAllAnimations = function()
{
	if (this.keyFrameAnimators)
	{
		var i, len = this.keyFrameAnimators.length;
		for (i = 0; i < len; i++)
		{
			this.keyFrameAnimators[i].stop();
		}
	}
}

Vizi.Viewer.prototype.setLoopAnimations = function(on)
{
	this.loopAnimations = on;
}

Vizi.Viewer.prototype.setHeadlightOn = function(on)
{
	this.controllerScript.headlight.intensity = this.headlightIntensity ? this.headlightIntensity : 0;
	this.headlightOn = on;
}

Vizi.Viewer.prototype.setHeadlightIntensity = function(intensity)
{
	this.controllerScript.headlight.intensity = intensity;
}

Vizi.Viewer.prototype.setGridOn = function(on)
{
	if (this.grid)
	{
		this.grid.visible = on;
	}
}

Vizi.Viewer.prototype.setBoundingBoxesOn = function(on)
{
	this.showBoundingBoxes = on;
	var that = this;
	this.sceneRoot.map(Vizi.Decoration, function(o) {
		if (!that.highlightedObject || (o != that.highlightDecoration)) {
			o.visible = that.showBoundingBoxes;
		}
	});
}

Vizi.Viewer.prototype.setAmbientLightOn = function(on)
{
	this.ambientLight.intensity = on ? 1 : 0;
	this.ambientLightOn = on;
}

Vizi.Viewer.prototype.setFlipY = function(flip) {
	this.flipY = flip;
	if (this.flipY) {
		this.sceneRoot.transform.rotation.x = -Math.PI / 2;
		this.fitToScene();
	}
	else {
		this.sceneRoot.transform.rotation.x = 0;
	}
}

Vizi.Viewer.prototype.initHighlight = function() {
	if (this.highlightedObject) {
		this.highlightedObject.removeComponent(this.highlightDecoration);
	}
	this.highlightedObject = null;
}

Vizi.Viewer.prototype.highlightObject = function(object) {

	if (this.highlightedObject) {
		this.highlightParent.removeComponent(this.highlightDecoration);
	}

	if (object) {
		
		this.highlightDecoration = Vizi.Helpers.BoundingBoxDecoration({
			object : object,
			color : 0xaaaa00
		});
		
		if (object instanceof Vizi.Object) {
			object._parent.addComponent(this.highlightDecoration);
			this.highlightedObject = object;
			this.highlightParent = object._parent;
		}
		else if (object instanceof Vizi.Visual) {
			object._object.addComponent(this.highlightDecoration);
			this.highlightedObject = object._object;
			this.highlightParent = object._object;
		}
	}
	else {
		this.highlightedObject = null;
		this.highlightParent = null;
	}
	
}

Vizi.Viewer.prototype.createGrid = function()
{
	if (this.gridRoot)
	{
		if (this.grid)
			this.gridRoot.removeComponent(this.grid);
		
		if (this.gridPicker)
			this.gridRoot.removeComponent(this.gridPicker);
	}

	// Create a line geometry for the grid pattern
	var floor = -0.04, step = this.gridStepSize, size = this.gridSize;
	var geometry = new THREE.Geometry();

	for ( var i = 0; i <= size / step * 2; i ++ )
	{
		geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
	
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );
	}

	var line_material = new THREE.LineBasicMaterial( { color: Vizi.Viewer.GRID_COLOR, 
		opacity:Vizi.Viewer.GRID_OPACITY } );
	
	var gridObject = new THREE.Line( geometry, line_material, THREE.LinePieces );
	gridObject.visible = this.showGrid;
	this.grid = new Vizi.Visual({ object : gridObject });

	this.gridRoot.addComponent(this.grid);
	
	this.gridPicker = new Vizi.Picker;
	var that = this;
	this.gridPicker.addEventListener("mouseup", function(e) {
		that.highlightObject(null);
	});
	this.gridRoot.addComponent(this.gridPicker);
}

Vizi.Viewer.prototype.fitToScene = function()
{
	function log10(val) {
		  return Math.log(val) / Math.LN10;
		}

	this.boundingBox = Vizi.SceneUtils.computeBoundingBox(this.sceneRoot);
	
	// For default camera setups-- small scenes (COLLADA, cm), or not clip big scenes
	// heuristic, who knows ?
	this.controllerScript.controls.userPanSpeed = 1;
	if (this.boundingBox.max.z < 1) {
		this.controllerScript.camera.near = 0.01;
		this.controllerScript.controls.userPanSpeed = 0.01;
	}
	else if (this.boundingBox.max.z > 10000) {
		this.controllerScript.camera.far = this.boundingBox.max.z * Math.sqrt(2) * 2;
	}
	else if (this.boundingBox.max.z > 1000) {
		this.controllerScript.camera.far = 20000;
	}
	
	var center = this.boundingBox.max.clone().add(this.boundingBox.min).multiplyScalar(0.5);
	this.controllerScript.center = center;
	if (this.scenes.length == 1) {
		var campos = new THREE.Vector3(0, this.boundingBox.max.y, this.boundingBox.max.z * 2);
		this.controllerScript.camera.position.copy(campos);
		this.controllerScript.camera.position.z *= 2;
		this.cameras[0].position.copy(this.controllerScript.camera.position);
	}
	
	// Bounding box display
	if (this.createBoundingBoxes) {
		
		var that = this;
		this.sceneRoot.map(Vizi.Object, function(o) {
			if (o._parent) {
				
				var decoration = Vizi.Helpers.BoundingBoxDecoration({
					object : o,
					color : 0x00ff00
				});
				
				o._parent.addComponent(decoration);							
				decoration.visible = that.showBoundingBoxes;
			}
		});
	}

	// Resize the grid
	var extent = this.boundingBox.max.clone().sub(this.boundingBox.min);
	
	this.sceneRadius = extent.length();
	
	var scope = Math.pow(10, Math.ceil(log10(this.sceneRadius)));
	
	this.gridSize = scope;
	this.gridStepSize = scope / 100;
	this.createGrid();
}

Vizi.Viewer.prototype.calcSceneStats = function()
{
	this.meshCount = 0;
	this.faceCount = 0;
	
	var that = this;
	var visuals = this.sceneRoot.findNodes(Vizi.Visual);
	var i, len = visuals.length;
	for (i = 0; i < len; i++) {
		var visual = visuals[i];
		var geometry = visual.geometry;
		var nFaces = geometry.faces ? geometry.faces.length : geometry.attributes.index.array.length / 3;
		this.faceCount += nFaces;
		this.meshCount++;		
	}

	this.sceneStats.meshCount = this.meshCount;
	this.sceneStats.faceCount = this.faceCount;
	this.sceneStats.boundingBox = this.boundingBox;
	
	this.dispatchEvent("scenestats", this.sceneStats);	
}

Vizi.Viewer.prototype.setController = function(type) {
	if (!this.boundingBox)
		this.boundingBox = Vizi.SceneUtils.computeBoundingBox(this.sceneRoot);

	var center;
	if (!isFinite(this.boundingBox.max.x)) {
		center = new THREE.Vector3;
	}
	else {
		center = this.boundingBox.max.clone().add(this.boundingBox.min).multiplyScalar(0.5);
	}
	switch (type) {
		case "model" :
			break;
		case "FPS" :
			center.y = 0;
			break;
	}
	this.controllerScript.center = center;
}

Vizi.Viewer.DEFAULT_GRID_SIZE = 100;
Vizi.Viewer.DEFAULT_GRID_STEP_SIZE = 1;
Vizi.Viewer.GRID_COLOR = 0x202020;
Vizi.Viewer.GRID_OPACITY = 0.2;
Vizi.Viewer.DEFAULT_HEADLIGHT_INTENSITY = 1;
goog.provide('Vizi.SpotLight');
goog.require('Vizi.Light');

Vizi.SpotLight = function(param)
{
	param = param || {};

	this.scaledDir = new THREE.Vector3;
	this.positionVec = new THREE.Vector3;
	this.castShadows = ( param.castShadows !== undefined ) ? param.castShadows : Vizi.SpotLight.DEFAULT_CAST_SHADOWS;
	
	Vizi.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
		this.direction = param.object.position.clone().normalize().negate();
		this.targetPos = param.object.target.position.clone();
		this.shadowDarkness = param.object.shadowDarkness;
	}
	else {
		this.direction = param.direction || new THREE.Vector3(0, 0, -1);
		this.targetPos = new THREE.Vector3;
		this.shadowDarkness = ( param.shadowDarkness !== undefined ) ? param.shadowDarkness : Vizi.SpotLight.DEFAULT_SHADOW_DARKNESS;

		var angle = ( param.angle !== undefined ) ? param.angle : Vizi.SpotLight.DEFAULT_ANGLE;
		var distance = ( param.distance !== undefined ) ? param.distance : Vizi.SpotLight.DEFAULT_DISTANCE;
		var exponent = ( param.exponent !== undefined ) ? param.exponent : Vizi.SpotLight.DEFAULT_EXPONENT;

		this.object = new THREE.SpotLight(param.color, param.intensity, distance, angle, exponent);
	}
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        angle: {
	        get: function() {
	            return this.object.angle;
	        },
	        set: function(v) {
	        	this.object.angle = v;
	        }
		},    	
        distance: {
	        get: function() {
	            return this.object.distance;
	        },
	        set: function(v) {
	        	this.object.distance = v;
	        }
    	},    	
        exponent: {
	        get: function() {
	            return this.object.exponent;
	        },
	        set: function(v) {
	        	this.object.exponent = v;
	        }
    	},    	

    });
	
}

goog.inherits(Vizi.SpotLight, Vizi.Light);

Vizi.SpotLight.prototype.realize = function() 
{
	Vizi.Light.prototype.realize.call(this);
}

Vizi.SpotLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform light directions automatically
	// Really bizarre semantics
	if (this.object)
	{
		this.positionVec.set(0, 0, 0);
		var worldmat = this.object.parent.matrixWorld;
		this.positionVec.applyMatrix4(worldmat);
		this.position.copy(this.positionVec);

		this.scaledDir.copy(this.direction);
		this.scaledDir.multiplyScalar(Vizi.Light.DEFAULT_RANGE);
		this.targetPos.copy(this.position);
		this.targetPos.add(this.scaledDir);	
		// this.object.target.position.copy(this.targetPos);
		
		this.updateShadows();
	}
	
	// Update the rest
	Vizi.Light.prototype.update.call(this);
}

Vizi.SpotLight.prototype.updateShadows = function()
{
	if (this.castShadows)
	{
		this.object.castShadow = true;
		this.object.shadowCameraNear = 1;
		this.object.shadowCameraFar = Vizi.Light.DEFAULT_RANGE;
		this.object.shadowCameraFov = 90;

		// light.shadowCameraVisible = true;

		this.object.shadowBias = 0.0001;
		this.object.shadowDarkness = this.shadowDarkness;

		this.object.shadowMapWidth = 1024;
		this.object.shadowMapHeight = 1024;
		
		Vizi.Graphics.instance.enableShadows(true);
	}	
}

Vizi.SpotLight.DEFAULT_DISTANCE = 0;
Vizi.SpotLight.DEFAULT_ANGLE = Math.PI / 2;
Vizi.SpotLight.DEFAULT_EXPONENT = 10;
Vizi.SpotLight.DEFAULT_CAST_SHADOWS = false;
Vizi.SpotLight.DEFAULT_SHADOW_DARKNESS = 0.3;
/**
 * @fileoverview Base class for visual decoration - like Vizi.Visual but not pickable.
 * @author Tony Parisi
 */
goog.provide('Vizi.Decoration');
goog.require('Vizi.Visual');

/**
 * @constructor
 */
Vizi.Decoration = function(param)
{
	param = param || {};
	
	Vizi.Visual.call(this, param);

}

goog.inherits(Vizi.Decoration, Vizi.Visual);

Vizi.Decoration.prototype._componentCategory = "decorations";

Vizi.Decoration.prototype.realize = function()
{
	Vizi.Visual.prototype.realize.call(this);
	this.object.ignorePick = true;
}/**
 * @fileoverview Module Configuration
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.Modules');
goog.require('Vizi.Component');
goog.require('Vizi.Object');
goog.require('Vizi.Application');
goog.require('Vizi.Service');
goog.require('Vizi.Services');
goog.require('Vizi.AnimationService');
goog.require('Vizi.Interpolator');
goog.require('Vizi.KeyFrameAnimator');
goog.require('Vizi.TweenService');
goog.require('Vizi.Behavior');
goog.require('Vizi.BounceBehavior');
goog.require('Vizi.FadeBehavior');
goog.require('Vizi.HighlightBehavior');
goog.require('Vizi.MoveBehavior');
goog.require('Vizi.RotateBehavior');
goog.require('Vizi.ScaleBehavior');
goog.require('Vizi.Camera');
goog.require('Vizi.CameraManager');
goog.require('Vizi.PerspectiveCamera');
goog.require('Vizi.FirstPersonControls');
goog.require('Vizi.OrbitControls');
goog.require('Vizi.FirstPersonControllerScript');
goog.require('Vizi.PointerLockControllerScript');
goog.require('Vizi.PointerLockControls');
goog.require('Vizi.ModelControllerScript');
goog.require('Vizi.DeviceOrientationControls');
goog.require('Vizi.DeviceOrientationControllerScript');
goog.require('Vizi.OculusRiftControls');
goog.require('Vizi.RiftControllerScript');
goog.require('Vizi.EventDispatcher');
goog.require('Vizi.EventService');
goog.require('Vizi.Graphics');
goog.require('Vizi.Helpers');
goog.require('Vizi.Input');
goog.require('Vizi.Keyboard');
goog.require('Vizi.Mouse');
goog.require('Vizi.Gamepad');
goog.require('Vizi.Picker');
goog.require('Vizi.PickManager');
goog.require('Vizi.CylinderDragger');
goog.require('Vizi.PlaneDragger');
goog.require('Vizi.SurfaceDragger');
goog.require('Vizi.Light');
goog.require('Vizi.AmbientLight');
goog.require('Vizi.DirectionalLight');
goog.require('Vizi.PointLight');
goog.require('Vizi.SpotLight');
goog.require('Vizi.Loader');
goog.require('Vizi.HUDScript');
goog.require('Vizi.SkyboxScript');
goog.require('Vizi.SkysphereScript');
goog.require('Vizi.Prefabs');
goog.require('Vizi.Decoration');
goog.require('Vizi.SceneComponent');
goog.require('Vizi.SceneUtils');
goog.require('Vizi.SceneVisual');
goog.require('Vizi.Transform');
goog.require('Vizi.Visual');
goog.require('Vizi.Script');
goog.require('Vizi.System');
goog.require('Vizi.Time');
goog.require('Vizi.Timer');
goog.require('Vizi.Viewer');

/**
 * @constructor
 */
Vizi.Modules = function()
{
}

var CLOSURE_NO_DEPS = true;

goog.provide('Vizi');

Vizi.loadUrl = function(url, element, options) {
	
	options = options || {};
	options.container = element;
	var viewer = new Vizi.Viewer(options);
	var loader = new Vizi.Loader;
	loader.addEventListener("loaded", function(data) { onLoadComplete(data, loadStartTime); }); 
	loader.addEventListener("progress", function(progress) { onLoadProgress(progress); }); 
	var loadStartTime = Date.now();
	loader.loadScene(url);
	viewer.run();

	function onLoadComplete(data, loadStartTime) {
		var loadTime = (Date.now() - loadStartTime) / 1000;
		Vizi.System.log("Vizi.loadUrl, scene loaded in ", loadTime, " seconds.");
		viewer.replaceScene(data);
		if (viewer.cameras.length > 1) {
			viewer.useCamera(1);
		}
		
		if (options.headlight) {
			viewer.setHeadlightOn(true);
		}
	}

	function onLoadProgress(progress) {
		var percentProgress = progress.loaded / progress.total * 100;
		Vizi.System.log("Vizi.loadUrl, ", percentProgress, " % loaded.");
	}

	return { viewer : viewer };
}