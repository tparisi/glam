glam.Sphere = {};

glam.Sphere.DEFAULT_RADIUS = 2;

glam.Sphere.create = function(docelt, sceneobj) {
	var radius = docelt.getAttribute('radius') || glam.Sphere.DEFAULT_RADIUS;
	
	if (docelt.id) {
		var style = glam.getStyle("#" + docelt.id);
	}
	
	var material = null;
	if (style) {
		if (style.radius)
			radius = style.radius;
	}

	var material = glam.Material.create(style);
	
	// Create the cube
	var sphere = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.SphereGeometry(radius, 32, 32),
				material: material
			});
	sphere.addComponent(visual);

	glam.Transform.parse(docelt, sphere);

	return sphere;
}
