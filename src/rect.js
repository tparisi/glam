/**
 * @fileoverview 2D rectangle parser/implementation
 * 
 * @author Tony Parisi
 */

glam.RectElement = {};

glam.RectElement.DEFAULT_WIDTH = 2;
glam.RectElement.DEFAULT_HEIGHT = 2;
glam.RectElement.DEFAULT_WIDTH_SEGMENTS = 1;
glam.RectElement.DEFAULT_HEIGHT_SEGMENTS = 1;

glam.RectElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.RectElement);
}

glam.RectElement.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.RectElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.RectElement.DEFAULT_HEIGHT;
	var widthSegments = docelt.getAttribute('width') || glam.RectElement.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height') || glam.RectElement.DEFAULT_HEIGHT_SEGMENTS;
	
	if (style) {
		if (style.width)
			width = style.width;
		if (style.height)
			height = style.height;
		if (style.widthSegments)
			widthSegments = style.widthSegments;
		if (style.heightSegments)
			heightSegments = style.heightSegments;
	}
	
	width = parseFloat(width);
	height = parseFloat(height);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);

	param.width = width;
	param.height = height;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
}

glam.RectElement.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments),
				material: material
			});

	return visual;
}
