glam.Camera = {};

glam.Camera.create = function(docelt, sceneobj, app) {
	
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
	
	app.addCamera(cam, docelt.id);
	
	return camera;
}
