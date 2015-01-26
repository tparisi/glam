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
	}
};