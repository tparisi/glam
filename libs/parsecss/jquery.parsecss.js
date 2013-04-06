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


(function($){

	// utility function, since we want to allow $('style') and $(document), so we need to look for elements in the jQuery object ($.fn.filter) and elements that are children of the jQuery object ($.fn.find)
	$.fn.findandfilter = function(selector){
		var ret = this.filter(selector).add(this.find(selector));
		ret.prevObject = ret.prevObject.prevObject; // maintain the filter/end chain correctly (the filter and the find both push onto the chain). 
		return ret;
	};
	
  $.fn.parsecss = function(callback, parseAttributes){
		var parse = function(str) { $.parsecss(str, callback) }; // bind the callback
    this
    .findandfilter ('style').each (function(){
      parse(this.innerHTML);
    })
    .end()
    .findandfilter ('link[type="text/css"]').each (function(){
			// only get the stylesheet if it's not disabled, it won't trigger cross-site security (doesn't start with anything like http:) and it uses the appropriate media)
			if (!this.disabled && !/^\w+:/.test($(this).attr('href')) && $.parsecss.mediumApplies(this.media)) $.get(this.href, parse);
    })
    .end();
		
		if (parseAttributes){
			$.get(location.pathname+location.search, function(HTMLtext) {
				styleAttributes(HTMLtext, callback);
			}, 'text');
		}
		
		return this;
	};

  $.parsecss = function(str, callback){
    var ret = {};
		str = munge(str).replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g, function(s,rule){
			// @rules end with ; or a block, with the semicolon not being part of the rule but the closing brace (represented by `b%) is
			processAtRule($.trim(rule), callback);
			return '';
		});

    $.each (str.split('`b%'), function(i,css){ // split on the end of a block 
			css = css.split('%b`'); // css[0] is the selector; css[1] is the index in munged for the cssText
			if (css.length < 2) return; // invalid css
			css[0] = restore(css[0]);
			ret[css[0]] = $.extend(ret[css[0]] || {}, parsedeclarations(css[1]));
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
  $.parsecss.mediumApplies = (window.media && window.media.query) || function(str){
    if (!str) return true; // if no descriptor, everything applies
    if (str in media) return media[str];
		var style = $('<style media="'+str+'">body {position: relative; z-index: 1;}</style>').appendTo('head');
		return media[str] = [$('body').css('z-index')==1, style.remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
  };

  $.parsecss.isValidSelector = function(str){
		var s = $('<style>'+str+'{}</style>').appendTo('head')[0];
		// s.styleSheet is IE; it accepts illegal selectors but converts them to UNKNOWN. Standards-based (s.shee.cssRules) just reject the rule
		return [s.styleSheet ? !/UNKNOWN/i.test(s.styleSheet.cssText) : !!s.sheet.cssRules.length, $(s).remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
  };
	
	$.parsecss.parseArguments = function(str){
		if (!str) return [];
		var ret = [], mungedArguments = munge(str, true).split(/\s+/); // can't use $.map because it flattens arrays !
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

	// uses the parsed css to apply useful jQuery functions
	$.parsecss.jquery = function(css){
		for (var selector in css){
			for (var property in css[selector]){
				var match = /^-jquery(-(.*))?/.exec(property);
				if (!match) continue;
				var value = munge(css[selector][property]).split('!'); // exclamation point separates the parts of livequery actions
				var which = match[2];
				dojQuery(selector, which, restore(value[0]), restore(value[1]));
			}
		}
	};

	// expose the styleAttributes function
	$.parsecss.styleAttributes = styleAttributes;
	
  // caches
  var media = {}; // media description strings
  var munged = {}; // strings that were removed by the parser so they don't mess up searching for specific characters

  // private functions

  function parsedeclarations(index){ // take a string from the munged array and parse it into an object of property: value pairs
		var str = munged[index].replace(/^{|}$/g, ''); // find the string and remove the surrounding braces
		str = munge(str); // make sure any internal braces or strings are escaped
    var parsed = {};
    $.each (str.split(';'), function (i, decl){
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
    str = str
    .replace(REatcomment,'$1') // strip /*@ comments but leave the text (to let invalid CSS through)
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
		if (str === undefined) return str;
    while (match = REmunged.exec(str)){
      str = str.replace(REmunged, munged[match[1]]);
    }
    return $.trim(str);
  }

  function processAtRule (rule, callback){
    var split = rule.split(/\s+/); // split on whitespace
    var type = split.shift(); // first word
    if (type=='media'){
      var css = restore(split.pop()).slice(1,-1); // last word is the rule; need to strip the outermost braces
      if ($.parsecss.mediumApplies(split.join(' '))){
        $.parsecss(css, callback);
      }
    }else if (type=='import'){
      var url = restore(split.shift());
      if ($.parsecss.mediumApplies(split.join(' '))){
        url = url.replace(/^url\(|\)$/gi, '').replace(/^["']|["']$/g, ''); // remove the url('...') wrapper
        $.get(url, function(str) { $.parsecss(str, callback) });
      }
    }
  }
		
	function dojQuery (selector, which, value, value2){ // value2 is the value for the livequery no longer match
		if (/show|hide/.test(which)) which +=  'Default'; // -jquery-show is a shortcut for -jquery-showDefault
		if (value2 !== undefined && $.livequery){
			// mode is 0 for a static value (can be evaluated when parsed); 
			// 1 for delayed (refers to "this" which means it needs to be evaluated separately for each element matched), and
			// 2 for livequery; evaluated whenever elments change
			var mode = 2;
		}else{
			mode = /\bthis\b/.test(value) ? 1 : 0;
		}
		if (which && $.fn[which]){
			// a plugin
			// late bind parseArguments so "this" is defined correctly
			function p (str) { return function() { return $.fn[which].apply($(this), $.parsecss.parseArguments.call(this, str)) } };
			switch (mode){
				case 0: return $.fn[which].apply($(selector), $.parsecss.parseArguments(value));
				case 1: return $(selector).each(p(value));
				case 2: return (new $.livequery(selector, document, undefined, p(value), value2 === '' ? undefined : p(value2))).run();
			}
		}else if (which){
			// a plugin but one that was not defined
			return undefined;
		}else{
			// straight javascript
			switch (mode){
				case 0: return eval(value);
				case 1: return $(selector).each(Function(value));
				case 2: return (new $.livequery(selector, document, undefined, Function(value), value2 === '' ? undefined : Function(value2))).run();
			}
		}
	}

	// override show and hide. $.data(el, 'showDefault') is a function that is to be used for show if no arguments are passed in (if there are arguments, they override the stored function)
	// Many of the effects call the native show/hide() with no arguments, resulting in an infinite loop.
	var _show = {show: $.fn.show, hide: $.fn.hide}; // save the originals
	$.each(['show','hide'], function(){
		var which = this, show = _show[which], plugin = which+'Default';
		$.fn[which] = function(){
			if (arguments.length > 0) return show.apply(this, arguments);
			return this.each(function(){
				var fn = $.data(this, plugin), $this = $(this);
				if (fn){
					$.removeData(this, plugin); // prevent the infinite loop
					fn.call($this);
					$this.queue(function(){$this.data(plugin, fn).dequeue()}); // put the function back at the end of the animation
				}else{
					show.call($this);
				}
			});
		};
		$.fn[plugin] = function(){
			var args = $.makeArray(arguments), name = args[0];
			if ($.fn[name]){ // a plugin
				args.shift();
				var fn = $.fn[name];
			}else if ($.effects && $.effects[name]){ // a jQuery UI effect. They require an options object as the second argument
				if (typeof args[1] != 'object') args.splice(1,0,{});
				fn = _show[which];
			}else{ // regular show/hide
				fn = _show[which];
			}
			return this.data(plugin, function(){fn.apply(this,args)});
		};
	});
		
	// experimental: find unrecognized style attributes in elements by reloading the code as text
	var RESGMLcomment = /<!--([^-]|-[^-])*-->/g; // as above, a simplification of real comments. Don't put -- in your HTML comments!
	var REnotATag = /(>)[^<]*/g;
	var REtag = /<(\w+)([^>]*)>/g;

	function styleAttributes (HTMLtext, callback) {
		var ret = '', style, tags = {}; //  keep track of tags so we can identify elements unambiguously
		HTMLtext = HTMLtext.replace(RESGMLcomment, '').replace(REnotATag, '$1');
		munge(HTMLtext).replace(REtag, function(s, tag, attrs){
			tag = tag.toLowerCase();
			if (tags[tag]) ++tags[tag]; else tags[tag] = 1;
			if (style = /\bstyle\s*=\s*(%s`\d+`s%)/i.exec(attrs)){ // style attributes must be of the form style = "a: bc" ; they must be in quotes. After munging, they are marked with numbers. Grab that number
				var id = /\bid\s*=\s*(\S+)/i.exec(attrs); // find the id if there is one.
				if (id) id = '#'+restore(id[1]).replace(/^['"]|['"]$/g,''); else id = tag + ':eq(' + (tags[tag]-1) + ')';
				ret += [id, '{', restore(style[1]).replace(/^['"]|['"]$/g,''),'}'].join('');
			}
		});
		$.parsecss(ret, callback);
	}
})(jQuery);
