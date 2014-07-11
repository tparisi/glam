glam.Sphere = {};

glam.Sphere.DEFAULT_RADIUS = 2;

glam.Sphere.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Sphere);
}

glam.Sphere.getAttributes = function(docelt, style, param) {
	
	var radius = docelt.getAttribute('radius') || glam.Sphere.DEFAULT_RADIUS;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
	}

	radius = parseFloat(radius);
	
	param.radius = radius;
}

glam.Sphere.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.SphereGeometry(param.radius, 32, 32),
				material: material
			});
	
	return visual;
}
