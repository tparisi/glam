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
 * @author arv@google.com (Erik Arvidsson)
 *
 * @provideGoog
 */


/**
 * @define {boolean} Overridden to true by the compiler when --closure_pass
 *     or --mark_as_compiled is specified.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {};


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, {@code CLOSURE_UNCOMPILED_DEFINES} may be defined before
 * loading base.js.  If a key is defined in {@code CLOSURE_UNCOMPILED_DEFINES},
 * {@code goog.define} will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var CLOSURE_UNCOMPILED_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object.<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_UNCOMPILED_DEFINES;


/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with goog.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object.<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_DEFINES;


/**
 * Returns true if the specified value is not undefined.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};


/**
 * Builds an object structure for the provided namespace path, ensuring that
 * names that already exist are not overwritten. For example:
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
 * Defines a named value. In uncompiled mode, the value is retreived from
 * CLOSURE_DEFINES or CLOSURE_UNCOMPILED_DEFINES if the object is defined and
 * has the property specified, and otherwise used the defined defaultValue.
 * When compiled the default can be overridden using the compiler
 * options or the value set in the CLOSURE_DEFINES object.
 *
 * @param {string} name The distinguished name to provide.
 * @param {string|number|boolean} defaultValue
 */
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else if (goog.global.CLOSURE_DEFINES &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_DEFINES, name)) {
      value = goog.global.CLOSURE_DEFINES[name];
    }
  }
  goog.exportPath_(name, value);
};


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
goog.define('goog.LOCALE', 'en');  // default to en


/**
 * @define {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define goog.TRUSTED_SITE=false" to the JSCompiler.
 */
goog.define('goog.TRUSTED_SITE', true);


/**
 * @define {boolean} Whether a project is expected to be running in strict mode.
 *
 * This define can be used to trigger alternate implementations compatible with
 * running in EcmaScript Strict mode or warn about unavailable functionality.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
goog.define('goog.STRICT_MODE_COMPATIBLE', false);


/**
 * Creates object stubs for a namespace.  The presence of one or more
 * goog.provide() calls indicate that the file defines the given
 * objects/namespaces.  Provided objects must not be null or undefined.
 * Build tools also scan for provide/require statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 * @see goog.require
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }

  goog.constructNamespace_(name);
};


/**
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 * @param {Object=} opt_obj The object to embed in the namespace.
 * @private
 */
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name, opt_obj);
};


/**
 * goog.module serves two purposes:
 * - marks a file that must be loaded as a module
 * - reserves a namespace (it can not also be goog.provided)
 * and has three requirements:
 * - goog.module may not be used in the same file as goog.provide.
 * - goog.module must be the first statement in the file.
 * - only one goog.module is allowed per file.
 * When a goog.module annotated file is loaded, it is loaded enclosed in
 * a strict function closure. This means that:
 * - any variable declared in a goog.module file are private to the file,
 * not global. Although the compiler is expected to inline the module.
 * - The code must obey all the rules of "strict" JavaScript.
 * - the file will be marked as "use strict"
 *
 * NOTE: unlike goog.provide, goog.module does not declare any symbols by
 * itself.
 *
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part", is expected but not required.
 */
goog.module = function(name) {
  if (!goog.isString(name) || !name) {
    throw Error('Invalid module identifier');
  }
  if (!goog.isInModuleLoader_()) {
    throw Error('Module ' + name + ' has been loaded incorrectly.');
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error('goog.module may only be called once per module.');
  }

  // Store the module name for the loader.
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 *
 * Note: This is not an alternative to goog.require, it does not
 * indicate a hard dependency, instead it is used to indicate
 * an optional dependency or to access the exports of a module
 * that has already been loaded.
 */
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 * @private
 */
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      // goog.require only return a value with-in goog.module files.
      return name in goog.loadedModules_ ?
          goog.loadedModules_[name] :
          goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};


/**
 * @private {?{
 *   moduleName: (string|undefined),
 *   declareTestMethods: boolean
 * }}
 */
goog.moduleLoaderState_ = null;


/**
 * @private
 * @return {boolean} Whether a goog.module is currently being initialized.
 */
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};


/**
 * Indicate that a module's exports that are known test methods should
 * be copied to the global object.  This makes the test methods visible to
 * test runners that inspect the global object.
 *
 * TODO(johnlenz): Make the test framework aware of goog.module so
 * that this isn't necessary. Alternately combine this with goog.setTestOnly
 * to minimize boiler plate.
 */
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw new Error('goog.module.declareTestMethods must be called from ' +
        'within a goog.module');
  }
  goog.moduleLoaderState_.declareTestMethods = true;
};


/**
 * Provide the module's exports as a globally accessible object under the
 * module's declared name.  This is intended to ease migration to goog.module
 * for files that have existing usages.
 */
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error('goog.module.declareLegacyNamespace must be called from ' +
        'within a goog.module');
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error('goog.module must be called prior to ' +
        'goog.module.declareLegacyNamespace.');
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                (opt_message ? ': ' + opt_message : '.'));
  }
};


/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 */
goog.forwardDeclare = function(name) {};


if (!COMPILED) {

  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return (name in goog.loadedModules_) ||
        (!goog.implicitNamespaces_[name] &&
            goog.isDefAndNotNull(goog.getObjectByName(name)));
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares that 'goog' and
   * 'goog.events' must be namespaces.
   *
   * @type {Object.<string, (boolean|undefined)>}
   * @private
   */
  goog.implicitNamespaces_ = {'goog.module': true};

  // NOTE: We add goog.module as an implicit namespace as goog.module is defined
  // here and because the existing module package has not been moved yet out of
  // the goog.module namespace. This satisifies both the debug loader and
  // ahead-of-time dependency management.
}


/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
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
 * @param {!Array.<string>} provides An array of strings with
 *     the names of the objects this file provides.
 * @param {!Array.<string>} requires An array of strings with
 *     the names of the objects this file requires.
 * @param {boolean=} opt_isModule Whether this dependency must be loaded as
 *     a module as declared by goog.module.
 */
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(nnaze): The debug DOM loader was included in base.js as an original way
// to do "debug-mode" development.  The dependency system can sometimes be
// confusing, as can the debug DOM loader's asynchronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the script
// will not load until some point after the current script.  If a namespace is
// needed at runtime, it needs to be defined in a previous script, or loaded via
// require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// https://developers.google.com/closure/library/docs/depswriter
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
goog.define('goog.ENABLE_DEBUG_LOADER', true);


/**
 * @param {string} msg
 * @private
 */
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console['error'](msg);
  }
};


/**
 * Implements a system for the dynamic resolution of dependencies that works in
 * parallel with the BUILD system. Note that all calls to goog.require will be
 * stripped by the JSCompiler when the --closure_pass option is used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide()) in
 *     the form "goog.package.part".
 * @return {?} If called within a goog.module file, the associated namespace or
 *     module otherwise null.
 */
goog.require = function(name) {

  // If the object already exists we do not need do do anything.
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return null;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    goog.logToConsole_(errorMessage);

    throw Error(errorMessage);
  }
};


/**
 * Path for included scripts.
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default, the deps are written.
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
 * @type {(function(string): boolean)|undefined}
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
 * @param {*=} opt_returnValue The single value that will be returned.
 * @param {...*} var_args Optional trailing arguments. These are ignored.
 * @return {?} The first argument. We can't know the type -- just pass it along
 *      without type.
 * @deprecated Use goog.functions.identity instead.
 */
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as an argument
 * because that would make it more difficult to obfuscate our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always returns the same
 * instance object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};


/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the {@code goog.testing.singleton} module. The compiler
 * removes this variable if unused.
 * @type {!Array.<!Function>}
 * @private
 */
goog.instantiatedSingletons_ = [];


/**
 * @define {boolean} Whether to load goog.modules using {@code eval} when using
 * the debug loader.  This provides a better debugging experience as the
 * source is unmodified and can be edited using Chrome Workspaces or
 * similiar.  However in some environments the use of {@code eval} is banned
 * so we provide an alternative.
 */
goog.define('goog.LOAD_MODULE_USING_EVAL', true);


/**
 * @define {boolean} Whether the exports of goog.modules should be sealed when
 * possible.
 */
goog.define('goog.SEAL_MODULE_EXPORTS', goog.DEBUG);


/**
 * The registry of initialized modules:
 * the module identifier to module exports map.
 * @private @const {Object.<string, ?>}
 */
goog.loadedModules_ = {};


/**
 * True if goog.dependencies_ is available.
 * @const {boolean}
 */
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;


if (goog.DEPENDENCIES_ENABLED) {
  /**
   * Object used to keep track of urls that have already been added. This record
   * allows the prevention of circular dependencies.
   * @private {!Object.<string, boolean>}
   */
  goog.included_ = {};


  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts.
   * @private
   * @type {{
   *   pathIsModule: !Object.<string, boolean>,
   *   nameToPath: !Object.<string, string>,
   *   requires: !Object.<string, !Object.<string, boolean>>,
   *   visited: !Object.<string, boolean>,
   *   written: !Object.<string, boolean>
   * }}
   */
  goog.dependencies_ = {
    pathIsModule: {}, // 1 to 1

    nameToPath: {}, // 1 to 1

    requires: {}, // 1 to many

    // Used when resolving dependencies to prevent us from visiting file twice.
    visited: {},

    written: {} // Used to keep track of script files we have written.
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
   * Tries to detect the base path of base.js script that bootstraps Closure.
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
      var script = /** @type {!HTMLScriptElement} */ (scripts[i]);
      var src = script.src;
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
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @private
   */
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /** @const @private {boolean} */
  goog.IS_OLD_IE_ = goog.global.document &&
      goog.global.document.all && !goog.global.atob;


  /**
   * Given a URL initiate retrieval and execution of the module.
   * @param {string} src Script source URL.
   * @private
   */
  goog.importModule_ = function(src) {
    // In an attempt to keep browsers from timing out loading scripts using
    // synchronous XHRs, put each load in its own script block.
    var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';

    if (goog.importScript_('', bootstrap)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /** @private {Array.<string>} */
  goog.queuedModules_ = [];


  /**
   * Retrieve and execute a module.
   * @param {string} src Script source URL.
   * @private
   */
  goog.retrieveAndExecModule_ = function(src) {
    // Canonicalize the path, removing any /./ or /../ since Chrome's debugging
    // console doesn't auto-canonicalize XHR loads as it does <script> srcs.
    var separator;
    while ((separator = src.indexOf('/./')) != -1) {
      src = src.substr(0, separator) + src.substr(separator + '/.'.length);
    }
    while ((separator = src.indexOf('/../')) != -1) {
      var previousComponent = src.lastIndexOf('/', separator - 1);
      src = src.substr(0, previousComponent) +
          src.substr(separator + '/..'.length);
    }

    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;

    var scriptText = null;

    var xhr = new goog.global['XMLHttpRequest']();

    /** @this {Object} */
    xhr.onload = function() {
      scriptText = this.responseText;
    };
    xhr.open('get', src, false);
    xhr.send();

    scriptText = xhr.responseText;

    if (scriptText != null) {
      var execModuleScript = goog.wrapModule_(src, scriptText);
      var isOldIE = goog.IS_OLD_IE_;
      if (isOldIE) {
        goog.queuedModules_.push(execModuleScript);
      } else {
        importScript(src, execModuleScript);
      }
      goog.dependencies_.written[src] = true;
    } else {
      throw new Error('load of ' + src + 'failed');
    }
  };


  /**
   * Return an appropriate module text. Suitable to insert into
   * a script tag (that is unescaped).
   * @param {string} srcUrl
   * @param {string} scriptText
   * @return {string}
   * @private
   */
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return '' +
          'goog.loadModule(function(exports) {' +
          '"use strict";' +
          scriptText +
          '\n' + // terminate any trailing single line comment.
          ';return exports' +
          '});' +
          '\n//# sourceURL=' + srcUrl + '\n';
    } else {
      return '' +
          'goog.loadModule(' +
          goog.global.JSON.stringify(
              scriptText + '\n//# sourceURL=' + srcUrl + '\n') +
          ');';
    }
  };


  /**
   * Load any deferred goog.module loads.
   * @private
   */
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0; i < count; i++) {
        var entry = queue[i];
        goog.globalEval(entry);
      }
    }
  };


  /**
   * @param {function(?):?|string} moduleDef The module definition.
   */
  goog.loadModule = function(moduleDef) {
    // NOTE: we allow function definitions to be either in the from
    // of a string to eval (which keeps the original source intact) or
    // in a eval forbidden environment (CSP) we allow a function definition
    // which in its body must call {@code goog.module}, and return the exports
    // of the module.
    try {
      goog.moduleLoaderState_ = {
        moduleName: undefined, declareTestMethods: false};
      var exports;
      if (goog.isFunction(moduleDef)) {
        exports = moduleDef.call(goog.global, {});
      } else if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
      } else {
        throw Error('Invalid module definition');
      }

      var moduleName = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(moduleName) || !moduleName) {
        throw Error('Invalid module name \"' + moduleName + '\"');
      }

      // Don't seal legacy namespaces as they may be uses as a parent of
      // another namespace
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
        Object.seal(exports);
      }

      goog.loadedModules_[moduleName] = exports;
      if (goog.moduleLoaderState_.declareTestMethods) {
        for (var entry in exports) {
          if (entry.indexOf('test', 0) === 0 ||
              entry == 'tearDown' ||
              entry == 'setUp' ||
              entry == 'setUpPage' ||
              entry == 'tearDownPage') {
            goog.global[entry] = exports[entry];
          }
        }
      }
    } finally {
      goog.moduleLoaderState_ = null;
    }
  };


  /**
   * @private @const {function(string):?}
   */
  goog.loadModuleFromSource_ = function() {
    // NOTE: we avoid declaring parameters or local variables here to avoid
    // masking globals or leaking values into the module definition.
    'use strict';
    var exports = {};
    eval(arguments[0]);
    return exports;
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script url.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;

      // If the user tries to require a new symbol after document load,
      // something has gone terribly wrong. Doing a document.write would
      // wipe out the page.
      if (doc.readyState == 'complete') {
        // Certain test frameworks load base.js multiple times, which tries
        // to write deps.js each time. If that happens, just fail silently.
        // These frameworks wipe the page between each load of base.js, so this
        // is OK.
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }

      var isOldIE = goog.IS_OLD_IE_;

      if (opt_sourceText === undefined) {
        if (!isOldIE) {
          doc.write(
              '<script type="text/javascript" src="' +
                  src + '"></' + 'script>');
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " +
              ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write(
              '<script type="text/javascript" src="' +
                  src + '"' + state + '></' + 'script>');
        }
      } else {
        doc.write(
            '<script type="text/javascript">' +
            opt_sourceText +
            '</' + 'script>');
      }
      return true;
    } else {
      return false;
    }
  };


  /** @private {number} */
  goog.lastNonModuleScriptIndex_ = 0;


  /**
   * A readystatechange handler for legacy IE
   * @param {HTMLScriptElement} script
   * @param {number} scriptIndex
   * @return {boolean}
   * @private
   */
  goog.onScriptLoad_ = function(script, scriptIndex) {
    // for now load the modules when we reach the last script,
    // later allow more inter-mingling.
    if (script.readyState == 'complete' &&
        goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };

  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @private
   */
  goog.writeScripts_ = function() {
    /** @type {!Array.<string>} The scripts we need to write this time. */
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    /** @param {string} path */
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // We have already visited this one. We can get here if we have cyclic
      // dependencies.
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

    // record that we are going to load all these scripts.
    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }

    // If a module is loaded synchronously then we need to
    // clear the current inModuleLoader value, and restore it when we are
    // done loading the current "requires".
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;

    var loadingModule = false;
    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      if (path) {
        if (!deps.pathIsModule[path]) {
          goog.importScript_(goog.basePath + path);
        } else {
          loadingModule = true;
          goog.importModule_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error('Undefined script input');
      }
    }

    // restore the current "module loading state"
    goog.moduleLoaderState_ = moduleState;
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
           // for this edge case.
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
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Returns true if the specified value is null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. As a special case, a function value is not array like, because its
 * length property is fixed to correspond to the number of expected arguments.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  // We do not use goog.isObject here in order to exclude function values.
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};


/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into {@code getUid}. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Whether the given object is alreay assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {Object} obj The object to check.
 * @return {boolean} Whether there an assigned unique id for the object.
 */
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In IE, DOM nodes are not instances of Object and throw an exception if we
  // try to delete.  Instead we try to use removeAttribute.
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
 * with other closure JavaScript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' + ((Math.random() * 1e9) >>> 0);


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
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which this should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind is
 *     deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which this should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
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
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default Chrome
      // extension environment. This means that for Chrome extensions, they get
      // the implementation of Function.prototype.bind that calls goog.bind
      // instead of the native one. Even worse, we don't want to introduce a
      // circular dependency between goog.bind and Function.prototype.bind, so
      // we have to hack this to make sure it works correctly.
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
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
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
goog.now = (goog.TRUSTED_SITE && Date.now) || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


/**
 * Evals JavaScript in the global scope.  In IE this uses execScript, other
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
 * @private {!Object.<string, string>|undefined}
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
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x= 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling goog.getCssName.
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
 * @type {!Object.<string, string>|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand goog.getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = goog.getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object.<string, string>=} opt_values Maps place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};


/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = goog.getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with goog.getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */
goog.getMsgWithFallback = function(a, b) {
  return a;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or goog.exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. goog.exportSymbol('public.path.Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is goog.global.
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
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
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
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * constructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass the name of the
 * method as the second argument to this function. If you do not, you will get a
 * runtime error. This calls the superclass' method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express inheritance
 * relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the compiler will do
 * macro expansion to remove a lot of the extra overhead that this function
 * introduces. The compiler will also enforce a lot of the assumptions that this
 * function makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 * @suppress {es5Strict} This method can not be used in strict mode, but
 *     all Closure Library consumers must depend on this file.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;

  if (goog.STRICT_MODE_COMPATIBLE || (goog.DEBUG && !caller)) {
    throw Error('arguments.caller not defined.  goog.base() cannot be used ' +
                'with strict mode code. See ' +
                'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }

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

  // If we did not find the caller in the prototype chain, then one of two
  // things happened:
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
 * uncompiled code - in compiled code the calls will be inlined and the aliases
 * applied.  In uncompiled code the function is simply run since the aliases as
 * written are valid JavaScript.
 *
 *
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *     (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  fn.call(goog.global);
};


/*
 * To support uncompiled, strict mode bundles that use eval to divide source
 * like so:
 *    eval('someSource;//# sourceUrl sourcefile.js');
 * We need to export the globally defined symbols "goog" and "COMPILED".
 * Exporting "goog" breaks the compiler optimizations, so we required that
 * be defined externally.
 * NOTE: We don't use goog.exportSymbol here because we don't want to trigger
 * extern generation when that compiler option is enabled.
 */
if (!COMPILED) {
  goog.global['COMPILED'] = COMPILED;
}



//==============================================================================
// goog.defineClass implementation
//==============================================================================


/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {Function} superClass The superclass, Object or null.
 * @param {goog.defineClass.ClassDescriptor} def
 *     An object literal describing the
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 */
goog.defineClass = function(superClass, def) {
  // TODO(johnlenz): consider making the superClass an optional parameter.
  var constructor = def.constructor;
  var statics = def.statics;
  // Wrap the constructor prior to setting up the prototype and static methods.
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error('cannot instantiate an interface (no constructor defined).');
    };
  }

  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }

  // Remove all the properties that should not be copied to the prototype.
  delete def.constructor;
  delete def.statics;

  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }

  return cls;
};


/**
 * @typedef {
 *     !Object|
 *     {constructor:!Function}|
 *     {constructor:!Function, statics:(Object|function(Function):void)}}
 */
goog.defineClass.ClassDescriptor;


/**
 * @define {boolean} Whether the instances returned by
 * goog.defineClass should be sealed when possible.
 */
goog.define('goog.defineClass.SEAL_CLASS_INSTANCES', goog.DEBUG);


/**
 * If goog.defineClass.SEAL_CLASS_INSTANCES is enabled and Object.seal is
 * defined, this function will wrap the constructor in a function that seals the
 * results of the provided constructor function.
 *
 * @param {!Function} ctr The constructor whose results maybe be sealed.
 * @param {Function} superClass The superclass constructor.
 * @return {!Function} The replacement constructor.
 * @private
 */
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES &&
      Object.seal instanceof Function) {
    // Don't seal subclasses of unsealable-tagged legacy classes.
    if (superClass && superClass.prototype &&
        superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    /** @this {*} */
    var wrappedCtr = function() {
      // Don't seal an instance of a subclass when it calls the constructor of
      // its super class as there is most likely still setup to do.
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};


// TODO(johnlenz): share these values with the goog.object
/**
 * The names of the fields that are defined on Object.prototype.
 * @type {!Array.<string>}
 * @private
 * @const
 */
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


// TODO(johnlenz): share this function with the goog.object
/**
 * @param {!Object} target The object to add properties to.
 * @param {!Object} source The object to copy properites from.
 * @private
 */
goog.defineClass.applyProperties_ = function(target, source) {
  // TODO(johnlenz): update this to support ES5 getters/setters

  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};


/**
 * Sealing classes breaks the older idiom of assigning properties on the
 * prototype rather than in the constructor.  As such, goog.defineClass
 * must not seal subclasses of these old-style classes until they are fixed.
 * Until then, this marks a class as "broken", instructing defineClass
 * not to seal subclasses.
 * @param {!Function} ctr The legacy constructor to tag as unsealable.
 */
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};


/**
 * Name for unsealable tag property.
 * @const @private {string}
 */
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';

/**
 * @author Tony Parisi
 */
goog.provide('glam.Service');

/**
 * Interface for a Service.
 *
 * Allows multiple different backends for the same type of service.
 * @interface
 */
glam.Service = function() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the Service - Abstract.
 */
glam.Service.prototype.initialize = function(param) {};

/**
 * Terminates the Service - Abstract.
 */
glam.Service.prototype.terminate = function() {};


/**
 * Updates the Service - Abstract.
 */
glam.Service.prototype.update = function() {};
/**
 *
 */
goog.provide('glam.Keyboard');

glam.Keyboard = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	glam.Keyboard.instance = this;
}

glam.Keyboard.prototype.onKeyDown = function(event)
{
}

glam.Keyboard.prototype.onKeyUp = function(event)
{
}

glam.Keyboard.prototype.onKeyPress = function(event)
{
}	        

glam.Keyboard.instance = null;

/* key codes
37: left
38: up
39: right
40: down
*/
glam.Keyboard.KEY_LEFT  = 37;
glam.Keyboard.KEY_UP  = 38;
glam.Keyboard.KEY_RIGHT  = 39;
glam.Keyboard.KEY_DOWN  = 40;

/**
 *
 */
goog.provide('glam.Mouse');

glam.Mouse = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.state = 
	{ x : glam.Mouse.NO_POSITION, y: glam.Mouse.NO_POSITION,

	buttons : { left : false, middle : false, right : false },
	scroll : 0,
	};

	glam.Mouse.instance = this;
};

glam.Mouse.prototype.onMouseMove = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
}

glam.Mouse.prototype.onMouseDown = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = true;
}

glam.Mouse.prototype.onMouseUp = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

glam.Mouse.prototype.onMouseClick = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

glam.Mouse.prototype.onMouseDoubleClick = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

glam.Mouse.prototype.onMouseScroll = function(event, delta)
{
    this.state.scroll = 0; // PUNT!
}


glam.Mouse.prototype.getState = function()
{
	return this.state;
}

glam.Mouse.instance = null;
glam.Mouse.NO_POSITION = Number.MIN_VALUE;

/**
 *
 */
goog.provide('glam.Input');
goog.require('glam.Service');
goog.require('glam.Mouse');
goog.require('glam.Keyboard');

glam.Input = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.mouse = new glam.Mouse();
	this.keyboard = new glam.Keyboard();
	this.gamepad = new glam.Gamepad();
	glam.Input.instance = this;
}

goog.inherits(glam.Input, glam.Service);

glam.Input.prototype.update = function() {
	if (this.gamepad && this.gamepad.update)
		this.gamepad.update();
}

glam.Input.instance = null;
/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Time');

