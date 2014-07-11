glam.Cylinder = {};

glam.Cylinder.DEFAULT_RADIUS = 2;
glam.Cylinder.DEFAULT_HEIGHT = 2;

glam.Cylinder.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Cylinder);
}

glam.Cylinder.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.Cylinder.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.Cylinder.DEFAULT_HEIGHT;
	
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

glam.Cylinder.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(param.radius, param.radius, param.height, 16),
				material: material
			});
	
	return visual;
}
