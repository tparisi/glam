goog.provide('glam');

glam.loadUrl = function(url, element, options) {
	
	options = options || {};
	options.container = element;
	var viewer = new glam.Viewer(options);
	var loader = new glam.Loader;
	loader.addEventListener("loaded", function(data) { onLoadComplete(data, loadStartTime); }); 
	loader.addEventListener("progress", function(progress) { onLoadProgress(progress); }); 
	var loadStartTime = Date.now();
	loader.loadScene(url);
	viewer.run();

	function onLoadComplete(data, loadStartTime) {
		var loadTime = (Date.now() - loadStartTime) / 1000;
		glam.System.log("glam.loadUrl, scene loaded in ", loadTime, " seconds.");
		viewer.replaceScene(data);
		if (viewer.cameras.length > 1) {
			viewer.useCamera(1);
		}
		
		if (options.headlight) {
			viewer.setHeadlightOn(true);
		}
	}

	function onLoadProgress(progress) {
		var percentProgress = progress.loaded / progress.total * 100;
		glam.System.log("glam.loadUrl, ", percentProgress, " % loaded.");
	}

	return { viewer : viewer };
}

glam.ready = function() {
	glam.DOM.ready();
}


glam.setFullScreen = function(enable) {
	return glam.Graphics.instance.setFullScreen(enable);
}