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
}

goog.inherits(glam.ViewPicker, glam.Component);

glam.ViewPicker.prototype._componentCategory = "viewpickers";

glam.ViewPicker.prototype.realize = function() {
	glam.Component.prototype.realize.call(this);
}

glam.ViewPicker.prototype.onViewOver = function() {
    this.dispatchEvent("viewover", { type : "viewover" });
}

glam.ViewPicker.prototype.onViewOut = function() {
    this.dispatchEvent("viewout", { type : "viewout" });
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

glam.ViewPicker.update = function() {

    var oldObj = glam.ViewPicker.overObject;
	glam.ViewPicker.overObject = glam.ViewPicker.objectFromView();

    if (glam.ViewPicker.overObject != oldObj) {
    	if (oldObj) {
    		oldObj.onViewOut();
    	}

    	if (glam.ViewPicker.overObject) {
    		glam.ViewPicker.overObject.onViewOver();
    	}
	}
}

glam.ViewPicker.objectFromView = function(event)
{
	this.origin.set(0, 0, 0);
	this.origin.applyMatrix4(glam.Graphics.instance.camera.matrixWorld);
	this.direction.set(0, 0, -1);
	this.direction.transformDirection(glam.Graphics.instance.camera.matrixWorld);

	this.raycaster.set(this.origin, this.direction);
	this.raycaster.near = glam.Graphics.instance.camera.near;
	this.raycaster.far = glam.Graphics.instance.camera.far;

	var intersects = this.raycaster.intersectObjects(glam.Graphics.instance.scene.children, 
		true);

    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(i < intersects.length && (!intersects[i].object.visible))
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
	}

	if (intersected && intersected.object)
	{
		var obj = glam.ViewPicker.findObjectFromIntersected(intersected.object);

    	if (obj.viewpickers)
    	{
    		var pickers = obj.viewpickers;
    		var i, len = pickers.length;
    		for (i = 0; i < len; i++) {
    			if (pickers[i].enabled) { // just need one :-)
    				return pickers[i]; // intersected.data._object;
    			}
    		}
    	}

		return glam.ViewPicker.findObjectPicker(intersected.object);
	}
	else
	{
		return null;
	}
}

glam.ViewPicker.findObjectFromIntersected = function(object) {
	if (object.data) {
		return object.data;
	}
	else if (object.parent) {
		return glam.ViewPicker.findObjectFromIntersected(object.parent);
	}
	else {
		return null;
	}
}

glam.ViewPicker.findObjectPicker = function(object) {
	while (object) {
		
		if (object.data && object.data._object.viewpickers) {
    		var pickers = object.data._object.viewpickers;
    		var i, len = pickers.length;
    		for (i = 0; i < len; i++) {
    			if (pickers[i].enabled) { // just need one :-)
    				return pickers[i]; // object.data._object;
    			}
    		}
		}

		object = object.parent;
	}
	
	return null;
}


glam.ViewPicker.origin = new THREE.Vector3();
glam.ViewPicker.direction = new THREE.Vector3();
glam.ViewPicker.raycaster = new THREE.Raycaster();

glam.ViewPicker.overObject = null;
glam.ViewPicker.clickedObject = null;