glam.Time = function()
{
	// Freak out if somebody tries to make 2
    if (glam.Time.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
}


glam.Time.prototype.initialize = function(param)
{
	this.currentTime = Date.now();

	glam.Time.instance = this;
}

glam.Time.prototype.update = function()
{
	this.currentTime = Date.now();
}

glam.Time.instance = null;
	        

/**
 *
 */
goog.require('glam.Service');
goog.provide('glam.EventService');

/**
 * The EventService.
 *
 * @extends {glam.Service}
 */
glam.EventService = function() {};

goog.inherits(glam.EventService, glam.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
glam.EventService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
glam.EventService.prototype.terminate = function() {};


/**
 * Updates the EventService.
 */
glam.EventService.prototype.update = function()
{
	do
	{
		glam.EventService.eventsPending = false;
		glam.Application.instance.updateObjects();
	}
	while (glam.EventService.eventsPending);
}
/**
 * @fileoverview EventDispatcher is the base class for any object that sends/receives messages
 * 
 * @author Tony Parisi
 */
goog.provide('glam.EventDispatcher');
goog.require('glam.EventService');
goog.require('glam.Time');

/**
 * @constructor
 */
glam.EventDispatcher = function() {
    this.eventTypes = {};
    this.timestamps = {};
    this.connections = {};
}

glam.EventDispatcher.prototype.addEventListener = function(type, listener) {
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

glam.EventDispatcher.prototype.removeEventListener =  function(type, listener) {
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

glam.EventDispatcher.prototype.dispatchEvent = function(type) {
    var listeners = this.eventTypes[type];

    if (listeners)
    {
    	var now = glam.Time.instance.currentTime;
    	
    	if (this.timestamps[type] < now)
    	{
    		this.timestamps[type] = now;
	    	glam.EventService.eventsPending = true;
	    	
    		[].shift.call(arguments);
	    	for (var i = 0; i < listeners.length; i++)
	        {
                listeners[i].apply(this, arguments);
	        }
    	}
    }
}

glam.EventDispatcher.prototype.hasEventListener = function (subscribers, subscriber) {
    var listeners = this.eventTypes[type];
    if (listeners)
        return (listeners.indexOf(listener) != -1)
    else
    	return false;
}

glam.EventDispatcher.prototype.connect = function(type, target, targetProp) {
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

glam.EventDispatcher.prototype.handleConnection = function(sourceProp, target, targetProp, args) {
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
 * @fileoverview Component is the base class for defining capabilities used within an Object
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Component');
goog.require('glam.EventDispatcher');

/**
 * Creates a new Component.
 * @constructor
 */
glam.Component = function(param) {
    glam.EventDispatcher.call(this);
	
	param = param || {};

    /**
     * @type {glam.Object}
     * @private
     */
    this._object = null;
    
    /**
     * @type {Boolean}
     * @private
     */
    this._realized = false;
}

goog.inherits(glam.Component, glam.EventDispatcher);

/**
 * Gets the Object the Component is associated with.
 * @returns {glam.Object} The Object the Component is associated with.
 */
glam.Component.prototype.getObject = function() {
    return this._object;
}

/**
 * Sets the Object the Component is associated with.
 * @param {glam.Object} object
 */
glam.Component.prototype.setObject = function(object) {
    this._object = object;
}

glam.Component.prototype.realize = function() {
    this._realized = true;
}

glam.Component.prototype.update = function() {
}

/**
 * @fileoverview Behavior component - base class for time-based behaviors
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Behavior');
goog.require('glam.Component');

glam.Behavior = function(param) {
	param = param || {};
	this.startTime = 0;
	this.running = false;
	this.loop = (param.loop !== undefined) ? param.loop : false;
	this.autoStart = (param.autoStart !== undefined) ? param.autoStart : false;
    glam.Component.call(this, param);
}

goog.inherits(glam.Behavior, glam.Component);

glam.Behavior.prototype._componentCategory = "behaviors";

glam.Behavior.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	
	if (this.autoStart)
		this.start();
}

glam.Behavior.prototype.start = function()
{
	this.startTime = glam.Time.instance.currentTime;
	this.running = true;
}

glam.Behavior.prototype.stop = function()
{
	this.startTime = 0;
	this.running = false;
}

glam.Behavior.prototype.toggle = function()
{
	if (this.running)
		this.stop();
	else
		this.start();
}

glam.Behavior.prototype.update = function()
{
	if (this.running)
	{
		// N.B.: soon, add logic to subtract suspend times
		var now = glam.Time.instance.currentTime;
		var elapsedTime = (now - this.startTime) / 1000;
		
		this.evaluate(elapsedTime);
	}
}

glam.Behavior.prototype.evaluate = function(t)
{
	if (glam.Behavior.WARN_ON_ABSTRACT)
		glam.System.warn("Abstract Behavior.evaluate called");
}

glam.Behavior.WARN_ON_ABSTRACT = true;

/**
 * @fileoverview BounceBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.BounceBehavior');
goog.require('glam.Behavior');

glam.BounceBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.bounceVector = (param.bounceVector !== undefined) ? param.bounceVector : new THREE.Vector3(0, 1, 0);
	this.tweenUp = null;
	this.tweenDown = null;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.BounceBehavior, glam.Behavior);

glam.BounceBehavior.prototype.start = function()
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
	
	glam.Behavior.prototype.start.call(this);
}

glam.BounceBehavior.prototype.evaluate = function(t)
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
}
/**
 * @fileoverview General-purpose key frame animation
 * @author Tony Parisi
 */
goog.provide('glam.KeyFrameAnimator');
goog.require('glam.Component');

// KeyFrameAnimator class
// Construction/initialization
glam.KeyFrameAnimator = function(param) 
{
    glam.Component.call(this, param);
	    		
	param = param || {};
	
	this.interpdata = param.interps || [];
	this.animationData = param.animations;
	this.running = false;
	this.direction = glam.KeyFrameAnimator.FORWARD_DIRECTION;
	this.duration = param.duration ? param.duration : glam.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.easing = param.easing;
}

goog.inherits(glam.KeyFrameAnimator, glam.Component);
	
glam.KeyFrameAnimator.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	
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

glam.KeyFrameAnimator.prototype.createInterpolators = function(interpdata)
{
	this.interps = [];
	
	var i, len = interpdata.length;
	for (i = 0; i < len; i++)
	{
		var data = interpdata[i];
		var interp = new glam.Interpolator({ keys: data.keys, values: data.values, target: data.target });
		interp.realize();
		this.interps.push(interp);
	}
}

// Start/stop
glam.KeyFrameAnimator.prototype.start = function()
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
					(this.direction == glam.KeyFrameAnimator.FORWARD_DIRECTION) ?
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

glam.KeyFrameAnimator.prototype.stop = function()
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
glam.KeyFrameAnimator.prototype.update = function()
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

glam.KeyFrameAnimator.prototype.updateAnimations = function()
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
glam.KeyFrameAnimator.default_duration = 1000;
glam.KeyFrameAnimator.FORWARD_DIRECTION = 0;
glam.KeyFrameAnimator.REVERSE_DIRECTION = 1;
/**
 * @fileoverview camera parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CameraElement');

glam.CameraElement.DEFAULT_FOV = 45;
glam.CameraElement.DEFAULT_NEAR = 1;
glam.CameraElement.DEFAULT_FAR = 10000;

glam.CameraElement.create = function(docelt, style, app) {
	
	var fov = docelt.getAttribute('fov') || glam.CameraElement.DEFAULT_FOV;
	var near = docelt.getAttribute('near') || glam.CameraElement.DEFAULT_NEAR;
	var far = docelt.getAttribute('far') || glam.CameraElement.DEFAULT_FAR;
	var aspect = docelt.getAttribute('aspect');
	
	if (style) {
		if (style.fov)
			fov = style.fov;
		if (style.near)
			near = style.near;
		if (style.far)
			far = style.far;
		if (style.aspect)
			aspect = style.aspect;
	}
	
	fov = parseFloat(fov);
	near = parseFloat(near);
	far = parseFloat(far);
	
	var param = {
			fov : fov,
			near : near,
			far : far,
	};

	if (aspect) {
		aspect = parseFloat(aspect);
		param.aspect = aspect;
	}
	
	var camera = new glam.Object;	
	var cam = new glam.PerspectiveCamera(param);
	camera.addComponent(cam);
	
	app.addCamera(cam, docelt.id);
	
	return camera;
}

/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('glam.SceneComponent');
goog.require('glam.Component');

/**
 * @constructor
 */
glam.SceneComponent = function(param)
{	
	param = param || {};

	glam.Component.call(this, param);
    
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

goog.inherits(glam.SceneComponent, glam.Component);

glam.SceneComponent.prototype.realize = function()
{
	if (this.object && !this.object.data)
	{
		this.addToScene();
	}
	
	glam.Component.prototype.realize.call(this);
}

glam.SceneComponent.prototype.update = function()
{	
	glam.Component.prototype.update.call(this);
}

glam.SceneComponent.prototype.addToScene = function() {
	var scene = this.layer ? this.layer.scene : glam.Graphics.instance.scene;
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

glam.SceneComponent.prototype.removeFromScene = function() {
	var scene = this.layer ? this.layer.scene : glam.Graphics.instance.scene;
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

goog.provide('glam.Light');
goog.require('glam.SceneComponent');

glam.Light = function(param)
{
	param = param || {};
	glam.SceneComponent.call(this, param);
	
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

goog.inherits(glam.Light, glam.SceneComponent);

glam.Light.prototype._componentProperty = "light";
glam.Light.prototype._componentPropertyType = "Light";

glam.Light.prototype.realize = function() 
{
	glam.SceneComponent.prototype.realize.call(this);
}

glam.Light.DEFAULT_COLOR = 0xFFFFFF;
glam.Light.DEFAULT_INTENSITY = 1;
glam.Light.DEFAULT_RANGE = 10000;
goog.provide('glam.SpotLight');
goog.require('glam.Light');

glam.SpotLight = function(param)
{
	param = param || {};

	this.scaledDir = new THREE.Vector3;
	this.positionVec = new THREE.Vector3;
	this.castShadows = ( param.castShadows !== undefined ) ? param.castShadows : glam.SpotLight.DEFAULT_CAST_SHADOWS;
	
	glam.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
		this.direction = param.object.position.clone().normalize().negate();
		this.targetPos = param.object.target.position.clone();
		this.shadowDarkness = param.object.shadowDarkness;
	}
	else {
		this.direction = param.direction || new THREE.Vector3(0, 0, -1);
		this.targetPos = new THREE.Vector3;
		this.shadowDarkness = ( param.shadowDarkness !== undefined ) ? param.shadowDarkness : glam.SpotLight.DEFAULT_SHADOW_DARKNESS;

		var angle = ( param.angle !== undefined ) ? param.angle : glam.SpotLight.DEFAULT_ANGLE;
		var distance = ( param.distance !== undefined ) ? param.distance : glam.SpotLight.DEFAULT_DISTANCE;
		var exponent = ( param.exponent !== undefined ) ? param.exponent : glam.SpotLight.DEFAULT_EXPONENT;

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

goog.inherits(glam.SpotLight, glam.Light);

glam.SpotLight.prototype.realize = function() 
{
	glam.Light.prototype.realize.call(this);
}

glam.SpotLight.prototype.update = function() 
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
		this.scaledDir.multiplyScalar(glam.Light.DEFAULT_RANGE);
		this.targetPos.copy(this.position);
		this.targetPos.add(this.scaledDir);	
		// this.object.target.position.copy(this.targetPos);
		
		this.updateShadows();
	}
	
	// Update the rest
	glam.Light.prototype.update.call(this);
}

glam.SpotLight.prototype.updateShadows = function()
{
	if (this.castShadows)
	{
		this.object.castShadow = true;
		this.object.shadowCameraNear = 1;
		this.object.shadowCameraFar = glam.Light.DEFAULT_RANGE;
		this.object.shadowCameraFov = 90;

		// light.shadowCameraVisible = true;

		this.object.shadowBias = 0.0001;
		this.object.shadowDarkness = this.shadowDarkness;

		this.object.shadowMapWidth = 1024;
		this.object.shadowMapHeight = 1024;
		
		glam.Graphics.instance.enableShadows(true);
	}	
}

glam.SpotLight.DEFAULT_DISTANCE = 0;
glam.SpotLight.DEFAULT_ANGLE = Math.PI / 2;
glam.SpotLight.DEFAULT_EXPONENT = 10;
glam.SpotLight.DEFAULT_CAST_SHADOWS = false;
glam.SpotLight.DEFAULT_SHADOW_DARKNESS = 0.3;

/**
 *
 */
goog.provide('glam.Transform');
goog.require('glam.SceneComponent');

glam.Transform = function(param) {
	param = param || {};
    glam.SceneComponent.call(this, param);

    if (param.object) {
		this.object = param.object;    	
    }
    else {
    	this.object = new THREE.Object3D();
    }
}

goog.inherits(glam.Transform, glam.SceneComponent);

glam.Transform.prototype._componentProperty = "transform";
glam.Transform.prototype._componentPropertyType = "Transform";

glam.Transform.prototype.addToScene = function() {
	var scene = this.layer ? this.layer.scene : glam.Graphics.instance.scene;
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

glam.Transform.prototype.removeFromScene = function() {
	var scene = this.layer ? this.layer.scene : glam.Graphics.instance.scene;
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
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Graphics');

glam.Graphics = function()
{
	// Freak out if somebody tries to make 2
    if (glam.Graphics.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
	
	glam.Graphics.instance = this;
}
	        
glam.Graphics.instance = null;

/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 *
 * @author Tony Parisi
 */
goog.require('glam.Graphics');
goog.provide('glam.GraphicsThreeJS');

glam.GraphicsThreeJS = function()
{
	glam.Graphics.call(this);
}

goog.inherits(glam.GraphicsThreeJS, glam.Graphics);

glam.GraphicsThreeJS.prototype.initialize = function(param)
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

glam.GraphicsThreeJS.prototype.focus = function()
{
	if (this.renderer && this.renderer.domElement)
	{
		this.renderer.domElement.focus();
	}
}

glam.GraphicsThreeJS.prototype.initOptions = function(param)
{
	this.displayStats = (param && param.displayStats) ?
			param.displayStats : glam.GraphicsThreeJS.default_display_stats;
}

glam.GraphicsThreeJS.prototype.initPageElements = function(param)
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
    		glam.System.warn("No Stats module found. Make sure to include stats.min.js");
    	}
    }
}

glam.GraphicsThreeJS.prototype.initScene = function()
{
    var scene = new THREE.Scene();

//    scene.add( new THREE.AmbientLight(0xffffff) ); //  0x505050 ) ); //

    var camera = new THREE.PerspectiveCamera( 45,
    		this.container.offsetWidth / this.container.offsetHeight, 1, 10000 );
    camera.position.copy(glam.Camera.DEFAULT_POSITION);

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

glam.GraphicsThreeJS.prototype.initRenderer = function(param)
{
	var antialias = (param.antialias !== undefined) ? param.antialias : true;
	var alpha = (param.alpha !== undefined) ? param.alpha : true;
	//var devicePixelRatio = (param.devicePixelRatio !== undefined) ? param.devicePixelRatio : 1;

    var renderer = // glam.Config.USE_WEBGL ?
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
    	this.riftCam = new THREE.VREffect(this.renderer, function(err) {
			if (err) {
				console.log("Error creating VR renderer: ", err);
			}
    	});
    }
    else if (param.cardboard) {
    	this.cardboard = new THREE.StereoEffect(this.renderer);
    	this.cardboard.setSize( this.container.offsetWidth, this.container.offsetHeight );
    }

    // Placeholder for effects composer
    this.composer = null;
}

glam.GraphicsThreeJS.prototype.initMouse = function()
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

glam.GraphicsThreeJS.prototype.initKeyboard = function()
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

glam.GraphicsThreeJS.prototype.addDomHandlers = function()
{
	var that = this;
	window.addEventListener( 'resize', function(event) { that.onWindowResize(event); }, false );

	setTimeout(function(event) { that.onWindowResize(event); }, 10);

	var fullScreenChange =
		this.renderer.domElement.mozRequestFullScreen? 'mozfullscreenchange' : 'webkitfullscreenchange';

	document.addEventListener( fullScreenChange,
			function(e) {that.onFullScreenChanged(e); }, false );

}

glam.GraphicsThreeJS.prototype.objectFromMouse = function(event)
{
	var eltx = event.elementX, elty = event.elementY;

	// translate client coords into vp x,y
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;

    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    vector.unproject( this.camera );

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

glam.GraphicsThreeJS.prototype.objectFromRay = function(hierarchy, origin, direction, near, far)
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


glam.GraphicsThreeJS.prototype.findObjectFromIntersected = function(object, point, face)
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

glam.GraphicsThreeJS.prototype.nodeFromMouse = function(event)
{
	// Blerg, this is to support code outside the SB components & picker framework
	// Returns a raw Three.js node

	// translate client coords into vp x,y
	var eltx = event.elementX, elty = event.elementY;

    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;

    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    vector.unproject( this.camera );

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

glam.GraphicsThreeJS.prototype.getObjectIntersection = function(x, y, object)
{
	// Translate client coords into viewport x,y
	var vpx = ( x / this.renderer.domElement.offsetWidth ) * 2 - 1;
	var vpy = - ( y / this.renderer.domElement.offsetHeight ) * 2 + 1;

    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    vector.unproject( this.camera );

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

glam.GraphicsThreeJS.prototype.calcElementOffset = function(offset) {

	offset.left = this.renderer.domElement.offsetLeft;
	offset.top = this.renderer.domElement.offsetTop;

	var parent = this.renderer.domElement.offsetParent;
	while(parent) {
		offset.left += parent.offsetLeft;
		offset.top += parent.offsetTop;
		parent = parent.offsetParent;
	}
}

glam.GraphicsThreeJS.prototype.onDocumentMouseMove = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);

	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;

	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY,
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey };

    glam.Mouse.instance.onMouseMove(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseMove(evt);
    }

    glam.Application.handleMouseMove(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseDown = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);

	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;

	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY,
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };

    glam.Mouse.instance.onMouseDown(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseDown(evt);
    }

    glam.Application.handleMouseDown(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseUp = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);

	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;

	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY,
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };

    glam.Mouse.instance.onMouseUp(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseUp(evt);
    }

    glam.Application.handleMouseUp(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseClick = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);

	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;

	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY,
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };

    glam.Mouse.instance.onMouseClick(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseClick(evt);
    }

    glam.Application.handleMouseClick(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseDoubleClick = function(event)
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

    glam.Mouse.instance.onMouseDoubleClick(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseDoubleClick(evt);
    }

    glam.Application.handleMouseDoubleClick(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseScroll = function(event)
{
    event.preventDefault();

	var delta = 0;

	if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

		delta = event.wheelDelta;

	} else if ( event.detail ) { // Firefox

		delta = - event.detail;

	}

	var evt = { type : "mousescroll", delta : delta };

    glam.Mouse.instance.onMouseScroll(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseScroll(evt);
    }

    glam.Application.handleMouseScroll(evt);
}

// Touch events
glam.GraphicsThreeJS.prototype.translateTouch = function(touch, offset) {

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

glam.GraphicsThreeJS.prototype.onDocumentTouchStart = function(event)
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

    if (glam.PickManager)
    {
    	glam.PickManager.handleTouchStart(evt);
    }

    glam.Application.handleTouchStart(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentTouchMove = function(event)
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

    if (glam.PickManager)
    {
    	glam.PickManager.handleTouchMove(evt);
    }

    glam.Application.handleTouchMove(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentTouchEnd = function(event)
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

    if (glam.PickManager)
    {
    	glam.PickManager.handleTouchEnd(evt);
    }

    glam.Application.handleTouchEnd(evt);
}


glam.GraphicsThreeJS.prototype.onKeyDown = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    glam.Keyboard.instance.onKeyDown(event);

	glam.Application.handleKeyDown(event);
}

glam.GraphicsThreeJS.prototype.onKeyUp = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    glam.Keyboard.instance.onKeyUp(event);

	glam.Application.handleKeyUp(event);
}

glam.GraphicsThreeJS.prototype.onKeyPress = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    glam.Keyboard.instance.onKeyPress(event);

	glam.Application.handleKeyPress(event);
}

glam.GraphicsThreeJS.prototype.onWindowResize = function(event)
{
	var width = this.container.offsetWidth,
		height = this.container.offsetHeight;

	// HACK HACK HACK seems to be the only reliable thing and even this
	// is dicey on Chrome. Is there a race condition?
	if (this.riftCam) {
		width = window.innerWidth;
		height = window.innerHeight;
	}

	if (this.cardboard) {
		this.cardboard.setSize(width, height);
	}

	this.renderer.setSize(width, height);

	if (this.composer) {
		this.composer.setSize(width, height);
	}


	if (glam.CameraManager && glam.CameraManager.handleWindowResize(this.container.offsetWidth, this.container.offsetHeight))
	{
	}
	else
	{
		this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
		this.camera.updateProjectionMatrix();
	}
}

glam.GraphicsThreeJS.prototype.onFullScreenChanged = function(event) {

	if ( !document.mozFullscreenElement && !document.webkitFullscreenElement ) {
		this.fullscreen = false;
	}
	else {
		this.fullscreen = true;
	}
}




glam.GraphicsThreeJS.prototype.setCursor = function(cursor)
{
	if (!cursor)
		cursor = this.saved_cursor;

	this.container.style.cursor = cursor;
}


glam.GraphicsThreeJS.prototype.update = function()
{
    var frameTime = Date.now();
    var deltat = (frameTime - this.lastFrameTime) / 1000;
    this.frameRate = 1 / deltat;

    this.lastFrameTime = frameTime;

	// N.B.: start with hack, let's see how it goes...
	if (this.composer) {
		this.renderEffects(deltat);
	}
	else if (this.cardboard) {
		this.renderStereo();
	}
    else if (this.riftCam && this.riftCam._vrHMD) {
		this.renderVR();
	}
	else {
		this.render();
	}

    if (this.stats)
    {
    	this.stats.update();
    }
}

glam.GraphicsThreeJS.prototype.render = function() {
    this.renderer.setClearColor( 0, 0 );
	this.renderer.autoClearColor = true;
    this.renderer.render( this.backgroundLayer.scene, this.backgroundLayer.camera );
    this.renderer.setClearColor( 0, 1 );
	this.renderer.autoClearColor = false;
    this.renderer.render( this.scene, this.camera );
}

glam.GraphicsThreeJS.prototype.renderVR = function() {
	// start with 2 layer to test; will need to work in postprocessing when that's ready
    this.riftCam.render([this.backgroundLayer.scene, this.scene], [this.backgroundLayer.camera, this.camera]);
}

glam.GraphicsThreeJS.prototype.renderEffects = function(deltat) {
	this.composer.render(deltat);
}

glam.GraphicsThreeJS.prototype.renderStereo = function() {
	// start with 2 layer to test; will need to work in postprocessing when that's ready
    this.cardboard.render([this.backgroundLayer.scene, this.scene], [this.backgroundLayer.camera, this.camera]);
//    this.cardboard.render(this.scene, this.camera);
}

glam.GraphicsThreeJS.prototype.enableShadows = function(enable)
{
	this.renderer.shadowMapEnabled = enable;
	this.renderer.shadowMapSoft = enable;
	this.renderer.shadowMapCullFrontFaces = false;
}

glam.GraphicsThreeJS.prototype.setFullScreen = function(enable)
{
	if (this.riftCam) {

		this.fullscreen = enable;

		this.riftCam.setFullScreen(enable);
	}
	else if (this.cardboard) {

		var canvas = this.renderer.domElement;

		if (enable) {
			if ( this.container.mozRequestFullScreen ) {
				this.container.mozRequestFullScreen();
			} else {
				this.container.webkitRequestFullscreen();
			}
		}
		else {
			if ( document.mozCancelFullScreen ) {
				document.mozCancelFullScreen();
			} else {
				document.webkitExitFullscreen();
			}
		}
	}
}

glam.GraphicsThreeJS.prototype.setCamera = function(camera) {
	this.camera = camera;
	if (this.composer) {
		this.composer.setCamera(camera);
	}
}

glam.GraphicsThreeJS.prototype.addEffect = function(effect) {

	if (!this.composer) {
		this.composer = new glam.Composer();
	}

	if (!this.effects) {
		this.effects  = [];
	}

	if (effect.isShaderEffect) {
		for (var i = 0; i < this.effects.length; i++) {
			var ef = this.effects[i];
//			ef.pass.renderToScreen = false;
		}
//		effect.pass.renderToScreen = true;
	}

	this.effects.push(effect);
	this.composer.addEffect(effect);
}

glam.GraphicsThreeJS.default_display_stats = false;

/**
 *
 */
goog.require('glam.Service');
goog.provide('glam.TweenService');

/**
 * The TweenService.
 *
 * @extends {glam.Service}
 */
glam.TweenService = function() {};

goog.inherits(glam.TweenService, glam.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
glam.TweenService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
glam.TweenService.prototype.terminate = function() {};


/**
 * Updates the TweenService.
 */
glam.TweenService.prototype.update = function()
{
	if (window.TWEEN)
		TWEEN.update();
}

/**
 * @fileoverview Service locator for various game services.
 */
goog.provide('glam.Services');
goog.require('glam.Time');
goog.require('glam.Input');
goog.require('glam.TweenService');
goog.require('glam.EventService');
goog.require('glam.GraphicsThreeJS');

glam.Services = {};

glam.Services._serviceMap = 
{ 
		"time" : { object : glam.Time },
		"input" : { object : glam.Input },
		"tween" : { object : glam.TweenService },
		"events" : { object : glam.EventService },
		"graphics" : { object : glam.GraphicsThreeJS },
};

glam.Services.create = function(serviceName)
{
	var serviceType = glam.Services._serviceMap[serviceName];
	if (serviceType)
	{
		var prop = serviceType.property;
		
		if (glam.Services[serviceName])
		{
	        throw new Error('Cannot create two ' + serviceName + ' service instances');
		}
		else
		{
			if (serviceType.object)
			{
				var service = new serviceType.object;
				glam.Services[serviceName] = service;

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

glam.Services.registerService = function(serviceName, object)
{
	if (glam.Services._serviceMap[serviceName])
	{
        throw new Error('Service ' + serviceName + 'already registered; cannot register twice');
	}
	else
	{
		var serviceType = { object: object };
		glam.Services._serviceMap[serviceName] = serviceType;
	}
}
/**
 * @fileoverview glam namespace and globals
 * 
 * @author Tony Parisi
 */


goog.provide('glam.DOM');

glam.DOM = {

		documents : {},
		
		documentIndex : 0,
				
		styles : {},

		viewers : {},

		animations : {},
		
};

glam.DOM.isReady = false;
glam.DOM.ready = function() {
	if (glam.DOM.isReady)
		return;
	
	glam.DOMParser.parseDocument();
	glam.DOM.createViewers();
	
	glam.DOM.isReady = true;
}

glam.DOM.createViewers = function() {
	for (var docname in glam.DOM.documents) {
		var doc = glam.DOM.documents[docname];
		var viewer = new glam.DOMViewer(doc);
		glam.DOM.viewers[docname] = viewer;
		viewer.go();
	}
}


glam.DOM.addStyle = function(selector, style)
{
	glam.DOM.styles[selector] = style;
}

glam.DOM.getStyle = function(selector)
{
	return glam.DOM.styles[selector];
}

glam.DOM.addAnimation = function(id, animation)
{
	glam.DOM.animations[id] = animation;
}

glam.DOM.getAnimation = function(id) {
	return glam.DOM.animations[id];
}

window.addEventListener('load',
	function() {
		glam.DOM.ready();
	}, 
	false);


/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Picker');
goog.require('glam.Component');

glam.Picker = function(param) {
	param = param || {};
	
    glam.Component.call(this, param);
    this.overCursor = param.overCursor;
    this.enabled = (param.enabled !== undefined) ? param.enabled : true;
}

goog.inherits(glam.Picker, glam.Component);

glam.Picker.prototype._componentCategory = "pickers";

glam.Picker.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	
    this.lastHitPoint = new THREE.Vector3;
    this.lastHitNormal = new THREE.Vector3;
    this.lastHitFace = new THREE.Face3;
}

glam.Picker.prototype.update = function()
{
}

glam.Picker.prototype.toModelSpace = function(vec)
{
	var modelMat = new THREE.Matrix4;
	modelMat.getInverse(this._object.transform.object.matrixWorld);
	vec.applyMatrix4(modelMat);
}

glam.Picker.prototype.onMouseOver = function(event)
{
    this.dispatchEvent("mouseover", event);
}

glam.Picker.prototype.onMouseOut = function(event)
{
    this.dispatchEvent("mouseout", event);
}
	        	        
glam.Picker.prototype.onMouseMove = function(event)
{
	var mouseOverObject = glam.PickManager.objectFromMouse(event);
	if (this._object == glam.PickManager.clickedObject || this._object == mouseOverObject)
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

glam.Picker.prototype.onMouseDown = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;
	
    this.dispatchEvent("mousedown", event);
}

glam.Picker.prototype.onMouseUp = function(event)
{
	var mouseOverObject = glam.PickManager.objectFromMouse(event);
	if (mouseOverObject != this._object)
	{
		event.point = this.lastHitPoint;
		event.normal = this.lastHitNormal;
		event.face = this.lastHitNormal;
		this.dispatchEvent("mouseout", event);
	}

	this.dispatchEvent("mouseup", event);
}

glam.Picker.prototype.onMouseClick = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;

	this.dispatchEvent("click", event);
}
	        
glam.Picker.prototype.onMouseDoubleClick = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;

	this.dispatchEvent("dblclick", event);
}
	
glam.Picker.prototype.onMouseScroll = function(event)
{
    this.dispatchEvent("mousescroll", event);
}

glam.Picker.prototype.onTouchMove = function(event)
{
	this.dispatchEvent("touchmove", event);
}

glam.Picker.prototype.onTouchStart = function(event)
{	
    this.dispatchEvent("touchstart", event);
}

glam.Picker.prototype.onTouchEnd = function(event)
{
	this.dispatchEvent("touchend", event);
}



/**
 * @fileoverview Picker component - get drag for an object along the surface of a reference object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.SurfaceDragger');
goog.require('glam.Picker');

glam.SurfaceDragger = function(param) {
	
	param = param || {};
	
    glam.Picker.call(this, param);
    
    this.reference = param.reference;
	this.dragPlane = new THREE.Plane();
}

goog.inherits(glam.SurfaceDragger, glam.Picker);

glam.SurfaceDragger.prototype.realize = function()
{
	glam.Picker.prototype.realize.call(this);

}

glam.SurfaceDragger.prototype.update = function()
{
}

glam.SurfaceDragger.prototype.onMouseDown = function(event)
{
	glam.Picker.prototype.onMouseDown.call(this, event);
	
	var visual = this.reference.visuals[0];
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, visual.object);
	if (intersection) {

		var hitpoint = intersection.point.clone();
		this.dragOffset = event.point.clone().sub(this._object.transform.position);
        this.dispatchEvent("dragstart", {
            type : "dragstart",
            offset : hitpoint
        });
	}

}

glam.SurfaceDragger.prototype.onMouseUp = function(event) {
	glam.Picker.prototype.onMouseUp.call(this, event);
    this.dispatchEvent("dragend", {
        type : "dragend",
    });
}

glam.SurfaceDragger.prototype.onMouseMove = function(event)
{
	glam.Picker.prototype.onMouseMove.call(this, event);
	
	var visual = this.reference.visuals[0];
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, visual.object);
	
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
 * @fileoverview renderer parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMRenderer');

glam.DOMRenderer = {
};

/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('glam.Visual');
goog.require('glam.SceneComponent');

/**
 * @constructor
 */
glam.Visual = function(param)
{
	param = param || {};
	
	glam.SceneComponent.call(this, param);

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

goog.inherits(glam.Visual, glam.SceneComponent);

// We're going to let this slide until we figure out the glTF mulit-material mesh
//glam.Visual.prototype._componentProperty = "visual";
//glam.Visual.prototype._componentPropertyType = "Visual";
glam.Visual.prototype._componentCategory = "visuals";

glam.Visual.prototype.realize = function()
{
	glam.SceneComponent.prototype.realize.call(this);
	
	if (!this.object && this.geometry && this.material) {
		this.object = new THREE.Mesh(this.geometry, this.material);
		this.object.ignorePick = false;
	    this.addToScene();
	}	
}


/**
 * @fileoverview Base class for visual decoration - like glam.Visual but not pickable.
 * @author Tony Parisi
 */
goog.provide('glam.Decoration');
goog.require('glam.Visual');

/**
 * @constructor
 */
glam.Decoration = function(param)
{
	param = param || {};
	
	glam.Visual.call(this, param);

}

goog.inherits(glam.Decoration, glam.Visual);

glam.Decoration.prototype._componentCategory = "decorations";

glam.Decoration.prototype.realize = function()
{
	glam.Visual.prototype.realize.call(this);
	this.object.ignorePick = true;
}
/**
 * @fileoverview Interpolator for key frame animation
 * @author Tony Parisi
 */
goog.provide('glam.Interpolator');
goog.require('glam.EventDispatcher');

//Interpolator class
//Construction/initialization
glam.Interpolator = function(param) 
{
	glam.EventDispatcher.call(param);
	    		
	param = param || {};
	
	this.keys = param.keys || [];
	this.values = param.values || [];
	this.target = param.target ? param.target : null;
	this.running = false;
}

goog.inherits(glam.Interpolator, glam.EventDispatcher);
	
glam.Interpolator.prototype.realize = function()
{
	if (this.keys && this.values)
	{
		this.setValue(this.keys, this.values);
	}	    		
}

glam.Interpolator.prototype.setValue = function(keys, values)
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
glam.Interpolator.prototype.copyKeys = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		to[i] = from[i];
	}
}

glam.Interpolator.prototype.copyValues = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		var val = {};
		this.copyValue(from[i], val);
		to[i] = val;
	}
}

glam.Interpolator.prototype.copyValue = function(from, to)
{
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		to[ property ] = from[ property ];
	}
}

//Interpolation and tweening methods
glam.Interpolator.prototype.interp = function(fract)
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

glam.Interpolator.prototype.tween = function(from, to, fract)
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

/**
 * @fileoverview 2D arc parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ArcElement');

glam.ArcElement.DEFAULT_RADIUS = 2;
glam.ArcElement.DEFAULT_RADIUS_SEGMENTS = 32;
glam.ArcElement.DEFAULT_START_ANGLE = "0deg";
glam.ArcElement.DEFAULT_END_ANGLE = "360deg";

glam.ArcElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.ArcElement);
}

glam.ArcElement.getAttributes = function(docelt, style, param) {

	function parseRotation(r) {
		return glam.DOMTransform.parseRotation(r);
	}
	
	var radius = docelt.getAttribute('radius') || glam.ArcElement.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.ArcElement.DEFAULT_RADIUS_SEGMENTS;

	var startAngle = docelt.getAttribute('startAngle') || glam.ArcElement.DEFAULT_START_ANGLE;
	var endAngle = docelt.getAttribute('endAngle') || glam.ArcElement.DEFAULT_END_ANGLE;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.radiusSegments)
			radiusSegments = style.radiusSegments;
		if (style.startAngle)
			startAngle = style.startAngle;
		if (style.endAngle)
			endAngle = style.endAngle;
	}
	
	radius = parseFloat(radius);
	radiusSegments = parseInt(radiusSegments);
	startAngle = parseRotation(startAngle);
	endAngle = parseRotation(endAngle);

	param.radius = radius;
	param.radiusSegments = radiusSegments;
	param.startAngle = startAngle;
	param.endAngle = endAngle;
}

glam.ArcElement.createVisual = function(docelt, material, param) {
	
	var visual = new glam.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments, param.startAngle, param.endAngle),
				material: material
			});

	return visual;
}

/**
 * @fileoverview Contains prefab assemblies for core GLAM package
 * @author Tony Parisi
 */
goog.provide('glam.Prefabs');
/**
 * @fileoverview Behavior component - base class for time-based behaviors
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Script');
goog.require('glam.Component');

glam.Script = function(param) {
	param = param || {};
    glam.Component.call(this, param);
}

goog.inherits(glam.Script, glam.Component);

glam.Script.prototype._componentCategory = "scripts";

glam.Script.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
}

glam.Script.prototype.update = function()
{
	if (glam.Script.WARN_ON_ABSTRACT)
		glam.System.warn("Abstract Script.evaluate called");
}

glam.Script.WARN_ON_ABSTRACT = true;


goog.require('glam.Prefabs');

glam.Prefabs.FirstPersonController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.FirstPersonControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('glam.FirstPersonControllerScript');
goog.require('glam.Script');

glam.FirstPersonControllerScript = function(param)
{
	glam.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._move = (param.move !== undefined) ? param.move : true;
	this._look = (param.look !== undefined) ? param.look : true;
	this._turn = (param.turn !== undefined) ? param.turn : true;
	this._tilt = (param.tilt !== undefined) ? param.tilt : true;
	this._mouseLook = (param.mouseLook !== undefined) ? param.mouseLook : false;
	this.testCollisions = (param.testCollisions !== undefined) ? param.testCollisions : false;
	
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

goog.inherits(glam.FirstPersonControllerScript, glam.Script);

glam.FirstPersonControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.FirstPersonControllerScript.prototype.createControls = function(camera)
{
	var controls = new glam.FirstPersonControls(camera.object, glam.Graphics.instance.container);
	controls.mouseLook = this._mouseLook;
	controls.movementSpeed = this._move ? this.moveSpeed : 0;
	controls.lookSpeed = this._look ? this.lookSpeed  : 0;
	controls.turnSpeed = this._turn ? this.turnSpeed : 0;
	controls.tiltSpeed = this._tilt ? this.tiltSpeed : 0;

	this.clock = new THREE.Clock();
	return controls;
}

glam.FirstPersonControllerScript.prototype.update = function()
{
	this.saveCamera();
	this.controls.update(this.clock.getDelta());
	if (this.testCollisions) {
		var collide = this.testCollision();
	}
	else {
		var collide = null;
	}
	
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

glam.FirstPersonControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

glam.FirstPersonControllerScript.prototype.setMove = function(move)
{
	this._move = move;
	this.controls.movementSpeed = move ? this.moveSpeed : 0;
}

glam.FirstPersonControllerScript.prototype.setLook = function(look)
{
	this._look = look;
	this.controls.lookSpeed = look ? 1.0 : 0;
}

glam.FirstPersonControllerScript.prototype.setMouseLook = function(mouseLook)
{
	this._mouseLook = mouseLook;
	this.controls.mouseLook = mouseLook;
}

glam.FirstPersonControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
	this.controls.movementSpeed = this.moveSpeed;
	this.controls.lookSpeed = this._look ?  0.1 : 0;

}

glam.FirstPersonControllerScript.prototype.saveCamera = function() {
	this.savedCameraPos.copy(this._camera.position);
}

glam.FirstPersonControllerScript.prototype.restoreCamera = function() {
	this._camera.position.copy(this.savedCameraPos);
}

glam.FirstPersonControllerScript.prototype.testCollision = function() {
	
	this.movementVector.copy(this._camera.position).sub(this.savedCameraPos);
	if (this.movementVector.length()) {
		
        var collide = glam.Graphics.instance.objectFromRay(null, 
        		this.savedCameraPos,
        		this.movementVector, 1, 2);

        if (collide && collide.object) {
        	var dist = this.savedCameraPos.distanceTo(collide.hitPointWorld);
        }
        
        return collide;
	}
	
	return null;
}

glam.FirstPersonControllerScript.prototype.testTerrain = function() {
	return false;
}

glam.FirstPersonControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}


/**
 * @fileoverview General-purpose transitions
 * @author Tony Parisi
 */
goog.provide('glam.Transition');
goog.require('glam.Component');

// Transition class
// Construction/initialization
glam.Transition = function(param) 
{
    glam.Component.call(this, param);
	    		
	param = param || {};
	
	this.running = false;
	this.duration = param.duration ? param.duration : glam.Transition.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.autoStart = param.autoStart || false;
	this.easing = param.easing || glam.Transition.default_easing;
	this.target = param.target;
	this.to = param.to;
}

goog.inherits(glam.Transition, glam.Component);
	
glam.Transition.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	this.createTweens();
	if (this.autoStart) {
		this.start();
	}
}

glam.Transition.prototype.createTweens = function()
{
	var repeatCount = this.loop ? Infinity : 0;
	
	var that = this;
	this.tween = new TWEEN.Tween(this.target)
		.to(this.to, this.duration)
		.easing(this.easing)
		.repeat(repeatCount)
		.onComplete(function() {
			that.onTweenComplete();
		})
		;
}

// Start/stop
glam.Transition.prototype.start = function()
{
	if (this.running)
		return;
	
	this.running = true;
	
	this.tween.start();
}

glam.Transition.prototype.stop = function()
{
	if (!this.running)
		return;
	
	this.running = false;
	this.dispatchEvent("complete");

	this.tween.stop();
}

glam.Transition.prototype.onTweenComplete = function()
{
	this.running = false;
	this.dispatchEvent("complete");
}
// Statics
glam.Transition.default_duration = 1000;
glam.Transition.default_easing = TWEEN.Easing.Linear.None;
/**
 * @fileoverview GLAM Effects Composer - postprocessing effects composer, wraps Three.js
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Composer');

/**
 * @constructor
 */

glam.Composer = function(param)
{
	// Freak out if somebody tries to make 2
    if (glam.Composer.instance)
    {
        throw new Error('Composer singleton already exists')
    }

	glam.Composer.instance = this;

    // Create the effects composer
    // For now, create default render pass to start it up
	var graphics = glam.Graphics.instance;
	graphics.renderer.autoClear = false;
    this.composer = new THREE.EffectComposer( graphics.riftCam ? graphics.riftCam : graphics.renderer );
    var bgPass = new THREE.RenderPass( graphics.backgroundLayer.scene, graphics.backgroundLayer.camera );
    bgPass.clear = true;
	this.composer.addPass( bgPass );
	var fgPass = new THREE.RenderPass( graphics.scene, graphics.camera );
	fgPass.clear = false;
	this.composer.addPass(fgPass);
	var copyPass = new THREE.ShaderPass( THREE.CopyShader );
	copyPass.renderToScreen = true;
	this.composer.addPass(copyPass);
}

glam.Composer.prototype.render = function(deltat) {

	// for now just pass it through
	this.composer.render(deltat);	
}

glam.Composer.prototype.addEffect = function(effect) {

	var index = this.composer.passes.length - 1;
	this.composer.insertPass(effect.pass, index);	
}

glam.Composer.prototype.setCamera = function(camera) {
	var renderpass = this.composer.passes[1];
	renderpass.camera = camera;
}

glam.Composer.prototype.setSize = function(width, height) {
	this.composer.setSize(width, height);
}

glam.Composer.instance = null;
/**
 * @fileoverview cube primitive parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.BoxElement');

glam.BoxElement.DEFAULT_WIDTH = 2;
glam.BoxElement.DEFAULT_HEIGHT = 2;
glam.BoxElement.DEFAULT_DEPTH = 2;

glam.BoxElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.BoxElement);
}

glam.BoxElement.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.BoxElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.BoxElement.DEFAULT_HEIGHT;
	var depth = docelt.getAttribute('depth') || glam.BoxElement.DEFAULT_DEPTH;
	
	if (style) {
		if (style.width)
			width = style.width
		if (style.height)
			height = style.height;
		if (style.depth)
			depth = style.depth;
	}
	
	width = parseFloat(width);
	height = parseFloat(height);
	depth = parseFloat(depth);
	
	param.width = width;
	param.height = height;
	param.depth = depth;
}

glam.BoxElement.createVisual = function(docelt, material, param) {

	var visual = new glam.Visual(
			{ geometry: new THREE.BoxGeometry(param.width, param.height, param.depth),
				material: material
			});
	
	return visual;
}

goog.provide('glam.Camera');
goog.require('glam.SceneComponent');

glam.Camera = function(param)
{
	param = param || {};
	
	glam.SceneComponent.call(this, param);

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
	        		glam.CameraManager.setActiveCamera(this);
	        	}
	        }
    	},    	

    });
	
	this._active = param.active || false;
	var position = param.position || glam.Camera.DEFAULT_POSITION;
    //this.position.copy(position);	
}

goog.inherits(glam.Camera, glam.SceneComponent);

glam.Camera.prototype._componentProperty = "camera";
glam.Camera.prototype._componentPropertyType = "Camera";

glam.Camera.prototype.realize = function() 
{
	glam.SceneComponent.prototype.realize.call(this);
	
	this.addToScene();
	
	glam.CameraManager.addCamera(this);
	
	if (this._active && !glam.CameraManager.activeCamera)
	{
		glam.CameraManager.setActiveCamera(this);
	}
}

glam.Camera.prototype.lookAt = function(v) 
{
	this.object.lookAt(v);
}

glam.Camera.DEFAULT_POSITION = new THREE.Vector3(0, 0, 0);
glam.Camera.DEFAULT_NEAR = 1;
glam.Camera.DEFAULT_FAR = 10000;

goog.provide('glam.PerspectiveCamera');
goog.require('glam.Camera');

glam.PerspectiveCamera = function(param) {
	param = param || {};
	
	if (param.object) {
		this.object = param.object;
	}
	else {		
		var fov = param.fov || 45;
		var near = param.near || glam.Camera.DEFAULT_NEAR;
		var far = param.far || glam.Camera.DEFAULT_FAR;
		var container = glam.Graphics.instance.container;
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

	glam.Camera.call(this, param);
	
    
}

goog.inherits(glam.PerspectiveCamera, glam.Camera);

glam.PerspectiveCamera.prototype.realize = function()  {
	glam.Camera.prototype.realize.call(this);	
}

glam.PerspectiveCamera.prototype.update = function()  {
	if (this.updateProjection)
	{
		this.object.updateProjectionMatrix();
		this.updateProjection = false;
	}
}

/**
 * @author mrdoob / http://mrdoob.com/
 */

goog.provide('glam.PointerLockControls');

glam.PointerLockControls = function ( camera ) {

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
 * @fileoverview visual base type - used by all thing seen on screen
 * 
 * @author Tony Parisi
 */

goog.provide('glam.VisualElement');

glam.VisualElement.create = function(docelt, style, cls) {

	var param = {
	};
	
	cls.getAttributes(docelt, style, param);
	
	var obj = new glam.Object;	
	
	var material = glam.DOMMaterial.create(style, function(material) {
		glam.VisualElement.createVisual(obj, cls, docelt, material, param);
	});
	
	if (material) {
		glam.VisualElement.createVisual(obj, cls, docelt, material, param);
	}
	
	return obj;
}

glam.VisualElement.createVisual = function(obj, cls, docelt, material, param) {
	var visual = cls.createVisual(docelt, material, param);	
	if (visual) {
		obj.addComponent(visual);
		glam.VisualElement.addProperties(docelt, obj);
	}
}

glam.VisualElement.addProperties = function(docelt, obj) {

	var visuals = obj.getComponents(glam.Visual);
	var visual = visuals[0];
	
	if (visual) {
		// Is this the API?	
		docelt.geometry = visual.geometry;
		docelt.material = visual.material;
	}
}

/**
 * @fileoverview viewer - creates WebGL (Three.js/GLAM scene) by traversing document
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMViewer');

glam.DOMViewer = function(doc) {

	this.document = doc;
	this.documentParent = doc.parentElement;
	this.riftRender = glam.DOM.riftRender || false;
	this.cardboardRender = glam.DOM.cardboardRender || false;
	this.displayStats = glam.DOM.displayStats || false;
}

glam.DOMViewer.prototype = new Object;

glam.DOMViewer.prototype.initRenderer = function() {
	var renderers = this.document.getElementsByTagName('renderer');
	if (renderers) {
		var renderer = renderers[0];
		if (renderer) {
			var type = renderer.getAttribute("type").toLowerCase();
			if (type == "rift") {
				this.riftRender = true;
			}
			else if (type == "cardboard") {
				this.cardboardRender = true;
			}
		}
	}
	this.app = new glam.Viewer({ container : this.documentParent, 
		headlight: false, 
		riftRender:this.riftRender, 
		cardboard:this.cardboardRender,
		displayStats:this.displayStats });
}

glam.DOMViewer.prototype.initDefaultScene = function() {
	
	this.scene = new glam.Object;
	this.app.sceneRoot.addChild(this.scene);
	this.app.defaultCamera.position.set(0, 0, 5);
}

glam.DOMViewer.prototype.traverseScene = function() {
	var scenes = this.document.getElementsByTagName('scene');
	if (scenes) {
		var scene = scenes[0];
		this.traverse(scene, this.scene);
	}
	else {
		console.warn("Document error! glam requires one 'scene' element");
		return;
	}
}

glam.DOMViewer.prototype.traverse = function(docelt, sceneobj) {

	var tag = docelt.tagName;

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();

		var fn = null;
		var type = tag ? glam.DOMTypes.types[tag] : null;
		if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {
			// console.log("    * found it in table!");
			glam.DOMElement.init(childelt);
			var style = glam.DOMElement.getStyle(childelt);
			var obj = fn.call(this, childelt, style, this.app);
			if (obj) {
				childelt.glam.object = obj;
				this.addFeatures(childelt, style, obj, type);
				sceneobj.addChild(obj);
				this.traverse(childelt, obj);
			}
		}
	}
	
}

glam.DOMViewer.prototype.addNode = function(docelt) {

	var tag = docelt.tagName;
	if (tag)
		tag = tag.toLowerCase();
	var fn = null;
	var type = tag ? glam.DOMTypes.types[tag] : null;
	if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {

		glam.DOMElement.init(docelt);
		var style = glam.DOMElement.getStyle(docelt);
		var obj = fn.call(this, docelt, style, this.app);
		
		if (obj) {
			docelt.glam.object = obj;
			this.addFeatures(docelt, style, obj, type);
			this.scene.addChild(obj);
			this.traverse(docelt, obj);
		}
	}
}

glam.DOMViewer.prototype.removeNode = function(docelt) {

	var obj = docelt.glam.object;
	if (obj) {
		obj._parent.removeChild(obj);
	}
}

glam.DOMViewer.prototype.addFeatures = function(docelt, style, obj, type) {

	if (type.transform) {
		glam.DOMTransform.parse(docelt, style, obj);
	}
	
	if (type.animation) {
		glam.AnimationElement.parse(docelt, style, obj);
		glam.TransitionElement.parse(docelt, style, obj);
	}

	if (type.input) {
		glam.DOMInput.add(docelt, obj);
	}
	
	if (type.visual) {
		glam.VisualElement.addProperties(docelt, obj);
		glam.DOMMaterial.addHandlers(docelt, style, obj);
	}
}

glam.DOMViewer.prototype.go = function() {
	// Run it
	this.initRenderer();
	this.initDefaultScene();
	this.traverseScene();
	this.prepareViewsAndControllers();
	this.app.run();
}

glam.DOMViewer.prototype.prepareViewsAndControllers = function() {
	
	var cameras = this.app.cameras;
	if (cameras && cameras.length) {
		var cam = cameras[0];
		var controller = glam.Application.instance.controllerScript;
		controller.camera = cam;
		controller.enabled = true;
		cam.active = true;
	}
}


/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Object');
goog.require('glam.EventDispatcher');

/**
 * Creates a new Object.
 * @constructor
 * @extends {glam.EventDispatcher}
 */
glam.Object = function(param) {
    glam.EventDispatcher.call(this);
    
    /**
     * @type {number}
     * @private
     */
    this._id = glam.Object.nextId++;

    /**
     * @type {glam.Object}
     * @private
     */
    this._parent = null;

    /**
     * @type {Array.<glam.Object>}
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
    this._realizing = false;
    
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
		this.addComponent(new glam.Transform(param));
	}
}

goog.inherits(glam.Object, glam.EventDispatcher);

/**
 * The next identifier to hand out.
 * @type {number}
 * @private
 */
glam.Object.nextId = 0;

glam.Object.prototype.getID = function() {
    return this._id;
}

//---------------------------------------------------------------------
// Hierarchy methods
//---------------------------------------------------------------------

/**
 * Sets the parent of the Object.
 * @param {glam.Object} parent The parent of the Object.
 * @private
 */
glam.Object.prototype.setParent = function(parent) {
    this._parent = parent;
}

/**
 * Adds a child to the Object.
 * @param {glam.Object} child The child to add.
 */
glam.Object.prototype.addChild = function(child) {
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

    if ((this._realizing || this._realized) && !child._realized)
    {
    	child.realize();
    }

}

/**
 * Removes a child from the Object
 * @param {glam.Object} child The child to remove.
 */
glam.Object.prototype.removeChild = function(child) {
    var i = this._children.indexOf(child);

    if (i != -1)
    {
        this._children.splice(i, 1);
        child.removeAllComponents();
        child.setParent(null);
        child._realized = child._realizing = false;
    }
}

/**
 * Removes a child from the Object
 * @param {glam.Object} child The child to remove.
 */
glam.Object.prototype.getChild = function(index) {
	if (index >= this._children.length)
		return null;
	
	return this._children[index];
}

//---------------------------------------------------------------------
// Component methods
//---------------------------------------------------------------------

/**
 * Adds a Component to the Object.
 * @param {glam.Component} component.
 */
glam.Object.prototype.addComponent = function(component) {
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
            glam.System.warn('Object already has a ' + t + ' component');
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
    
    if ((this._realizing || this._realized) && !component._realized)
    {
    	component.realize();
    }
}

/**
 * Removes a Component from the Object.
 * @param {glam.Component} component.
 */
glam.Object.prototype.removeComponent = function(component) {
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
 * @param {glam.Component} component.
 */
glam.Object.prototype.removeAllComponents = function() {
    var i, len = this._components.length;

    for (i = 0; i < len; i++)
    {
    	var component = this._components[i];
    	if (component.removeFromScene)
    	{
    		component.removeFromScene();
    		component._realized = component._realizing = false;
    	}
    	
        component.setObject(null);
    }
}

/**
 * Retrieves a Component of a given type in the Object.
 * @param {Object} type.
 */
glam.Object.prototype.getComponent = function(type) {
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
glam.Object.prototype.getComponents = function(type) {
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

glam.Object.prototype.realize = function() {
    this._realizing = true;
    
    this.realizeComponents();
    this.realizeChildren();
        
    this._realized = true;
}

/**
 * @private
 */
glam.Object.prototype.realizeComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        if (!this._components[i]._realized) {
        	// in case we're part of a previously-removed object getting re-parented
        	this._components[i].setObject(this);
        	this._components[i].realize();
        }
    }
}

/**
 * @private
 */
glam.Object.prototype.realizeChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        if (!this._children[i]._realized) {
        	this._children[i].realize();
        }
    }
}

//---------------------------------------------------------------------
// Update methods
//---------------------------------------------------------------------

glam.Object.prototype.update = function() {
    this.updateComponents();
    this.updateChildren();
}

/**
 * @private
 */
glam.Object.prototype.updateComponents = function() {
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
glam.Object.prototype.updateChildren = function() {
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

glam.Object.prototype.traverse = function (callback) {

	callback(this);

    var i, count = this._children.length;
	for (i = 0; i < count ; i ++ ) {

		this._children[ i ].traverse( callback );
	}
}

glam.Object.prototype.findCallback = function(n, query, found) {
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

glam.Object.prototype.findNode = function(str) {
	var that = this;
	var found = [];
	this.traverse(function (o) { that.findCallback(o, str, found); });
	
	return found[0];
}

glam.Object.prototype.findNodes = function(query) {
	var that = this;
	var found = [];
	this.traverse(function (o) { that.findCallback(o, query, found); });
	
	return found;
}

glam.Object.prototype.map = function(query, callback){
	var found = this.findNodes(query);
	var i, len = found.length;
	
	for (i = 0; i < len; i++) {
		callback(found[i]);
	}
}

/**
 * @fileoverview FadeBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.FadeBehavior');
goog.require('glam.Behavior');

glam.FadeBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.opacity = (param.opacity !== undefined) ? param.opacity : 0.5;
	this.savedOpacities = [];
	this.savedTransparencies = [];
	this.tween = null;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.FadeBehavior, glam.Behavior);

glam.FadeBehavior.prototype.start = function()
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
	
	glam.Behavior.prototype.start.call(this);
}

glam.FadeBehavior.prototype.evaluate = function(t)
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


glam.FadeBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();

	glam.Behavior.prototype.stop.call(this);
}

/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('glam.Prefabs');

glam.Prefabs.Skybox = function(param)
{
	param = param || {};
	
	var box = new glam.Object({layer:glam.Graphics.instance.backgroundLayer});

	var textureCube = null;

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		side: THREE.BackSide

	} );

	var visual = new glam.Visual(
			{ geometry: new THREE.BoxGeometry( 10000, 10000, 10000 ),
				material: material,
			});
	box.addComponent(visual);
	
	var script = new glam.SkyboxScript(param);
	box.addComponent(script);
	
	box.realize();

	return box;
}

goog.provide('glam.SkyboxScript');
goog.require('glam.Script');

glam.SkyboxScript = function(param)
{
	glam.Script.call(this, param);

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

goog.inherits(glam.SkyboxScript, glam.Script);

glam.SkyboxScript.prototype.realize = function()
{
	var visual = this._object.getComponent(glam.Visual);
	this.uniforms = visual.material.uniforms;

	this.camera = glam.Graphics.instance.backgroundLayer.camera;
	this.camera.far = 20000;
	this.camera.position.set(0, 0, 0);
}

glam.SkyboxScript.prototype.update = function()
{
	var maincam = glam.Graphics.instance.camera;
	maincam.updateMatrixWorld();
	maincam.matrixWorld.decompose(this.maincampos, this.maincamrot, this.maincamscale);
	this.camera.quaternion.copy(this.maincamrot);
}


/**
 * @fileoverview line primitive parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.LineElement');

glam.LineElement.create = function(docelt, style) {
		
	var material = glam.DOMMaterial.create(style, null, "line");
	
	var geometry = new THREE.Geometry;
	
	glam.LineElement.parse(docelt, geometry, material);
	
	var line = new THREE.Line(geometry, material);
	
	var obj = new glam.Object;	
	var visual = new glam.Visual(
			{
				object : line,
			});
	obj.addComponent(visual);

	// Is this the API?
	docelt.geometry = geometry;
	docelt.material = material;
	
	return obj;
}

glam.LineElement.parse = function(docelt, geometry, material) {

	var verts = docelt.getElementsByTagName('vertices');
	if (verts) {
		verts = verts[0];
		glam.DOMTypes.parseVector3Array(verts, geometry.vertices);
	}
	
	var vertexColors = [];
	var colors = docelt.getElementsByTagName('colors');
	if (colors) {
		colors = colors[0];
		if (colors) {
			glam.DOMTypes.parseColor3Array(colors, vertexColors);
	
			var i, len = vertexColors.length;
	
			for (i = 0; i < len; i++) {			
				var c = vertexColors[i];
				geometry.colors.push(c.clone());
			}
	
			material.vertexColors = THREE.VertexColors;
		}
	}


}


/**
 * @fileoverview The base Application class
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Application');
goog.require('glam.EventDispatcher');
goog.require('glam.Time');
goog.require('glam.Input');
goog.require('glam.Services');

/**
 * @constructor
 */
glam.Application = function(param)
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	glam.EventDispatcher.call(this);
	glam.Application.instance = this;
	this.initialize(param);
}

goog.inherits(glam.Application, glam.EventDispatcher);

glam.Application.prototype.initialize = function(param)
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

glam.Application.prototype.addService = function(serviceName)
{
	var service = glam.Services.create(serviceName);
	this._services.push(service);	
}

glam.Application.prototype.initServices = function(param)
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].initialize(param);
	}
}

glam.Application.prototype.addOptionalServices = function()
{
}

glam.Application.prototype.focus = function()
{
	// Hack hack hack should be the input system
	glam.Graphics.instance.focus();
}

glam.Application.prototype.run = function()
{
    // core game loop here
	this.realizeObjects();
	glam.Graphics.instance.scene.updateMatrixWorld();
	this.lastFrameTime = Date.now();
	this.running = true;
	this.runloop();
}
	        
glam.Application.prototype.runloop = function()
{
	var now = Date.now();
	var deltat = now - this.lastFrameTime;
	
	if (deltat >= glam.Application.minFrameTime)
	{
		this.updateServices();
        this.lastFrameTime = now;
	}
	
	var that = this;
    requestAnimationFrame( function() { that.runloop(); } );
}

glam.Application.prototype.updateServices = function()
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].update();
	}
}

glam.Application.prototype.updateObjects = function()
{
	var i, len = this._objects.length;
	
	for (i = 0; i < len; i++)
	{
		this._objects[i].update();
	}
	
}

glam.Application.prototype.addObject = function(o)
{
	this._objects.push(o);
	if (this.running) {
		o.realize();
	}
}

glam.Application.prototype.removeObject = function(o) {
    var i = this._objects.indexOf(o);
    if (i != -1) {
    	// N.B.: I suppose we could be paranoid and check to see if I actually own this component
        this._objects.splice(i, 1);
    }
}

glam.Application.prototype.realizeObjects = function()
{
	var i, len = this._objects.length;
	
	for (i = 0; i < len; i++)
	{
		this._objects[i].realize();
	}
	
}
	
glam.Application.prototype.onMouseMove = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseMove)
	{
		this.mouseDelegate.onMouseMove(event);
	}
}

