/**
 * @fileoverview background parser/implementation. supports skyboxes and skyspheres
 * 
 * @author Tony Parisi
 */

goog.provide('glam.BackgroundElement');

glam.BackgroundElement.DEFAULT_BACKGROUND_TYPE = "box";

glam.BackgroundElement.create = function(docelt, style) {
	var type = docelt.getAttribute('background-type') || glam.BackgroundElement.DEFAULT_BACKGROUND_TYPE;
	type = docelt.getAttribute('type') || type;
	
	if (style) {
		if (style["background-type"])
			type = style["background-type"];
		var  param = glam.DOMMaterial.parseStyle(style);
	}	

	var background;
	if (type == "box") {
		background = glam.Prefabs.Skybox();
		var skyboxScript = background.getComponent(glam.SkyboxScript);
		skyboxScript.texture = param.envMap;
	}
	else if (type == "sphere") {
		background = glam.Prefabs.Skysphere();
		var skysphereScript = background.getComponent(glam.SkysphereScript);
		skysphereScript.texture = param.envMap;
	}

	glam.BackgroundElement.addHandlers(docelt, style, background);
	
	glam.Application.instance.addObject(background);
	
	return null;
}

glam.BackgroundElement.addHandlers = function(docelt, style, obj) {

	docelt.glam.setAttributeHandlers.push(function(attr, val) {
		glam.BackgroundElement.onSetAttribute(obj, docelt, attr, val);
	});
	
	style.setPropertyHandlers.push(function(attr, val) {
		glam.BackgroundElement.onSetAttribute(obj, docelt, attr, val);
	});
}

glam.BackgroundElement.onSetAttribute = function(obj, docelt, attr, val) {

	switch (attr) {
		case "sphere-image" :
		case "sphereImage" :
			var skysphereScript = obj.getComponent(glam.SkysphereScript);
			if (skysphereScript) {
				var envMap = THREE.ImageUtils.loadTexture(val);
				skysphereScript.texture = envMap;
			}
			else {
			}
			break;
	}
}
