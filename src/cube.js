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
	
	// Create the cube
	var cube = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CubeGeometry(width, height, depth),
				material: material
			});
	cube.addComponent(visual);

	// Add a rotate behavior to give the cube some life
	//var rotator = new Vizi.RotateBehavior({autoStart:true, duration:5});
	//cube.addComponent(rotator);

	glam.Transform.parse(docelt, cube);
	glam.Animation.parse(docelt, cube);
	
    // Tilt the cube toward the viewer so we can see 3D-ness
    // cube.transform.rotation.x = .5;

	return cube;
}
