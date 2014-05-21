glam.Sphere = {};

glam.Sphere.DEFAULT_RADIUS = 2;

glam.Sphere.create = function(docelt, sceneobj) {
	var radius = docelt.getAttribute('radius') || glam.Sphere.DEFAULT_RADIUS;
	
	var style = glam.Node.getStyle(docelt);
	
	if (style) {
		if (style.radius)
			radius = style.radius;
	}

	// Create the cube
	var sphere = new Vizi.Object;
	var material = glam.Material.create(style, function(material) {
		var visual = new Vizi.Visual(
				{ geometry: new THREE.SphereGeometry(radius, 32, 32),
					material: material
				});
		sphere.addComponent(visual);
		
	});
	
	if (material) {
		var visual = new Vizi.Visual(
				{ geometry: new THREE.SphereGeometry(radius, 32, 32),
					material: material
				});
		sphere.addComponent(visual);
	}
	
	var picker = new Vizi.Picker;
	picker.addEventListener("click", function(event){
		var domEvent = new CustomEvent(
				"click", 
				{
					detail: {
					},
					bubbles: true,
					cancelable: true
				}
			);
		for (propName in event) {
			domEvent[propName] = event[propName];
		}
		var res = docelt.dispatchEvent(domEvent);
		
	});
	sphere.addComponent(picker);
	
	glam.Transform.parse(docelt, sphere);
	glam.Animation.parse(docelt, sphere);

	return sphere;
}
