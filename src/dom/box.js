/**
 * @fileoverview cube primitive parser/implementation
 * 
 * @author Tony Parisi
 */

glam.BoxElement = {};

glam.BoxElement.DEFAULT_WIDTH = 2;
glam.BoxElement.DEFAULT_HEIGHT = 2;
glam.BoxElement.DEFAULT_DEPTH = 2;

glam.BoxElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.BoxElement);
}

glam.BoxElement.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.BoxElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.BoxElement.DEFAULT_HEIGHT;
	var depth = docelt.getAttribute('depth') || glam.BoxElement.DEFAULT_DEPTH;
	
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

glam.BoxElement.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.BoxGeometry(param.width, param.height, param.depth),
				material: material
			});
	
	return visual;
}
