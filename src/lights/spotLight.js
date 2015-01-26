goog.provide('glam.SpotLight');
goog.require('glam.Light');

glam.SpotLight = function(param)
{
	param = param || {};

	this.scaledDir = new THREE.Vector3;
	this.positionVec = new THREE.Vector3;
	this.castShadows = ( param.castShadows !== undefined ) ? param.castShadows : glam.SpotLight.DEFAULT_CAST_SHADOWS;
	
	glam.Light.call(this, param);

	if (param.object) {
		this.object = param.object; 
		this.direction = param.object.position.clone().normalize().negate();
		this.targetPos = param.object.target.position.clone();
		this.shadowDarkness = param.object.shadowDarkness;
	}
	else {
		this.direction = param.direction || new THREE.Vector3(0, 0, -1);
		this.targetPos = new THREE.Vector3;
		this.shadowDarkness = ( param.shadowDarkness !== undefined ) ? param.shadowDarkness : glam.SpotLight.DEFAULT_SHADOW_DARKNESS;

		var angle = ( param.angle !== undefined ) ? param.angle : glam.SpotLight.DEFAULT_ANGLE;
		var distance = ( param.distance !== undefined ) ? param.distance : glam.SpotLight.DEFAULT_DISTANCE;
		var exponent = ( param.exponent !== undefined ) ? param.exponent : glam.SpotLight.DEFAULT_EXPONENT;

		this.object = new THREE.SpotLight(param.color, param.intensity, distance, angle, exponent);
	}
	
    // Create accessors for all properties... just pass-throughs to Three.js
    Object.defineProperties(this, {
        angle: {
	        get: function() {
	            return this.object.angle;
	        },
	        set: function(v) {
	        	this.object.angle = v;
	        }
		},    	
        distance: {
	        get: function() {
	            return this.object.distance;
	        },
	        set: function(v) {
	        	this.object.distance = v;
	        }
    	},    	
        exponent: {
	        get: function() {
	            return this.object.exponent;
	        },
	        set: function(v) {
	        	this.object.exponent = v;
	        }
    	},    	

    });
	
}

goog.inherits(glam.SpotLight, glam.Light);

glam.SpotLight.prototype.realize = function() 
{
	glam.Light.prototype.realize.call(this);
}

glam.SpotLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform light directions automatically
	// Really bizarre semantics
	if (this.object)
	{
		this.positionVec.set(0, 0, 0);
		var worldmat = this.object.parent.matrixWorld;
		this.positionVec.applyMatrix4(worldmat);
		this.position.copy(this.positionVec);

		this.scaledDir.copy(this.direction);
		this.scaledDir.multiplyScalar(glam.Light.DEFAULT_RANGE);
		this.targetPos.copy(this.position);
		this.targetPos.add(this.scaledDir);	
		// this.object.target.position.copy(this.targetPos);
		
		this.updateShadows();
	}
	
	// Update the rest
	glam.Light.prototype.update.call(this);
}

glam.SpotLight.prototype.updateShadows = function()
{
	if (this.castShadows)
	{
		this.object.castShadow = true;
		this.object.shadowCameraNear = 1;
		this.object.shadowCameraFar = glam.Light.DEFAULT_RANGE;
		this.object.shadowCameraFov = 90;

		// light.shadowCameraVisible = true;

		this.object.shadowBias = 0.0001;
		this.object.shadowDarkness = this.shadowDarkness;

		this.object.shadowMapWidth = 1024;
		this.object.shadowMapHeight = 1024;
		
		glam.Graphics.instance.enableShadows(true);
	}	
}

glam.SpotLight.DEFAULT_DISTANCE = 0;
glam.SpotLight.DEFAULT_ANGLE = Math.PI / 2;
glam.SpotLight.DEFAULT_EXPONENT = 10;
glam.SpotLight.DEFAULT_CAST_SHADOWS = false;
glam.SpotLight.DEFAULT_SHADOW_DARKNESS = 0.3;
