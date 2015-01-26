/**
 * @fileoverview cone primitive parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ConeElement');

glam.ConeElement.DEFAULT_RADIUS = 2;
glam.ConeElement.DEFAULT_HEIGHT = 2;

glam.ConeElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.ConeElement);
}

glam.ConeElement.getAttributes = function(docelt, style, param) {

	var radius = docelt.getAttribute('radius') || glam.ConeElement.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.ConeElement.DEFAULT_HEIGHT;
	
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

glam.ConeElement.createVisual = function(docelt, material, param) {
	
	var visual = new glam.Visual(
			{ geometry: new THREE.CylinderGeometry(0, param.radius, param.height, 32),
				material: material
			});

	return visual;
}
