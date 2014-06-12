glam.Cube = {};

glam.Cube.DEFAULT_WIDTH = 2;
glam.Cube.DEFAULT_HEIGHT = 2;
glam.Cube.DEFAULT_DEPTH = 2;

glam.Cube.create = function(docelt, sceneobj) {
	var width = docelt.getAttribute('width') || glam.Cube.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.Cube.DEFAULT_HEIGHT;
	var depth = docelt.getAttribute('depth') || glam.Cube.DEFAULT_DEPTH;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.width)
			width = style.width
		if (style.height)
			height = style.height;
		if (style.depth)
			depth = style.depth;
	}
	
	var material = glam.Material.create(style);
	
	var cube = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CubeGeometry(width, height, depth),
				material: material
			});
	cube.addComponent(visual);


	glam.Transform.parse(docelt, cube);
	glam.Animation.parse(docelt, cube);
	glam.Input.add(docelt, cube);
	glam.Material.addHandlers(docelt, cube);
	
	return cube;
}
