glam.Rect = {};

glam.Rect.DEFAULT_WIDTH = 2;
glam.Rect.DEFAULT_HEIGHT = 2;
glam.Rect.DEFAULT_WIDTH_SEGMENTS = 1;
glam.Rect.DEFAULT_HEIGHT_SEGMENTS = 1;

glam.Rect.create = function(docelt) {
	var width = docelt.getAttribute('width') || glam.Rect.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.Rect.DEFAULT_HEIGHT;
	var widthSegments = docelt.getAttribute('width') || glam.Rect.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height') || glam.Rect.DEFAULT_HEIGHT_SEGMENTS;
	
	var style = glam.Node.getStyle(docelt);

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
	
	var material = glam.Material.create(style);
	
	var rect = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.PlaneGeometry(width, height, widthSegments, heightSegments),
				material: material
			});
	rect.addComponent(visual);

	return rect;
}
