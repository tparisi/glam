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