/**
 * @fileoverview visual base type - used by all thing seen on screen
 * 
 * @author Tony Parisi
 */

glam.Visual = {};

glam.Visual.create = function(docelt, style, cls) {

	var param = {
	};
	
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
		glam.Visual.addProperties(docelt, obj);
	}
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
