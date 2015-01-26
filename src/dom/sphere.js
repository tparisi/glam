/**
 * @fileoverview sphere primitive parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.SphereElement');

glam.SphereElement.DEFAULT_RADIUS = 2;
glam.SphereElement.DEFAULT_WIDTH_SEGMENTS = 32;
glam.SphereElement.DEFAULT_HEIGHT_SEGMENTS = 32;

glam.SphereElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.SphereElement);
}

glam.SphereElement.getAttributes = function(docelt, style, param) {
	
	var radius = docelt.getAttribute('radius') || glam.SphereElement.DEFAULT_RADIUS;
	var widthSegments = docelt.getAttribute('width-segments') || glam.SphereElement.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height-segments') || glam.SphereElement.DEFAULT_HEIGHT_SEGMENTS;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.widthSegments || style["width-segments"])
			widthSegments = style.widthSegments || style["width-segments"];
		if (style.heightSegments || style["height-segments"])
			heightSegments = style.heightSegments || style["height-segments"];
	}

	radius = parseFloat(radius);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);
	
	param.radius = radius;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
}

glam.SphereElement.createVisual = function(docelt, material, param) {

	var visual = new glam.Visual(
			{ geometry: new THREE.SphereGeometry(param.radius, param.widthSegments, param.heightSegments),
				material: material
			});
	
	return visual;
}
