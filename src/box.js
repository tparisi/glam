/**
 * @fileoverview cube primitive parser/implementation
 * 
 * @author Tony Parisi
 */

glam.Box = {};

glam.Box.DEFAULT_WIDTH = 2;
glam.Box.DEFAULT_HEIGHT = 2;
glam.Box.DEFAULT_DEPTH = 2;

glam.Box.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Box);
}

glam.Box.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.Box.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.Box.DEFAULT_HEIGHT;
	var depth = docelt.getAttribute('depth') || glam.Box.DEFAULT_DEPTH;
	
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

glam.Box.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.BoxGeometry(param.width, param.height, param.depth),
				material: material
			});
	
	return visual;
}