glam.Application.prototype.onMouseDown = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDown)
	{
		this.mouseDelegate.onMouseDown(event);
	}
}

glam.Application.prototype.onMouseUp = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseUp)
	{
		this.mouseDelegate.onMouseUp(event);
	}
}

glam.Application.prototype.onMouseClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseClick)
	{
		this.mouseDelegate.onMouseClick(event);
	}
}

glam.Application.prototype.onMouseDoubleClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDoubleClick)
	{
		this.mouseDelegate.onMouseDoubleClick(event);
	}
}

glam.Application.prototype.onMouseScroll = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseScroll)
	{
		this.mouseDelegate.onMouseScroll(event);
	}
}

glam.Application.prototype.onKeyDown = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyDown)
	{
		this.keyboardDelegate.onKeyDown(event);
	}
}

glam.Application.prototype.onKeyUp = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyUp)
	{
		this.keyboardDelegate.onKeyUp(event);
	}
}

glam.Application.prototype.onKeyPress = function(event)
{
	if (this.keyboardDelegate  && this.keyboardDelegate.onKeyPress)
	{
		this.keyboardDelegate.onKeyPress(event);
	}
}	

/* statics */

glam.Application.instance = null;
glam.Application.curObjectID = 0;
glam.Application.minFrameTime = 1;
	    	
glam.Application.handleMouseMove = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseMove)
    	glam.Application.instance.onMouseMove(event);	            	
}

glam.Application.handleMouseDown = function(event)
{
    // Click to focus
    if (glam.Application.instance.tabstop)
    	glam.Application.instance.focus();
        
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseDown)
    	glam.Application.instance.onMouseDown(event);	            	
}

glam.Application.handleMouseUp = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseUp)
    	glam.Application.instance.onMouseUp(event);	            	
}

glam.Application.handleMouseClick = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseClick)
    	glam.Application.instance.onMouseClick(event);	            	
}

glam.Application.handleMouseDoubleClick = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseDoubleClick)
    	glam.Application.instance.onMouseDoubleClick(event);	            	
}

glam.Application.handleMouseScroll = function(event)
{
    if (glam.PickManager && glam.PickManager.overObject)
    	return;
    
    if (glam.Application.instance.onMouseScroll)
    	glam.Application.instance.onMouseScroll(event);	            	
}

glam.Application.handleTouchStart = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onTouchStart)
    	glam.Application.instance.onTouchStart(event);	            	
}

glam.Application.handleTouchMove = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onTouchMove)
    	glam.Application.instance.onTouchMove(event);	            	
}

glam.Application.handleTouchEnd = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onTouchEnd)
    	glam.Application.instance.onTouchEnd(event);	            	
}

glam.Application.handleKeyDown = function(event)
{
    if (glam.Application.instance.onKeyDown)
    	glam.Application.instance.onKeyDown(event);	            	
}

glam.Application.handleKeyUp = function(event)
{
    if (glam.Application.instance.onKeyUp)
    	glam.Application.instance.onKeyUp(event);	            	
}

glam.Application.handleKeyPress = function(event)
{
    if (glam.Application.instance.onKeyPress)
    	glam.Application.instance.onKeyPress(event);	            	
}

glam.Application.prototype.onTouchMove = function(event)
{
	if (this.touchDelegate  && this.touchDelegate.onTouchMove)
	{
		this.touchDelegate.onTouchMove(event);
	}
}

glam.Application.prototype.onTouchStart = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchStart)
	{
		this.touchDelegate.onTouchStart(event);
	}
}

glam.Application.prototype.onTouchEnd = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchEnd)
	{
		this.touchDelegate.onTouchEnd(event);
	}
}


/**
 * @fileoverview Picker component - add one to get picking support on your object
 *
 * @author Tony Parisi
 */

goog.provide('glam.ViewPicker');
goog.require('glam.Component');

glam.ViewPicker = function(param) {
	param = param || {};

    glam.Component.call(this, param);

    this.enabled = (param.enabled !== undefined) ? param.enabled : true;

	this.position = new THREE.Vector3();
	this.mouse = new THREE.Vector3(0,0, 1);
	this.unprojectedMouse = new THREE.Vector3();

	this.raycaster = new THREE.Raycaster();
	this.projector = new THREE.Projector();

	this.over = false;
}

goog.inherits(glam.ViewPicker, glam.Component);

glam.ViewPicker.prototype._componentCategory = "pickers";

glam.ViewPicker.prototype.realize = function() {
	glam.Component.prototype.realize.call(this);
}

glam.ViewPicker.prototype.update = function() {

	this.unprojectMouse();
	var intersected = this.checkForIntersections(this.unprojectedMouse);

	if (intersected != this.over) {
		this.over = intersected;
		if (this.over) {
			this.onViewOver();
		}
		else {
			this.onViewOut();
		}
	}
}

glam.ViewPicker.prototype.unprojectMouse = function() {

	this.unprojectedMouse.copy(this.mouse);
    this.unprojectedMouse.unproject(glam.Graphics.instance.camera);
}

glam.ViewPicker.prototype.checkForIntersections = function(position) {

	var origin = position;
	var direction = origin.clone()
	var pos = new THREE.Vector3();
	pos.applyMatrix4(glam.Graphics.instance.camera.matrixWorld);
	direction.sub(pos);
	direction.normalize();

	this.raycaster.set(pos, direction);
	this.raycaster.near = glam.Graphics.instance.camera.near;
	this.raycaster.far = glam.Graphics.instance.camera.far;

	var intersected = this.raycaster.intersectObjects(this._object.transform.object.children);

	return (intersected.length > 0);
}

glam.ViewPicker.prototype.onViewOver = function() {
    this.dispatchEvent("viewover", { type : "viewover" });
}

glam.ViewPicker.prototype.onViewOut = function() {
    this.dispatchEvent("viewout", { type : "viewout" });
}


