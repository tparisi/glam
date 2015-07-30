goog.provide("glam.System");

glam.System = {
	log : function() {
		var args = ["[glam] "].concat([].slice.call(arguments));
		console.log.apply(console, args);			
	},
	info : function() {
		if (glam.System.logLevel <= glam.System.LOG_INFO) {
			var args = ["[glam] "].concat([].slice.call(arguments));
			console.info.apply(console, args);			
		}
	},
	warn : function() {
		if (glam.System.logLevel <= glam.System.LOG_WARNINGS) {
			var args = ["[glam] "].concat([].slice.call(arguments));
			console.warn.apply(console, args);
		}
	},
	error : function() {
		if (glam.System.logLevel <= glam.System.LOG_ERRORS) {
			var args = ["[glam] "].concat([].slice.call(arguments));
			console.error.apply(console, args);
		}
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

glam.System.LOG_INFO = 0;
glam.System.LOG_WARNINGS = 1;
glam.System.LOG_ERRORS = 2;

glam.System.logLevel = glam.System.LOG_INFO;
