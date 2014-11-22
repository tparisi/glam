/**
 * @fileoverview viewer - creates WebGL (Three.js/Vizi scene) by traversing document
 * 
 * @author Tony Parisi
 */

glam.Viewer = function(doc) {

	this.document = doc;
	this.documentParent = doc.parentElement;
	this.riftRender = glam.riftRender || false;
	this.displayStats = glam.displayStats || false;
}

glam.Viewer.prototype = new Object;

glam.Viewer.prototype.initRenderer = function() {
	var renderers = this.document.getElementsByTagName('renderer');
	if (renderers) {
		var renderer = renderers[0];
		if (renderer) {
			var type = renderer.getAttribute("type");
			if (type.toLowerCase() == "rift") {
				this.riftRender = true;
			}
      else if(type.toLowerCase() == "cardboard") {
				this.cardboard = true;
      }
		}
	}
	this.app = new Vizi.Viewer({ container : this.documentParent, headlight: false, riftRender:this.riftRender, cardboard:this.cardboard, displayStats:this.displayStats });
}

glam.Viewer.prototype.initDefaultScene = function() {
	
	this.scene = new Vizi.Object;
	this.app.sceneRoot.addChild(this.scene);
	this.app.defaultCamera.position.set(0, 0, 5);
}

glam.Viewer.prototype.traverseScene = function() {
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

glam.Viewer.prototype.traverse = function(docelt, sceneobj) {

	var tag = docelt.tagName;

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();

		var fn = null;
		var type = tag ? glam.Types.types[tag] : null;
		if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {
			// console.log("    * found it in table!");
			glam.Node.init(childelt);
			var style = glam.Node.getStyle(childelt);
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

glam.Viewer.prototype.addNode = function(docelt) {

	var tag = docelt.tagName;
	if (tag)
		tag = tag.toLowerCase();
	var fn = null;
	var type = tag ? glam.Types.types[tag] : null;
	if (type && type.cls && (fn = type.cls.create) && typeof(fn) == "function") {

		glam.Node.init(docelt);
		var style = glam.Node.getStyle(docelt);
		var obj = fn.call(this, docelt, style, this.app);
		
		if (obj) {
			docelt.glam.object = obj;
			this.addFeatures(docelt, style, obj, type);
			this.scene.addChild(obj);
			this.traverse(docelt, obj);
		}
	}
}

glam.Viewer.prototype.removeNode = function(docelt) {

	var obj = docelt.glam.object;
	if (obj) {
		obj._parent.removeChild(obj);
	}
}

glam.Viewer.prototype.addFeatures = function(docelt, style, obj, type) {

	if (type.transform) {
		glam.Transform.parse(docelt, style, obj);
	}
	
	if (type.animation) {
		glam.Animation.parse(docelt, style, obj);
		glam.Transition.parse(docelt, style, obj);
	}

	if (type.input) {
		glam.Input.add(docelt, obj);
	}
	
	if (type.visual) {
		glam.Visual.addProperties(docelt, obj);
		glam.Material.addHandlers(docelt, style, obj);
	}
}

glam.Viewer.prototype.go = function() {
	// Run it
	this.initRenderer();
	this.initDefaultScene();
	this.traverseScene();
	this.prepareViewsAndControllers();
	this.app.run();
}

glam.Viewer.prototype.prepareViewsAndControllers = function() {
	
	var cameras = this.app.cameras;
	if (cameras && cameras.length) {
		var cam = cameras[0];
		var controller = Vizi.Application.instance.controllerScript;
		controller.camera = cam;
		controller.enabled = true;
		cam.active = true;
	}
}