/**
 * @fileoverview class list - emulate DOM classList property for glam
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMClassList');

glam.DOMClassList = function(docelt) {
	this.docelt = docelt;
	Array.call(this);
}

glam.DOMClassList.prototype = new Array;

glam.DOMClassList.prototype.item = function(i) {
	return this[i];
}

glam.DOMClassList.prototype.add = function(item) {
	return this.push(item);
}

glam.DOMClassList.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if (i != -1) {
		this.splice(i, 1)
	}
}


goog.provide('glam.ParticleEmitter');
goog.require('glam.Component');

glam.ParticleEmitter = function(param) {
	this.param = param || {};

	glam.Component.call(this, param);

	var size = this.param.size || glam.ParticleEmitter.DEFAULT_SIZE;
	var sizeEnd = this.param.sizeEnd || glam.ParticleEmitter.DEFAULT_SIZE_END;
	var colorStart = this.param.colorStart || glam.ParticleEmitter.DEFAULT_COLOR_START;
	var colorEnd = this.param.colorEnd || glam.ParticleEmitter.DEFAULT_COLOR_END;
	var particlesPerSecond = this.param.particlesPerSecond || glam.ParticleEmitter.DEFAULT_PARTICLES_PER_SECOND;
	var opacityStart = this.param.opacityStart || glam.ParticleEmitter.DEFAULT_OPACITY_START;
	var opacityMiddle = this.param.opacityMiddle || glam.ParticleEmitter.DEFAULT_OPACITY_MIDDLE;
	var opacityEnd = this.param.opacityEnd || glam.ParticleEmitter.DEFAULT_OPACITY_END;
	var velocity = this.param.velocity || glam.ParticleEmitter.DEFAULT_VELOCITY;
	var acceleration = this.param.acceleration || glam.ParticleEmitter.DEFAULT_ACCELERATION;
	var positionSpread = this.param.positionSpread || glam.ParticleEmitter.DEFAULT_POSITION_SPREAD;
	var accelerationSpread = this.param.accelerationSpread || glam.ParticleEmitter.DEFAULT_ACCELERATION_SPREAD;
	var blending = this.param.blending || glam.ParticleEmitter.DEFAULT_BLENDING;

	this._active = false;

	this.object = new SPE.Emitter({
		size: size,
        sizeEnd: sizeEnd,
        colorStart: colorStart,
        colorEnd: colorEnd,
        particlesPerSecond: particlesPerSecond,
        opacityStart: opacityStart,
        opacityMiddle: opacityMiddle,
        opacityEnd: opacityEnd,
        velocity: velocity,
        acceleration: acceleration,
        positionSpread: positionSpread,
        accelerationSpread: accelerationSpread,
        blending: blending,
      });

    Object.defineProperties(this, {
        active: {
	        get: function() {
	            return this._active;
	        },
	        set: function(v) {
	        	this.setActive(v);
	        }
    	},
    });

}

goog.inherits(glam.ParticleEmitter, glam.Component);

glam.ParticleEmitter.prototype.realize = function() {

}

glam.ParticleEmitter.prototype.update = function() {

}

glam.ParticleEmitter.prototype.setActive = function(active) {

    this._active = active;

    if (this._active) {
    	this.object.enable();
    }
    else {
    	this.object.disable();
    }
}

glam.ParticleEmitter.DEFAULT_SIZE = 1;
glam.ParticleEmitter.DEFAULT_SIZE_END = 1;
glam.ParticleEmitter.DEFAULT_COLOR_START = new THREE.Color;
glam.ParticleEmitter.DEFAULT_COLOR_END = new THREE.Color;
glam.ParticleEmitter.DEFAULT_PARTICLES_PER_SECOND = 10;
glam.ParticleEmitter.DEFAULT_OPACITY_START = 0.1;
glam.ParticleEmitter.DEFAULT_OPACITY_MIDDLE = 0.5;
glam.ParticleEmitter.DEFAULT_OPACITY_END = 0.0;
glam.ParticleEmitter.DEFAULT_VELOCITY = new THREE.Vector3(0, 10, 0);
glam.ParticleEmitter.DEFAULT_ACCELERATION = new THREE.Vector3(0, 1, 0);
glam.ParticleEmitter.DEFAULT_POSITION_SPREAD = new THREE.Vector3(0, 0, 0);
glam.ParticleEmitter.DEFAULT_ACCELERATION_SPREAD = new THREE.Vector3(0, 1, 0);
glam.ParticleEmitter.DEFAULT_BLENDING = THREE.NoBlending;



goog.provide('glam.ParticleSystemScript');
goog.require('glam.Script');
goog.require('glam.ParticleEmitter');

glam.ParticleSystem = function(param) {

	param = param || {};

	var obj = new glam.Object;

	var texture = param.texture || null;
	var maxAge = param.maxAge || glam.ParticleSystemScript.DEFAULT_MAX_AGE;

	var visual = null;
	if (param.geometry) {

		var color = (param.color !== undefined) ? param.color : glam.ParticleSystem.DEFAULT_COLOR;
		var material = new THREE.PointCloudMaterial({color:color, size:param.size, map:param.map,
			transparent: (param.map !== null),
		    depthWrite: false,
			vertexColors: (param.geometry.colors.length > 0)});
		var ps = new THREE.PointCloud(param.geometry, material);
		ps.sortParticles = true;

		if (param.map)
			ps.sortParticles = true;

	    visual = new glam.Visual({object:ps});
	}
	else {

		var particleGroup = new SPE.Group({
	        texture: texture,
	        maxAge: maxAge,
	      });

	    visual = new glam.Visual({object:particleGroup.mesh});
	}

    obj.addComponent(visual);

	param.particleGroup = particleGroup;

	var pScript = new glam.ParticleSystemScript(param);
	obj.addComponent(pScript);

	return obj;
}


glam.ParticleSystemScript = function(param) {
	glam.Script.call(this, param);

	this.particleGroup = param.particleGroup;

	this._active = true;

    Object.defineProperties(this, {
        active: {
	        get: function() {
	            return this._active;
	        },
	        set: function(v) {
	        	this.setActive(v);
	        }
    	},
    });

}

goog.inherits(glam.ParticleSystemScript, glam.Script);

glam.ParticleSystemScript.prototype.realize = function()
{
    this.initEmitters();

}

glam.ParticleSystemScript.prototype.initEmitters = function() {

	var emitters = this._object.getComponents(glam.ParticleEmitter);

	var i = 0, len = emitters.length;

    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	this.particleGroup.addEmitter(emitter.object);
    	emitter.active = this._active;
    }

    this.emitters = emitters;
}

glam.ParticleSystemScript.prototype.setActive = function(active) {

	var emitters = this.emitters;
	if (!emitters)
		return;

	var i = 0, len = emitters.length;

    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	emitter.active = active;
    }

    this._active = active;
}

glam.ParticleSystemScript.prototype.update = function() {
	if (this.particleGroup) {
		this.particleGroup.tick();
	}
}

glam.ParticleSystem.DEFAULT_COLOR = 0xffffff;
glam.ParticleSystemScript.DEFAULT_MAX_AGE = 1;


/**
 * @fileoverview ScaleBehavior - simple scale up/down over time
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ScaleBehavior');
goog.require('glam.Behavior');

glam.ScaleBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.startScale = (param.startScale !== undefined) ? param.startScale.clone() : 
		new THREE.Vector3(1, 1, 1);
	this.endScale = (param.endScale !== undefined) ? param.endScale.clone() : 
		new THREE.Vector3(2, 2, 2);
	this.tween = null;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.ScaleBehavior, glam.Behavior);

glam.ScaleBehavior.prototype.start = function()
{
	if (this.running)
		return;

	this.scale = this.startScale.clone();
	this.originalScale = this._object.transform.scale.clone();
	this.tween = new TWEEN.Tween(this.scale).to(this.endScale, this.duration * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();
	
	glam.Behavior.prototype.start.call(this);
}

glam.ScaleBehavior.prototype.evaluate = function(t)
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


glam.ScaleBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();
	
	glam.Behavior.prototype.stop.call(this);
}
/**
 *
 */
goog.require('glam.Service');
goog.provide('glam.AnimationService');

/**
 * The AnimationService.
 *
 * @extends {glam.Service}
 */
glam.AnimationService = function() {};

goog.inherits(glam.AnimationService, glam.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
glam.AnimationService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
glam.AnimationService.prototype.terminate = function() {};


/**
 * Updates the AnimationService.
 */
glam.AnimationService.prototype.update = function()
{
	if (window.TWEEN)
		THREE.glTFAnimator.update();
}

/**
 * @fileoverview material parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMMaterial');

glam.DOMMaterial.create = function(style, createCB, objtype) {
	var material = null;
	
	if (style) {
		var param = glam.DOMMaterial.parseStyle(style);
		if (style.shader) {
			switch (style.shader.toLowerCase()) {
				case "phong" :
				case "blinn" :
					material = new THREE.MeshPhongMaterial(param);
					break;
				case "lambert" :
					material = new THREE.MeshLambertMaterial(param);
					break;
				case "line" :
					material = new THREE.LineBasicMaterial(param);
					break;
				case "basic" :
				default :
					material = new THREE.MeshBasicMaterial(param);
					break;
			}
		}
		else if (style["vertex-shader"] && style["fragment-shader"] && style["shader-uniforms"]) {
			material = glam.DOMMaterial.createShaderMaterial(style, param, createCB);
		}
		else if (objtype == "line") {
			if (param.dashSize !== undefined  || param.gapSize !== undefined) {
				material = new THREE.LineDashedMaterial(param);
			}
			else {
				material = new THREE.LineBasicMaterial(param);
			}
		}
		else {
			material = new THREE.MeshBasicMaterial(param);
		}
	}
	else {
		material = new THREE.MeshBasicMaterial();
	}
	
	return material;
}

glam.DOMMaterial.parseStyle = function(style) {

	var textures = glam.DOMMaterial.parseTextures(style);

	var reflectivity;
	if (style.reflectivity)
		reflectivity = parseFloat(style.reflectivity);
	
	var refractionRatio;
	if (style.refractionRatio)
		refractionRatio = parseFloat(style.refractionRatio);
	
	var color;
	var diffuse;
	var specular;
	var ambient;
	var css = "";

	if (css = style["color"]) {
		color = new THREE.Color().setStyle(css).getHex();
	}
	if (css = style["diffuse-color"]) {
		diffuse = new THREE.Color().setStyle(css).getHex();
	}
	if (css = style["specular-color"]) {
		specular = new THREE.Color().setStyle(css).getHex();
	}
	if (css = style["ambient-color"]) {
		ambient = new THREE.Color().setStyle(css).getHex();
	}
	
	var opacity;
	if (style.opacity)
		opacity = parseFloat(style.opacity);

	var side = THREE.FrontSide;
	if (style["backface-visibility"]) {
		switch (style["backface-visibility"].toLowerCase()) {
			case "visible" :
				side = THREE.DoubleSide;
				break;
			case "hidden" :
				side = THREE.FrontSide;
				break;
		}
	}
	
	var wireframe;
	if (style.hasOwnProperty("render-mode"))
		wireframe = (style["render-mode"] == "wireframe");
	
	var linewidth;
	if (style["line-width"]) {
		linewidth = parseInt(style["line-width"]);
	}
	
	var dashSize;
	if (style["dash-size"]) {
		dashSize = parseInt(style["dash-size"]);
	}

	var gapSize;
	if (style["gap-size"]) {
		gapSize = parseInt(style["gap-size"]);
	}
	
	var param = {
	};
	
	if (textures.image)
		param.map = THREE.ImageUtils.loadTexture(textures.image);
	if (textures.envMap)
		param.envMap = textures.envMap;
	if (textures.normalMap)
		param.normalMap = THREE.ImageUtils.loadTexture(textures.normalMap);
	if (textures.bumpMap)
		param.bumpMap = THREE.ImageUtils.loadTexture(textures.bumpMap);
	if (textures.specularMap)
		param.specularMap = THREE.ImageUtils.loadTexture(textures.specularMap);
	if (color !== undefined)
		param.color = color;
	if (diffuse !== undefined)
		param.color = diffuse;
	if (specular !== undefined)
		param.specular = specular;
	if (ambient !== undefined)
		param.ambient = ambient;
	if (opacity !== undefined) {
		param.opacity = opacity;
		param.transparent = opacity < 1;
	}
	if (wireframe !== undefined) {
		param.wireframe = wireframe;
	}
	if (linewidth !== undefined) {
		param.linewidth = linewidth;
	}
	if (dashSize !== undefined) {
		param.dashSize = dashSize;
	}
	if (gapSize !== undefined) {
		param.gapSize = gapSize;
	}
	if (reflectivity !== undefined)
		param.reflectivity = reflectivity;
	if (refractionRatio !== undefined)
		param.refractionRatio = refractionRatio;

	param.side = side;
	
	return param;
}

glam.DOMMaterial.parseTextures = function(style) {

	var textures = {

	};

	var image = style.image;
	if (image) {
		image = image.trim();
		if (image.substr(0, 3) == "url") {
			textures.image = glam.DOMMaterial.parseUrl(style.image);
		}
		else {
			glam.DOMMaterial.parseTexturesImage(image, textures);
			return textures;
		}
	}

	if (style["normal-image"]) {
		textures.normalMap = glam.DOMMaterial.parseUrl(style["normal-image"]);
	}

	if (style["bump-image"]) {
		textures.bumpMap = glam.DOMMaterial.parseUrl(style["bump-image"]);
	}

	if (style["specular-image"]) {
		textures.specularMap = glam.DOMMaterial.parseUrl(style["specular-image"]);
	}

	textures.envMap = glam.DOMMaterial.tryParseEnvMap(style);

	return textures;
}

/*
image = image.trim()
"diffuse url(../../images/earth_atmos_2048.jpg) normal url(../../images/earth_normal_2048.jpg)  cube-right url(../../images/Park2/posx.jpg) cube-left url(../../images/Park2/negx.jpg)  cube-top url(../../images/Park2/posy.jpg)  cube-bottom url(../../images/Park2/negy.jpg) cube-front  url(../../images/Park2/posz.jpg) 		cube-back url(../../images/Park2/negz.jpg)  specular url(../../images/ash_uvgrid01-bw.jpg)"
image
"diffuse url(../../images/earth_atmos_2048.jpg) normal url(../../images/earth_normal_2048.jpg)  cube-right url(../../images/Park2/posx.jpg) cube-left url(../../images/Park2/negx.jpg)  cube-top url(../../images/Park2/posy.jpg)  cube-bottom url(../../images/Park2/negy.jpg) cube-front  url(../../images/Park2/posz.jpg) 		cube-back url(../../images/Park2/negz.jpg)  specular url(../../images/ash_uvgrid01-bw.jpg)"
image.match(/\S+/g)
["diffuse", "url(../../images/earth_atmos_2048.jpg)", "normal", "url(../../images/earth_normal_2048.jpg)", "cube-right", "url(../../images/Park2/posx.jpg)", "cube-left", "url(../../images/Park2/negx.jpg)", "cube-top", "url(../../images/Park2/posy.jpg)", "cube-bottom", "url(../../images/Park2/negy.jpg)", "cube-front", "url(../../images/Park2/posz.jpg)", "cube-back", "url(../../images/Park2/negz.jpg)", "specular", "url(../../images/ash_uvgrid01-bw.jpg)"]
image.substr(0, 3)
"dif"
"url(asfasdfasdf".substr(0, 3)
"url"
*/

glam.DOMMaterial.parseTexturesImage = function(image, textures) {

	var images = image.match(/\S+/g);
	var envmapStyle = {

	};

	var i, len = images.length;
	for (i = 0; i < len; i += 2) {

		var type = images[i],
			url = images[i + 1];

		switch (type) {
			case 'diffuse' :
				textures.image = glam.DOMMaterial.parseUrl(url);
				break;
			case 'normal' :
				textures.normalMap = glam.DOMMaterial.parseUrl(url);
				break;
			case 'bump' :
				textures.bumpMap = glam.DOMMaterial.parseUrl(url);
				break;
			case 'specular' :
				textures.specularMap = glam.DOMMaterial.parseUrl(url);
				break;

			case 'sphere' :
				envmapStyle['sphere-image'] = url;
				break;

			default :
				if (type.indexOf('cube') != -1) {
					var comp = type.substr(4, type.length - 4);
					envmapStyle['cube-image' + comp] = url;
				}

				break;
		}
	}

	textures.envMap = glam.DOMMaterial.tryParseEnvMap(envmapStyle);

}

glam.DOMMaterial.parseUrl = function(image) {
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(image);
	image = matches[1];
	return image;
}

glam.DOMMaterial.tryParseEnvMap = function(style) {
	var urls = [];
	
	if (style["cube-image-right"])
		urls.push(glam.DOMMaterial.parseUrl(style["cube-image-right"]));
	if (style["cube-image-left"])
		urls.push(glam.DOMMaterial.parseUrl(style["cube-image-left"]));
	if (style["cube-image-top"])
		urls.push(glam.DOMMaterial.parseUrl(style["cube-image-top"]));
	if (style["cube-image-bottom"])
		urls.push(glam.DOMMaterial.parseUrl(style["cube-image-bottom"]));
	if (style["cube-image-front"])
		urls.push(glam.DOMMaterial.parseUrl(style["cube-image-front"]));
	if (style["cube-image-back"])
		urls.push(glam.DOMMaterial.parseUrl(style["cube-image-back"]));
	
	if (urls.length == 6) {
		//console.log("**** GLAM: Loading cubemap", urls[0]);
		var cubeTexture = THREE.ImageUtils.loadTextureCube( urls, THREE.Texture.DEFAULT_MAPPING,
			function(texture) {
				//console.log("**** GLAM: cubemap loaded", texture, urls[0]);
			} );
		return cubeTexture;
	}
	
	if (style["sphere-image"]) {
		var url = glam.DOMMaterial.parseUrl(style["sphere-image"]);
		//console.log("**** GLAM: Loading spheremap", url);
		return THREE.ImageUtils.loadTexture(url, THREE.SphericalRefractionMapping, 
			function(texture) {
				//console.log("**** GLAM: spheremap loaded", texture, url);
			});
	}
	
	return null;
}

glam.DOMMaterial.createShaderMaterial = function(style, param, createCB) {
	
	function done() {
		var material = new THREE.ShaderMaterial({
			vertexShader : vstext,
			fragmentShader : fstext,
			uniforms: uniforms,
		});
		
		glam.DOMMaterial.saveShaderMaterial(vsurl, fsurl, material);
		glam.DOMMaterial.callShaderMaterialCallbacks(vsurl, fsurl);
	}
	
	var vs = style["vertex-shader"];
	var fs = style["fragment-shader"];
	var uniforms = glam.DOMMaterial.parseUniforms(style["shader-uniforms"], param);

	var vsurl = glam.DOMMaterial.parseUrl(vs);
	var fsurl = glam.DOMMaterial.parseUrl(fs);

	if (!vsurl || !fsurl) {
		var vselt = document.getElementById(vs);
		var vstext = vselt.textContent;
		var fselt = document.getElementById(fs);
		var fstext = fselt.textContent;
		
		if (vstext && fstext) {
			return new THREE.ShaderMaterial({
				vertexShader : vstext,
				fragmentShader : fstext,
				uniforms: uniforms,
			});
		}
		else {
			return null;
		}
	}	
	
	var material = glam.DOMMaterial.getShaderMaterial(vsurl, fsurl);
	if (material)
		return material;
	
	glam.DOMMaterial.addShaderMaterialCallback(vsurl, fsurl, createCB);
	
	if (glam.DOMMaterial.getShaderMaterialLoading(vsurl, fsurl))
		return;
	
	glam.DOMMaterial.setShaderMaterialLoading(vsurl, fsurl);
	
	var vstext = "";
	var fstext = "";
	
	glam.System.ajax({
	      type: 'GET',
	      url: vsurl,
	      dataType: "text",
	      success: function(result) { vstext = result; if (fstext) done(); },
	});	
	
	
	glam.System.ajax({
	      type: 'GET',
	      url: fsurl,
	      dataType: "text",
	      success: function(result) { fstext = result; if (vstext) done(); },
	});	
}

glam.DOMMaterial.parseUniforms = function(uniformsText, param) {
	
	var uniforms = {
	};
	
	var tokens = uniformsText.split(" ");

	var i, len = tokens.length / 3;
	for (i = 0; i < len; i++) {
		var name = tokens[i * 3];
		var type = tokens[i * 3 + 1];
		var value = tokens[i * 3 + 2];
		
		if (type == "f")
			value = parseFloat(value);
		if (type == "c") {
			var c = new THREE.Color();
			c.setStyle(value);
			value = c;
		}
		else if (type == "t") {
			value = value.toLowerCase();
			if (value == "cube") {
				value = param.envMap;
			}
			else {
				var image = glam.DOMMaterial.parseUrl(value);
				value = THREE.ImageUtils.loadTexture(image);
				value.wrapS = value.wrapT = THREE.Repeat;
			}
		}
		
		var uniform =  {
			type : type,
			value : value,
		};
		
		uniforms[name] = uniform;
	}
		
	return uniforms;
}

glam.DOMMaterial.shaderMaterials = {};

glam.DOMMaterial.saveShaderMaterial = function(vsurl, fsurl, material) {
	var key = vsurl + fsurl;
	var entry = glam.DOMMaterial.shaderMaterials[key];
	entry.material = material;
	entry.loading = false;
}

glam.DOMMaterial.addShaderMaterialCallback = function(vsurl, fsurl, cb) {
	var key = vsurl + fsurl;
	
	var entry = glam.DOMMaterial.shaderMaterials[key];
	if (!entry) {
		glam.DOMMaterial.shaderMaterials[key] = {
			material : null,
			loading : false,
			callbacks : [],
		};
	}
	
	glam.DOMMaterial.shaderMaterials[key].callbacks.push(cb);
}

glam.DOMMaterial.callShaderMaterialCallbacks = function(vsurl, fsurl) {
	var key = vsurl + fsurl;
	
	var entry = glam.DOMMaterial.shaderMaterials[key];
	if (entry && entry.material) {
		for (var cb in entry.callbacks) {
			entry.callbacks[cb](entry.material);
		}
	}
}

glam.DOMMaterial.getShaderMaterial = function(vsurl, fsurl) {
	
	var key = vsurl + fsurl;
	var entry = glam.DOMMaterial.shaderMaterials[key];
	if (entry) {
		return entry.material;
	}
	else {
		return null;
	}
}

glam.DOMMaterial.setShaderMaterialLoading = function(vsurl, fsurl) {
	
	var key = vsurl + fsurl;
	var entry = glam.DOMMaterial.shaderMaterials[key];
	if (entry) {
		entry.loading = true;
	}
}

glam.DOMMaterial.getShaderMaterialLoading = function(vsurl, fsurl) {
	
	var key = vsurl + fsurl;
	var entry = glam.DOMMaterial.shaderMaterials[key];
	return (entry && entry.loading);
}

glam.DOMMaterial.addHandlers = function(docelt, style, obj) {

	docelt.glam.setAttributeHandlers.push(function(attr, val) {
		glam.DOMMaterial.onSetAttribute(obj, docelt, attr, val);
	});
	
	style.setPropertyHandlers.push(function(attr, val) {
		glam.DOMMaterial.onSetProperty(obj, docelt, attr, val);
	});
}

glam.DOMMaterial.onSetAttribute = function(obj, docelt, attr, val) {

	var material = obj.visuals[0].material;
	switch (attr) {
		case "color" :
		case "diffuse-color" :
		case "diffuseColor" :
			material.color.setStyle(val);
			break;
	}
}

glam.DOMMaterial.onSetProperty = function(obj, docelt, attr, val) {

	var material = obj.visuals[0].material;
	switch (attr) {
		case "color" :
		case "diffuse-color" :
		case "diffuseColor" :
			material.color.setStyle(val);
			break;
	}
}

/**
 * @fileoverview mesh parser/implementation. currently only supports triangle sets
 * 
 * @author Tony Parisi
 */

goog.provide('glam.MeshElement');

glam.MeshElement.VERTEX_NORMALS = false;
glam.MeshElement.VERTEX_COLORS = false;

glam.MeshElement.create = function(docelt, style) {
	
	return glam.VisualElement.create(docelt, style, glam.MeshElement);
}

glam.MeshElement.getAttributes = function(docelt, style, param) {
	
	var vertexNormals = docelt.getAttribute('vertexNormals');
	if (vertexNormals !== null) {
		vertexNormals = true;
	}
	else {
		vertexNormals = glam.MeshElement.VERTEX_NORMALS;
	}
	
	var vertexColors = docelt.getAttribute('vertexColors');
	if (vertexColors !== null) {
		vertexColors = true;
	}
	else {
		vertexColors = glam.MeshElement.VERTEX_COLORS;
	}
	
	if (style) {
		if (style.vertexNormals)
			vertexNormals = style.vertexNormals;
		if (style.vertexColors)
			vertexColors = style.vertexColors;
	}
	
	param.vertexNormals = vertexNormals;
	param.vertexColors = vertexColors;
}

glam.MeshElement.createVisual = function(docelt, material, param) {

	var geometry = new THREE.Geometry;
	
	glam.MeshElement.parse(docelt, geometry, material, param);
	
	var mesh = new THREE.Mesh(geometry, material);
	var visual = new glam.Visual(
			{
				object : mesh,
			});
	
	return visual;
}

glam.MeshElement.parse = function(docelt, geometry, material, param) {

	var verts = docelt.getElementsByTagName('vertices');
	if (verts) {
		verts = verts[0];
		if (verts) {
			glam.DOMTypes.parseVector3Array(verts, geometry.vertices);
		}
	}
	
	var uvs = docelt.getElementsByTagName('uvs');
	if (uvs) {
		uvs = uvs[0];
		if (uvs) {
			glam.DOMTypes.parseUVArray(uvs, geometry.faceVertexUvs[0]);
		}
	}

	var faces = docelt.getElementsByTagName('faces');
	if (faces) {
		faces = faces[0];
		if (faces) {
			glam.DOMTypes.parseFaceArray(faces, geometry.faces);
		}
	}

	var vertexNormals = [];
	var normals = docelt.getElementsByTagName('normals');
	if (normals) {
		normals = normals[0];
		if (normals) {
			glam.DOMTypes.parseVector3Array(normals, vertexNormals);
			
			if (param.vertexNormals) {
				
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var norm = vertexNormals[face.a].normalize().clone();
						face.vertexNormals[0] = norm;
						var norm = vertexNormals[face.b].normalize().clone();
						face.vertexNormals[1] = norm;
						var norm = vertexNormals[face.c].normalize().clone();
						face.vertexNormals[2] = norm;
					}
				}
			}
			else {
				
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var norm = vertexNormals[i].normalize();
						face.normal.copy(norm);
					}
				}
			}
		}
	}
	
	var vertexColors = [];
	var colors = docelt.getElementsByTagName('colors');
	if (colors) {
		colors = colors[0];
		if (colors) {
			glam.DOMTypes.parseColor3Array(colors, vertexColors);
	
			if (param.vertexColors) {
	
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var c = vertexColors[face.a];
						if (c) {
							face.vertexColors[0] = c.clone();
						}
						var c = vertexColors[face.b];
						if (c) {
							face.vertexColors[1] = c.clone();
						}
						var c = vertexColors[face.c];
						if (c) {
							face.vertexColors[2] = c.clone();
						}
					}
				}
	
				material.vertexColors = THREE.VertexColors;
			}
			else {
				
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var c = vertexColors[i];
						if (c) {
							face.color.copy(c);
						}
					}
				}
				
				material.vertexColors = THREE.FaceColors; 
			}
		
			geometry.colorsNeedUpdate = true;
			geometry.buffersNeedUpdate = true;
		}
	}
}


/**
 *
 */
goog.provide('glam.Gamepad');
goog.require('glam.EventDispatcher');

glam.Gamepad = function()
{
    glam.EventDispatcher.call(this);

    // N.B.: freak out if somebody tries to make 2
	// throw (...)

    this.controllers = {
    };
    
    this.values = {
    };
    
	glam.Gamepad.instance = this;
}       

goog.inherits(glam.Gamepad, glam.EventDispatcher);

