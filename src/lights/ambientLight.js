goog.provide('glam.AmbientLight');
goog.require('glam.Light');

glam.AmbientLight = function(param)
{
	param = param || {};
	
	glam.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
	}
	else {
		this.object = new THREE.AmbientLight(param.color);
	}
}

goog.inherits(glam.AmbientLight, glam.Light);

glam.AmbientLight.prototype.realize = function() 
{
	glam.Light.prototype.realize.call(this);
}
