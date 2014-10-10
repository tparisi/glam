/**
 * @fileoverview glam namespace and globals
 * 
 * @author Tony Parisi
 */



glam = {

		documents : {},
		
		documentIndex : 0,
				
		styles : {},

		viewers : {},

		animations : {},
		
};

glam.isReady = false;
glam.ready = function() {
	if (glam.isReady)
		return;
	
	glam.parser.parseDocument();
	glam.createViewers();
	
	glam.isReady = true;
}

glam.createViewers = function() {
	for (docname in glam.documents) {
		var doc = glam.documents[docname];
		var viewer = new glam.Viewer(doc);
		glam.viewers[docname] = viewer;
		viewer.go();
	}
}


glam.addStyle = function(selector, style)
{
	glam.styles[selector] = style;
}

glam.getStyle = function(selector)
{
	return glam.styles[selector];
}

glam.addAnimation = function(id, animation)
{
	glam.animations[id] = animation;
}

glam.getAnimation = function(id) {
	return glam.animations[id];
}

$(document).ready(function(){

	glam.ready();
});