glam.Gamepad.prototype.update = function() {

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

glam.Gamepad.prototype.testValues = function(gamepad, buttonsChangedEvent, axesChangedEvent) {
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

glam.Gamepad.prototype.saveValues = function(gamepad) {
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

glam.Gamepad.prototype.addGamepad = function(gamepad) {
	  this.controllers[gamepad.index] = gamepad;
	  this.values[gamepad.index] = {
			  buttons : [],
			  axes : [],
	  };
	  
	  this.saveValues(gamepad);
	  console.log("Gamepad added! ", gamepad.id);
}

glam.Gamepad.prototype.scanGamepads = function() {
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

glam.Gamepad.instance = null;

/* input codes
*/
glam.Gamepad.BUTTON_A = glam.Gamepad.BUTTON_CROSS 		= 0;
glam.Gamepad.BUTTON_B = glam.Gamepad.BUTTON_CIRCLE 		= 1;
glam.Gamepad.BUTTON_X = glam.Gamepad.BUTTON_SQUARE 		= 2;
glam.Gamepad.BUTTON_Y = glam.Gamepad.BUTTON_TRIANGLE 	= 3;
glam.Gamepad.SHOULDER_LEFT 								= 4;
glam.Gamepad.SHOULDER_RIGHT 							= 5;
glam.Gamepad.TRIGGER_LEFT 								= 6;
glam.Gamepad.TRIGGER_RIGHT 								= 7;
glam.Gamepad.SELECT = glam.Gamepad.BACK 				= 8;
glam.Gamepad.START 										= 9;
glam.Gamepad.STICK_LEFT 								= 10;
glam.Gamepad.STICK_RIGHT 								= 11;
glam.Gamepad.DPAD_UP	 								= 12;
glam.Gamepad.DPAD_DOWN	 								= 13;
glam.Gamepad.DPAD_LEFT	 								= 14;
glam.Gamepad.DPAD_RIGHT	 								= 15;
glam.Gamepad.HOME = glam.Gamepad.MENU					= 16;
glam.Gamepad.AXIS_LEFT_H								= 0;
glam.Gamepad.AXIS_LEFT_V								= 1;
glam.Gamepad.AXIS_RIGHT_H								= 2;
glam.Gamepad.AXIS_RIGHT_V								= 3;

/**
 * @fileoverview glam document class
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMDocument');

glam.DOMDocument = {
		
	scenes : {},
	
	styles : [],

	animations : {},
	
	addScene : function(script, scene)
	{
		glam.DOMDocument.scenes[script.id] = { parentElement : script.parentElement, scene : scene };
	},

	addStyle : function(declaration)
	{
		glam.DOMDocument.styles.push(declaration);
	},
	
	addAnimation : function(id, animation)
	{
		glam.DOMDocument.animations[id] = animation;
	},

	parseDocument : function()
	{
		var dp = new DOMParser;

		var i, len;
		
		var scripts = document.getElementsByTagName("script");
		var len = scripts.length;
		for (i = 0; i < len; i++)
		{
			if (scripts[i].type == "text/glam")
			{
				var scene = dp.parseFromString(scripts[i].textContent, "text/xml");
				glam.DOMDocument.addScene(scripts[i], scene);
			}
		}
		
		var styles = document.head.getElementsByTagName("style");
		var len = styles.length;
		for (i = 0; i < len; i++)
		{
			{
				glam.CSSParser.parsecss(styles[i].childNodes[0].data,
						function(css) {
								glam.DOMDocument.addStyle(css);
							}
						);
			}
		}
	},
};

// jQuery based CSS parser
// documentation: http://youngisrael-stl.org/wordpress/2009/01/16/jquery-css-parser/
// Version: 1.5
// Copyright (c) 2011 Daniel Wachsstock
// MIT license:
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

goog.provide('glam.CSSParser');
glam.CSSParser = {

};


(function(parser){

	parser.extend = function(a, b){
		for(var key in b)
		    if(b.hasOwnProperty(key))
		        a[key] = b[key];
	    return a;
	}

	// utility function, since we want to allow parser('style') and parser(document), so we need to look for elements in the jQuery object (parser.fn.filter) and elements that are children of the jQuery object (parser.fn.find)
	parser.findandfilter = function(selector){
		var ret = this.filter(selector).add(this.find(selector));
		ret.prevObject = ret.prevObject.prevObject; // maintain the filter/end chain correctly (the filter and the find both push onto the chain). 
		return ret;
	};
	

  parser.parsecss = function(str, callback){
    var ret = {};
		str = munge(str).replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g, function(s,rule){
			// @rules end with ; or a block, with the semicolon not being part of the rule but the closing brace (represented by `b%) is
			processAtRule(rule.trim(), callback);
			return '';
		});

    str.split('`b%').forEach(function(css){ // split on the end of a block 
			css = css.split('%b`'); // css[0] is the selector; css[1] is the index in munged for the cssText
			if (css.length < 2) return; // invalid css
			css[0] = restore(css[0]);
			ret[css[0]] = parser.extend(ret[css[0]] || {}, parsedeclarations(css[1]));
    });
		callback(ret);
  };
	// explanation of the above: munge(str) strips comments and encodes strings and brace-delimited blocks, so that
	// %b` corresponds to { and `b% corresponds to }
	// munge(str) replaces blocks with %b`1`b% (for example)
	// 
	// str.split('`b%') splits the text by '}' (which ends every CSS statement) 
	// Each so the each(munge(str... function(i,css)
	// is called with css being empty (the string after the last delimiter), an @rule, or a css statement of the form
	// selector %b`n where n is a number (the block was turned into %b`n`b% by munge). Splitting on %b` gives the selector and the
	// number corresponding to the declaration block. parsedeclarations will do restore('%b`'+n+'`b%') to get it back.

	// if anyone ever implements http://www.w3.org/TR/cssom-view/#the-media-interface, we're ready
  parser.parsecss.mediumApplies = (window.media && window.media.query) || function(str){
    if (!str) return true; // if no descriptor, everything applies
    if (str in media) return media[str];
		var style = parser('<style media="'+str+'">body {position: relative; z-index: 1;}</style>').appendTo('head');
		return media[str] = [parser('body').css('z-index')==1, style.remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
  };

  parser.parsecss.isValidSelector = function(str){
		var s = parser('<style>'+str+'{}</style>').appendTo('head')[0];
		// s.styleSheet is IE; it accepts illegal selectors but converts them to UNKNOWN. Standards-based (s.shee.cssRules) just reject the rule
		return [s.styleSheet ? !/UNKNOWN/i.test(s.styleSheet.cssText) : !!s.sheet.cssRules.length, parser(s).remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
  };
	
	parser.parsecss.parseArguments = function(str){
		if (!str) return [];
		var ret = [], mungedArguments = munge(str, true).split(/\s+/); // can't use parser.map because it flattens arrays !
		for (var i = 0; i < mungedArguments.length; ++i) {
			var a = restore(mungedArguments[i]);
			try{
				ret.push(eval('('+a+')'));
			}catch(err){
				ret.push(a);
			}
		}
		return ret;
	};


	// expose the styleAttributes function
	parser.parsecss.styleAttributes = styleAttributes;
	
  // caches
  var media = {}; // media description strings
  var munged = {}; // strings that were removed by the parser so they don't mess up searching for specific characters

  // private functions

  function parsedeclarations(index){ // take a string from the munged array and parse it into an object of property: value pairs
		var str = munged[index].replace(/^{|}parser/g, ''); // find the string and remove the surrounding braces
		str = munge(str); // make sure any internal braces or strings are escaped
    var parsed = {};
    str.split(';').forEach(function (decl){
      decl = decl.split(':');
      if (decl.length < 2) return;
      parsed[restore(decl[0])] = restore(decl.slice(1).join(':'));
    });
    return parsed;
  }

  // replace strings and brace-surrounded blocks with %s`number`s% and %b`number`b%. By successively taking out the innermost
  // blocks, we ensure that we're matching braces. No way to do this with just regular expressions. Obviously, this assumes no one
  // would use %s` in the real world.
	// Turns out this is similar to the method that Dean Edwards used for his CSS parser in IE7.js (http://code.google.com/p/ie7-js/)
  var REbraces = /{[^{}]*}/;
	var REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/; // match pairs of parentheses, brackets, and braces and function definitions.
	var REatcomment = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g; // comments of the form /*@ text */ have text parsed 
	// we have to combine the comments and the strings because comments can contain string delimiters and strings can contain comment delimiters
	// var REcomment = /\/\*(?:[^\*]|\*[^\/])*\*\/|<!--|-->/g; // other comments are stripped. (this is a simplification of real SGML comments (see http://htmlhelp.com/reference/wilbur/misc/comment.html) , but it's what real browsers use)
	// var REstring = /\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*'/g; //  match escaped characters and strings
	var REcomment_string =
		/(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
  var REmunged = /%\w`(\d+)`\w%/;
  var uid = 0; // unique id number
  function munge(str, full){
  	var match;
  	var replacement;
    str = str
    .replace(REatcomment,'parser1') // strip /*@ comments but leave the text (to let invalid CSS through)
    .replace(REcomment_string, function (s, string){ // strip strings and escaped characters, leaving munged markers, and strip comments
			if (!string) return '';
      var replacement = '%s`'+(++uid)+'`s%';
      munged[uid] = string.replace(/^\\/,''); // strip the backslash now
      return replacement;      
    })
		;    
    // need a loop here rather than .replace since we need to replace nested braces
		var RE = full ? REfull : REbraces;
    while (match = RE.exec(str)){
      replacement = '%b`'+(++uid)+'`b%';
      munged[uid] = match[0];
      str = str.replace(RE, replacement);
    }
    return str;
  }

  function restore(str){
  	var match;
	if (str === undefined) return str;
    while (match = REmunged.exec(str)){
      str = str.replace(REmunged, munged[match[1]]);
    }
    return str.trim();
  }

  function processAtRule (rule, callback){
    var split = rule.split(/\s+/); // split on whitespace
    var type = split.shift(); // first word
    if (type=='media'){
      var css = restore(split.pop()).slice(1,-1); // last word is the rule; need to strip the outermost braces
      if (parser.parsecss.mediumApplies(split.join(' '))){
        parser.parsecss(css, callback);
      }
    }else if (type=='import'){
      var url = restore(split.shift());
      if (parser.parsecss.mediumApplies(split.join(' '))){
        url = url.replace(/^url\(|\)parser/gi, '').replace(/^["']|["']parser/g, ''); // remove the url('...') wrapper
        parser.get(url, function(str) { parser.parsecss(str, callback) });
      }
    }else if (type=='-webkit-keyframes' || type=='-moz-keyframes' || type=='keyframes'){
        var kfName = split.shift();
        var css = restore(split.join(' '));
        css = css.substr(1, css.length - 2); // strip {}
        parser.parsecss(css, function(keyframes) {
        	// console.log("Parsed keyframes: ", keyframes);
        	var ret = {};
        	ret[kfName] = keyframes;
        	callback(ret);
        })
    }
  }
		

		
	// experimental: find unrecognized style attributes in elements by reloading the code as text
	var RESGMLcomment = /<!--([^-]|-[^-])*-->/g; // as above, a simplification of real comments. Don't put -- in your HTML comments!
	var REnotATag = /(>)[^<]*/g;
	var REtag = /<(\w+)([^>]*)>/g;

	function styleAttributes (HTMLtext, callback) {
		var ret = '', style, tags = {}; //  keep track of tags so we can identify elements unambiguously
		HTMLtext = HTMLtext.replace(RESGMLcomment, '').replace(REnotATag, 'parser1');
		munge(HTMLtext).replace(REtag, function(s, tag, attrs){
			tag = tag.toLowerCase();
			if (tags[tag]) ++tags[tag]; else tags[tag] = 1;
			if (style = /\bstyle\s*=\s*(%s`\d+`s%)/i.exec(attrs)){ // style attributes must be of the form style = "a: bc" ; they must be in quotes. After munging, they are marked with numbers. Grab that number
				var id = /\bid\s*=\s*(\S+)/i.exec(attrs); // find the id if there is one.
				if (id) id = '#'+restore(id[1]).replace(/^['"]|['"]parser/g,''); else id = tag + ':eq(' + (tags[tag]-1) + ')';
				ret += [id, '{', restore(style[1]).replace(/^['"]|['"]parser/g,''),'}'].join('');
			}
		});
		parser.parsecss(ret, callback);
	}
})(glam.CSSParser);

/**
 * @fileoverview animation parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.AnimationElement');

glam.AnimationElement.DEFAULT_DURATION = "1s";
glam.AnimationElement.DEFAULT_ITERATION_COUNT = "1";
glam.AnimationElement.DEFAULT_TIMING_FUNCTION = "linear";
glam.AnimationElement.DEFAULT_FRAME_TIME = "0%";
glam.AnimationElement.DEFAULT_FRAME_PROPERTY = "transform";

glam.AnimationElement.create = function(docelt) {

	var id = docelt.id;
	var duration = docelt.getAttribute('duration') || glam.AnimationElement.DEFAULT_DURATION;
	var iterationCount = docelt.getAttribute('iteration-count') || glam.AnimationElement.DEFAULT_ITERATION_COUNT;
	var timingFunction = docelt.getAttribute('timing-function') || glam.AnimationElement.DEFAULT_TIMING_FUNCTION;
	
	duration = glam.AnimationElement.parseTime(duration);
	var easing = glam.AnimationElement.parseTimingFunction(timingFunction);
	var loop = (iterationCount.toLowerCase() == "infinite") ? true : false;
	
	var i, 
		children = docelt.childNodes, 
		len = children.length,
		frames = [];
	
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();
		
		if (tag == "keyframe") {
			var frame = glam.AnimationElement.parseFrame(childelt);
			frames.push(frame);
		}
	}
	
	var anim = glam.AnimationElement.build(duration, loop, easing, frames);
	
	glam.DOM.addAnimation(id, anim);
	glam.AnimationElement.callParseCallbacks(id, anim);
}

glam.AnimationElement.parseFrame = function(docelt) {

	var time = docelt.getAttribute('time') || glam.AnimationElement.DEFAULT_FRAME_TIME;
	var frametime = glam.AnimationElement.parseFrameTime(time);
	var property = docelt.getAttribute('property') || glam.AnimationElement.DEFAULT_FRAME_PROPERTY;
	var value = docelt.getAttribute('value') || "";
	
	if (property == "transform") {
		var t = {};
		glam.DOMTransform.parseTransform(value, t);

		return {
			time : frametime,
			value : t,
			type : "transform",
		};
	}
	else if (property == "material") {

		var s = glam.AnimationElement.parseMaterial(value);
		var param = glam.DOMMaterial.parseStyle(s);

		return {
			time : frametime,
			value : param,
			type : "material",
		};
	}
	
}

glam.AnimationElement.createFromStyle = function(docelt, style, obj) {
	var animationSpec,
		animationName,
		duration,
		timingFunction,
		easing,
		delayTime,
		iterationCount,
		loop;

	animationName = style["animation-name"]
	                          || style["-webkit-animation-name"]
	 		                  || style["-moz-animation-name"];
	
	if (animationName) {
		duration = style["animation-duration"]
	            || style["-webkit-animation-duration"]
	 		      || style["-moz-animation-duration"];

		
		timingFunction = style["animation-timing-function"]
		                    || style["-webkit-animation-timing-function"]
				 		      || style["-moz-animation-timing-function"];
		
		iterationCount = style["animation-iteration-count"]
			                    || style["-webkit-animation-iteration-count"]
					 		      || style["-moz-animation-iteration-count"];
	}
	else {
		animationSpec = style["animation"]
		                      || style["-webkit-animation"]
		 		 		      || style["-moz-animation"];
		
		if (animationSpec) {
			// name duration timing-function delay iteration-count direction
			var split = animationSpec.split("\\s+");
			animationName = split[0];
			duration = split[1];
			timingFunction = split[2];
			delayTime = split[3];
			iterationCount = split[4];
			
		}
	}
	
    duration = duration || glam.AnimationElement.DEFAULT_DURATION;
	duration = glam.AnimationElement.parseTime(duration);
    timingFunction = timingFunction || glam.AnimationElement.DEFAULT_TIMING_FUNCTION;
	easing = glam.AnimationElement.parseTimingFunction(timingFunction);
    iterationCount = iterationCount || glam.AnimationElement.DEFAULT_ITERATION_COUNT;
	loop = (iterationCount.toLowerCase() == "infinite") ? true : false;				
	
	if (animationName) {
		var animation = glam.DOM.getStyle(animationName);
		
		var frames = [];
		
		for (var k in animation) {
			var frametime;
			if (k == 'from') {
				frametime = 0; 
			}
			else if (k == 'to') {
				frametime = 1;
			}
			else {
				frametime = glam.AnimationElement.parseFrameTime(k);
			}

			var framevalue;
			var framedata = animation[k];
			for (var prop in framedata) {
				var value = framedata[prop];
				var type;
				if (prop == "transform" ||
						prop == "-webkit-transform" ||
						prop == "-moz-transform") {
					
					type = "transform";
					framevalue = {};
					glam.DOMTransform.parseTransform(value, framevalue);
				}
				else if (prop == "opacity" || prop == "color") {
					type = "material";
					framevalue = glam.DOMMaterial.parseStyle(framedata);
				}
				
				var frame = {
						time : frametime,
						value : framevalue,
						type : type,
					};
				frames.push(frame);
			}			
		}
		
		var anim = glam.AnimationElement.build(duration, loop, easing, frames);
		glam.AnimationElement.addAnimationToObject(anim, obj);
	}
	
}

glam.AnimationElement.build = function(duration, loop, easing, frames) {

	var poskeys = [];
	var posvalues = [];
	var rotkeys = [];
	var rotvalues = [];
	var sclkeys = [];
	var sclvalues = [];
	var opakeys = [];
	var opavalues = [];
	var colorkeys = [];
	var colorvalues = [];
	
	var i, len = frames.length;
	
	for (i = 0; i < len; i++) {
		var frame = frames[i];
		var val = frame.value;
		if (frame.type == "transform") {
			if ("x" in val || "y" in val || "z" in val) {
				poskeys.push(frame.time);
				var value = {
				};
				if ("x" in val) {
					value.x = val.x;
				}
				if ("y" in val) {
					value.y = val.y;
				}
				if ("z" in val) {
					value.z = val.z;
				}
				posvalues.push(value);
			}
			if ("rx" in val || "ry" in val || "rz" in val) {
				rotkeys.push(frame.time);
				var value = {
				};
				if ("rx" in val) {
					value.x = val.rx;
				}
				if ("ry" in val) {
					value.y = val.ry;
				}
				if ("rz" in val) {
					value.z = val.rz;
				}
				rotvalues.push(value);
			}
			if ("sx" in val || "sy" in val || "sz" in val) {
				sclkeys.push(frame.time);
				var value = {
				};
				if ("sx" in val) {
					value.x = val.sx;
				}
				if ("sy" in val) {
					value.y = val.sy;
				}
				if ("sz" in val) {
					value.z = val.sz;
				}
				sclvalues.push(value);
			}
		}
		else if (frame.type == "material") {
			if ("opacity" in val) {
				opakeys.push(frame.time);
				opavalues.push( { opacity : parseFloat(val.opacity) });
			}
			if ("color" in val) {
				colorkeys.push(frame.time);
				var rgbColor = new THREE.Color(val.color);
				colorvalues.push( { r : rgbColor.r, g: rgbColor.g, b: rgbColor.b });
			}
		}
	}
	
	var anim = {
		duration : duration,
		loop : loop,
		easing : easing,
		poskeys : poskeys,
		posvalues : posvalues,
		rotkeys : rotkeys,
		rotvalues : rotvalues,
		sclkeys : sclkeys,
		sclvalues : sclvalues,
		opakeys : opakeys,
		opavalues : opavalues,
		colorkeys : colorkeys,
		colorvalues : colorvalues,
	};

	return anim;
}

glam.AnimationElement.parseTime = function(time) {
	var index = time.indexOf("ms");
	if (index != -1)
		return parseFloat(time.split("ms")[0]);
	
	var index = time.indexOf("s");
	if (index != -1)
		return parseFloat(time.split("s")[0]) * 1000;
	
}

glam.AnimationElement.parseFrameTime = function(time) {
	var index = time.indexOf("%");
	if (index != -1)
		return parseFloat(time.split("%")[0]) / 100;
	else
		return parseFloat(time);
}

glam.AnimationElement.parseTimingFunction = function(timingFunction) {
	timingFunction = timingFunction.toLowerCase();
	switch (timingFunction) {
	
		case "linear" :
			return TWEEN.Easing.Linear.None;
			break;
		
		case "ease-in-out" :
		default :
			return TWEEN.Easing.Quadratic.InOut;
			break;
		
	}
}

glam.AnimationElement.parseMaterial = function(value) {

	var s = {};
	
	var values = value.split(";");
	var i, len = values.length;
	for (i = 0; i < len; i++) {
		var val = values[i];
		if (val) {
			var valsplit = val.split(":");
			var valname = valsplit[0];
			var valval = valsplit[1];
			
			s[valname] = valval;
		}
	}
	
	return s;
}

glam.AnimationElement.parse = function(docelt, style, obj) {
	var animationId = docelt.getAttribute('animation');
	if (animationId) {
		var animation = glam.DOM.getAnimation(animationId);
		if (animation) {
			glam.AnimationElement.addAnimationToObject(animation, obj);
		}
		else {
			glam.AnimationElement.addParseCallback(animationId, function(animation) {
				glam.AnimationElement.addAnimationToObject(animation, obj);				
			});
		}
	}
	else {
		glam.AnimationElement.createFromStyle(docelt, style, obj);
	}
}

glam.AnimationElement.addAnimationToObject = function(animation, obj) {
		
	var interps = [];
	if (animation.poskeys.length) {
		interps.push({
			keys : animation.poskeys,
			values : animation.posvalues,
			target : obj.transform.position,
		});
	}
	if (animation.rotkeys.length) {
		interps.push({
			keys : animation.rotkeys,
			values : animation.rotvalues,
			target : obj.transform.rotation,
		});
	}
	if (animation.sclkeys.length) {
		interps.push({
			keys : animation.sclkeys,
			values : animation.sclvalues,
			target : obj.transform.scale,
		});
	}
	if (animation.opakeys.length) {
		interps.push({
			keys : animation.opakeys,
			values : animation.opavalues,
			target : obj.visuals[0].material,
		});
	}
	if (animation.colorkeys.length) {
		interps.push({
			keys : animation.colorkeys,
			values : animation.colorvalues,
			target : obj.visuals[0].material.color,
		});
	}
	var loop = animation.iterationCount > 1;
	
	if (interps.length) {
		var kf = new glam.KeyFrameAnimator({ interps: interps, 
			duration : animation.duration, 
			loop : animation.loop, 
			easing: animation.easing
		});
		obj.addComponent(kf);
		
		kf.start();
	}
}

glam.AnimationElement.parseCallbacks = {};

glam.AnimationElement.addParseCallback = function(id, cb) {
	var cbs = glam.AnimationElement.parseCallbacks[id];
	if (!cbs) {
		cbs = { callbacks : [] };
		glam.AnimationElement.parseCallbacks[id] = cbs;
	}

	cbs.callbacks.push(cb);
	
}

glam.AnimationElement.callParseCallbacks = function(id, anim) {
	var cbs = glam.AnimationElement.parseCallbacks[id];
	if (cbs) {
		var callbacks = cbs.callbacks;
		var i, len = callbacks.length;
		for (i = 0; i < len; i++) {
			var cb = callbacks[i];
			cb(anim);
		}
	}
}

/**
 * @fileoverview transition parser/implementation - still WIP
 * 
 * @author Tony Parisi
 */

goog.provide('glam.TransitionElement');
goog.require('glam.AnimationElement');

glam.TransitionElement.DEFAULT_DURATION = glam.AnimationElement.DEFAULT_DURATION;
glam.TransitionElement.DEFAULT_TIMING_FUNCTION =  glam.AnimationElement.DEFAULT_TIMING_FUNCTION;

// transition:transform 2s, background-color 5s linear 2s;

glam.TransitionElement.parse = function(docelt, style, obj) {

	var transition = style.transition || "";
	
	var transitions = {
	};
	
	var comps = transition.split(",");
	var i, len = comps.length;
	for (i = 0; i < len; i++) {
		var comp = comps[i];
		if (comp) {
			var params = comp.split(" ");
			if (params[0] == "")
				params.shift();
			var propname = params[0];
			var duration = params[1];
			var timingFunction = params[2] || glam.TransitionElement.DEFAULT_TIMING_FUNCTION;
			var delay = params[3] || "";
			
			duration = glam.AnimationElement.parseTime(duration);
			timingFunction = glam.AnimationElement.parseTimingFunction(timingFunction);
			delay = glam.AnimationElement.parseTime(delay);
			
			transitions[propname] = {
					duration : duration,
					timingFunction : timingFunction,
					delay : delay
			};
		}
	}
	
}

/**
 * @fileoverview grouping element parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.GroupElement');

glam.GroupElement.create = function(docelt, style) {

	// Create the group
	var group = new glam.Object;
	
	return group;
}

/**
 * @fileoverview HighlightBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.HighlightBehavior');
goog.require('glam.Behavior');

glam.HighlightBehavior = function(param) {
	param = param || {};
	this.highlightColor = (param.highlightColor !== undefined) ? param.highlightColor : 0xffffff;
	this.savedColors = [];
    glam.Behavior.call(this, param);
}

goog.inherits(glam.HighlightBehavior, glam.Behavior);

glam.HighlightBehavior.prototype.start = function()
{
	glam.Behavior.prototype.start.call(this);
	
	if (this._realized && this._object.visuals) {
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			this.savedColors.push(visuals[i].material.color.getHex());
			visuals[i].material.color.setHex(this.highlightColor);
		}	
	}
}

glam.HighlightBehavior.prototype.evaluate = function(t)
{
}

glam.HighlightBehavior.prototype.stop = function()
{
	glam.Behavior.prototype.stop.call(this);

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
glam.HighlightBehavior.prototype.on = glam.HighlightBehavior.prototype.start;
glam.HighlightBehavior.prototype.off = glam.HighlightBehavior.prototype.stop;

/**
 * @fileoverview MoveBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.MoveBehavior');
goog.require('glam.Behavior');

glam.MoveBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.moveVector = (param.moveVector !== undefined) ? param.moveVector : new THREE.Vector3(0, 1, 0);
	this.tween = null;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.MoveBehavior, glam.Behavior);

glam.MoveBehavior.prototype.start = function()
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
	
	glam.Behavior.prototype.start.call(this);
}

glam.MoveBehavior.prototype.evaluate = function(t)
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


glam.MoveBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();
	
	glam.Behavior.prototype.stop.call(this);
}
/**
 * @fileoverview 2D circle parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CircleElement');

glam.CircleElement.DEFAULT_RADIUS = 2;
glam.CircleElement.DEFAULT_RADIUS_SEGMENTS = 32;

glam.CircleElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.CircleElement);
}

glam.CircleElement.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.CircleElement.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.CircleElement.DEFAULT_RADIUS_SEGMENTS;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.radiusSegments)
			radiusSegments = style.radiusSegments;
	}

	radius = parseFloat(radius);
	radiusSegments = parseInt(radiusSegments);
	
	param.radius = radius;
	param.radiusSegments = radiusSegments;
}

glam.CircleElement.createVisual = function(docelt, material, param) {
	
	var visual = new glam.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments),
				material: material
			});
	
	return visual;
}

/**
 * @fileoverview 2D rectangle parser/implementation
 * 
 * @author Tony Parisi
 */


goog.provide('glam.RectElement');

glam.RectElement.DEFAULT_WIDTH = 2;
glam.RectElement.DEFAULT_HEIGHT = 2;
glam.RectElement.DEFAULT_WIDTH_SEGMENTS = 1;
glam.RectElement.DEFAULT_HEIGHT_SEGMENTS = 1;

glam.RectElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.RectElement);
}

glam.RectElement.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.RectElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.RectElement.DEFAULT_HEIGHT;
	var widthSegments = docelt.getAttribute('width') || glam.RectElement.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height') || glam.RectElement.DEFAULT_HEIGHT_SEGMENTS;
	
	if (style) {
		if (style.width)
			width = style.width;
		if (style.height)
			height = style.height;
		if (style.widthSegments)
			widthSegments = style.widthSegments;
		if (style.heightSegments)
			heightSegments = style.heightSegments;
	}
	
	width = parseFloat(width);
	height = parseFloat(height);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);

	param.width = width;
	param.height = height;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
}

glam.RectElement.createVisual = function(docelt, material, param) {

	var visual = new glam.Visual(
			{ geometry: new THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments),
				material: material
			});

	return visual;
}

/**
 * @fileoverview light parser/implementation. supports point, spot, directional, ambient
 * 
 * @author Tony Parisi
 */

goog.provide('glam.LightElement');

glam.LightElement.DEFAULT_TYPE = "directional";
glam.LightElement.DEFAULT_COLOR = "#ffffff";
glam.LightElement.DEFAULT_ANGLE = "90deg";
glam.LightElement.DEFAULT_DISTANCE = 0;
glam.LightElement.DEFAULT_EXPONENT = glam.SpotLight.DEFAULT_EXPONENT;

glam.LightElement.create = function(docelt, style, app) {
	
	function parseAngle(t) {
		return glam.DOMTransform.parseRotation(t);
	}
		
	var type = docelt.getAttribute('type') || glam.LightElement.DEFAULT_TYPE;
	var color = docelt.getAttribute('color') || glam.LightElement.DEFAULT_COLOR;
	var angle = docelt.getAttribute('angle') || glam.LightElement.DEFAULT_ANGLE;
	var distance = docelt.getAttribute('distance') || glam.LightElement.DEFAULT_DISTANCE;
	var exponent = docelt.getAttribute('exponent') || glam.LightElement.DEFAULT_EXPONENT;
	
	var direction = new THREE.Vector3(0, 0, -1);
	
	var dx = parseFloat(docelt.getAttribute('dx')) || 0;
	var dy = parseFloat(docelt.getAttribute('dy')) || 0;
	var dz = parseFloat(docelt.getAttribute('dz')) || 0;
	if (dx || dy || dz) {
		direction.set(dx, dy, dz);
	}
	
	direction.normalize();
	
	if (style) {
		if (style.type) {
			type = style.type;
		}
		if (style.color) {
			color = style.color;
		}
		if (style.angle) {
			angle = style.angle;
		}
		if (style.distance) {
			distance = style.distance;
		}
	}

	color = new THREE.Color().setStyle(color).getHex(); 
	angle = parseAngle(angle);
	distance = parseFloat(distance);
	exponent = parseFloat(exponent);
	
	var param = {
			color : color,
			angle : angle,
			direction : direction,
			distance : distance,
			exponent : exponent,
	};
	
	var obj = new glam.Object;

	var light = null;
	switch (type.toLowerCase()) {
	
		case 'directional' :
			light = new glam.DirectionalLight(param);
			break;
		case 'point' :
			light = new glam.PointLight(param);
			break;
		case 'spot' :
			light = new glam.SpotLight(param);
			break;
		case 'ambient' :
			light = new glam.AmbientLight(param);
			break;
	}
	
	if (light) {
		obj.addComponent(light);
		return obj;
	}
	
	return null;
}

goog.provide('glam.DirectionalLight');
goog.require('glam.Light');

glam.DirectionalLight = function(param)
{
	param = param || {};

	this.scaledDir = new THREE.Vector3;
	this.castShadows = ( param.castShadows !== undefined ) ? param.castShadows : glam.DirectionalLight.DEFAULT_CAST_SHADOWS;
	
	glam.Light.call(this, param);

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
		this.shadowDarkness = ( param.shadowDarkness !== undefined ) ? param.shadowDarkness : glam.DirectionalLight.DEFAULT_SHADOW_DARKNESS;
	}
}

goog.inherits(glam.DirectionalLight, glam.Light);

glam.DirectionalLight.prototype.realize = function() 
{
	glam.Light.prototype.realize.call(this);
}

glam.DirectionalLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform light directions automatically
	// Really bizarre semantics
	this.position.copy(this.direction).normalize().negate();
	var worldmat = this.object.parent.matrixWorld;
	this.position.applyMatrix4(worldmat);
	this.scaledDir.copy(this.direction);
	this.scaledDir.multiplyScalar(glam.Light.DEFAULT_RANGE);
	this.targetPos.copy(this.position);
	this.targetPos.add(this.scaledDir);	
 	this.object.target.position.copy(this.targetPos);

	this.updateShadows();
	
	glam.Light.prototype.update.call(this);
}

glam.DirectionalLight.prototype.updateShadows = function()
{
	if (this.castShadows)
	{
		this.object.castShadow = true;
		this.object.shadowCameraNear = 1;
		this.object.shadowCameraFar = glam.Light.DEFAULT_RANGE;
		this.object.shadowCameraFov = 90;

		// light.shadowCameraVisible = true;

		this.object.shadowBias = 0.0001;
		this.object.shadowDarkness = this.shadowDarkness;

		this.object.shadowMapWidth = 1024;
		this.object.shadowMapHeight = 1024;
		
		glam.Graphics.instance.enableShadows(true);
	}	
}


glam.DirectionalLight.DEFAULT_CAST_SHADOWS = false;
glam.DirectionalLight.DEFAULT_SHADOW_DARKNESS = 0.3;

/**
 * DeviceOrientationControls - applies device orientation on object rotation
 *
 * @param {Object} object - instance of THREE.Object3D
 * @constructor
 *
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author jonobr1 / http://jonobr1.com
 * @author arodic / http://aleksandarrodic.com
 * @author doug / http://github.com/doug
 * @author tparisi / http://github.com/tparisi for GLAM
 *
 * W3C Device Orientation control
 * (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

goog.provide('glam.DeviceOrientationControlsCB');

glam.DeviceOrientationControlsCB = function(object) {

  this.object = object;

  this.object.rotation.reorder('YXZ');

  this.freeze = true;

  this.movementSpeed = 1.0;
  this.rollSpeed = 0.005;
  this.autoAlign = true;
  this.autoForward = false;

  this.alpha = 0;
  this.beta = 0;
  this.gamma = 0;
  this.orient = 0;

  this.alignQuaternion = new THREE.Quaternion();
  this.orientationQuaternion = new THREE.Quaternion();

  var quaternion = new THREE.Quaternion();
  var quaternionLerp = new THREE.Quaternion();

  var tempVector3 = new THREE.Vector3();
  var tempMatrix4 = new THREE.Matrix4();
  var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  var tempQuaternion = new THREE.Quaternion();

  var zee = new THREE.Vector3(0, 0, 1);
  var up = new THREE.Vector3(0, 1, 0);
  var v0 = new THREE.Vector3(0, 0, 0);
  var euler = new THREE.Euler();
  var q0 = new THREE.Quaternion(); // - PI/2 around the x-axis
  var q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

  this.deviceOrientation = {};
  this.screenOrientation = window.orientation || 0;

  this.onDeviceOrientationChangeEvent = (function(rawEvtData) {

    this.deviceOrientation = rawEvtData;

  }).bind(this);

  var getOrientation = function() {
    switch (window.screen.orientation || window.screen.mozOrientation) {
      case 'landscape-primary':
        return 90;
      case 'landscape-secondary':
        return -90;
      case 'portrait-secondary':
        return 180;
      case 'portrait-primary':
        return 0;
    }
    // this returns 90 if width is greater then height 
    // and window orientation is undefined OR 0
    // if (!window.orientation && window.innerWidth > window.innerHeight)
    //   return 90;
    return window.orientation || 0;
  };

  this.onScreenOrientationChangeEvent = (function() {

    this.screenOrientation = getOrientation();

  }).bind(this);

  this.update = function(delta) {

    return function() {

      if (this.freeze) return;

      // should not need this
      var orientation = getOrientation(); 
      if (orientation !== this.screenOrientation) {
        this.screenOrientation = orientation;
        this.autoAlign = true;
      }

      this.alpha = this.deviceOrientation.gamma ?
        THREE.Math.degToRad(this.deviceOrientation.alpha) : 0; // Z
      this.beta = this.deviceOrientation.beta ?
        THREE.Math.degToRad(this.deviceOrientation.beta) : 0; // X'
      this.gamma = this.deviceOrientation.gamma ?
        THREE.Math.degToRad(this.deviceOrientation.gamma) : 0; // Y''
      this.orient = this.screenOrientation ?
        THREE.Math.degToRad(this.screenOrientation) : 0; // O

      // The angles alpha, beta and gamma
      // form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

      // 'ZXY' for the device, but 'YXZ' for us
      euler.set(this.beta, this.alpha, - this.gamma, 'YXZ');

      quaternion.setFromEuler(euler);
      quaternionLerp.slerp(quaternion, 0.5); // interpolate

      // orient the device
      if (this.autoAlign) this.orientationQuaternion.copy(quaternion); // interpolation breaks the auto alignment
      else this.orientationQuaternion.copy(quaternionLerp);

      // camera looks out the back of the device, not the top
      this.orientationQuaternion.multiply(q1);

      // adjust for screen orientation
      this.orientationQuaternion.multiply(q0.setFromAxisAngle(zee, - this.orient));

      this.object.quaternion.copy(this.alignQuaternion);
      this.object.quaternion.multiply(this.orientationQuaternion);

      if (this.autoForward) {

        tempVector3
          .set(0, 0, -1)
          .applyQuaternion(this.object.quaternion, 'ZXY')
          .setLength(this.movementSpeed / 50); // TODO: why 50 :S

        this.object.position.add(tempVector3);

      }

      if (this.autoAlign && this.alpha !== 0) {

        this.autoAlign = false;

        this.align();

      }

    };

  }();

  // //debug
  // window.addEventListener('click', (function(){
  //   this.align();
  // }).bind(this)); 

  this.align = function() {

    // N.B.: this seemed, literally, ass-backwards so changed
    // it to point the opposite way --TP
    tempVector3
      .set(0, 0, 1) // z was: -1
      .applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );

    tempEuler.setFromQuaternion(
      tempQuaternion.setFromRotationMatrix(
        tempMatrix4.lookAt(tempVector3, v0, up)
     )
   );

    tempEuler.set(0, tempEuler.y, 0);
    this.alignQuaternion.setFromEuler(tempEuler);

  };

  this.connect = function() {

    // run once on load
    this.onScreenOrientationChangeEvent();

    // window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

    this.freeze = false;

    return this;

  };

  this.disconnect = function() {

    this.freeze = true;

    // window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

  };


};


/**
 * @fileoverview cone primitive parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ConeElement');

glam.ConeElement.DEFAULT_RADIUS = 2;
glam.ConeElement.DEFAULT_HEIGHT = 2;

glam.ConeElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.ConeElement);
}

glam.ConeElement.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.ConeElement.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.ConeElement.DEFAULT_HEIGHT;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}

	radius = parseFloat(radius);
	height = parseFloat(height);
	
	param.radius = radius;
	param.height = height;
}

glam.ConeElement.createVisual = function(docelt, material, param) {
	
	var visual = new glam.Visual(
			{ geometry: new THREE.CylinderGeometry(0, param.radius, param.height, 32),
				material: material
			});

	return visual;
}


goog.require('glam.Prefabs');

glam.Prefabs.PointerLockController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.PointerLockControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('glam.PointerLockControllerScript');
goog.require('glam.Script');

glam.PointerLockControllerScript = function(param)
{
	glam.Script.call(this, param);

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

goog.inherits(glam.PointerLockControllerScript, glam.Script);

glam.PointerLockControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.PointerLockControllerScript.prototype.createControls = function(camera)
{
	var controls = new glam.PointerLockControls(camera.object, glam.Graphics.instance.container);
	controls.mouseLook = this._mouseLook;
	controls.movementSpeed = this._move ? this.moveSpeed : 0;
	controls.lookSpeed = this._look ? this.lookSpeed  : 0;
	controls.turnSpeed = this._turn ? this.turnSpeed : 0;
	controls.tiltSpeed = this._tilt ? this.tiltSpeed : 0;

	this.clock = new THREE.Clock();
	return controls;
}

glam.PointerLockControllerScript.prototype.update = function()
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

glam.PointerLockControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

glam.PointerLockControllerScript.prototype.setMove = function(move)
{
	this._move = move;
	this.controls.movementSpeed = move ? this.moveSpeed : 0;
}

glam.PointerLockControllerScript.prototype.setLook = function(look)
{
	this._look = look;
	this.controls.lookSpeed = look ? 1.0 : 0;
}

glam.PointerLockControllerScript.prototype.setMouseLook = function(mouseLook)
{
	this._mouseLook = mouseLook;
	this.controls.mouseLook = mouseLook;
}

glam.PointerLockControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
	this.controls.movementSpeed = this.moveSpeed;
	this.controls.lookSpeed = this._look ?  0.1 : 0;

}

glam.PointerLockControllerScript.prototype.saveCamera = function() {
	this.savedCameraPos.copy(this._camera.position);
}

glam.PointerLockControllerScript.prototype.restoreCamera = function() {
	this._camera.position.copy(this.savedCameraPos);
}

glam.PointerLockControllerScript.prototype.testCollision = function() {
	
	this.movementVector.copy(this._camera.position).sub(this.savedCameraPos);
	if (this.movementVector.length()) {
		
        var collide = glam.Graphics.instance.objectFromRay(null, 
        		this.savedCameraPos,
        		this.movementVector, 1, 2);

        if (collide && collide.object) {
        	var dist = this.savedCameraPos.distanceTo(collide.hitPointWorld);
        }
        
        return collide;
	}
	
	return null;
}

glam.PointerLockControllerScript.prototype.testTerrain = function() {
	return false;
}

glam.PointerLockControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}


/**
 * @fileoverview base node class
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMElement');

glam.DOMElement.init = function(docelt) {

	docelt.glam = {
	};
	
	docelt.glam.setAttributeHandlers = [];
	docelt.glam.onSetAttribute = function(attr, val) {
		var i, len = docelt.glam.setAttributeHandlers.length;
		for (i = 0; i < len; i++) {
			var handler = docelt.glam.setAttributeHandlers[i];
			if (handler) {
				handler(attr, val);
			}
		}
	}
}

glam.DOMElement.getStyle = function(docelt) {
	
	var glamClassList = new glam.DOMClassList(docelt);
	docelt.glam.classList = glamClassList;
	
	var style = new glam.DOMStyle(docelt);
	
	if (docelt.id) {
		var styl = glam.DOM.getStyle("#" + docelt.id);
		style.addProperties(styl);
	}
	
	var klass = docelt.getAttribute('class');
	if (!klass)
		klass = docelt['class'];
	
	if (klass) {
		
		var klasses = klass.split(" ");
		for (var klassname in klasses) {
			var kls = klasses[klassname];
			if (kls) {
				var styl = glam.DOM.getStyle("." + kls);
				style.addProperties(styl);
				
				glamClassList.add(kls);
			}
		}
	}
	
	var styl = docelt.getAttribute("style");
	if (styl) {
		style.addPropertiesFromString(styl);
	}
	
	docelt.glam.style = style;
	
	return style;
}

/**
 * @fileoverview parser base; see also viewer.js
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMParser');
goog.require('glam.CSSParser');

glam.DOMParser = {
		
	addDocument : function(doc)
	{
		// create an observer instance
		var mo = (window.WebKitMutationObserver !== undefined) ? window.WebKitMutationObserver : window.MutationObserver;
		var observer = new mo(function(mutations) {
		  mutations.forEach(function(mutation) {
		    if (mutation.type == "childList") {
		    	var i, len = mutation.addedNodes.length;
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.addedNodes[i];
		    		var viewer = glam.DOM.viewers[doc.id];
			    	viewer.addNode(node);
		    	}
		    	var i, len = mutation.removedNodes.length;
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.removedNodes[i];
		    		var viewer = glam.DOM.viewers[doc.id];
			    	viewer.removeNode(node);
		    	}
		    }
		    else if (mutation.type == "attributes") {
		    	var onSetAttribute = mutation.target.glam ? mutation.target.glam.onSetAttribute : null;
		    	if (onSetAttribute) {
		    		var attr = mutation.attributeName;
		    		var val = mutation.target.getAttribute(attr);
		    		onSetAttribute(attr, val);
		    	}
		    }
		  });    
		});
		 
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true, subtree: true };
		 
		// pass in the target node, as well as the observer options
		observer.observe(doc, config);		
	},

	addStyle : function(declaration)
	{
		for (var selector in declaration) {
			glam.DOM.addStyle(selector, declaration[selector]);
		}
	},
	
	getStyle : function(selector)
	{
		return glam.DOM.getStyle(selector);
	},
	
	parseDocument : function()
	{
		var dp = new DOMParser;

		var i, len;
		
		var docs = document.getElementsByTagName("glam");
		var len = docs.length;
		for (i = 0; i < len; i++)
		{
			var doc = docs[i];
			if (!doc.id) {
				doc.id = "#glamDocument" + glam.DOM.documentIndex++;
			}
			glam.DOMParser.addDocument(doc);
			glam.DOM.documents[doc.id] = doc;
			doc.style.display = 'none';
			glam.DOMParser.addEventHandlers(doc);
		}
		
		var styles = document.head.getElementsByTagName("style");
		var len = styles.length;
		for (i = 0; i < len; i++)
		{
			if (styles[i].childNodes.length) {
				glam.CSSParser.parsecss(styles[i].childNodes[0].data,
						function(css) {
								glam.DOMParser.addStyle(css);
							}
						);
			}
		}
	},
	
	addEventHandlers : function(elt) {

		// Trap all mouse events to keep page from going bonkers
		elt.addEventListener("mouseover", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		elt.addEventListener("mouseout", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		elt.addEventListener("mousedown", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		elt.addEventListener("mouseup", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		elt.addEventListener("mousemove", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		elt.addEventListener("click", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		
	},
};


/**
 * @fileoverview sphere primitive parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.SphereElement');

glam.SphereElement.DEFAULT_RADIUS = 2;
glam.SphereElement.DEFAULT_WIDTH_SEGMENTS = 32;
glam.SphereElement.DEFAULT_HEIGHT_SEGMENTS = 32;

glam.SphereElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.SphereElement);
}

glam.SphereElement.getAttributes = function(docelt, style, param) {
	
	var radius = docelt.getAttribute('radius') || glam.SphereElement.DEFAULT_RADIUS;
	var widthSegments = docelt.getAttribute('width-segments') || glam.SphereElement.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height-segments') || glam.SphereElement.DEFAULT_HEIGHT_SEGMENTS;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.widthSegments || style["width-segments"])
			widthSegments = style.widthSegments || style["width-segments"];
		if (style.heightSegments || style["height-segments"])
			heightSegments = style.heightSegments || style["height-segments"];
	}

	radius = parseFloat(radius);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);
	
	param.radius = radius;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
}

glam.SphereElement.createVisual = function(docelt, material, param) {

	var visual = new glam.Visual(
			{ geometry: new THREE.SphereGeometry(param.radius, param.widthSegments, param.heightSegments),
				material: material
			});
	
	return visual;
}


goog.require('glam.Prefabs');

glam.Prefabs.RiftController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.RiftControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);

	return controller;
}

goog.provide('glam.RiftControllerScript');
goog.require('glam.Script');

glam.RiftControllerScript = function(param)
{
	glam.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this.riftControls = null;

	this._headlightOn = param.headlight;
	
	this.cameraDir = new THREE.Vector3;
	
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

goog.inherits(glam.RiftControllerScript, glam.Script);

glam.RiftControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.RiftControllerScript.prototype.update = function()
{
	if (this._enabled && this.riftControls) {
		this.riftControls.update();
	}
	
	if (this._headlightOn)
	{
		this.cameraDir.set(0, 0, -1);
		this.cameraDir.transformDirection(this.camera.object.matrixWorld);
		
		this.headlight.direction.copy(this.cameraDir);
	}	
}

glam.RiftControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
}

glam.RiftControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.riftControls = this.createControls(camera);
}

glam.RiftControllerScript.prototype.createControls = function(camera)
{
	var controls = new THREE.VRControls(camera.object, function(err) {
			if (err) {
				console.log("Error creating VR controller: ", err);
			}
		});

	// N.B.: this only works because the callback up there is synchronous...
	return controls;
}



/**
 * @fileoverview model import parser/implementation
 * 
 * @author Tony Parisi
 */


goog.provide('glam.ImportElement');

glam.ImportElement.create = function(docelt, style) {
	var src = docelt.getAttribute('src');
		
	// Create the cube
	var obj = new glam.Object;	

	if (src) {
		var loader = new glam.Loader;

		var loadCallback = function(data) {
			glam.ImportElement.onLoadComplete(obj, data, src);
			loader.removeEventListener("loaded", loadCallback);
		}	

		loader.addEventListener("loaded", loadCallback);
		loader.loadScene(src);
	}

	return obj;
}

glam.ImportElement.onLoadComplete = function(obj, data, url) {

	obj.addChild(data.scene);
}

/**
 * @fileoverview effect parser/implementation. supports built-in postprocessing effects
 * 
 * @author Tony Parisi
 */

goog.provide('glam.EffectElement');

glam.EffectElement.DEFAULT_BLOOM_STRENGTH = 1;
glam.EffectElement.DEFAULT_FILM_GRAYSCALE = 0;
glam.EffectElement.DEFAULT_FILM_SCANLINECOUNT = 512;
glam.EffectElement.DEFAULT_FILM_INTENSITY = 0.5;
glam.EffectElement.DEFAULT_RGBSHIFT_AMOUNT = 0.0015;
glam.EffectElement.DEFAULT_DOTSCREEN_SCALE = 1;

glam.EffectElement.create = function(docelt, style, app) {
	
	var type = docelt.getAttribute("type");
	
	var effect = null;
	
	switch (type) {

		case "Bloom" :
			var strength = glam.EffectElement.DEFAULT_BLOOM_STRENGTH;
			var str = docelt.getAttribute("strength");
			if (str != undefined) {
				strength = parseFloat(str);
			}
			effect = new glam.Effect(new THREE.BloomPass(strength));
			break;

		case "FXAA" :
			effect = new glam.Effect(THREE.FXAAShader);
			var w = glam.Graphics.instance.renderer.domElement.offsetWidth;
			var h = glam.Graphics.instance.renderer.domElement.offsetHeight;
			effect.pass.uniforms['resolution'].value.set(1 / w, 1 / h);
			break;
			
		case "Film" :
			effect = new glam.Effect( THREE.FilmShader );
			effect.pass.uniforms['grayscale'].value = glam.EffectElement.DEFAULT_FILM_GRAYSCALE;
			effect.pass.uniforms['sCount'].value = glam.EffectElement.DEFAULT_FILM_SCANLINECOUNT;
			effect.pass.uniforms['nIntensity'].value = glam.EffectElement.DEFAULT_FILM_INTENSITY;
			break;
			
		case "RGBShift" :
			effect = new glam.Effect( THREE.RGBShiftShader );
			effect.pass.uniforms[ 'amount' ].value = glam.EffectElement.DEFAULT_RGBSHIFT_AMOUNT;
			break;
			
		case "DotScreen" :
			effect = new glam.Effect(THREE.DotScreenShader);
			effect.pass.uniforms[ 'scale' ].value = glam.EffectElement.DEFAULT_DOTSCREEN_SCALE;
			break;

		case "DotScreenRGB" :
			effect = new glam.Effect(THREE.DotScreenRGBShader);
			effect.pass.uniforms[ 'scale' ].value = glam.EffectElement.DEFAULT_DOTSCREEN_SCALE;
			break;
	}
	
	if (effect) {
		glam.EffectElement.parseAttributes(docelt, effect, style);
		glam.Graphics.instance.addEffect(effect);
	}
	
	return null;
}

glam.EffectElement.parseAttributes = function(docelt, effect, style) {
	
	var disabled = docelt.getAttribute("disabled");
	if (disabled != undefined) {
		effect.pass.enabled = false;
	}
	
	var uniforms = effect.pass.uniforms;
	
	for (var u in uniforms) {
		
		var attr = docelt.getAttribute(u);
		if (attr) {
			
			var value = null;
			var uniform = uniforms[u];

			if (uniform) {
				
				switch (uniform.type) {
				
					case "t" :
						
						var image = glam.DOMMaterial.parseUrl(attr);
						value = THREE.ImageUtils.loadTexture(image);
						value.wrapS = value.wrapT = THREE.Repeat;
						break;
						
					case "f" :
						
						value = parseFloat(attr);						
						break;

					case "i" :
						
						value = parseInt(attr);						
						break;
				}
				
				if (value) {
					uniform.value = value;
				}
			}
		}
	}
}


/**
 * @fileoverview text primitive parser/implementation. only supports helvetiker and optimer fonts right now.
 * 
 * @author Tony Parisi
 */

goog.provide('glam.TextElement');

glam.TextElement.DEFAULT_FONT_SIZE = 1;
glam.TextElement.DEFAULT_FONT_DEPTH = .2;
glam.TextElement.DEFAULT_FONT_BEVEL = "none";
glam.TextElement.DEFAULT_BEVEL_SIZE = .01;
glam.TextElement.DEFAULT_BEVEL_THICKNESS = .02;
glam.TextElement.DEFAULT_FONT_FAMILY = "helvetica";
glam.TextElement.DEFAULT_FONT_WEIGHT = "normal";
glam.TextElement.DEFAULT_FONT_STYLE = "normal";

glam.TextElement.BEVEL_EPSILON = 0.0001;

glam.TextElement.DEFAULT_VALUE = "",

glam.TextElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.TextElement);
}

glam.TextElement.getAttributes = function(docelt, style, param) {

	// Font stuff
	// for now: helvetiker, optimer - typeface.js stuff
	// could also do: gentilis, droid sans, droid serif but the files are big.
	var fontFamily = docelt.getAttribute('fontFamily') || glam.TextElement.DEFAULT_FONT_FAMILY; // "optimer";
	var fontWeight = docelt.getAttribute('fontWeight') || glam.TextElement.DEFAULT_FONT_WEIGHT; // "bold"; // normal bold
	var fontStyle = docelt.getAttribute('fontStyle') || glam.TextElement.DEFAULT_FONT_STYLE; // "normal"; // normal italic

	// Size, depth, bevel etc.
	var fontSize = docelt.getAttribute('fontSize') || glam.TextElement.DEFAULT_FONT_SIZE;
	var fontDepth = docelt.getAttribute('fontDepth') || glam.TextElement.DEFAULT_FONT_DEPTH;
	var fontBevel = docelt.getAttribute('fontBevel') || glam.TextElement.DEFAULT_FONT_BEVEL;
	var bevelSize = docelt.getAttribute('bevelSize') || glam.TextElement.DEFAULT_BEVEL_SIZE;
	var bevelThickness = docelt.getAttribute('bevelThickness') || glam.TextElement.DEFAULT_BEVEL_THICKNESS;
	
	if (style) {
		if (style["font-family"])
			fontFamily = style["font-family"];
		if (style["font-weight"])
			fontWeight = style["font-weight"];
		if (style["font-style"])
			fontStyle = style["font-style"];
		if (style["font-size"])
			fontSize = style["font-size"];
		if (style["font-depth"])
			fontDepth = style["font-depth"];
		if (style["font-bevel"])
			fontBevel = style["font-bevel"];
		if (style["bevel-size"])
			bevelSize = style["bevel-size"];
		if (style["bevel-thickness"])
			bevelThickness = style["bevel-thickness"];
	}

	// set up defaults, safeguards; convert to typeface.js names
	fontFamily = fontFamily.toLowerCase();
	switch (fontFamily) {
		case "optima" :
			fontFamily = "optimer"; 
			break;
		case "helvetica" :
		default :
			fontFamily = "helvetiker"; 
			break;
	}

	// final safeguard, make sure font is there. if not, use helv
	var face = THREE.FontUtils.faces[fontFamily];
	if (!face) {
		fontFamily = "helvetiker"; 
	}
	
	fontWeight = fontWeight.toLowerCase();
	if (fontWeight != "bold") {
		fontWeight = "normal";
	}

	fontStyle = fontStyle.toLowerCase();
	// N.B.: for now, just use normal, italic doesn't seem to work 
	if (true) { // fontStyle != "italic") {
		fontStyle = "normal";
	}
	
	fontSize = parseFloat(fontSize);
	fontDepth = parseFloat(fontDepth);
	bevelSize = parseFloat(bevelSize);
	bevelThickness = parseFloat(bevelThickness);
	var bevelEnabled = (fontBevel.toLowerCase() == "bevel") ? true : false;
	if (!fontDepth) {
		bevelEnabled = false;
	}
	// hack because no-bevel shading has bad normals along text edge
	if (!bevelEnabled) {
		bevelThickness = bevelSize = glam.TextElement.BEVEL_EPSILON;
		bevelEnabled = true;
	}

	// The text value
	var value = docelt.getAttribute('value') || glam.TextElement.DEFAULT_VALUE;

	if (!value) {
		value = docelt.textContent;
	}
	
	param.value = value;
	param.fontSize = fontSize;
	param.fontDepth = fontDepth;
	param.bevelSize = bevelSize;
	param.bevelThickness = bevelThickness;
	param.bevelEnabled = bevelEnabled;
	param.fontFamily = fontFamily;
	param.fontWeight = fontWeight;
	param.fontStyle = fontStyle;
}

glam.TextElement.createVisual = function(docelt, material, param) {

	if (!param.value) {
		return null;
	}
	
	var curveSegments = 4;

	var textGeo = new THREE.TextGeometry( param.value, {

		font: param.fontFamily,
		weight: param.fontWeight,
		style: param.fontStyle,

		size: param.fontSize,
		height: param.fontDepth,
		curveSegments: curveSegments,

		bevelThickness: param.bevelThickness,
		bevelSize: param.bevelSize,
		bevelEnabled: param.bevelEnabled,

		material: 0,
		extrudeMaterial: 1

	});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	var frontMaterial = material.clone();
	frontMaterial.shading = THREE.FlatShading;
	var extrudeMaterial = material.clone();
	extrudeMaterial.shading = THREE.SmoothShading;
	var textmat = new THREE.MeshFaceMaterial( [ frontMaterial,  // front
	                                            extrudeMaterial // side
	                                            ]);


	var visual = new glam.Visual(
			{ geometry: textGeo,
				material: textmat
			});

	textGeo.center();
	
	return visual;
}

/**
 * @fileoverview cylinder parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CylinderElement');

glam.CylinderElement.DEFAULT_RADIUS = 2;
glam.CylinderElement.DEFAULT_HEIGHT = 2;

glam.CylinderElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.CylinderElement);
}

glam.CylinderElement.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.CylinderElement.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.CylinderElement.DEFAULT_HEIGHT;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}
	
	radius = parseFloat(radius);
	height = parseFloat(height);
	param.radius = radius;
	param.height = height;
}	

glam.CylinderElement.createVisual = function(docelt, material, param) {

	var visual = new glam.Visual(
			{ geometry: new THREE.CylinderGeometry(param.radius, param.radius, param.height, 32),
				material: material
			});
	
	return visual;
}

/**
 * @fileoverview particle system parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ParticlesElement');

glam.ParticlesElement.create = function(docelt, style) {

	var mparam = glam.DOMMaterial.parseStyle(style);

	// Parse the attributes
	var param = {};
	glam.ParticlesElement.getAttributes(docelt, style, param);
	
	// Throw in the texture from the material
	param.map = mparam.map;      // for static geometry-based
	param.texture = mparam.map;  // for dynamic emitter-based
	param.color = mparam.color;
	
	// Parse the child elements
	var elts = glam.ParticlesElement.parse(docelt);
	
	// Got geometry in there? Pass it on
	param.geometry = elts.geometry;

	// Create the particle system
	var ps = glam.ParticleSystem(param);

	// Got emitters in there? Add them
	glam.ParticlesElement.addEmitters(elts.emitters, ps);

	// Bind the properties
	var visual = ps.getComponent(glam.Visual);
	docelt.geometry = visual.geometry;
	docelt.material = visual.material;
	
	// Start it
	var pscript = ps.getComponent(glam.ParticleSystemScript);	
	pscript.active = true;
	return ps;
}

glam.ParticlesElement.getAttributes = function(docelt, style, param) {
	var maxAge = docelt.getAttribute('maxAge') || glam.ParticlesElement.DEFAULT_MAX_AGE;
	var size = parseFloat(docelt.getAttribute('size'));

	param.maxAge = parseFloat(maxAge);
	param.size = size;
}

glam.ParticlesElement.parse = function(docelt) {
	
	var result = {
			geometry : null,
			emitters : [
			            ],
	};
	
	// Any emitters?
	var emitters = docelt.getElementsByTagName('emitter');
	if (emitters) {
		var i, len = emitters.length;
		for (i = 0; i < len; i++) {
			
			var param = {
			};
			
			var emitter = emitters[i];
			if (emitter) {
				glam.ParticlesElement.parseEmitter(emitter, param);

				var pe = new glam.ParticleEmitter(param);
				result.emitters.push(pe);
			}
		}
	}
	
	// Or just static vertices...? Not working yet
	var verts = docelt.getElementsByTagName('vertices');
	if (verts) {
		verts = verts[0];
		if (verts) {
			var geometry = new THREE.Geometry;
			glam.DOMTypes.parseVector3Array(verts, geometry.vertices);
			result.geometry = geometry;
		}
	}
	
	return result;
}

glam.ParticlesElement.parseEmitter = function(emitter, param) {
	    
	var size = parseFloat(emitter.getAttribute('size'));
	var sizeEnd = parseFloat(emitter.getAttribute('sizeEnd'));
	var particlesPerSecond = parseInt(emitter.getAttribute('particlesPerSecond'));
	var opacityStart = parseFloat(emitter.getAttribute('opacityStart'));
	var opacityMiddle = parseFloat(emitter.getAttribute('opacityMiddle'));
	var opacityEnd = parseFloat(emitter.getAttribute('opacityEnd'));
	
	var colorStart, colorEnd, css;
	if (css = emitter.getAttribute('colorStart')) {
		colorStart = new THREE.Color().setStyle(css);
	}
	if (css = emitter.getAttribute('colorEnd')) {
		colorEnd = new THREE.Color().setStyle(css);
	}
	
	var vx = parseFloat(emitter.getAttribute('vx')) || 0;
	var vy = parseFloat(emitter.getAttribute('vy')) || 0;
	var vz = parseFloat(emitter.getAttribute('vz')) || 0;
	var ax = parseFloat(emitter.getAttribute('ax')) || 0;
	var ay = parseFloat(emitter.getAttribute('ay')) || 0;
	var az = parseFloat(emitter.getAttribute('az')) || 0;
	var psx = parseFloat(emitter.getAttribute('psx')) || 0;
	var psy = parseFloat(emitter.getAttribute('psy')) || 0;
	var psz = parseFloat(emitter.getAttribute('psz')) || 0;
	var asx = parseFloat(emitter.getAttribute('asx')) || 0;
	var asy = parseFloat(emitter.getAttribute('asy')) || 0;
	var asz = parseFloat(emitter.getAttribute('asz')) || 0;

	var velocity = new THREE.Vector3(vx, vy, vz);
	var acceleration = new THREE.Vector3(ax, ay, az);
	var positionSpread = new THREE.Vector3(psx, psy, psz);
	var accelerationSpread = new THREE.Vector3(asx, asy, asz);

	var vel = emitter.getAttribute('velocity');
	if (vel) {
		glam.DOMTypes.parseVector3(vel, velocity);
	}
	
	var accel = emitter.getAttribute('acceleration');
	if (accel) {
		glam.DOMTypes.parseVector3(accel, acceleration);
	}
	
	var posSpread = emitter.getAttribute('positionSpread');
	if (posSpread) {
		glam.DOMTypes.parseVector3(posSpread, positionSpread);
	}

	var accelSpread = emitter.getAttribute('accelerationSpread');
	if (accelSpread) {
		glam.DOMTypes.parseVector3(accelSpread, accelerationSpread);
	}

	var blending = THREE.NoBlending;
	var blend = emitter.getAttribute('blending') || "";
	switch (blend.toLowerCase()) {
	
		case "normal" :
			blending = THREE.NormalBlending;
			break;
		case "additive" :
			blending = THREE.AdditiveBlending;
			break;
		case "subtractive" :
			blending = THREE.SubtractiveBlending;
			break;
		case "multiply" :
			blending = THREE.MultiplyBlending;
			break;
		case "custom" :
			blending = THREE.CustomBlending;
			break;
		case "none" :
		default :
			break;
	}
	
	param.size = size;
	param.sizeEnd = sizeEnd;
	if (colorStart !== undefined) {
		param.colorStart = colorStart;
	}
	if (colorEnd !== undefined) {
		param.colorEnd = colorEnd;
	}	
	param.particlesPerSecond = particlesPerSecond;	
	param.opacityStart = opacityStart;
	param.opacityMiddle = opacityMiddle;
	param.opacityEnd = opacityEnd;
	param.velocity = velocity;
	param.acceleration = acceleration;
	param.positionSpread = positionSpread;
	param.accelerationSpread = accelerationSpread; 
	param.blending = blending;
}

glam.ParticlesElement.addEmitters = function(emitters, ps) {
	
	var i, len = emitters.length;
	for (i = 0; i < len; i++) {
		ps.addComponent(emitters[i]);
	}
}

glam.ParticlesElement.DEFAULT_MAX_AGE = 1;


/**
 * @fileoverview background parser/implementation. supports skyboxes and skyspheres
 * 
 * @author Tony Parisi
 */

goog.provide('glam.BackgroundElement');

glam.BackgroundElement.DEFAULT_BACKGROUND_TYPE = "box";

glam.BackgroundElement.create = function(docelt, style) {
	var type = docelt.getAttribute('background-type') || glam.BackgroundElement.DEFAULT_BACKGROUND_TYPE;
	type = docelt.getAttribute('type') || type;
	
	if (style) {
		if (style["background-type"])
			type = style["background-type"];
		var  param = glam.DOMMaterial.parseStyle(style);
	}	

	var background;
	if (type == "box") {
		background = glam.Prefabs.Skybox();
		var skyboxScript = background.getComponent(glam.SkyboxScript);
		skyboxScript.texture = param.envMap;
	}
	else if (type == "sphere") {
		background = glam.Prefabs.Skysphere();
		var skysphereScript = background.getComponent(glam.SkysphereScript);
		skysphereScript.texture = param.envMap;
	}

	glam.BackgroundElement.addHandlers(docelt, style, background);
	
	glam.Application.instance.addObject(background);
	
	return null;
}

glam.BackgroundElement.addHandlers = function(docelt, style, obj) {

	docelt.glam.setAttributeHandlers.push(function(attr, val) {
		glam.BackgroundElement.onSetAttribute(obj, docelt, attr, val);
	});
	
	style.setPropertyHandlers.push(function(attr, val) {
		glam.BackgroundElement.onSetAttribute(obj, docelt, attr, val);
	});
}

glam.BackgroundElement.onSetAttribute = function(obj, docelt, attr, val) {

	switch (attr) {
		case "sphere-image" :
		case "sphereImage" :
			var skysphereScript = obj.getComponent(glam.SkysphereScript);
			if (skysphereScript) {
				var envMap = THREE.ImageUtils.loadTexture(val);
				skysphereScript.texture = envMap;
			}
			else {
			}
			break;
	}
}

/**
 * @fileoverview controller parser/implementation. supports model, FPS and Rift
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ControllerElement');

glam.ControllerElement.create = function(docelt, style, app) {
	var on = true;
	
	var noheadlight = docelt.getAttribute("noheadlight");
	if (noheadlight !== null) {
		on = false;
		app.controllerScript.headlightOn = false;
	}
	
	var type = docelt.getAttribute("type");
	if (type !== null) {
		type = type.toLowerCase();
		if (type == "fps") {
			
			var x = parseFloat(docelt.getAttribute('x')) || 0;
			var y = parseFloat(docelt.getAttribute('y')) || 0;
			var z = parseFloat(docelt.getAttribute('z')) || 0;
			
			var controller = glam.Prefabs.FirstPersonController({active:true, headlight:on});
			var controllerScript = controller.getComponent(glam.FirstPersonControllerScript);
			app.addObject(controller);

			var object = new glam.Object;	
			var camera = new glam.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
		}
		else if (type == "rift") {
			var controller = glam.Prefabs.RiftController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(glam.RiftControllerScript);			
			app.addObject(controller);

			var object = new glam.Object;	
			var camera = new glam.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
			if (app.controllerScript) {
				app.controllerScript.enabled = false;
			}
			
			// hack because existing FPS or model controller
			// will clobber our values
			app.controller = controller;
			app.controllerScript = controllerScript;
		}
		else if (type == "deviceorientation") {
			var controller = glam.Prefabs.DeviceOrientationController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(glam.DeviceOrientationControllerScript);			
			app.addObject(controller);

			var object = new glam.Object;	
			var camera = new glam.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
			if (app.controllerScript) {
				app.controllerScript.enabled = false;
			}
			
			// hack because existing FPS or model controller
			// will clobber our values
			app.controller = controller;
			app.controllerScript = controllerScript;
		}
	}
	
	return null;
}

/**
 * @fileoverview built-in types and utilities to support glam parser
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMTypes');
goog.require('glam.BoxElement');
goog.require('glam.ConeElement');
goog.require('glam.CylinderElement');
goog.require('glam.SphereElement');
goog.require('glam.RectElement');
goog.require('glam.CircleElement');
goog.require('glam.ArcElement');
goog.require('glam.GroupElement');
goog.require('glam.AnimationElement');
goog.require('glam.BackgroundElement');
goog.require('glam.ImportElement');
goog.require('glam.CameraElement');
goog.require('glam.ControllerElement');
goog.require('glam.TextElement');
goog.require('glam.MeshElement');
goog.require('glam.LineElement');
goog.require('glam.LightElement');
goog.require('glam.ParticlesElement');
goog.require('glam.EffectElement');

glam.DOMTypes = {
};

// statics
glam.DOMTypes.types = {
		"box" :  { cls : glam.BoxElement, transform:true, animation:true, input:true, visual:true },
		"cone" :  { cls : glam.ConeElement, transform:true, animation:true, input:true, visual:true },
		"cylinder" :  { cls : glam.CylinderElement, transform:true, animation:true, input:true, visual:true },
		"sphere" :  { cls : glam.SphereElement, transform:true, animation:true, input:true, visual:true },
		"rect" :  { cls : glam.RectElement, transform:true, animation:true, input:true, visual:true },
		"circle" :  { cls : glam.CircleElement, transform:true, animation:true, input:true, visual:true },
		"arc" :  { cls : glam.ArcElement, transform:true, animation:true, input:true, visual:true },
		"group" :  { cls : glam.GroupElement, transform:true, animation:true, input:true },
		"animation" :  { cls : glam.AnimationElement },
		"background" :  { cls : glam.BackgroundElement },
		"import" :  { cls : glam.ImportElement, transform:true, animation:true },
		"camera" :  { cls : glam.CameraElement, transform:true, animation:true },
		"controller" :  { cls : glam.ControllerElement },
		"text" :  { cls : glam.TextElement, transform:true, animation:true, input:true, visual:true },
		"mesh" :  { cls : glam.MeshElement, transform:true, animation:true, input:true, visual:true },
		"line" :  { cls : glam.LineElement, transform:true, animation:true, visual:true },
		"light" :  { cls : glam.LightElement, transform:true, animation:true },
		"particles" :  { cls : glam.ParticlesElement, transform:true, animation:true },
		"effect" :  { cls : glam.EffectElement, },
};


glam.DOMTypes.parseVector3Array = function(element, vertices) {

	var text = element.textContent;
	var nums = text.match(/\S+/g);
	
	if (!nums)
		return;

	var i, len = nums.length;
	if (len < 3)
		return;
	
	for (i = 0; i < len; i += 3) {
		
		var x = parseFloat(nums[i]), 
			y = parseFloat(nums[i + 1]), 
			z = parseFloat(nums[i + 2]);
		
		var vec = new THREE.Vector3(x, y, z);
		vertices.push(vec);
	}
}

glam.DOMTypes.parseVector3 = function(text, vec) {

	var nums = text.match(/\S+/g);

	if (!nums)
		return;
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	var x = parseFloat(nums[0]), 
		y = parseFloat(nums[1]), 
		z = parseFloat(nums[2]);
	
	vec.set(x, y, z);
}

glam.DOMTypes.parseVector2Array = function(element, uvs) {
	var text = element.textContent;
	var nums = text.match(/\S+/g);

	if (!nums)
		return;
	
	var i, len = nums.length;
	if (len < 2)
		return;
	
	for (i = 0; i < len; i += 2) {
		
		var x = parseFloat(nums[i]), 
			y = parseFloat(nums[i + 1]);
		
		var vec = new THREE.Vector2(x, y);
		uvs.push(vec);
	}

}

glam.DOMTypes.parseColor3Array = function(element, colors) {
	var text = element.textContent;
	var nums = text.match(/\S+/g);

	if (!nums)
		return;
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	for (i = 0; i < len; i += 3) {
		
		var r = parseFloat(nums[i]), 
			g = parseFloat(nums[i + 1]), 
			b = parseFloat(nums[i + 2]);
		
		var c = new THREE.Color(r, g, b);
		colors.push(c);
	}

}


glam.DOMTypes.parseColor3 = function(text, c) {

	var nums = text.match(/\S+/g);

	if (!nums)
		return;
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	var r = parseFloat(nums[0]), 
		g = parseFloat(nums[1]), 
		b = parseFloat(nums[2]);
	
	c.setRGB(r, g, b);
}

glam.DOMTypes.parseFaceArray = function(element, faces) {
	
	var text = element.textContent;
	var nums = text.match(/\S+/g);

	if (!nums)
		return;
	
	var i, len = nums.length;
	if (len < 1)
		return;
	
	for (i = 0; i < len; i += 3) {
		
		var a = parseInt(nums[i]), 
			b = parseInt(nums[i + 1]), 
			c = parseInt(nums[i + 2]);
		
		var face = new THREE.Face3(a, b, c);
		faces.push(face);
	}

}

glam.DOMTypes.parseUVArray = function(element, uvs) {
	var text = element.textContent;
	var nums = text.match(/\S+/g);

	if (!nums)
		return;
	
	var i, len = nums.length;
	if (len < 6)
		return;
	
	for (i = 0; i < len; i += 6) {
		
		var faceUvs = [];
		
		for (var j = 0; j < 3; j++) {
			var x = parseFloat(nums[i + j * 2]);
			var y = parseFloat(nums[i + j * 2 + 1]);
			var vec = new THREE.Vector2(x, y);
			faceUvs.push(vec);
		}
		
		uvs.push(faceUvs);
	}

}

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

/* Hacked-up version of Three.js orbit controls for GLAM
 * Adds mode for one-button operation and optional userMinY
 * 
 */

goog.provide('glam.OrbitControls');

glam.OrbitControls = function ( object, domElement ) {

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
	
	this.usekeys = false;
	
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

		if ( !scope.usekeys) {
			return;
		}
		
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

glam.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );

/**
 * @fileoverview Camera Manager - singleton to manage cameras, active, resize etc.
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CameraManager');

glam.CameraManager.addCamera = function(camera)
{
	glam.CameraManager.cameraList.push(camera);
}

glam.CameraManager.removeCamera = function(camera)
{
    var i = glam.CameraManager.cameraList.indexOf(camera);

    if (i != -1)
    {
    	glam.CameraManager.cameraList.splice(i, 1);
    }
}

glam.CameraManager.setActiveCamera = function(camera)
{
	if (glam.CameraManager.activeCamera && glam.CameraManager.activeCamera != camera)
		glam.CameraManager.activeCamera.active = false;
	
	glam.CameraManager.activeCamera = camera;
	glam.Graphics.instance.setCamera(camera.object);
}


glam.CameraManager.handleWindowResize = function(width, height)
{
	var cameras = glam.CameraManager.cameraList;
	
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


glam.CameraManager.cameraList = [];
glam.CameraManager.activeCamera = null;
/**
 * @fileoverview Viewer class - Application Subclass for Model/Scene Viewer
 * @author Tony Parisi / http://www.tonyparisi.com
 */

goog.provide('glam.Viewer');
goog.require('glam.Application');

glam.Viewer = function(param)
{
	// Chain to superclass
	glam.Application.call(this, param);
	
	// Set up stats info
	this.lastFPSUpdateTime = 0;
	
	this.renderStats = { fps : 0 };
	this.sceneStats = { meshCount : 0, faceCount : 0, boundingBox:new THREE.Box3 };
	
	// Tuck away prefs based on param
	this.renderStatsUpdateInterval = (param.renderStatsUpdateInterval !== undefined) ? param.renderStatsUpdateInterval : 1000;
	this.loopAnimations = (param.loopAnimations !== undefined) ? param.loopAnimations : false;
	this.headlightOn = (param.headlight !== undefined) ? param.headlight : true;
	this.headlightIntensity = param.headlightIntensity || glam.Viewer.DEFAULT_HEADLIGHT_INTENSITY;
	this.riftController = (param.riftController !== undefined) ? param.riftController : false;
	this.firstPerson = (param.firstPerson !== undefined) ? param.firstPerson : false;
	this.showGrid = (param.showGrid !== undefined) ? param.showGrid : false;
	this.createBoundingBoxes = (param.createBoundingBoxes !== undefined) ? param.createBoundingBoxes : false;
	this.showBoundingBoxes = (param.showBoundingBoxes !== undefined) ? param.showBoundingBoxes : false;
	this.allowPan = (param.allowPan !== undefined) ? param.allowPan : true;
	this.allowZoom = (param.allowZoom !== undefined) ? param.allowZoom : true;
	this.oneButton = (param.oneButton !== undefined) ? param.oneButton : false;
	this.gridSize = param.gridSize || glam.Viewer.DEFAULT_GRID_SIZE;
	this.gridStepSize = param.gridStepSize || glam.Viewer.DEFAULT_GRID_STEP_SIZE;
	this.flipY = (param.flipY !== undefined) ? param.flipY : false;
	this.highlightedObject = null;
	this.highlightDecoration = null;
	
	// Set up backdrop objects for empty scene
	this.initScene();

	// Set up shadows - maybe make this a pref
	glam.Graphics.instance.enableShadows(true);
}

goog.inherits(glam.Viewer, glam.Application);

glam.Viewer.prototype.initScene = function()
{
	this.sceneRoot = new glam.Object;
	this.addObject(this.sceneRoot);
	if (this.flipY) {
		this.sceneRoot.transform.rotation.x = -Math.PI / 2;
	}

	this.gridRoot = new glam.Object;
	this.addObject(this.gridRoot);
	this.grid = null;	
	this.gridPicker = null;	
	this.createGrid();
	
	if (this.firstPerson) {
		this.controller = glam.Prefabs.FirstPersonController({active:true, 
			headlight:true,
			turn: !this.riftController,
			look: !this.riftController,
			});
		this.controllerScript = this.controller.getComponent(glam.FirstPersonControllerScript);
	}
	else {
		this.controller = glam.Prefabs.ModelController({active:true, headlight:true, 
			allowPan:this.allowPan, allowZoom:this.allowZoom, oneButton:this.oneButton});
		this.controllerScript = this.controller.getComponent(glam.ModelControllerScript);
	}
	this.addObject(this.controller);

	var viewpoint = new glam.Object;
	this.defaultCamera = new glam.PerspectiveCamera({active:true, 
		position : glam.Viewer.DEFAULT_CAMERA_POSITION});
	viewpoint.addComponent(this.defaultCamera);
	viewpoint.name = "[default]";
	this.addObject(viewpoint);

	this.controllerScript.camera = this.defaultCamera;
	
	if (this.riftController) {
		var controller = glam.Prefabs.RiftController({active:true, 
			headlight:false,
			mouseLook:false,
			useVRJS : true,
		});
		var controllerScript = controller.getComponent(glam.RiftControllerScript);
		controllerScript.camera = this.defaultCamera;
		controllerScript.moveSpeed = 6;
		
		this.riftControllerScript = controllerScript;
		this.addObject(controller);
	}
	
	var ambientLightObject = new glam.Object;
	this.ambientLight = new glam.AmbientLight({color:0xFFFFFF, intensity : this.ambientOn ? 1 : 0 });
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

glam.Viewer.prototype.runloop = function()
{
	var updateInterval = this.renderStatsUpdateInterval;
	
	glam.Application.prototype.runloop.call(this);
	if (glam.Graphics.instance.frameRate)
	{
		var now = Date.now();
		var deltat = now - this.lastFPSUpdateTime;
		if (deltat > updateInterval)
		{
			this.renderStats.fps = glam.Graphics.instance.frameRate;
			this.dispatchEvent("renderstats", this.renderStats);
			this.lastFPSUpdateTime = now;
		}
	}
}

glam.Viewer.prototype.replaceScene = function(data)
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
	
	this.sceneRoot.removeComponent(this.sceneRoot.findNode(glam.Decoration));
	
	this.scenes = [data.scene];
	this.sceneRoot.addChild(data.scene);
	
	var bbox = glam.SceneUtils.computeBoundingBox(data.scene);
	
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
				light.shadowCameraFar = glam.Light.DEFAULT_RANGE;
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

glam.Viewer.prototype.addToScene = function(data)
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
				light.shadowCameraFar = glam.Light.DEFAULT_RANGE;
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

glam.Viewer.prototype.createDefaultCamera = function() {
	
	var cam = this.controllerScript.viewpoint.camera.object;
	cam.updateMatrixWorld();
	var position = new THREE.Vector3;
	var quaternion = new THREE.Quaternion;
	var scale = new THREE.Vector3;
	cam.matrixWorld.decompose(position, quaternion, scale);
	var rotation = new THREE.Euler().setFromQuaternion(quaternion);

	var newCamera = new THREE.PerspectiveCamera(cam.fov, cam.aspect, cam.near, cam.far);
	return new glam.PerspectiveCamera({object:newCamera});
}

glam.Viewer.prototype.copyCameraValues = function(oldCamera, newCamera)
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

glam.Viewer.prototype.useCamera = function(id) {

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

glam.Viewer.prototype.addCamera = function(camera, id) {

	this.cameras.push(camera);
	this.cameraNames.push(id);

}

glam.Viewer.prototype.getCamera = function(id) {

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

glam.Viewer.prototype.toggleLight = function(index)
{
	if (this.lights && this.lights[index])
	{
		var light = this.lights[index];
		if (light instanceof glam.AmbientLight)
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

glam.Viewer.prototype.playAnimation = function(index, loop, reverse)
{
	if (loop === undefined)
		loop = this.loopAnimations;
	
	if (this.keyFrameAnimators && this.keyFrameAnimators[index])
	{
		this.keyFrameAnimators[index].loop = loop;
		if (reverse) {
			this.keyFrameAnimators[index].direction = glam.KeyFrameAnimator.REVERSE_DIRECTION;
		}
		else {
			this.keyFrameAnimators[index].direction = glam.KeyFrameAnimator.FORWARD_DIRECTION;
		}
		
		if (!loop)
			this.keyFrameAnimators[index].stop();

		this.keyFrameAnimators[index].start();
	}
}

glam.Viewer.prototype.stopAnimation = function(index)
{
	if (this.keyFrameAnimators && this.keyFrameAnimators[index])
	{
		this.keyFrameAnimators[index].stop();
	}
}

glam.Viewer.prototype.playAllAnimations = function(loop, reverse)
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
				this.keyFrameAnimators[i].direction = glam.KeyFrameAnimator.REVERSE_DIRECTION;
			}
			else {
				this.keyFrameAnimators[i].direction = glam.KeyFrameAnimator.FORWARD_DIRECTION;
			}
			
			this.keyFrameAnimators[i].start();
		}
	}
}

glam.Viewer.prototype.stopAllAnimations = function()
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

glam.Viewer.prototype.setLoopAnimations = function(on)
{
	this.loopAnimations = on;
}

glam.Viewer.prototype.setHeadlightOn = function(on)
{
	this.controllerScript.headlight.intensity = this.headlightIntensity ? this.headlightIntensity : 0;
	this.headlightOn = on;
}

glam.Viewer.prototype.setHeadlightIntensity = function(intensity)
{
	this.controllerScript.headlight.intensity = intensity;
}

glam.Viewer.prototype.setGridOn = function(on)
{
	if (this.grid)
	{
		this.grid.visible = on;
	}
}

glam.Viewer.prototype.setBoundingBoxesOn = function(on)
{
	this.showBoundingBoxes = on;
	var that = this;
	this.sceneRoot.map(glam.Decoration, function(o) {
		if (!that.highlightedObject || (o != that.highlightDecoration)) {
			o.visible = that.showBoundingBoxes;
		}
	});
}

glam.Viewer.prototype.setAmbientLightOn = function(on)
{
	this.ambientLight.intensity = on ? 1 : 0;
	this.ambientLightOn = on;
}

glam.Viewer.prototype.setFlipY = function(flip) {
	this.flipY = flip;
	if (this.flipY) {
		this.sceneRoot.transform.rotation.x = -Math.PI / 2;
		this.fitToScene();
	}
	else {
		this.sceneRoot.transform.rotation.x = 0;
	}
}

glam.Viewer.prototype.initHighlight = function() {
	if (this.highlightedObject) {
		this.highlightedObject.removeComponent(this.highlightDecoration);
	}
	this.highlightedObject = null;
}

glam.Viewer.prototype.highlightObject = function(object) {

	if (this.highlightedObject) {
		this.highlightParent.removeComponent(this.highlightDecoration);
	}

	if (object) {
		
		this.highlightDecoration = glam.Helpers.BoundingBoxDecoration({
			object : object,
			color : 0xaaaa00
		});
		
		if (object instanceof glam.Object) {
			object._parent.addComponent(this.highlightDecoration);
			this.highlightedObject = object;
			this.highlightParent = object._parent;
		}
		else if (object instanceof glam.Visual) {
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

glam.Viewer.prototype.createGrid = function()
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

	var line_material = new THREE.LineBasicMaterial( { color: glam.Viewer.GRID_COLOR, 
		opacity:glam.Viewer.GRID_OPACITY } );
	
	var gridObject = new THREE.Line( geometry, line_material, THREE.LinePieces );
	gridObject.visible = this.showGrid;
	this.grid = new glam.Visual({ object : gridObject });

	this.gridRoot.addComponent(this.grid);
	
	this.gridPicker = new glam.Picker;
	var that = this;
	this.gridPicker.addEventListener("mouseup", function(e) {
		that.highlightObject(null);
	});
	this.gridRoot.addComponent(this.gridPicker);
}

glam.Viewer.prototype.fitToScene = function()
{
	function log10(val) {
		  return Math.log(val) / Math.LN10;
		}

	this.boundingBox = glam.SceneUtils.computeBoundingBox(this.sceneRoot);
	
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
		this.sceneRoot.map(glam.Object, function(o) {
			if (o._parent) {
				
				var decoration = glam.Helpers.BoundingBoxDecoration({
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

glam.Viewer.prototype.calcSceneStats = function()
{
	this.meshCount = 0;
	this.faceCount = 0;
	
	var that = this;
	var visuals = this.sceneRoot.findNodes(glam.Visual);
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

glam.Viewer.prototype.setController = function(type) {
	if (!this.boundingBox)
		this.boundingBox = glam.SceneUtils.computeBoundingBox(this.sceneRoot);

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

glam.Viewer.DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 10);
glam.Viewer.DEFAULT_GRID_SIZE = 100;
glam.Viewer.DEFAULT_GRID_STEP_SIZE = 1;
glam.Viewer.GRID_COLOR = 0x202020;
glam.Viewer.GRID_OPACITY = 0.2;
glam.Viewer.DEFAULT_HEADLIGHT_INTENSITY = 1;

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

goog.provide('glam.OculusRiftControls');

glam.OculusRiftControls = function ( camera ) {

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

/**
 * @fileoverview Pick Manager - singleton to manage currently picked object(s)
 * 
 * @author Tony Parisi
 */

goog.provide('glam.PickManager');

glam.PickManager.handleMouseMove = function(event)
{
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseMove) {
    			pickers[i].onMouseMove(event);
    		}
    	}
    }
    else
    {
        var oldObj = glam.PickManager.overObject;
        glam.PickManager.overObject = glam.PickManager.objectFromMouse(event);

        if (glam.PickManager.overObject != oldObj)
        {
    		if (oldObj)
    		{
    			glam.Graphics.instance.setCursor(null);

    			event.type = "mouseout";
    	    	var pickers = oldObj.pickers;
    	    	var i, len = pickers.length;
    	    	for (i = 0; i < len; i++) {
    	    		if (pickers[i].enabled && pickers[i].onMouseOut) {
    	    			pickers[i].onMouseOut(event);
    	    		}
    	    	}
    		}

            if (glam.PickManager.overObject)
            {            	
        		event.type = "mouseover";
    	    	var pickers = glam.PickManager.overObject.pickers;
    	    	var i, len = pickers.length;
    	    	for (i = 0; i < len; i++) {
    	    		
    	    		if (pickers[i].enabled && pickers[i].overCursor) {
    	        		glam.Graphics.instance.setCursor(pickers[i].overCursor);
    	    		}
    	    		
    	        	if (pickers[i].enabled && pickers[i].onMouseOver) {
    	        		pickers[i].onMouseOver(event);
    	        	}
    	    	}

            }
        }
        
        if (glam.PickManager.overObject) {
	    	var pickers = glam.PickManager.overObject.pickers;
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

glam.PickManager.handleMouseDown = function(event)
{
    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseDown) {
    			pickers[i].onMouseDown(event);
    		}
    	}
    }
}

glam.PickManager.handleMouseUp = function(event)
{
    if (glam.PickManager.clickedObject)
    {
    	var overobject = glam.PickManager.objectFromMouse(event);
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseUp) {
    			pickers[i].onMouseUp(event);
    			// Also deliver a click event if we're over the same object as when
    			// the mouse was first pressed
    			if (overobject == glam.PickManager.clickedObject) {
    				event.type = "click";
    				pickers[i].onMouseClick(event);
    			}
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
}

glam.PickManager.handleMouseClick = function(event)
{
	/* N.B.: bailing out here, not sure why, leave this commented out
	return;
	
    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
    
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseClick) {
    			pickers[i].onMouseClick(event);
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
    */
}

glam.PickManager.handleMouseDoubleClick = function(event)
{
    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
    
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseDoubleClick) {
    			pickers[i].onMouseDoubleClick(event);
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
}

glam.PickManager.handleMouseScroll = function(event)
{
    if (glam.PickManager.overObject)
    {
    	var pickers = glam.PickManager.overObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseScroll) {
    			pickers[i].onMouseScroll(event);
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
}

glam.PickManager.handleTouchStart = function(event)
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
	    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
	    if (glam.PickManager.clickedObject)
	    {
	    	var pickers = glam.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchStart) {
	    			pickers[i].onTouchStart(event);
	    		}
	    	}
	    }
	}
}

glam.PickManager.handleTouchMove = function(event)
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

		if (glam.PickManager.clickedObject) {
	    	var pickers = glam.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchMove) {
	    			pickers[i].onTouchMove(event);
	    		}
	    	}
	    }
	}
}

glam.PickManager.handleTouchEnd = function(event)
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
	    if (glam.PickManager.clickedObject)
	    {
	    	var pickers = glam.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchEnd) {
	    			pickers[i].onTouchEnd(event);
	    		}
	    	}
	    }
	    
	    glam.PickManager.clickedObject = null;
	}	
}

