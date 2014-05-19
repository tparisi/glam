glam.Cube = {};

glam.Cube.DEFAULT_WIDTH = 2;
glam.Cube.DEFAULT_HEIGHT = 2;
glam.Cube.DEFAULT_DEPTH = 2;

glam.Cube.create = function(docelt, sceneobj) {
	var width = docelt.getAttribute('width') || glam.Cube.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.Cube.DEFAULT_HEIGHT;
	var depth = docelt.getAttribute('depth') || glam.Cube.DEFAULT_DEPTH;
	
	if (docelt.id) {
		var style = glam.getStyle("#" + docelt.id);
	}
	
	var image = "";
	if (style) {
		if (style.width)
			width = style.width
		if (style.height)
			height = style.height;
		if (style.depth)
			depth = style.depth;
		if (style.image) {
			var regExp = /\(([^)]+)\)/;
			var matches = regExp.exec(style.image);
			image = matches[1];
		}
	}
	
	// Create a phong-shaded, texture-mapped cube
	var cube = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CubeGeometry(width, height, depth),
				material: new THREE.MeshPhongMaterial({map: image ? THREE.ImageUtils.loadTexture(image) :
					null})
			});
	cube.addComponent(visual);

	// Add a rotate behavior to give the cube some life
	var rotator = new Vizi.RotateBehavior({autoStart:true, duration:5});
	cube.addComponent(rotator);
	
    // Tilt the cube toward the viewer so we can see 3D-ness
    cube.transform.rotation.x = .5;

    // Add the cube and light to the scene
	sceneobj.addChild(cube);
	
}
