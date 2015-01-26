/**
 * @fileoverview cylinder parser/implementation
 * 
 * @author Tony Parisi
 */

glam.CylinderElement = {};

glam.CylinderElement.DEFAULT_RADIUS = 2;
glam.CylinderElement.DEFAULT_HEIGHT = 2;

glam.CylinderElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.CylinderElement);
}

glam.CylinderElement.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.CylinderElement.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.CylinderElement.DEFAULT_HEIGHT;
	
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

glam.CylinderElement.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(param.radius, param.radius, param.height, 32),
				material: material
			});
	
	return visual;
}
