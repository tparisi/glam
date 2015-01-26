/**
 * @fileoverview model import parser/implementation
 * 
 * @author Tony Parisi
 */

glam.ImportElement = {};

glam.ImportElement.create = function(docelt, style) {
	var src = docelt.getAttribute('src');
		
	// Create the cube
	var obj = new Vizi.Object;	

	if (src) {
		var loader = new Vizi.Loader;

		var loadCallback = function(data) {
			glam.ImportElement.onLoadComplete(obj, data, src);
			loader.removeEventListener("loaded", loadCallback);
		}	

		loader.addEventListener("loaded", loadCallback);
		loader.loadScene(src);
	}

	return obj;
}

glam.ImportElement.onLoadComplete = function(obj, data, url) {

	obj.addChild(data.scene);
}
