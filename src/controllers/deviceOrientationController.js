
//goog.provide('DeviceOrientationControllerScript');

module.exports = DeviceOrientationControllerScript;

// Object is already defined as a global, so we're gonna name it GlamObject to avoid conflict
var GlamObject = require("../core/object");
var Prefabs = require("../prefabs/prefabs");
var Script = require("../scripts/script");
var DirectionalLight = require("../lights/directionalLight");

ver util = require("util");

util.inherits(DeviceOrientationControllerScript, Script);

Prefabs.DeviceOrientationController = function(param)
{
	param = param || {};

	var controller = new GlamObject(param);
	var controllerScript = new DeviceOrientationControllerScript(param);
	controller.addComponent(controllerScript);

	var intensity = param.headlight ? 1 : 0;

	var headlight = new DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);

	return controller;
}

function DeviceOrientationControllerScript(param)
{
	Script.call(this, param);

	this._enabled = (param.enabled !== undefined) ? param.enabled : true;
	this._headlightOn = param.headlight;
	this.roll = (param.roll !== undefined) ? param.roll : true;

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


DeviceOrientationControllerScript.prototype.realize = function() {
	this.headlight = this._object.getComponent(DirectionalLight);
	this.headlight.intensity = this._headlightOn ? 1 : 0;
}

DeviceOrientationControllerScript.prototype.createControls = function(camera)
{
	var controls = new DeviceOrientationControlsCB(camera.object);

	if (this._enabled)
		controls.connect();

	controls.roll = this.roll;
	return controls;
}

DeviceOrientationControllerScript.prototype.update = function()
{
	if (this._enabled)
		this.controls.update();

	if (this._headlightOn)
	{
		this.headlight.direction.copy(this._camera.position).negate();
	}
}

DeviceOrientationControllerScript.prototype.setEnabled = function(enabled)
{
	this._enabled = enabled;
	if (this._enabled)
		this.controls.connect();
	else
		this.controls.disconnect();
}

DeviceOrientationControllerScript.prototype.setHeadlightOn = function(on)
{
	this._headlightOn = on;
	if (this.headlight) {
		this.headlight.intensity = on ? 1 : 0;
	}
}

DeviceOrientationControllerScript.prototype.setCamera = function(camera) {
	this._camera = camera;
	this.controls = this.createControls(camera);
}
