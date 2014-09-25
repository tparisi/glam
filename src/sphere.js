/**
 * @fileoverview sphere primitive parser/implementation
 * 
 * @author Tony Parisi
 */

glam.Sphere = {};

glam.Sphere.DEFAULT_RADIUS = 2;
glam.Sphere.DEFAULT_WIDTH_SEGMENTS = 32;
glam.Sphere.DEFAULT_HEIGHT_SEGMENTS = 32;

glam.Sphere.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Sphere);
}

glam.Sphere.getAttributes = function(docelt, style, param) {
	
	var radius = docelt.getAttribute('radius') || glam.Sphere.DEFAULT_RADIUS;
	var widthSegments = docelt.getAttribute('width-segments') || glam.Sphere.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height-segments') || glam.Sphere.DEFAULT_HEIGHT_SEGMENTS;
	
	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.widthSegments || style["width-segments"])
			widthSegments = style.widthSegments || style["width-segments"];
		if (style.heightSegments || style["height-segments"])
			heightSegments = style.heightSegments || style["height-segments"];
	}

	radius = parseFloat(radius);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);
	
	param.radius = radius;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
}

glam.Sphere.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.SphereGeometry(param.radius, param.widthSegments, param.heightSegments),
				material: material
			});
	
	return visual;
}
