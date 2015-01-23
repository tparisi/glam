/**
 * @fileoverview background parser/implementation. supports skyboxes and skyspheres
 * 
 * @author Tony Parisi
 */

glam.DOM.Background = {};

glam.DOM.Background.DEFAULT_BACKGROUND_TYPE = "box";

glam.DOM.Background.create = function(docelt, style) {
	var type = docelt.getAttribute('background-type') || glam.DOM.Background.DEFAULT_BACKGROUND_TYPE;
	type = docelt.getAttribute('type') || type;
	
	if (style) {
		if (style["background-type"])
			type = style["background-type"];
		var  param = glam.DOM.Material.parseStyle(style);
	}	

	var background;
	if (type == "box") {
		background = Vizi.Prefabs.Skybox();
		var skyboxScript = background.getComponent(Vizi.SkyboxScript);
		skyboxScript.texture = param.envMap;
	}
	else if (type == "sphere") {
		background = Vizi.Prefabs.Skysphere();
		skysphereScript = background.getComponent(Vizi.SkysphereScript);
		skysphereScript.texture = param.envMap;
	}

	glam.DOM.Background.addHandlers(docelt, style, background);
	
	Vizi.Application.instance.addObject(background);
	
	return null;
}

glam.DOM.Background.addHandlers = function(docelt, style, obj) {

	docelt.glam.setAttributeHandlers.push(function(attr, val) {
		glam.DOM.Background.onSetAttribute(obj, docelt, attr, val);
	});
	
	style.setPropertyHandlers.push(function(attr, val) {
		glam.DOM.Background.onSetAttribute(obj, docelt, attr, val);
	});
}

glam.DOM.Background.onSetAttribute = function(obj, docelt, attr, val) {

	switch (attr) {
		case "sphere-image" :
		case "sphereImage" :
			var skysphereScript = obj.getComponent(Vizi.SkysphereScript);
			if (skysphereScript) {
				var envMap = THREE.ImageUtils.loadTexture(val);
				skysphereScript.texture = envMap;
			}
			else {
			}
			break;
	}
}
