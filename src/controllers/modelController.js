
goog.require('glam.Prefabs');

glam.Prefabs.ModelController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.ModelControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('glam.ModelControllerScript');
goog.require('glam.Script');

glam.ModelControllerScript = function(param)
{
	glam.Script.call(this, param);

	this.radius = param.radius || glam.ModelControllerScript.default_radius;
	this.minRadius = param.minRadius || glam.ModelControllerScript.default_min_radius;
	this.minAngle = (param.minAngle !== undefined) ? param.minAngle : 
		glam.ModelControllerScript.default_min_angle;
	this.maxAngle = (param.maxAngle !== undefined) ? param.maxAngle : 
		glam.ModelControllerScript.default_max_angle;
	this.minDistance = (param.minDistance !== undefined) ? param.minDistance : 
		glam.ModelControllerScript.default_min_distance;
	this.maxDistance = (param.maxDistance !== undefined) ? param.maxDistance : 
		glam.ModelControllerScript.default_max_distance;
	this.allowPan = (param.allowPan !== undefined) ? param.allowPan : true;
	this.allowZoom = (param.allowZoom !== undefined) ? param.allowZoom : true;
	this.allowRotate = (param.allowRotate !== undefined) ? param.allowRotate : true;
	this.oneButton = (param.oneButton !== undefined) ? param.oneButton : true;
	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._headlightOn = param.headlight;
	this.cameras = [];
	this.controlsList = [];
	
    Object.defineProperties(this, {
    	camera: {
			get : function() {
				return this._camera;
			},
			set: function(camera) {
				this.setCamera(camera);
			}
		},
    	center : {
    		get: function() {
    			return this.controls.center;
    		},
    		set: function(c) {
    			this.controls.center.copy(c);
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

goog.inherits(glam.ModelControllerScript, glam.Script);

glam.ModelControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.ModelControllerScript.prototype.createControls = function(camera)
{
	var controls = new glam.OrbitControls(camera.object, glam.Graphics.instance.container);
	controls.userMinY = this.minY;
	controls.userMinZoom = this.minZoom;
	controls.userMaxZoom = this.maxZoom;
	controls.minPolarAngle = this.minAngle;
	controls.maxPolarAngle = this.maxAngle;	
	controls.minDistance = this.minDistance;	
	controls.maxDistance = this.maxDistance;	
	controls.oneButton = this.oneButton;
	controls.userPan = this.allowPan;
	controls.userZoom = this.allowZoom;
	controls.userRotate = this.allowRotate;
	controls.enabled = this._enabled;
	return controls;
}

glam.ModelControllerScript.prototype.update = function()
{
	if (!this.enabled)
		return;
	
	this.controls.update();
	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}	
}

glam.ModelControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this._camera.position.set(0, this.radius / 2, this.radius);
	this.controls = this.createControls(camera);
}

glam.ModelControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

glam.ModelControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	this.controls.enabled = enabled;
}

glam.ModelControllerScript.default_radius = 10;
glam.ModelControllerScript.default_min_radius = 1;
glam.ModelControllerScript.default_min_angle = 0;
glam.ModelControllerScript.default_max_angle = Math.PI;
glam.ModelControllerScript.default_min_distance = 0;
glam.ModelControllerScript.default_max_distance = Infinity;
glam.ModelControllerScript.MAX_X_ROTATION = 0; // Math.PI / 12;
glam.ModelControllerScript.MIN_X_ROTATION = -Math.PI / 2;
glam.ModelControllerScript.MAX_Y_ROTATION = Math.PI * 2;
glam.ModelControllerScript.MIN_Y_ROTATION = -Math.PI * 2;
