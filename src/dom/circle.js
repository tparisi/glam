/**
 * @fileoverview 2D circle parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CircleElement');

glam.CircleElement.DEFAULT_RADIUS = 2;
glam.CircleElement.DEFAULT_RADIUS_SEGMENTS = 32;

glam.CircleElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.CircleElement);
}

glam.CircleElement.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.CircleElement.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.CircleElement.DEFAULT_RADIUS_SEGMENTS;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.radiusSegments)
			radiusSegments = style.radiusSegments;
	}

	radius = parseFloat(radius);
	radiusSegments = parseInt(radiusSegments);
	
	param.radius = radius;
	param.radiusSegments = radiusSegments;
}

glam.CircleElement.createVisual = function(docelt, material, param) {
	
	var visual = new glam.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments),
				material: material
			});
	
	return visual;
}
