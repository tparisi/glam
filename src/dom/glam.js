/**
 * @fileoverview glam namespace and globals
 * 
 * @author Tony Parisi
 */



glam = {
		
};

glam.ready = function() {
	glam.DOM.ready();
}


glam.setFullScreen = function(enable) {
	return Vizi.Graphics.instance.setFullScreen(enable);
}