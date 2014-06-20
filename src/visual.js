glam.Visual = {};

glam.Visual.create = function(docelt, cls) {

	var param = {
	};
	
	var style = glam.Node.getStyle(docelt);
	
	cls.getAttributes(docelt, style, param);
	
	var obj = new Vizi.Object;	
	
	var material = glam.Material.create(style, function(material) {
		glam.Visual.createVisual(obj, cls, docelt, material, param);
	});
	
	if (material) {
		glam.Visual.createVisual(obj, cls, docelt, material, param);
	}
	
	return obj;
}

glam.Visual.createVisual = function(obj, cls, docelt, material, param) {
	var visual = cls.createVisual(docelt, material, param);	
	if (visual) {
		obj.addComponent(visual);
		glam.Visual.addProperties(docelt, visual);
	}
}

glam.Visual.addProperties = function(docelt, visual) {

	if (visual) {
		// Is this the API?	
		docelt.geometry = visual.geometry;
		docelt.material = visual.material;
	}
}
