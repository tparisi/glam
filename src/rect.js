glam.Rect = {};

glam.Rect.DEFAULT_WIDTH = 2;
glam.Rect.DEFAULT_HEIGHT = 2;
glam.Rect.DEFAULT_WIDTH_SEGMENTS = 1;
glam.Rect.DEFAULT_HEIGHT_SEGMENTS = 1;

glam.Rect.create = function(docelt) {
	return glam.Visual.create(docelt, glam.Rect);
}

glam.Rect.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.Rect.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.Rect.DEFAULT_HEIGHT;
	var widthSegments = docelt.getAttribute('width') || glam.Rect.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height') || glam.Rect.DEFAULT_HEIGHT_SEGMENTS;
	
	if (style) {
		if (style.width)
			width = style.width;
		if (style.height)
			height = style.height;
		if (style.widthSegments)
			widthSegments = style.widthSegments;
		if (style.heightSegments)
			heightSegments = style.heightSegments;
	}
	
	width = parseFloat(width);
	height = parseFloat(height);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);

	param.width = width;
	param.height = height;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
}

glam.Rect.createVisual = function(docelt, material, param) {

	var visual = new Vizi.Visual(
			{ geometry: new THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments),
				material: material
			});

	return visual;
}
