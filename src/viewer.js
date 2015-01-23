/**
 * @fileoverview viewer - creates WebGL (Three.js/Vizi scene) by traversing document
 * 
 * @author Tony Parisi
 */

glam.DOM.Viewer = function(doc) {

	this.document = doc;
	this.documentParent = doc.parentElement;
	this.riftRender = glam.DOM.riftRender || false;
	this.cardboardRender = glam.DOM.cardboardRender || false;
	this.displayStats = glam.DOM.displayStats || false;
}

glam.DOM.Viewer.prototype = new Object;

glam.DOM.Viewer.prototype.initRenderer = function() {
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
	this.app = new Vizi.Viewer({ container : this.documentParent, 
		headlight: false, 
		riftRender:this.riftRender, 
		cardboard:this.cardboardRender,
		displayStats:this.displayStats });
}

glam.DOM.Viewer.prototype.initDefaultScene = function() {
	
	this.scene = new Vizi.Object;
	this.app.sceneRoot.addChild(this.scene);
	this.app.defaultCamera.position.set(0, 0, 5);
}

glam.DOM.Viewer.prototype.traverseScene = function() {
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

glam.DOM.Viewer.prototype.traverse = function(docelt, sceneobj) {

	var tag = docelt.tagName;

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();

		var fn = null;
		var type = tag ? glam.DOM.Types.types[tag] : null;
		if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {
			// console.log("    * found it in table!");
			glam.DOM.Node.init(childelt);
			var style = glam.DOM.Node.getStyle(childelt);
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

glam.DOM.Viewer.prototype.addNode = function(docelt) {

	var tag = docelt.tagName;
	if (tag)
		tag = tag.toLowerCase();
	var fn = null;
	var type = tag ? glam.DOM.Types.types[tag] : null;
	if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {

		glam.DOM.Node.init(docelt);
		var style = glam.DOM.Node.getStyle(docelt);
		var obj = fn.call(this, docelt, style, this.app);
		
		if (obj) {
			docelt.glam.object = obj;
			this.addFeatures(docelt, style, obj, type);
			this.scene.addChild(obj);
			this.traverse(docelt, obj);
		}
	}
}

glam.DOM.Viewer.prototype.removeNode = function(docelt) {

	var obj = docelt.glam.object;
	if (obj) {
		obj._parent.removeChild(obj);
	}
}

glam.DOM.Viewer.prototype.addFeatures = function(docelt, style, obj, type) {

	if (type.transform) {
		glam.DOM.Transform.parse(docelt, style, obj);
	}
	
	if (type.animation) {
		glam.DOM.Animation.parse(docelt, style, obj);
		glam.DOM.Transition.parse(docelt, style, obj);
	}

	if (type.input) {
		glam.DOM.Input.add(docelt, obj);
	}
	
	if (type.visual) {
		glam.DOM.Visual.addProperties(docelt, obj);
		glam.DOM.Material.addHandlers(docelt, style, obj);
	}
}

glam.DOM.Viewer.prototype.go = function() {
	// Run it
	this.initRenderer();
	this.initDefaultScene();
	this.traverseScene();
	this.prepareViewsAndControllers();
	this.app.run();
}

glam.DOM.Viewer.prototype.prepareViewsAndControllers = function() {
	
	var cameras = this.app.cameras;
	if (cameras && cameras.length) {
		var cam = cameras[0];
		var controller = Vizi.Application.instance.controllerScript;
		controller.camera = cam;
		controller.enabled = true;
		cam.active = true;
	}
}

