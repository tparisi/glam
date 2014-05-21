glam.Camera = {};

glam.Camera.create = function(docelt, sceneobj) {
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}
	
	var camera = new Vizi.Object;	
	var cam = new Vizi.PerspectiveCamera();
	camera.addComponent(cam);
	
	glam.Transform.parse(docelt, camera);
	glam.Animation.parse(docelt, camera);

	Vizi.Application.instance.defaultCamera.position.copy(camera.transform.position);
    // Tilt the cube toward the viewer so we can see 3D-ness
    // cube.transform.rotation.x = .5;

	return camera;
}
