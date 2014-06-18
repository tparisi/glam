glam.Arc = {};

glam.Arc.DEFAULT_RADIUS = 2;
glam.Arc.DEFAULT_RADIUS_SEGMENTS = 32;
glam.Arc.DEFAULT_START_ANGLE = "0deg";
glam.Arc.DEFAULT_END_ANGLE = "360deg";

glam.Arc.create = function(docelt, sceneobj) {

	function parseRotation(r) {
		return glam.Transform.parseRotation(r);
	}
	
	var radius = docelt.getAttribute('radius') || glam.Arc.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.Arc.DEFAULT_RADIUS_SEGMENTS;

	var startAngle = docelt.getAttribute('startAngle') || glam.Arc.DEFAULT_START_ANGLE;
	var endAngle = docelt.getAttribute('endAngle') || glam.Arc.DEFAULT_END_ANGLE;
	
	var style = glam.Node.getStyle(docelt);

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
	
	startAngle = parseRotation(startAngle);
	endAngle = parseRotation(endAngle);
	
	var material = glam.Material.create(style);
	
	var arc = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CircleGeometry(radius, radiusSegments, startAngle, endAngle),
				material: material
			});
	arc.addComponent(visual);

	return arc;
}
