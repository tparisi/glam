/**
 * @fileoverview cylinder parser/implementation
 * 
 * @author Tony Parisi
 */

glam.DOM.Cylinder = {};

glam.DOM.Cylinder.DEFAULT_RADIUS = 2;
glam.DOM.Cylinder.DEFAULT_HEIGHT = 2;

glam.DOM.Cylinder.create = function(docelt, style) {
	return glam.DOM.Visual.create(docelt, style, glam.DOM.Cylinder);
}

glam.DOM.Cylinder.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.DOM.Cylinder.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.DOM.Cylinder.DEFAULT_HEIGHT;
	
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

glam.DOM.Cylinder.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(param.radius, param.radius, param.height, 32),
				material: material
			});
	
	return visual;
}
