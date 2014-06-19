glam.Light = {};

glam.Light.DEFAULT_TYPE = "directional";
glam.Light.DEFAULT_COLOR = "#ffffff";
glam.Light.DEFAULT_ANGLE = "90deg";

glam.Light.create = function(docelt, sceneobj, app) {
	
	function parseAngle(t) {
		return glam.Transform.parseRotation(t);
	}
		
	var type = docelt.getAttribute('type') || glam.Light.DEFAULT_TYPE;
	var color = docelt.getAttribute('color') || glam.Light.DEFAULT_COLOR;
	var angle = docelt.getAttribute('angle') || glam.Light.DEFAULT_ANGLE;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.type) {
			type = style.type;
		}
		if (style.color) {
			color = style.color;
		}
		if (style.angle) {
			angle = style.angle;
		}
	}

	color = new THREE.Color().setStyle(color).getHex(); 
	angle = parseAngle(angle);
	
	var param = {
			color : color,
			angle : angle,
	};
	
	var obj = new Vizi.Object;

	var light = null;
	switch (type.toLowerCase()) {
	
		case 'directional' :
			light = new Vizi.DirectionalLight(param);
			break;
		case 'point' :
			light = new Vizi.PointLight(param);
			break;
		case 'spot' :
			light = new Vizi.SpotLight(param);
			break;
		case 'ambient' :
			light = new Vizi.AmbientLight(param);
			break;
	}
	
	if (light) {
		obj.addComponent(light);
		return obj;
	}
	
	return null;
}
