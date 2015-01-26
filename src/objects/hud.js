/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('glam.Prefabs');

glam.Prefabs.HUD = function(param) {

	param = param || {};
	
	var hud = new glam.Object();

	var hudScript = new glam.HUDScript(param);
	hud.addComponent(hudScript);
	
	return hud;
}

goog.provide('glam.HUDScript');
goog.require('glam.Script');

glam.HUDScript = function(param) {
	
	glam.Script.call(this, param);

	this.zDistance = (param.zDistance !== undefined) ? param.zDistance : glam.HUDScript.DEFAULT_Z_DISTANCE;
	this.position = new THREE.Vector3(0, 0, -this.zDistance);
	this.savedPosition = this.position.clone();
	this.scale = new THREE.Vector3;
	this.quaternion = new THREE.Quaternion;
}

goog.inherits(glam.HUDScript, glam.Script);

glam.HUDScript.prototype.realize = function() {
}

glam.HUDScript.EPSILON = 0.001;

glam.HUDScript.prototype.update = function() {
	
	var cam = glam.Graphics.instance.camera;
	
	cam.updateMatrixWorld();
	
	cam.matrixWorld.decompose(this.position, this.quaternion, this.scale);
	
	this._object.transform.quaternion.copy(this.quaternion);
	this._object.transform.position.copy(this.position);
	this._object.transform.translateZ(-this.zDistance);
	
	if (this.savedPosition.distanceTo(this.position) > glam.HUDScript.EPSILON) {
		console.log("Position changed:", this.position)
	}
	
	this.savedPosition.copy(this.position);
}

glam.HUDScript.DEFAULT_Z_DISTANCE = 1;