glam.PickManager.objectFromMouse = function(event)
{
	var intersected = glam.Graphics.instance.objectFromMouse(event);
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

		return glam.PickManager.findObjectPicker(event, intersected.hitPointWorld, intersected.object.object);
	}
	else
	{
		return null;
	}
}

glam.PickManager.findObjectPicker = function(event, hitPointWorld, object) {
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


glam.PickManager.clickedObject = null;
glam.PickManager.overObject  =  null;
goog.provide('glam.AmbientLight');
goog.require('glam.Light');

glam.AmbientLight = function(param)
{
	param = param || {};
	
	glam.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
	}
	else {
		this.object = new THREE.AmbientLight(param.color);
	}
}

goog.inherits(glam.AmbientLight, glam.Light);

glam.AmbientLight.prototype.realize = function() 
{
	glam.Light.prototype.realize.call(this);
}

/**
 * @fileoverview RotateBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.RotateBehavior');
goog.require('glam.Behavior');

glam.RotateBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.velocity = (param.velocity !== undefined) ? param.velocity : (Math.PI / 2 / this.duration);
	this.startAngle = 0;
	this.angle = 0;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.RotateBehavior, glam.Behavior);

glam.RotateBehavior.prototype.start = function()
{
	this.angle = 0;
	this._object.transform.rotation.y = this._object.transform.rotation.y % (Math.PI * 2);
	this.startAngle = this._object.transform.rotation.y;
	
	glam.Behavior.prototype.start.call(this);
}

glam.RotateBehavior.prototype.evaluate = function(t)
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
}
/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('glam.Prefabs');

glam.Prefabs.Skysphere = function(param)
{
	param = param || {};
	
	var sphere = new glam.Object({layer:glam.Graphics.instance.backgroundLayer});

	var material = new THREE.MeshBasicMaterial( {
		color:0xffffff,
//		side: THREE.BackSide

	} );

	var geometry = new THREE.SphereGeometry( 500, 32, 32 );
	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
	var visual = new glam.Visual(
			{ geometry: geometry,
				material: material,
			});
	sphere.addComponent(visual);
	
	var script = new glam.SkysphereScript(param);
	sphere.addComponent(script);
	
	sphere.realize();

	return sphere;
}

goog.provide('glam.SkysphereScript');
goog.require('glam.Script');

glam.SkysphereScript = function(param)
{
	glam.Script.call(this, param);

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

goog.inherits(glam.SkysphereScript, glam.Script);

glam.SkysphereScript.prototype.realize = function()
{
	var visual = this._object.getComponent(glam.Visual);
	this.material = visual.material;

	this.camera = glam.Graphics.instance.backgroundLayer.camera;
	this.camera.far = 20000;
	this.camera.position.set(0, 0, 0);
}

glam.SkysphereScript.prototype.update = function()
{
	var maincam = glam.Graphics.instance.camera;
	maincam.updateMatrixWorld();
	maincam.matrixWorld.decompose(this.maincampos, this.maincamrot, this.maincamscale);
	this.camera.quaternion.copy(this.maincamrot);
}


goog.provide("glam.System");

glam.System = {
	log : function() {
		var args = ["[glam] "].concat([].slice.call(arguments));
		console.log.apply(console, args);
	},
	warn : function() {
		var args = ["[glam] "].concat([].slice.call(arguments));
		console.warn.apply(console, args);
	},
	error : function() {
		var args = ["[glam] "].concat([].slice.call(arguments));
		console.error.apply(console, args);
	},
	ajax : function(param) {

		var type = param.type,
			url = param.url,
			dataType = param.dataType,
			success = param.success,
			error = param.error;

        var xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.responseType = dataType;

        xhr.addEventListener( 'load', function ( event ) {
            success(xhr.response);
        }, false );
        xhr.addEventListener( 'error', function ( event ) {
            error(xhr.status);
        }, false );
        xhr.send(null);
    },		
};
goog.provide('glam.PointLight');
goog.require('glam.Light');

glam.PointLight = function(param)
{
	param = param || {};
	
	glam.Light.call(this, param);
	
	this.positionVec = new THREE.Vector3;
	
	if (param.object) {
		this.object = param.object; 
	}
	else {
		var distance = ( param.distance !== undefined ) ? param.distance : glam.PointLight.DEFAULT_DISTANCE;
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

goog.inherits(glam.PointLight, glam.Light);

glam.PointLight.prototype.realize = function() 
{
	glam.Light.prototype.realize.call(this);
}

glam.PointLight.prototype.update = function() 
{
	if (this.object)
	{
		this.positionVec.set(0, 0, 0);
		var worldmat = this.object.parent.matrixWorld;
		this.positionVec.applyMatrix4(worldmat);
		this.position.copy(this.positionVec);
	}
	
	// Update the rest
	glam.Light.prototype.update.call(this);
}

glam.PointLight.DEFAULT_DISTANCE = 0;

/**
 * @fileoverview Effect - GLAM postprocessing effect, wraps Three.js
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Effect');
goog.require('glam.EventDispatcher');

/**
 * @constructor
 */

