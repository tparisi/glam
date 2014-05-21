glam.Background = {};

glam.Background.DEFAULT_BACKGROUND_TYPE = "box";

glam.Background.create = function(docelt, sceneobj) {
	var type = docelt.getAttribute('background-type') || glam.Background.DEFAULT_BACKGROUND_TYPE;
	type = docelt.getAttribute('type') || type;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style["background-type"])
			type = style["background-type"];
		var  param = glam.Material.parseStyle(style);
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

	return background;
}
