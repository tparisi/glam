glam.Viewer = function(doc, docParent) {

	this.document = doc;
	this.documentParent = docParent;
	
	this.initRenderer();
	this.initDefaultScene();
	this.traverseDocument();
}

glam.Viewer.prototype = new Object;

glam.Viewer.prototype.initRenderer = function() {
	this.app = new Vizi.Viewer({ container : this.documentParent, headlight: false });
}

glam.Viewer.prototype.initDefaultScene = function() {
	
	this.scene = new Vizi.Object;
	this.app.sceneRoot.addChild(this.scene);
//	this.app.controllerScript.enabled = false;
	this.app.defaultCamera.position.set(0, 0, 5);
}

glam.Viewer.prototype.traverseDocument = function() {
	var elt = this.document.childNodes[0];
	if (elt.tagName != "glam") {
		console.warn("Document error! Root element must be 'glam'");
		return;
	}
	this.glamElement = elt;
	this.traverseScene(this.document.childNodes[0].childNodes[1].childNodes[1], this.scene);
}

glam.Viewer.prototype.traverseScene = function() {
	var elt = this.glamElement.childNodes[1];
	if (elt.tagName != "scene") {
		console.warn("Document error! First (and only) glam child must be 'scene'");
		return;
	}
	this.sceneElement = elt;
	this.traverse(this.sceneElement, this.scene);
}

glam.Viewer.prototype.traverse = function(docelt, sceneobj) {

	var tag = docelt.tagName;
	// console.log("Parsing element ", tag, "!");

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		// console.log("  child element ", childelt.tagName);
		var fn = null;
		if (tag && glam.Viewer.types[tag] && (fn = glam.Viewer.types[tag].create) && typeof(fn) == "function") {
			// console.log("    * found it in table!");
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
	var fn = null;
	if (tag && glam.Viewer.types[tag] && (fn = glam.Viewer.types[tag].create) && typeof(fn) == "function") {
		// console.log("    * found it in table!");
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

glam.Viewer.prototype.go = function() {
	// Run it
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
};