glam.Effect = function(shader)
{
    glam.EventDispatcher.call(this);	
    
	this.isShaderEffect = false;

    if (shader.render && typeof(shader.render) == "function") {
    	this.pass = shader;
    }
    else {
    	this.pass = new THREE.ShaderPass(shader);
    	this.isShaderEffect = true;
    }
}

goog.inherits(glam.Effect, glam.EventDispatcher);

glam.Effect.prototype.update = function() {

	// hook for later - maybe we do
	// subclass with specific knowledge about shader uniforms
}


/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.PlaneDragger');
goog.require('glam.Picker');

glam.PlaneDragger = function(param) {
	
	param = param || {};
	
    glam.Picker.call(this, param);
    
    this.normal = param.normal || new THREE.Vector3(0, 0, 1);
    this.position = param.position || new THREE.Vector3;
    this.color = 0x0000aa;
}

goog.inherits(glam.PlaneDragger, glam.Picker);

glam.PlaneDragger.prototype.realize = function()
{
	glam.Picker.prototype.realize.call(this);

    // And some helpers
    this.dragObject = null;
	this.dragOffset = new THREE.Vector3;
	this.dragHitPoint = new THREE.Vector3;
	this.dragStartPoint = new THREE.Vector3;
	this.dragPlane = this.createDragPlane();
	this.dragPlane.visible = glam.PlaneDragger.SHOW_DRAG_PLANE;
	this.dragPlane.ignorePick = true;
	this.dragPlane.ignoreBounds = true;
	this._object._parent.transform.object.add(this.dragPlane);
}

