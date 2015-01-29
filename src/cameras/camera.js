// goog.provide('Camera');

module.exports = Camera;

var SceneComponent = require("../scene/sceneComponent");
var CameraManager = require("./cameraManager");
var util = require("util");

util.inherits(Camera, SceneComponent);

function Camera(param)
{
	param = param || {};

	SceneComponent.call(this, param);

	// Accessors
	Object.defineProperties(this, {
			active: {
				get: function() {
						return this._active;
				},
				set: function(v) {
					this._active = v;
					// N.B.: trying this out for now... TP
					if (/*this._realized && */ this._active)
					{
						CameraManager.setActiveCamera(this);
					}
				}
		},

	});

	this._active = param.active || false;
	var position = param.position || Camera.DEFAULT_POSITION;
	//this.position.copy(position);
}

Camera.prototype._componentProperty = "camera";
Camera.prototype._componentPropertyType = "Camera";

Camera.prototype.realize = function()
{
	SceneComponent.prototype.realize.call(this);

	this.addToScene();

	CameraManager.addCamera(this);

	if (this._active && !CameraManager.activeCamera)
	{
		CameraManager.setActiveCamera(this);
	}
}

Camera.prototype.lookAt = function(v)
{
	this.object.lookAt(v);
}

Camera.DEFAULT_POSITION = new THREE.Vector3(0, 0, 0);
Camera.DEFAULT_NEAR = 1;
Camera.DEFAULT_FAR = 10000;
