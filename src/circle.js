glam.Circle = {};

glam.Circle.DEFAULT_RADIUS = 2;
glam.Circle.DEFAULT_RADIUS_SEGMENTS = 32;

glam.Circle.create = function(docelt) {
		
	var radius = docelt.getAttribute('radius') || glam.Circle.DEFAULT_RADIUS;
	var radiusSegments = docelt.getAttribute('radiusSegments') || glam.Circle.DEFAULT_RADIUS_SEGMENTS;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.radiusSegments)
			radiusSegments = style.radiusSegments;
	}
	
	var material = glam.Material.create(style);
	
	var circle = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CircleGeometry(radius, radiusSegments),
				material: material
			});
	circle.addComponent(visual);
	
	return circle;
}
