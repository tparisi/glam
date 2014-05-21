glam.Cylinder = {};

glam.Cylinder.DEFAULT_RADIUS = 2;
glam.Cylinder.DEFAULT_HEIGHT = 2;

glam.Cylinder.create = function(docelt, sceneobj) {
	var radius = docelt.getAttribute('radius') || glam.Cylinder.DEFAULT_RADIUS;
	var height = docelt.getAttribute('height') || glam.Cylinder.DEFAULT_HEIGHT;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.radius)
			radius = style.radius;
		if (style.height)
			height = style.height;
	}
	
	var material = glam.Material.create(style);
	
	// Create the cube
	var cone = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: new THREE.CylinderGeometry(radius, radius, height, 16),
				material: material
			});
	cone.addComponent(visual);

	// Add a rotate behavior to give the cube some life
	//var rotator = new Vizi.RotateBehavior({autoStart:true, duration:5});
	//cube.addComponent(rotator);

	glam.Transform.parse(docelt, cone);
	glam.Animation.parse(docelt, cone);
	
    // Tilt the cube toward the viewer so we can see 3D-ness
    // cube.transform.rotation.x = .5;

	return cone;
}
