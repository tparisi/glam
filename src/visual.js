glam.Visual = {};

glam.Visual.create = function(docelt, cls) {

	var param = {
	};
	
	var style = glam.Node.getStyle(docelt);
	
	cls.getAttributes(docelt, style, param);
	
	var obj = new Vizi.Object;	
	
	var material = glam.Material.create(style, function(material) {
		var visual = cls.createVisual(docelt, material, param);	
		obj.addComponent(visual);
		glam.Visual.addProperties(docelt, obj);
	});
	
	if (material) {
		var visual = cls.createVisual(docelt, material, param);	
		obj.addComponent(visual);
		glam.Visual.addProperties(docelt, obj);
	}
	
	return obj;
}


glam.Visual.addProperties = function(docelt, obj) {

	var visuals = obj.getComponents(Vizi.Visual);
	var visual = visuals[0];

	if (visual) {
		// Is this the API?	
		docelt.geometry = visual.geometry;
		docelt.material = visual.material;
	}
}
