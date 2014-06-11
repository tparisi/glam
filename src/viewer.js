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
		}
	}
	this.app = new Vizi.Viewer({ container : this.documentParent, headlight: false, riftRender:this.riftRender, displayStats:this.displayStats });
}

glam.Viewer.prototype.initDefaultScene = function() {
	
	this.scene = new Vizi.Object;
	this.app.sceneRoot.addChild(this.scene);
//	this.app.controllerScript.enabled = false;
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
	// console.log("Parsing element ", tag, "!");

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();
		// console.log("  child element ", childelt.tagName);
		var fn = null;
		if (tag == "controller") {
			this.initController(childelt);
		}
		else if (tag && glam.Viewer.types[tag] && (fn = glam.Viewer.types[tag].create) && typeof(fn) == "function") {
			// console.log("    * found it in table!");
			this.addFeatures(childelt);
			var obj = fn.call(this, childelt, sceneobj);
			childelt.glam = obj;
			if (obj) {
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
	if (tag && glam.Viewer.types[tag] && (fn = glam.Viewer.types[tag].create) && typeof(fn) == "function") {
		// console.log("    * found it in table!");
		this.addFeatures(docelt);
		var obj = fn.call(this, docelt, this.scene);
		
		if (obj) {
			docelt.glam = obj;
			this.scene.addChild(obj);
			this.traverse(docelt, obj);
		}
	}
}

glam.Viewer.prototype.removeNode = function(docelt) {

	var obj = docelt.glam;
	if (obj) {
		obj._parent.removeChild(obj);
	}
}

glam.Viewer.prototype.addFeatures = function(docelt) {

	docelt.setAttributeHandlers = [];
	docelt.onSetAttribute = function(attr, val) {
		var i, len = docelt.setAttributeHandlers.length;
		for (i = 0; i < len; i++) {
			var handler = docelt.setAttributeHandlers[i];
			if (handler) {
				handler(attr, val);
			}
		}
	}
}

glam.Viewer.prototype.initController = function(docelt) {
	var on = true;
	
	var noheadlight = docelt.getAttribute("noheadlight");
	if (noheadlight !== null) {
		on = false;
		this.app.controllerScript.headlightOn = false;
	}
	
	var type = docelt.getAttribute("type");
	if (type !== null) {
		type = type.toLowerCase();
		if (type == "fps") {
			
			var x = parseFloat(docelt.getAttribute('x')) || 0;
			var y = parseFloat(docelt.getAttribute('y')) || 0;
			var z = parseFloat(docelt.getAttribute('z')) || 0;
			
			var controller = Vizi.Prefabs.FirstPersonController({active:true, headlight:on});
			var controllerScript = controller.getComponent(Vizi.FirstPersonControllerScript);
			this.app.addObject(controller);

			var object = new Vizi.Object;	
			var camera = new Vizi.PerspectiveCamera();
			object.addComponent(camera);
			this.app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
//			object.transform.position.set(x, y, z);
		}
		else if (type == "rift") {
			var controller = Vizi.Prefabs.RiftController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(Vizi.RiftControllerScript);			
			this.app.addObject(controller);

			var object = new Vizi.Object;	
			var camera = new Vizi.PerspectiveCamera();
			object.addComponent(camera);
			this.app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
			if (this.app.controllerScript) {
				this.app.controllerScript.enabled = false;
			}
			
			this.app.controller = controller;
			this.app.controllerScript = controllerScript;
		}
	}
	
}

glam.Viewer.prototype.go = function() {
	// Run it
	this.initRenderer();
	this.initDefaultScene();
	this.traverseScene();
	this.app.run();
}

// statics
glam.Viewer.types = {
		"cube" : glam.Cube,
		"cone" : glam.Cone,
		"cylinder" : glam.Cylinder,
		"sphere" : glam.Sphere,
		"group" : glam.Group,
		"animation" : glam.Animation,
		"background" : glam.Background,
		"import" : glam.Import,
		"camera" : glam.Camera,
		"text" : glam.Text,
};