glam.PlaneDragger.prototype.createDragPlane = function() {

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

	var mat = new THREE.MeshBasicMaterial({color:this.color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	return mesh;
}

glam.PlaneDragger.prototype.update = function() {
}

glam.PlaneDragger.prototype.onMouseMove = function(event) {
	glam.Picker.prototype.onMouseMove.call(this, event);
	this.handleMouseMove(event);
}

glam.PlaneDragger.prototype.handleMouseMove = function(event) {
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
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

glam.PlaneDragger.prototype.onMouseDown = function(event) {
	glam.Picker.prototype.onMouseDown.call(this, event);
	this.handleMouseDown(event);
}

glam.PlaneDragger.prototype.handleMouseDown = function(event) {
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
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

glam.PlaneDragger.prototype.onMouseUp = function(event) {
	glam.Picker.prototype.onMouseUp.call(this, event);
	this.handleMouseUp(event);
}

glam.PlaneDragger.prototype.handleMouseUp = function(event) {
}


glam.PlaneDragger.prototype.onTouchStart = function(event) {
	glam.Picker.prototype.onTouchStart.call(this, event);

	this.handleMouseDown(event);
}

glam.PlaneDragger.prototype.onTouchMove = function(event) {
	glam.Picker.prototype.onTouchMove.call(this, event);

	this.handleMouseMove(event);
}

glam.PlaneDragger.prototype.onTouchEnd = function(event) {
	glam.Picker.prototype.onTouchEnd.call(this, event);

	this.handleMouseUp(event);
}

glam.PlaneDragger.SHOW_DRAG_PLANE = false;
glam.PlaneDragger.SHOW_DRAG_NORMAL = false;
/**
 * @fileoverview A visual containing a model in Collada format
 * @author Tony Parisi
 */
goog.provide('glam.SceneVisual');
goog.require('glam.Visual');

glam.SceneVisual = function(param) 
{
	param = param || {};
	
    glam.Visual.call(this, param);

    this.object = param.scene;
}

goog.inherits(glam.SceneVisual, glam.Visual);

glam.SceneVisual.prototype.realize = function()
{
	glam.Visual.prototype.realize.call(this);
	
    this.addToScene();
}

/**
 * @fileoverview Contains prefab assemblies for core GLAM package
 * @author Tony Parisi
 */
goog.provide('glam.Helpers');

glam.Helpers.BoundingBoxDecoration = function(param) {
	param = param || {};
	if (!param.object) {
		glam.warn("glam.Helpers.BoundingBoxDecoration requires an object");
		return null;
	}
	
	var object = param.object;
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var bbox = glam.SceneUtils.computeBoundingBox(object);
	
	var width = bbox.max.x - bbox.min.x,
		height = bbox.max.y - bbox.min.y,
		depth = bbox.max.z - bbox.min.z;
	
	var mesh = new THREE.BoxHelper();
	mesh.material.color.setHex(color);
	mesh.scale.set(width / 2, height / 2, depth / 2);
	
	var decoration = new glam.Decoration({object:mesh});
	
	var center = bbox.max.clone().add(bbox.min).multiplyScalar(0.5);
	decoration.position.add(center);
	
	return decoration;
}

glam.Helpers.VectorDecoration = function(param) {

	param = param || {};
	
	var start = param.start || new THREE.Vector3;
	var end = param.end || new THREE.Vector3(0, 1, 0);
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var linegeom = new THREE.Geometry();
	linegeom.vertices.push(start, end); 

	var mat = new THREE.LineBasicMaterial({color:color});

	var mesh = new THREE.Line(linegeom, mat);
	
	var decoration = new glam.Decoration({object:mesh});
	return decoration;
}

glam.Helpers.PlaneDecoration = function(param) {

	param = param || {};
	
	if (!param.normal && !param.triangle) {
		glam.warn("glam.Helpers.PlaneDecoration requires either a normal or three coplanar points");
		return null;
	}

	var normal = param.normal;
	if (!normal) {
		// do this later
		glam.warn("glam.Helpers.PlaneDecoration creating plane from coplanar points not implemented yet");
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
	
	var decoration = new glam.Decoration({object:mesh});
	return decoration;
}


/**
 * @fileoverview GLAM scene utilities
 * @author Tony Parisi
 */
goog.provide('glam.SceneUtils');

// Compute the bounding box of an object or hierarchy of objects
glam.SceneUtils.computeBoundingBox = function(obj) {
	
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
	
	if (obj instanceof glam.Object) {
		return computeBoundingBox(obj.transform.object);
	}
	else if (obj instanceof glam.Visual) {
		return computeBoundingBox(obj.object);
	}
	else {
		return new THREE.Box3(new THREE.Vector3, new THREE.Vector3);
	}
}



/**
 * @fileoverview Loader - loads level files
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Loader');
goog.require('glam.EventDispatcher');

/**
 * @constructor
 * @extends {glam.PubSub}
 */
glam.Loader = function()
{
    glam.EventDispatcher.call(this);	
}

goog.inherits(glam.Loader, glam.EventDispatcher);
        
glam.Loader.prototype.loadModel = function(url, userData)
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

glam.Loader.prototype.handleModelLoaded = function(url, userData, geometry, materials)
{
	// Create a new mesh with per-face materials
	var material = new THREE.MeshFaceMaterial(materials);
	var mesh = new THREE.Mesh( geometry, material  );
	
	var obj = new glam.Object;
	var visual = new glam.Visual({object:mesh});
	obj.addComponent(visual);

	var result = { scene : obj, cameras: [], lights: [], keyFrameAnimators:[] , userData: userData };
	
	this.dispatchEvent("loaded", result);
}

glam.Loader.prototype.loadScene = function(url, userData)
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

glam.Loader.prototype.traverseCallback = function(n, result)
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

glam.Loader.prototype.handleSceneLoaded = function(url, data, userData)
{
	var result = {};
	var success = false;
	
	if (data.scene)
	{
		// console.log("In loaded callback for ", url);
		
		var convertedScene = this.convertScene(data.scene);
		result.scene = convertedScene; // new glam.SceneVisual({scene:data.scene}); // 
		result.cameras = convertedScene.findNodes(glam.Camera);
		result.lights = convertedScene.findNodes(glam.Light);
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
			result.keyFrameAnimators.push(new glam.KeyFrameAnimator({animations:animations}));
		}
	}
	
	/*
	if (data.skins && data.skins.length)
	{
		// result.meshAnimator = new glam.MeshAnimator({skins:data.skins});
	}
	*/
	
	if (success)
		this.dispatchEvent("loaded", result);
}

glam.Loader.prototype.handleSceneProgress = function(url, progress)
{
	this.dispatchEvent("progress", progress);
}

glam.Loader.prototype.convertScene = function(scene) {

	function convert(n) {
		if (n instanceof THREE.Mesh) {
			// cheap fixes for picking and animation; need to investigate
			// the general case longer-term for glTF loader
			n.matrixAutoUpdate = true;
			n.geometry.dynamic = true;
			var v = new glam.Visual({object:n});
			v.name = n.name;
			return v;
		}
		else if (n instanceof THREE.Camera) {
			if (n instanceof THREE.PerspectiveCamera) {
				return new glam.PerspectiveCamera({object:n});
			}
		}
		else if (n instanceof THREE.Light) {
			if (n instanceof THREE.AmbientLight) {
				return new glam.AmbientLight({object:n});
			}
			else if (n instanceof THREE.DirectionalLight) {
				return new glam.DirectionalLight({object:n});
			}
			else if (n instanceof THREE.PointLight) {
				return new glam.PointLight({object:n});
			}
			else if (n instanceof THREE.SpotLight) {
				return new glam.SpotLight({object:n});
			}
		}
		else if (n.children) {
			var o = new glam.Object({autoCreateTransform:false});
			o.addComponent(new glam.Transform({object:n}));
			o.name = n.name;
			n.matrixAutoUpdate = true;
			var i, len = n.children.length;
			for (i = 0; i < len; i++) {
				var childNode  = n.children[i];
				var c = convert(childNode);
				if (c instanceof glam.Object) {
					o.addChild(c);
				}
				else if (c instanceof glam.Component) {
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


goog.require('glam.Prefabs');

glam.Prefabs.ModelController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.ModelControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('glam.ModelControllerScript');
goog.require('glam.Script');

glam.ModelControllerScript = function(param)
{
	glam.Script.call(this, param);

	this.radius = param.radius || glam.ModelControllerScript.default_radius;
	this.minRadius = param.minRadius || glam.ModelControllerScript.default_min_radius;
	this.minAngle = (param.minAngle !== undefined) ? param.minAngle : 
		glam.ModelControllerScript.default_min_angle;
	this.maxAngle = (param.maxAngle !== undefined) ? param.maxAngle : 
		glam.ModelControllerScript.default_max_angle;
	this.minDistance = (param.minDistance !== undefined) ? param.minDistance : 
		glam.ModelControllerScript.default_min_distance;
	this.maxDistance = (param.maxDistance !== undefined) ? param.maxDistance : 
		glam.ModelControllerScript.default_max_distance;
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

goog.inherits(glam.ModelControllerScript, glam.Script);

glam.ModelControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.ModelControllerScript.prototype.createControls = function(camera)
{
	var controls = new glam.OrbitControls(camera.object, glam.Graphics.instance.container);
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

glam.ModelControllerScript.prototype.update = function()
{
	this.controls.update();
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

glam.ModelControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this._camera.position.set(0, this.radius / 2, this.radius);
	this.controls = this.createControls(camera);
}

glam.ModelControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

glam.ModelControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

glam.ModelControllerScript.default_radius = 10;
glam.ModelControllerScript.default_min_radius = 1;
glam.ModelControllerScript.default_min_angle = 0;
glam.ModelControllerScript.default_max_angle = Math.PI;
glam.ModelControllerScript.default_min_distance = 0;
glam.ModelControllerScript.default_max_distance = Infinity;
glam.ModelControllerScript.MAX_X_ROTATION = 0; // Math.PI / 12;
glam.ModelControllerScript.MIN_X_ROTATION = -Math.PI / 2;
glam.ModelControllerScript.MAX_Y_ROTATION = Math.PI * 2;
glam.ModelControllerScript.MIN_Y_ROTATION = -Math.PI * 2;


goog.require('glam.Prefabs');

glam.Prefabs.DeviceOrientationController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.DeviceOrientationControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
		
	return controller;
}

goog.provide('glam.DeviceOrientationControllerScript');
goog.require('glam.Script');

glam.DeviceOrientationControllerScript = function(param)
{
	glam.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._headlightOn = param.headlight;
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

goog.inherits(glam.DeviceOrientationControllerScript, glam.Script);

glam.DeviceOrientationControllerScript.prototype.realize = function() {
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.DeviceOrientationControllerScript.prototype.createControls = function(camera)
{
	var controls = new glam.DeviceOrientationControlsCB(camera.object);
	
	if (this._enabled)
		controls.connect();
	
	controls.roll = this.roll;
	return controls;
}

glam.DeviceOrientationControllerScript.prototype.update = function()
{
	if (this._enabled)
		this.controls.update();

	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

glam.DeviceOrientationControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	if (this._enabled)
		this.controls.connect();
	else
		this.controls.disconnect();
}

glam.DeviceOrientationControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

glam.DeviceOrientationControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
}

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

/* Heavily adapted version of Three.js FirstPerson controls for GLAM
 * 
 */

goog.provide('glam.FirstPersonControls');

glam.FirstPersonControls = function ( object, domElement ) {

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
			
			if (axis.axis == glam.Gamepad.AXIS_LEFT_V) {
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
			else if (axis.axis == glam.Gamepad.AXIS_LEFT_H) {
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
			else if (axis.axis == glam.Gamepad.AXIS_RIGHT_V) {
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
			else if (axis.axis == glam.Gamepad.AXIS_RIGHT_H) {
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
	
	var gamepad = glam.Gamepad.instance;
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
 * @fileoverview mouse input implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMInput');

glam.DOMInput = {};

glam.DOMInput.add = function(docelt, obj) {
	
	function addListener(picker, evt) {
		picker.addEventListener(evt, function(event){
			var domEvent = new CustomEvent(
					evt, 
					{
						detail: {
						},
						bubbles: true,
						cancelable: true
					}
				);
			for (var propName in event) {
				if (domEvent[propName] === undefined) {
					domEvent[propName] = event[propName];					
				}
				else {
					; // console.log("Skipping prop", propName);					
				}
			}
			var res = docelt.dispatchEvent(domEvent);
			
		});
	}
	
	var picker = new glam.Picker;
	
	var events = ["click", "mouseover", "mouseout", "mousedown", "mouseup", "mousemove",
		"touchstart", "touchend"];
	for (var index in events) {
		var evt = events[index];
		addListener(picker, evt);
	}
		
	obj.addComponent(picker);

	var viewpicker = new glam.ViewPicker;
	obj.addComponent(viewpicker);
	addListener(viewpicker, "viewover")
	addListener(viewpicker, "viewout");
}

/**
 * @fileoverview styles support - emulate built-in DOM style object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMStyle');

glam.DOMStyle = function(docelt) {

	this.docelt = docelt;
	this._properties = {
	};
	
	this.setPropertyHandlers = [];
	this.defineStandardProperties();
}

glam.DOMStyle.prototype = new Object;

glam.DOMStyle.prototype.addProperties = function(props) {
	for (var p in props) {
		this.addProperty(p, props[p]);
	}
}

glam.DOMStyle.prototype.addProperty = function(propName, propValue) {

	this.defineProperty(propName, propValue);

	this._properties[propName] = propValue;
}

glam.DOMStyle.prototype.addPropertiesFromString = function(str) {
	var propstrs = str.split(';');
	var props = {
	};
	
	var i, len = propstrs.length;
	for (i = 0; i < len; i++) {
		var prop = propstrs[i];
		var elts = prop.split(':');
		var propName = elts[0];
		propName = propName.replace(/ /g,'');
		if (propName) {
			var propValue = elts[1];
			props[propName] = propValue;
		}
	}
	
	this.addProperties(props);
}

glam.DOMStyle.prototype.onPropertyChanged = function(propName, propValue) {

	// console.log(this.docelt.id, "property", propName, "value changed to", propValue);

	var i, len = this.setPropertyHandlers.length;
	for (i = 0; i < len; i++) {
		var handler = this.setPropertyHandlers[i];
		if (handler) {
			handler(propName, propValue);
		}
	}
}

glam.DOMStyle.prototype.defineProperty = function(propName, propValue) {
	Object.defineProperty(this, propName, {
			enumerable : true,
			configurable : true,
	        get: function() {
	            return this._properties[propName];
	        },
	        set: function(v) {
	        	this._properties[propName] = v;
	        	this.onPropertyChanged(propName, v);
	        }
		});
}

glam.DOMStyle.prototype.defineStandardProperties = function() {

	var props = glam.DOMStyle._standardProperties
	var propName;
	for (propName in props) {
		var propValue = props[propName];
		this.defineProperty(propName, propValue)
	}
}

glam.DOMStyle._standardProperties = {
		"angle" : "",
		"backface-visibility" : "visible",
		"background-type" : "",
		"bevel-size" : "",
		"bevel-thickness" : "",
		"color" : "",
		"diffuse-color" : "",
		"diffuseColor" : "",
		"specular-color" : "",
		"specularColor" : "",
		"dash-size" : "",
		"depth" : "",
		"distance" : "",
		"end-angle" : "",
		"cube-image-back" : "",
		"cube-image-bottom" : "",
		"cube-image-front" : "",
		"cube-image-left" : "",
		"cube-image-right" : "",
		"cube-image-top" : "",
		"sphere-image" : "",
		"sphereImage" : "",
		"font-bevel" : "",
		"font-depth" : "",
		"font-family" : "",
		"font-size" : "",
		"font-style" : "",
		"font-weight" : "",
		"gap-size" : "",
		"height" : "",
		"line-width" : "",
		"image" : "",
		"normal-image" : "",
		"bump-image" : "",
		"specular-image" : "",
		"opacity" : "",
		"radius" : "",
		"radius-segments" : "",
		"width-segments" : "",
		"height-segments" : "",
		"reflectivity" : "",
		"refraction-ratio" : "",
		"render-mode" : "",
		"rx" : "",
		"ry" : "",
		"rz" : "",
		"shader" : "phong",
		"fragment-shader" : "",
		"vertex-shader" : "",
		"shader-uniforms" : "",
		"start-angle" : "",
		"sx" : "",
		"sy" : "",
		"sz" : "",
		"vertex-colors" : "",
		"vertex-normals" : "",
		"width" : "",
		"x" : "",
		"y" : "",
		"z" : "",
};


/**
 * @fileoverview Timer - component that generates time events
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Timer');
goog.require('glam.Component');

glam.Timer = function(param)
{
    glam.Component.call(this);
    param = param || {};
    
    this.currentTime = glam.Time.instance.currentTime;
    this.running = false;
    this.duration = param.duration ? param.duration : 0;
    this.loop = (param.loop !== undefined) ? param.loop : false;
    this.lastFraction = 0;
}

goog.inherits(glam.Timer, glam.Component);

glam.Timer.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = glam.Time.instance.currentTime;
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

glam.Timer.prototype.start = function()
{
	this.running = true;
	this.currentTime = glam.Time.instance.currentTime;
}

glam.Timer.prototype.stop = function()
{
	this.running = false;
}


/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('glam.Prefabs');

glam.Prefabs.HUD = function(param) {

	param = param || {};
	
	var hud = new glam.Object();

	var hudScript = new glam.HUDScript(param);
	hud.addComponent(hudScript);
	
	return hud;
}

goog.provide('glam.HUDScript');
goog.require('glam.Script');

glam.HUDScript = function(param) {
	
	glam.Script.call(this, param);

	this.zDistance = (param.zDistance !== undefined) ? param.zDistance : glam.HUDScript.DEFAULT_Z_DISTANCE;
	this.position = new THREE.Vector3(0, 0, -this.zDistance);
	this.savedPosition = this.position.clone();
	this.scale = new THREE.Vector3;
	this.quaternion = new THREE.Quaternion;
}

goog.inherits(glam.HUDScript, glam.Script);

glam.HUDScript.prototype.realize = function() {
}

glam.HUDScript.EPSILON = 0.001;

glam.HUDScript.prototype.update = function() {
	
	var cam = glam.Graphics.instance.camera;
	
	cam.updateMatrixWorld();
	
	cam.matrixWorld.decompose(this.position, this.quaternion, this.scale);
	
	this._object.transform.quaternion.copy(this.quaternion);
	this._object.transform.position.copy(this.position);
	this._object.transform.translateZ(-this.zDistance);
	
	if (this.savedPosition.distanceTo(this.position) > glam.HUDScript.EPSILON) {
		console.log("Position changed:", this.position)
	}
	
	this.savedPosition.copy(this.position);
}

glam.HUDScript.DEFAULT_Z_DISTANCE = 1;


/**
 * @fileoverview transform properties parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMTransform');

glam.DOMTransform.parse = function(docelt, style, obj) {
	
	var t = {
	};
	
	t.x = parseFloat(docelt.getAttribute('x')) || 0;
	t.y = parseFloat(docelt.getAttribute('y')) || 0;
	t.z = parseFloat(docelt.getAttribute('z')) || 0;
	t.rx = glam.DOMTransform.parseRotation(docelt.getAttribute('rx')) || 0;
	t.ry = glam.DOMTransform.parseRotation(docelt.getAttribute('ry')) || 0;
	t.rz = glam.DOMTransform.parseRotation(docelt.getAttribute('rz')) || 0;
	t.sx = parseFloat(docelt.getAttribute('sx')) || 1;
	t.sy = parseFloat(docelt.getAttribute('sy')) || 1;
	t.sz = parseFloat(docelt.getAttribute('sz')) || 1;
	var transform = docelt.getAttribute('transform') ||
		docelt.getAttribute('-webkit-transform') ||
		docelt.getAttribute('-moz-transform') ||
		docelt.getAttribute('-ms-transform') ||
		docelt.getAttribute('-opera-transform');
	if (transform) {
		glam.DOMTransform.parseTransform(transform, t);
	}

	if (style) {
		glam.DOMTransform.parseStyle(style, t);
	}
	
	obj.transform.position.set(t.x, t.y, t.z);
	obj.transform.rotation.set(t.rx, t.ry, t.rz);
	obj.transform.scale.set(t.sx, t.sy, t.sz);
	
	docelt.glam.setAttributeHandlers.push(function(attr, val) {
		glam.DOMTransform.onSetAttribute(obj, docelt, attr, val);
	});

	style.setPropertyHandlers.push(function(attr, val) {
		glam.DOMTransform.onSetAttribute(obj, docelt, attr, val);
	});
}

glam.DOMTransform.parseStyle = function(style, t) {
	
	if (style) {
		if (style.x) {
			t.x = parseFloat(style.x);
		}
		if (style.y) {
			t.y = parseFloat(style.y);
		}
		if (style.z) {
			t.z = parseFloat(style.z);
		}
		if (style.rx) {
			t.rx = glam.DOMTransform.parseRotation(style.rx);
		}
		if (style.ry) {
			t.ry = glam.DOMTransform.parseRotation(style.ry);
		}
		if (style.rz) {
			t.rz = glam.DOMTransform.parseRotation(style.rz);
		}
		if (style.sx) {
			t.sx = parseFloat(style.sx);
		}
		if (style.sy) {
			t.sy = parseFloat(style.sy);
		}
		if (style.sz) {
			t.sz = parseFloat(style.sz);
		}
		var transform = style['transform'] ||
			style['-webkit-transform'] ||
			style['-moz-transform'] ||
			style['-ms-transform'] ||
			style['-opera-transform'];

		if (transform) {			
			glam.DOMTransform.parseTransform(transform, t);
		}
	}
}

glam.DOMTransform.parseRotation = function(r) {
	if (!r)
		return null;
	
	r = r.toLowerCase();
	var i = r.indexOf("deg");
	if (i != -1) {
		var degrees = r.split("deg");
		if (degrees.length) {
			var deg = parseFloat(degrees[0]);
			return THREE.Math.degToRad(deg);
		}
	}
	
	var i = r.indexOf("rad");
	if (i != -1) {
		var radians = r.split("rad");
		if (radians.length) {
			var rad = parseFloat(radians[0]);
			return rad;
		}
	}
	
	return parseFloat(r);
}

glam.DOMTransform.parseTransform = function(str, t) {

	var transforms = str.split(" ");
	var i, len = transforms.length;
	for (i = 0; i < len; i++) {
		var transform = transforms[i];
		var op = transform.split("(")[0];
		var regExp = /\(([^)]+)\)/;
		var matches = regExp.exec(transform);
		var value = matches[1];
		
		
		switch(op) {
			case "translateX" :
				t.x = parseFloat(value);
				break;
			case "translateY" :
				t.y = parseFloat(value);
				break;
			case "translateZ" :
				t.z = parseFloat(value);
				break;
			case "rotateX" :
				t.rx = glam.DOMTransform.parseRotation(value);
				break;
			case "rotateY" :
				t.ry = glam.DOMTransform.parseRotation(value);
				break;
			case "rotateZ" :
				t.rz = glam.DOMTransform.parseRotation(value);
				break;
			case "scaleX" :
				t.sx = parseFloat(value);
				break;
			case "scaleY" :
				t.sy = parseFloat(value);
				break;
			case "scaleZ" :
				t.sz = parseFloat(value);
				break;
		}		
	}
}

glam.DOMTransform.onSetAttribute = function(obj, docelt, attr, val) {
	var v = parseFloat(val);
	switch(attr) {
		case 'x' :
			obj.transform.position.x = v;
			break;
		case 'y' :
			obj.transform.position.y = v;
			break;
		case 'z' :
			obj.transform.position.z = v;
			break;
		case 'rx' :
			obj.transform.rotation.x = v;
			break;
		case 'ry' :
			obj.transform.rotation.y = v;
			break;
		case 'rz' :
			obj.transform.rotation.z = v;
			break;
		case 'sx' :
			obj.transform.scale.x = v;
			break;
		case 'sy' :
			obj.transform.scale.y = v;
			break;
		case 'sz' :
			obj.transform.scale.z = v;
			break;
		
	}
}

/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CylinderDragger');
goog.require('glam.Picker');

glam.CylinderDragger = function(param) {
	
	param = param || {};
	
    glam.Picker.call(this, param);
    
    this.normal = param.normal || new THREE.Vector3(0, 1, 0);
    this.position = param.position || new THREE.Vector3;
    this.color = 0xaa0000;
}

goog.inherits(glam.CylinderDragger, glam.Picker);

glam.CylinderDragger.prototype.realize = function()
{
	glam.Picker.prototype.realize.call(this);

    // And some helpers
    this.dragObject = null;
	this.dragOffset = new THREE.Euler;
	this.currentOffset = new THREE.Euler;
	this.dragHitPoint = new THREE.Vector3;
	this.dragStartPoint = new THREE.Vector3;
	this.dragPlane = this.createDragPlane();
	this.dragPlane.visible = glam.CylinderDragger.SHOW_DRAG_PLANE;
	this.dragPlane.ignorePick = true;
	this.dragPlane.ignoreBounds = true;
	this._object.transform.object.add(this.dragPlane);
}

glam.CylinderDragger.prototype.createDragPlane = function() {

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

	var mat = new THREE.MeshBasicMaterial({color:this.color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	return mesh;
}

glam.CylinderDragger.prototype.update = function()
{
}

glam.CylinderDragger.prototype.onMouseDown = function(event) {
	glam.Picker.prototype.onMouseDown.call(this, event);
	this.handleMouseDown(event);
}

glam.CylinderDragger.prototype.handleMouseDown = function(event) {
	
	if (this.dragPlane) {
		
		var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
		
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
	
	if (glam.CylinderDragger.SHOW_DRAG_NORMAL) {
		
		if (this.arrowDecoration)
			this._object.removeComponent(this.arrowDecoration);
		
		var mesh = new THREE.ArrowHelper(this.normal, new THREE.Vector3, 500, 0x00ff00, 5, 5);
		var visual = new glam.Decoration({object:mesh});
		this._object.addComponent(visual);
		this.arrowDecoration = visual;
		
	}
}

glam.CylinderDragger.prototype.onMouseMove = function(event) {
	glam.Picker.prototype.onMouseMove.call(this, event);
	this.handleMouseMove(event);
}

glam.CylinderDragger.prototype.handleMouseMove = function(event) {
	
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
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

glam.CylinderDragger.prototype.onMouseUp = function(event) {
	glam.Picker.prototype.onMouseUp.call(this, event);
	this.handleMouseUp(event);
}

glam.CylinderDragger.prototype.handleMouseUp = function(event) {
	
	if (this.arrowDecoration)
		this._object.removeComponent(this.arrowDecoration);

}

glam.CylinderDragger.prototype.onTouchStart = function(event) {
	glam.Picker.prototype.onTouchStart.call(this, event);

	this.handleMouseDown(event);
}

glam.CylinderDragger.prototype.onTouchMove = function(event) {
	glam.Picker.prototype.onTouchMove.call(this, event);

	this.handleMouseMove(event);
}

glam.CylinderDragger.prototype.onTouchEnd = function(event) {
	glam.Picker.prototype.onTouchEnd.call(this, event);

	this.handleMouseUp(event);
}

glam.CylinderDragger.SHOW_DRAG_PLANE = false;
glam.CylinderDragger.SHOW_DRAG_NORMAL = false;

/**
 * @fileoverview Module Configuration
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Modules');
goog.require('glam.Component');
goog.require('glam.Object');
goog.require('glam.Application');
goog.require('glam.Service');
goog.require('glam.Services');
goog.require('glam.AnimationService');
goog.require('glam.Interpolator');
goog.require('glam.KeyFrameAnimator');
goog.require('glam.Transition');
goog.require('glam.TweenService');
goog.require('glam.Behavior');
goog.require('glam.BounceBehavior');
goog.require('glam.FadeBehavior');
goog.require('glam.HighlightBehavior');
goog.require('glam.MoveBehavior');
goog.require('glam.RotateBehavior');
goog.require('glam.ScaleBehavior');
goog.require('glam.Camera');
goog.require('glam.CameraManager');
goog.require('glam.PerspectiveCamera');
goog.require('glam.FirstPersonControls');
goog.require('glam.OrbitControls');
goog.require('glam.FirstPersonControllerScript');
goog.require('glam.PointerLockControllerScript');
goog.require('glam.PointerLockControls');
goog.require('glam.ModelControllerScript');
goog.require('glam.DeviceOrientationControlsCB');
goog.require('glam.DeviceOrientationControllerScript');
goog.require('glam.OculusRiftControls');
goog.require('glam.RiftControllerScript');
goog.require('glam.EventDispatcher');
goog.require('glam.EventService');
goog.require('glam.Graphics');
goog.require('glam.Helpers');
goog.require('glam.Input');
goog.require('glam.Keyboard');
goog.require('glam.Mouse');
goog.require('glam.Gamepad');
goog.require('glam.Picker');
goog.require('glam.PickManager');
goog.require('glam.CylinderDragger');
goog.require('glam.PlaneDragger');
goog.require('glam.SurfaceDragger');
goog.require('glam.ViewPicker');
goog.require('glam.Light');
goog.require('glam.AmbientLight');
goog.require('glam.DirectionalLight');
goog.require('glam.PointLight');
goog.require('glam.SpotLight');
goog.require('glam.Loader');
goog.require('glam.HUDScript');
goog.require('glam.SkyboxScript');
goog.require('glam.SkysphereScript');
goog.require('glam.Prefabs');
goog.require('glam.Decoration');
goog.require('glam.ParticleEmitter');
goog.require('glam.ParticleSystemScript');
goog.require('glam.Composer');
goog.require('glam.Effect');
goog.require('glam.SceneComponent');
goog.require('glam.SceneUtils');
goog.require('glam.SceneVisual');
goog.require('glam.Transform');
goog.require('glam.Visual');
goog.require('glam.Script');
goog.require('glam.System');
goog.require('glam.Time');
goog.require('glam.Timer');
goog.require('glam.Viewer');
goog.require('glam.DOM');
goog.require('glam.AnimationElement');
goog.require('glam.ArcElement');
goog.require('glam.BackgroundElement');
goog.require('glam.BoxElement');
goog.require('glam.CameraElement');
goog.require('glam.CircleElement');
goog.require('glam.DOMClassList');
goog.require('glam.ConeElement');
goog.require('glam.ControllerElement');
goog.require('glam.CylinderElement');
goog.require('glam.DOMDocument');
goog.require('glam.EffectElement');
goog.require('glam.GroupElement');
goog.require('glam.DOMInput');
goog.require('glam.LightElement');
goog.require('glam.LineElement');
goog.require('glam.DOMMaterial');
goog.require('glam.MeshElement');
goog.require('glam.DOMElement');
goog.require('glam.CSSParser');
goog.require('glam.DOMParser');
goog.require('glam.ParticlesElement');
goog.require('glam.RectElement');
goog.require('glam.DOMRenderer');
goog.require('glam.SphereElement');
goog.require('glam.DOMStyle');
goog.require('glam.TextElement');
goog.require('glam.DOMTransform');
goog.require('glam.TransitionElement');
goog.require('glam.DOMTypes');
goog.require('glam.DOMViewer');
goog.require('glam.VisualElement');

/**
 * @constructor
 */
glam.Modules = function()
{
}

var CLOSURE_NO_DEPS = true;


goog.provide('glam');

glam.loadUrl = function(url, element, options) {
	
	options = options || {};
	options.container = element;
	var viewer = new glam.Viewer(options);
	var loader = new glam.Loader;
	loader.addEventListener("loaded", function(data) { onLoadComplete(data, loadStartTime); }); 
	loader.addEventListener("progress", function(progress) { onLoadProgress(progress); }); 
	var loadStartTime = Date.now();
	loader.loadScene(url);
	viewer.run();

	function onLoadComplete(data, loadStartTime) {
		var loadTime = (Date.now() - loadStartTime) / 1000;
		glam.System.log("glam.loadUrl, scene loaded in ", loadTime, " seconds.");
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
		glam.System.log("glam.loadUrl, ", percentProgress, " % loaded.");
	}

	return { viewer : viewer };
}

glam.ready = function() {
	glam.DOM.ready();
}


glam.setFullScreen = function(enable) {
	return glam.Graphics.instance.setFullScreen(enable);
}
