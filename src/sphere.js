glam.Sphere = {};

glam.Sphere.DEFAULT_RADIUS = 2;

glam.Sphere.create = function(docelt, sceneobj) {
	var radius = docelt.getAttribute('radius') || glam.Sphere.DEFAULT_RADIUS;
	
	var style = glam.Node.getStyle(docelt);
	
	if (style) {
		if (style.radius)
			radius = style.radius;
	}

	// Create the cube
	var sphere = new Vizi.Object;
	var material = glam.Material.create(style, function(material) {
		var visual = new Vizi.Visual(
				{ geometry: new THREE.SphereGeometry(radius, 32, 32),
					material: material
				});
		sphere.addComponent(visual);
		
	});
	
	if (material) {
		var visual = new Vizi.Visual(
				{ geometry: new THREE.SphereGeometry(radius, 32, 32),
					material: material
				});
		sphere.addComponent(visual);
	}
	
	glam.Transform.parse(docelt, sphere);
	glam.Animation.parse(docelt, sphere);
	glam.Input.add(docelt, sphere);
	glam.Material.addHandlers(docelt, sphere);

	return sphere;
}
