goog.provide('glam.Light');
goog.require('glam.SceneComponent');

glam.Light = function(param)
{
	param = param || {};
	glam.SceneComponent.call(this, param);
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        color: {
	        get: function() {
	            return this.object.color;
	        }
    	},
        intensity: {
	        get: function() {
	            return this.object.intensity;
	        },
	        set: function(v) {
	        	this.object.intensity = v;
	        }
    	},    	

    });
	
}

goog.inherits(glam.Light, glam.SceneComponent);

glam.Light.prototype._componentProperty = "light";
glam.Light.prototype._componentPropertyType = "Light";

glam.Light.prototype.realize = function() 
{
	glam.SceneComponent.prototype.realize.call(this);
}

glam.Light.DEFAULT_COLOR = 0xFFFFFF;
glam.Light.DEFAULT_INTENSITY = 1;
glam.Light.DEFAULT_RANGE = 10000;