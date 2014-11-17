/**
 * @fileoverview 2D circle parser/implementation
 * 
 * @author Tony Parisi
 */

glam.Circle = {};

glam.Circle.DEFAULT_RADIUS = 2;
glam.Circle.DEFAULT_RADIUS_SEGMENTS = 32;

glam.Circle.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Circle);
}

glam.Circle.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.Circle.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.Circle.DEFAULT_RADIUS_SEGMENTS;
	
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

glam.Circle.createVisual = function(docelt, material, param) {
	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments),
				material: material
			});
	
	return visual;
}
