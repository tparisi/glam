/**
 * @fileoverview viewer - creates WebGL (Three.js/GLAM scene) by traversing document
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMViewer');

glam.DOMViewer = function(doc) {

	this.document = doc;
	this.documentParent = doc.parentElement;
	this.riftRender = glam.DOM.riftRender || false;
	this.cardboardRender = glam.DOM.cardboardRender || false;
	this.displayStats = glam.DOM.displayStats || false;
}

glam.DOMViewer.prototype = new Object;

glam.DOMViewer.prototype.initRenderer = function() {
	var renderers = this.document.getElementsByTagName('renderer');
	if (renderers) {
		var renderer = renderers[0];
		if (renderer) {
			var type = renderer.getAttribute("type").toLowerCase();
			if (type == "rift") {
				this.riftRender = true;
			}
			else if (type == "cardboard") {
				this.cardboardRender = true;
			}
		}
	}
	this.app = new glam.Viewer({ container : this.documentParent, 
		headlight: false, 
		riftRender:this.riftRender, 
		cardboard:this.cardboardRender,
		displayStats:this.displayStats });
}

glam.DOMViewer.prototype.initDefaultScene = function() {
	
	this.scene = new glam.Object;
	this.app.sceneRoot.addChild(this.scene);
	this.app.defaultCamera.position.set(0, 0, 5);
}

glam.DOMViewer.prototype.traverseScene = function() {
	var scenes = this.document.getElementsByTagName('scene');
	if (scenes) {
		var scene = scenes[0];
		this.traverse(scene, this.scene);
	}
	else {
		console.warn("Document error! glam requires one 'scene' element");
		return;
	}
}

glam.DOMViewer.prototype.traverse = function(docelt, sceneobj) {

	var tag = docelt.tagName;

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();

		var fn = null;
		var type = tag ? glam.DOMTypes.types[tag] : null;
		if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {
			// console.log("    * found it in table!");
			glam.DOMElement.init(childelt);
			var style = glam.DOMElement.getStyle(childelt);
			var obj = fn.call(this, childelt, style, this.app);
			if (obj) {
				childelt.glam.object = obj;
				this.addFeatures(childelt, style, obj, type);
				sceneobj.addChild(obj);
				this.traverse(childelt, obj);
			}
		}
	}
	
}

glam.DOMViewer.prototype.addNode = function(docelt) {

	var tag = docelt.tagName;
	if (tag)
		tag = tag.toLowerCase();
	var fn = null;
	var type = tag ? glam.DOMTypes.types[tag] : null;
	if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {

		glam.DOMElement.init(docelt);
		var style = glam.DOMElement.getStyle(docelt);
		var obj = fn.call(this, docelt, style, this.app);
		
		if (obj) {
			docelt.glam.object = obj;
			this.addFeatures(docelt, style, obj, type);
			this.scene.addChild(obj);
			this.traverse(docelt, obj);
		}
	}
}

glam.DOMViewer.prototype.removeNode = function(docelt) {

	var obj = docelt.glam.object;
	if (obj) {
		obj._parent.removeChild(obj);
	}
}

glam.DOMViewer.prototype.addFeatures = function(docelt, style, obj, type) {

	if (type.transform) {
		glam.DOMTransform.parse(docelt, style, obj);
	}
	
	if (type.animation) {
		glam.AnimationElement.parse(docelt, style, obj);
		glam.TransitionElement.parse(docelt, style, obj);
	}

	if (type.input) {
		glam.DOMInput.add(docelt, obj);
	}
	
	if (type.visual) {
		glam.VisualElement.addProperties(docelt, obj);
		glam.DOMMaterial.addHandlers(docelt, style, obj);
	}
}

glam.DOMViewer.prototype.go = function() {
	// Run it
	this.initRenderer();
	this.initDefaultScene();
	this.traverseScene();
	this.prepareViewsAndControllers();
	this.app.run();
}

glam.DOMViewer.prototype.prepareViewsAndControllers = function() {
	
	var cameras = this.app.cameras;
	if (cameras && cameras.length) {
		var cam = cameras[0];
		var controller = glam.Application.instance.controllerScript;
		controller.camera = cam;
		controller.enabled = true;
		cam.active = true;
	}
}

