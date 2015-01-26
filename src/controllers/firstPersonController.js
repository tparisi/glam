
goog.require('glam.Prefabs');

glam.Prefabs.FirstPersonController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.FirstPersonControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('glam.FirstPersonControllerScript');
goog.require('glam.Script');

glam.FirstPersonControllerScript = function(param)
{
	glam.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._move = (param.move !== undefined) ? param.move : true;
	this._look = (param.look !== undefined) ? param.look : true;
	this._turn = (param.turn !== undefined) ? param.turn : true;
	this._tilt = (param.tilt !== undefined) ? param.tilt : true;
	this._mouseLook = (param.mouseLook !== undefined) ? param.mouseLook : false;
	this.testCollisions = (param.testCollisions !== undefined) ? param.testCollisions : false;
	
	this.collisionDistance = 10;
	this.moveSpeed = 13;
	this.turnSpeed = 5;
	this.tiltSpeed = 5;
	this.lookSpeed = 1;
	
	this.savedCameraPos = new THREE.Vector3;	
	this.movementVector = new THREE.Vector3;
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	enabled : {
    		get: function() {
    			return this._enabled;
    		},
    		set: function(v) {
    			this.setEnabled(v);
    		}
    	},
    	move : {
    		get: function() {
    			return this._move;
    		},
    		set: function(v) {
    			this.setMove(v);
    		}
    	},
    	look : {
    		get: function() {
    			return this._look;
    		},
    		set: function(v) {
    			this.setLook(v);
    		}
    	},
    	mouseLook : {
    		get: function() {
    			return this._mouseLook;
    		},
    		set: function(v) {
    			this.setMouseLook(v);
    		}
    	},
        headlightOn: {
	        get: function() {
	            return this._headlightOn;
	        },
	        set:function(v)
	        {
	        	this.setHeadlightOn(v);
	        }
    	},
    });
}

goog.inherits(glam.FirstPersonControllerScript, glam.Script);

glam.FirstPersonControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.FirstPersonControllerScript.prototype.createControls = function(camera)
{
	var controls = new glam.FirstPersonControls(camera.object, glam.Graphics.instance.container);
	controls.mouseLook = this._mouseLook;
	controls.movementSpeed = this._move ? this.moveSpeed : 0;
	controls.lookSpeed = this._look ? this.lookSpeed  : 0;
	controls.turnSpeed = this._turn ? this.turnSpeed : 0;
	controls.tiltSpeed = this._tilt ? this.tiltSpeed : 0;

	this.clock = new THREE.Clock();
	return controls;
}

glam.FirstPersonControllerScript.prototype.update = function()
{
	this.saveCamera();
	this.controls.update(this.clock.getDelta());
	if (this.testCollisions) {
		var collide = this.testCollision();
	}
	else {
		var collide = null;
	}
	
	if (collide && collide.object) {
		this.restoreCamera();
		this.dispatchEvent("collide", collide);
	}
	
	if (this.testTerrain()) {
		this.restoreCamera();
	}
	
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

glam.FirstPersonControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

glam.FirstPersonControllerScript.prototype.setMove = function(move)
{
	this._move = move;
	this.controls.movementSpeed = move ? this.moveSpeed : 0;
}

glam.FirstPersonControllerScript.prototype.setLook = function(look)
{
	this._look = look;
	this.controls.lookSpeed = look ? 1.0 : 0;
}

glam.FirstPersonControllerScript.prototype.setMouseLook = function(mouseLook)
{
	this._mouseLook = mouseLook;
	this.controls.mouseLook = mouseLook;
}

glam.FirstPersonControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
	this.controls.movementSpeed = this.moveSpeed;
	this.controls.lookSpeed = this._look ?  0.1 : 0;

}

glam.FirstPersonControllerScript.prototype.saveCamera = function() {
	this.savedCameraPos.copy(this._camera.position);
}

glam.FirstPersonControllerScript.prototype.restoreCamera = function() {
	this._camera.position.copy(this.savedCameraPos);
}

glam.FirstPersonControllerScript.prototype.testCollision = function() {
	
	this.movementVector.copy(this._camera.position).sub(this.savedCameraPos);
	if (this.movementVector.length()) {
		
        var collide = glam.Graphics.instance.objectFromRay(null, 
        		this.savedCameraPos,
        		this.movementVector, 1, 2);

        if (collide && collide.object) {
        	var dist = this.savedCameraPos.distanceTo(collide.hitPointWorld);
        }
        
        return collide;
	}
	
	return null;
}

glam.FirstPersonControllerScript.prototype.testTerrain = function() {
	return false;
}

glam.FirstPersonControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

