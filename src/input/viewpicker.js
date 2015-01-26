/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ViewPicker');
goog.require('glam.Component');

glam.ViewPicker = function(param) {
	param = param || {};
	
    glam.Component.call(this, param);

    this.enabled = (param.enabled !== undefined) ? param.enabled : true;

	this.position = new THREE.Vector3();
	this.mouse = new THREE.Vector3(0,0, 1);
	this.unprojectedMouse = new THREE.Vector3();

	this.raycaster = new THREE.Raycaster();
	this.projector = new THREE.Projector();

	this.over = false;
}

goog.inherits(glam.ViewPicker, glam.Component);

glam.ViewPicker.prototype._componentCategory = "pickers";

glam.ViewPicker.prototype.realize = function() {
	glam.Component.prototype.realize.call(this);
}

glam.ViewPicker.prototype.update = function() {

	this.unprojectMouse();
	var intersected = this.checkForIntersections(this.unprojectedMouse);

	if (intersected != this.over) {
		this.over = intersected;
		if (this.over) {
			this.onViewOver();
		}
		else {
			this.onViewOut();
		}
	}
}

glam.ViewPicker.prototype.unprojectMouse = function() {

	this.unprojectedMouse.copy(this.mouse);
	this.projector.unprojectVector(this.unprojectedMouse, glam.Graphics.instance.camera);
}

glam.ViewPicker.prototype.checkForIntersections = function(position) {

	var origin = position;
	var direction = origin.clone()
	var pos = new THREE.Vector3();
	pos.applyMatrix4(glam.Graphics.instance.camera.matrixWorld);
	direction.sub(pos);
	direction.normalize();

	this.raycaster.set(pos, direction);
	this.raycaster.near = glam.Graphics.instance.camera.near;
	this.raycaster.far = glam.Graphics.instance.camera.far;

	var intersected = this.raycaster.intersectObjects(this._object.transform.object.children);

	return (intersected.length > 0);
}

glam.ViewPicker.prototype.onViewOver = function() {
    this.dispatchEvent("viewover", { type : "viewover" });
}

glam.ViewPicker.prototype.onViewOut = function() {
    this.dispatchEvent("viewout", { type : "viewout" });
}

