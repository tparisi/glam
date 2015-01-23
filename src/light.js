/**
 * @fileoverview light parser/implementation. supports point, spot, directional, ambient
 * 
 * @author Tony Parisi
 */

glam.DOM.Light = {};

glam.DOM.Light.DEFAULT_TYPE = "directional";
glam.DOM.Light.DEFAULT_COLOR = "#ffffff";
glam.DOM.Light.DEFAULT_ANGLE = "90deg";
glam.DOM.Light.DEFAULT_DISTANCE = 0;
glam.DOM.Light.DEFAULT_EXPONENT = Vizi.SpotLight.DEFAULT_EXPONENT;

glam.DOM.Light.create = function(docelt, style, app) {
	
	function parseAngle(t) {
		return glam.DOM.Transform.parseRotation(t);
	}
		
	var type = docelt.getAttribute('type') || glam.DOM.Light.DEFAULT_TYPE;
	var color = docelt.getAttribute('color') || glam.DOM.Light.DEFAULT_COLOR;
	var angle = docelt.getAttribute('angle') || glam.DOM.Light.DEFAULT_ANGLE;
	var distance = docelt.getAttribute('distance') || glam.DOM.Light.DEFAULT_DISTANCE;
	var exponent = docelt.getAttribute('exponent') || glam.DOM.Light.DEFAULT_EXPONENT;
	
	var direction = new THREE.Vector3(0, 0, -1);
	
	var dx = parseFloat(docelt.getAttribute('dx')) || 0;
	var dy = parseFloat(docelt.getAttribute('dy')) || 0;
	var dz = parseFloat(docelt.getAttribute('dz')) || 0;
	if (dx || dy || dz) {
		direction.set(dx, dy, dz);
	}
	
	direction.normalize();
	
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
		if (style.distance) {
			distance = style.distance;
		}
	}

	color = new THREE.Color().setStyle(color).getHex(); 
	angle = parseAngle(angle);
	distance = parseFloat(distance);
	exponent = parseFloat(exponent);
	
	var param = {
			color : color,
			angle : angle,
			direction : direction,
			distance : distance,
			exponent : exponent,
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
