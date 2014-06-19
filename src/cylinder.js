glam.Cylinder = {};

glam.Cylinder.DEFAULT_RADIUS = 2;
glam.Cylinder.DEFAULT_HEIGHT = 2;

glam.Cylinder.create = function(docelt) {
	var radius = docelt.getAttribute('radius') || glam.Cylinder.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.Cylinder.DEFAULT_HEIGHT;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}
	
	var material = glam.Material.create(style);
	
	var cylinder = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(radius, radius, height, 16),
				material: material
			});
	cylinder.addComponent(visual);
	
	return cylinder;
}
