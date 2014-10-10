/**
 * @fileoverview cube primitive parser/implementation
 * 
 * @author Tony Parisi
 */

glam.Cube = {};

glam.Cube.DEFAULT_WIDTH = 2;
glam.Cube.DEFAULT_HEIGHT = 2;
glam.Cube.DEFAULT_DEPTH = 2;

glam.Cube.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Cube);
}

glam.Cube.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.Cube.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.Cube.DEFAULT_HEIGHT;
	var depth = docelt.getAttribute('depth') || glam.Cube.DEFAULT_DEPTH;
	
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

glam.Cube.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.BoxGeometry(param.width, param.height, param.depth),
				material: material
			});
	
	return visual;
}
