
var System = require("./system/system");
var Viewer = require("./viewer/Viewer");
var Loader = require("./loaders/loader");
var Graphics = require("./graphics/graphics");
var DOM = require("./dom/dom");

var glam = module.exports = {
	// TODO: Add ALL the things to be exported
	loadUrl: loadUrl,
	ready: ready,
	setFullScreen
}

function loadUrl(url, element, options) {
	options = options || {};
	options.container = element;
	var viewer = new Viewer(options);
	var loader = new Loader;
	loader.addEventListener("loaded", function(data) { onLoadComplete(data, loadStartTime); });
	loader.addEventListener("progress", function(progress) { onLoadProgress(progress); });
	var loadStartTime = Date.now();
	loader.loadScene(url);
	viewer.run();

	function onLoadComplete(data, loadStartTime) {
		var loadTime = (Date.now() - loadStartTime) / 1000;
		System.log("loadUrl, scene loaded in ", loadTime, " seconds.");
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
		System.log("loadUrl, ", percentProgress, " % loaded.");
	}

	return { viewer : viewer };
}

function ready() {
	DOM.ready();
}


function setFullScreen(enable) {
	return Graphics.instance.setFullScreen(enable);
}
