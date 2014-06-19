glam.Cone = {};

glam.Cone.DEFAULT_RADIUS = 2;
glam.Cone.DEFAULT_HEIGHT = 2;

glam.Cone.create = function(docelt) {
	return glam.Visual.create(docelt, glam.Cone);
}

glam.Cone.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.Cone.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.Cone.DEFAULT_HEIGHT;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}

	radius = parseFloat(radius);
	height = parseFloat(height);
	
	param.radius = radius;
	param.height = height;
}

glam.Cone.createVisual = function(docelt, material, param) {
	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(0, param.radius, param.height, 16),
				material: material
			});

	return visual;
}
