/**
 * @fileoverview glam namespace and globals
 * 
 * @author Tony Parisi
 */



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
	
	glam.DOM.parser.parseDocument();
	glam.DOM.createViewers();
	
	glam.DOM.isReady = true;
}

glam.DOM.createViewers = function() {
	for (docname in glam.DOM.documents) {
		var doc = glam.DOM.documents[docname];
		var viewer = new glam.DOM.Viewer(doc);
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


$(document).ready(function(){

	glam.DOM.ready();
});


