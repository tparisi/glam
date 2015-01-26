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


$(document).ready(function(){

	glam.DOM.ready();
});


