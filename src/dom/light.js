/**
 * @fileoverview light parser/implementation. supports point, spot, directional, ambient
 * 
 * @author Tony Parisi
 */

goog.provide('glam.LightElement');

glam.LightElement.DEFAULT_TYPE = "directional";
glam.LightElement.DEFAULT_COLOR = "#ffffff";
glam.LightElement.DEFAULT_ANGLE = "90deg";
glam.LightElement.DEFAULT_DISTANCE = 0;
glam.LightElement.DEFAULT_EXPONENT = glam.SpotLight.DEFAULT_EXPONENT;

glam.LightElement.create = function(docelt, style, app) {
	
	function parseAngle(t) {
		return glam.DOMTransform.parseRotation(t);
	}
		
	var type = docelt.getAttribute('type') || glam.LightElement.DEFAULT_TYPE;
	var color = docelt.getAttribute('color') || glam.LightElement.DEFAULT_COLOR;
	var angle = docelt.getAttribute('angle') || glam.LightElement.DEFAULT_ANGLE;
	var distance = docelt.getAttribute('distance') || glam.LightElement.DEFAULT_DISTANCE;
	var exponent = docelt.getAttribute('exponent') || glam.LightElement.DEFAULT_EXPONENT;
	
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
	
	var obj = new glam.Object;

	var light = null;
	switch (type.toLowerCase()) {
	
		case 'directional' :
			light = new glam.DirectionalLight(param);
			break;
		case 'point' :
			light = new glam.PointLight(param);
			break;
		case 'spot' :
			light = new glam.SpotLight(param);
			break;
		case 'ambient' :
			light = new glam.AmbientLight(param);
			break;
	}
	
	if (light) {
		obj.addComponent(light);
		return obj;
	}
	
	return null;
}
