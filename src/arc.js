/**
 * @fileoverview 2D arc parser/implementation
 * 
 * @author Tony Parisi
 */

glam.DOM.Arc = {};

glam.DOM.Arc.DEFAULT_RADIUS = 2;
glam.DOM.Arc.DEFAULT_RADIUS_SEGMENTS = 32;
glam.DOM.Arc.DEFAULT_START_ANGLE = "0deg";
glam.DOM.Arc.DEFAULT_END_ANGLE = "360deg";

glam.DOM.Arc.create = function(docelt, style) {
	return glam.DOM.Visual.create(docelt, style, glam.DOM.Arc);
}

glam.DOM.Arc.getAttributes = function(docelt, style, param) {

	function parseRotation(r) {
		return glam.DOM.Transform.parseRotation(r);
	}
	
	var radius = docelt.getAttribute('radius') || glam.DOM.Arc.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.DOM.Arc.DEFAULT_RADIUS_SEGMENTS;

	var startAngle = docelt.getAttribute('startAngle') || glam.DOM.Arc.DEFAULT_START_ANGLE;
	var endAngle = docelt.getAttribute('endAngle') || glam.DOM.Arc.DEFAULT_END_ANGLE;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.radiusSegments)
			radiusSegments = style.radiusSegments;
		if (style.startAngle)
			startAngle = style.startAngle;
		if (style.endAngle)
			endAngle = style.endAngle;
	}
	
	radius = parseFloat(radius);
	radiusSegments = parseInt(radiusSegments);
	startAngle = parseRotation(startAngle);
	endAngle = parseRotation(endAngle);

	param.radius = radius;
	param.radiusSegments = radiusSegments;
	param.startAngle = startAngle;
	param.endAngle = endAngle;
}

glam.DOM.Arc.createVisual = function(docelt, material, param) {
	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments, param.startAngle, param.endAngle),
				material: material
			});

	return visual;
}
