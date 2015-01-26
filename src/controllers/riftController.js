
goog.require('glam.Prefabs');

glam.Prefabs.RiftController = function(param)
{
	param = param || {};
	
	var controller = new glam.Object(param);
	var controllerScript = new glam.RiftControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new glam.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);

	return controller;
}

goog.provide('glam.RiftControllerScript');
goog.require('glam.Script');

glam.RiftControllerScript = function(param)
{
	glam.Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this.riftControls = null;

	this._headlightOn = param.headlight;
	
	this.cameraDir = new THREE.Vector3;
	
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
    });
}

goog.inherits(glam.RiftControllerScript, glam.Script);

glam.RiftControllerScript.prototype.realize = function()
{
	this.headlight = this._object.getComponent(glam.DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

glam.RiftControllerScript.prototype.update = function()
{
	if (this._enabled && this.riftControls) {
		this.riftControls.update();
	}
	
	if (this._headlightOn)
	{
		this.cameraDir.set(0, 0, -1);
		this.cameraDir.transformDirection(this.camera.object.matrixWorld);
		
		this.headlight.direction.copy(this.cameraDir);
	}	
}

glam.RiftControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
}

glam.RiftControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.riftControls = this.createControls(camera);
}

glam.RiftControllerScript.prototype.createControls = function(camera)
{
	var controls = new THREE.VRControls(camera.object, function(err) {
			if (err) {
				console.log("Error creating VR controller: ", err);
			}
		});

	// N.B.: this only works because the callback up there is synchronous...
	return controls;
}


