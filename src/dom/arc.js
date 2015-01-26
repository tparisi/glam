/**
 * @fileoverview 2D arc parser/implementation
 * 
 * @author Tony Parisi
 */

glam.ArcElement = {};

glam.ArcElement.DEFAULT_RADIUS = 2;
glam.ArcElement.DEFAULT_RADIUS_SEGMENTS = 32;
glam.ArcElement.DEFAULT_START_ANGLE = "0deg";
glam.ArcElement.DEFAULT_END_ANGLE = "360deg";

glam.ArcElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.ArcElement);
}

glam.ArcElement.getAttributes = function(docelt, style, param) {

	function parseRotation(r) {
		return glam.DOMTransform.parseRotation(r);
	}
	
	var radius = docelt.getAttribute('radius') || glam.ArcElement.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.ArcElement.DEFAULT_RADIUS_SEGMENTS;

	var startAngle = docelt.getAttribute('startAngle') || glam.ArcElement.DEFAULT_START_ANGLE;
	var endAngle = docelt.getAttribute('endAngle') || glam.ArcElement.DEFAULT_END_ANGLE;
	
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

glam.ArcElement.createVisual = function(docelt, material, param) {
	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments, param.startAngle, param.endAngle),
				material: material
			});

	return visual;
}
