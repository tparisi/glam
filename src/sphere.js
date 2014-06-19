glam.Sphere = {};

glam.Sphere.DEFAULT_RADIUS = 2;

glam.Sphere.create = function(docelt, sceneobj) {
	var radius = docelt.getAttribute('radius') || glam.Sphere.DEFAULT_RADIUS;
	
	var style = glam.Node.getStyle(docelt);
	
	if (style) {
		if (style.radius)
			radius = style.radius;
	}

	var sphere = new Vizi.Object;
	var material = glam.Material.create(style, function(material) {
		var visual = new Vizi.Visual(
				{ geometry: new THREE.SphereGeometry(radius, 32, 32),
					material: material
				});
		sphere.addComponent(visual);
		glam.Visual.add(docelt, sphere);
	});
	
	if (material) {
		var visual = new Vizi.Visual(
				{ geometry: new THREE.SphereGeometry(radius, 32, 32),
					material: material
				});
		sphere.addComponent(visual);
	}
	
	return sphere;
}
