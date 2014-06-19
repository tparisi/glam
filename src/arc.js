glam.Arc = {};

glam.Arc.DEFAULT_RADIUS = 2;
glam.Arc.DEFAULT_RADIUS_SEGMENTS = 32;
glam.Arc.DEFAULT_START_ANGLE = "0deg";
glam.Arc.DEFAULT_END_ANGLE = "360deg";

glam.Arc.create = function(docelt) {
	return glam.Visual.create(docelt, glam.Arc);
}

glam.Arc.getAttributes = function(docelt, style, param) {

	function parseRotation(r) {
		return glam.Transform.parseRotation(r);
	}
	
	var radius = docelt.getAttribute('radius') || glam.Arc.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.Arc.DEFAULT_RADIUS_SEGMENTS;

	var startAngle = docelt.getAttribute('startAngle') || glam.Arc.DEFAULT_START_ANGLE;
	var endAngle = docelt.getAttribute('endAngle') || glam.Arc.DEFAULT_END_ANGLE;
	
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

glam.Arc.createVisual = function(docelt, material, param) {
	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CircleGeometry(param.radius, param.radiusSegments, param.startAngle, param.endAngle),
				material: material
			});

	return visual;
}
