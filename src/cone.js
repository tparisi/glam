glam.Cone = {};

glam.Cone.DEFAULT_RADIUS = 2;
glam.Cone.DEFAULT_HEIGHT = 2;

glam.Cone.create = function(docelt) {
	var radius = docelt.getAttribute('radius') || glam.Cone.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.Cone.DEFAULT_HEIGHT;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}
	
	var material = glam.Material.create(style);
	
	var cone = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(0, radius, height, 16),
				material: material
			});
	cone.addComponent(visual);

	return cone;
}
