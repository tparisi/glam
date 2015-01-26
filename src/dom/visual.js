/**
 * @fileoverview visual base type - used by all thing seen on screen
 * 
 * @author Tony Parisi
 */

goog.provide('glam.VisualElement');

glam.VisualElement.create = function(docelt, style, cls) {

	var param = {
	};
	
	cls.getAttributes(docelt, style, param);
	
	var obj = new glam.Object;	
	
	var material = glam.DOMMaterial.create(style, function(material) {
		glam.VisualElement.createVisual(obj, cls, docelt, material, param);
	});
	
	if (material) {
		glam.VisualElement.createVisual(obj, cls, docelt, material, param);
	}
	
	return obj;
}

glam.VisualElement.createVisual = function(obj, cls, docelt, material, param) {
	var visual = cls.createVisual(docelt, material, param);	
	if (visual) {
		obj.addComponent(visual);
		glam.VisualElement.addProperties(docelt, obj);
	}
}

glam.VisualElement.addProperties = function(docelt, obj) {

	var visuals = obj.getComponents(glam.Visual);
	var visual = visuals[0];
	
	if (visual) {
		// Is this the API?	
		docelt.geometry = visual.geometry;
		docelt.material = visual.material;
	}
}
