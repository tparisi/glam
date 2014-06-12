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

	var controller = Vizi.Application.instance.controllerScript;
	controller.camera = cam;
	controller.enabled = true;
	cam.active = true;

	return camera;
}
