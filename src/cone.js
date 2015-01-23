/**
 * @fileoverview cone primitive parser/implementation
 * 
 * @author Tony Parisi
 */

glam.DOM.Cone = {};

glam.DOM.Cone.DEFAULT_RADIUS = 2;
glam.DOM.Cone.DEFAULT_HEIGHT = 2;

glam.DOM.Cone.create = function(docelt, style) {
	return glam.DOM.Visual.create(docelt, style, glam.DOM.Cone);
}

glam.DOM.Cone.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.DOM.Cone.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.DOM.Cone.DEFAULT_HEIGHT;
	
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

glam.DOM.Cone.createVisual = function(docelt, material, param) {
	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(0, param.radius, param.height, 32),
				material: material
			});

	return visual;
}
