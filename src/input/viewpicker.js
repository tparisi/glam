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

	this.origin = new THREE.Vector3();
	this.direction = new THREE.Vector3();
	this.raycaster = new THREE.Raycaster();

	this.over = false;
}

goog.inherits(glam.ViewPicker, glam.Component);

glam.ViewPicker.prototype._componentCategory = "pickers";

glam.ViewPicker.prototype.realize = function() {
	glam.Component.prototype.realize.call(this);
}

glam.ViewPicker.prototype.update = function() {

	var intersected = this.checkForIntersections();

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

glam.ViewPicker.prototype.checkForIntersections = function() {

	this.origin.set(0, 0, 0);
	this.origin.applyMatrix4(glam.Graphics.instance.camera.matrixWorld);
	this.direction.set(0, 0, -1);
	this.direction.transformDirection(glam.Graphics.instance.camera.matrixWorld);

	this.raycaster.set(this.origin, this.direction);
	this.raycaster.near = glam.Graphics.instance.camera.near;
	this.raycaster.far = glam.Graphics.instance.camera.far;

	var intersected = this.raycaster.intersectObjects(this._object.transform.object.children, true);

	return (intersected.length > 0);
}

glam.ViewPicker.prototype.onViewOver = function() {
    this.dispatchEvent("viewover", { type : "viewover" });
    glam.ViewPicker.overObject = this;
}

glam.ViewPicker.prototype.onViewOut = function() {
    this.dispatchEvent("viewout", { type : "viewout" });
    glam.ViewPicker.overObject = null;
}

glam.ViewPicker.prototype.onViewMouseDown = function() {
    this.dispatchEvent("mousedown", { type : "mousedown" });
}

glam.ViewPicker.prototype.onViewMouseUp = function() {
    this.dispatchEvent("mouseup", { type : "mouseup" });
}

glam.ViewPicker.prototype.onViewMouseClick = function() {
    this.dispatchEvent("click", { type : "click" });
}

glam.ViewPicker.handleMouseDown = function(event) {
    glam.ViewPicker.clickedObject = glam.ViewPicker.overObject;
    if (glam.ViewPicker.clickedObject) {
    	glam.ViewPicker.clickedObject.onViewMouseDown();
    }
}

glam.ViewPicker.handleMouseUp = function(event) {
    if (glam.ViewPicker.clickedObject) {
    	glam.ViewPicker.clickedObject.onViewMouseUp();
    	glam.ViewPicker.clickedObject.onViewMouseClick();
    }

    glam.ViewPicker.clickedObject = null;
}

glam.ViewPicker.overObject = null;
glam.ViewPicker.clickedObject = null;
