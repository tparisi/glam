glam.Import = {};

glam.Import.create = function(docelt, sceneobj) {
	var src = docelt.getAttribute('src');
		
	// Create the cube
	var obj = new Vizi.Object;	

	if (src) {
		var loader = new Vizi.Loader;

		var loadCallback = function(data) {
			glam.Import.onLoadComplete(obj, data, src);
			loader.removeEventListener("loaded", loadCallback);
		}	

		loader.addEventListener("loaded", loadCallback);
		loader.loadScene(src);
	}

	// Tilt the cube toward the viewer so we can see 3D-ness
    // cube.transform.rotation.x = .5;
	glam.Transform.parse(docelt, obj);
	glam.Animation.parse(docelt, obj);

	return obj;
}

glam.Import.onLoadComplete = function(obj, data, url) {

	obj.addChild(data.scene);
}