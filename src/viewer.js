glam.Viewer = function(doc, docParent) {

	this.document = doc;
	this.documentParent = docParent;
	
	this.initRenderer();
	this.initDefaultScene();
	this.traverseDocument();
}

glam.Viewer.prototype = new Object;

glam.Viewer.prototype.initRenderer = function() {
	this.app = new Vizi.Application({ container : this.documentParent });
}

glam.Viewer.prototype.initDefaultScene = function() {
	var camobj = new Vizi.Object;
	camera1 = new Vizi.PerspectiveCamera({active:true});
	camobj.addComponent(camera1);
	camera1.position.z = 5;
	this.app.addObject(camobj);
	
	this.scene = new Vizi.Object;
	this.app.addObject(this.scene);
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
	console.log("Parsing element ", tag, "!");

	var i, len, children = docelt.childNodes, len = children.length;
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		console.log("  child element ", childelt.tagName);
		var fn = null;
		if (tag && (fn = glam.Viewer.types[tag]) && typeof(fn) == "function") {
			console.log("    * found it in table!");
		}
	}
	
	// Create a phong-shaded, texture-mapped cube
	var cube = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CubeGeometry(2, 2, 2),
				material: new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture("../images/flowers.jpg")})
			});
	cube.addComponent(visual);

	// Add a rotate behavior to give the cube some life
	var rotator = new Vizi.RotateBehavior({autoStart:true, duration:5});
	cube.addComponent(rotator);
	
    // Tilt the cube toward the viewer so we can see 3D-ness
    cube.transform.rotation.x = .5;
	
	// Add a light to show shading
	var light = new Vizi.Object;
	light.addComponent(new Vizi.DirectionalLight);

	// Add the cube and light to the scene
	sceneobj.addChild(cube);
	sceneobj.addChild(light);
}

glam.Viewer.prototype.createCube = function() {
}

glam.Viewer.prototype.go = function() {
	// Run it
	this.app.run();
}

// statics
glam.Viewer.types = {
		"cube" : glam.Viewer.prototype.createCube,
};


