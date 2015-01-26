/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Picker');
goog.require('glam.Component');

glam.Picker = function(param) {
	param = param || {};
	
    glam.Component.call(this, param);
    this.overCursor = param.overCursor;
    this.enabled = (param.enabled !== undefined) ? param.enabled : true;
}

goog.inherits(glam.Picker, glam.Component);

glam.Picker.prototype._componentCategory = "pickers";

glam.Picker.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	
    this.lastHitPoint = new THREE.Vector3;
    this.lastHitNormal = new THREE.Vector3;
    this.lastHitFace = new THREE.Face3;
}

glam.Picker.prototype.update = function()
{
}

glam.Picker.prototype.toModelSpace = function(vec)
{
	var modelMat = new THREE.Matrix4;
	modelMat.getInverse(this._object.transform.object.matrixWorld);
	vec.applyMatrix4(modelMat);
}

glam.Picker.prototype.onMouseOver = function(event)
{
    this.dispatchEvent("mouseover", event);
}

glam.Picker.prototype.onMouseOut = function(event)
{
    this.dispatchEvent("mouseout", event);
}
	        	        
glam.Picker.prototype.onMouseMove = function(event)
{
	var mouseOverObject = glam.PickManager.objectFromMouse(event);
	if (this._object == glam.PickManager.clickedObject || this._object == mouseOverObject)
	{
		if (event.point)
			this.lastHitPoint.copy(event.point);
		if (event.normal)
			this.lastHitNormal.copy(event.normal);
		if (event.face)
			this.lastHitFace = event.face;

		if (event.point) {
			this.dispatchEvent("mousemove", event);
		}
	}
}

glam.Picker.prototype.onMouseDown = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;
	
    this.dispatchEvent("mousedown", event);
}

glam.Picker.prototype.onMouseUp = function(event)
{
	var mouseOverObject = glam.PickManager.objectFromMouse(event);
	if (mouseOverObject != this._object)
	{
		event.point = this.lastHitPoint;
		event.normal = this.lastHitNormal;
		event.face = this.lastHitNormal;
		this.dispatchEvent("mouseout", event);
	}

	this.dispatchEvent("mouseup", event);
}

glam.Picker.prototype.onMouseClick = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;

	this.dispatchEvent("click", event);
}
	        
glam.Picker.prototype.onMouseDoubleClick = function(event)
{
	this.lastHitPoint.copy(event.point);
	if (event.normal)
		this.lastHitNormal.copy(event.normal);
	if (event.face)
		this.lastHitFace = event.face;

	this.dispatchEvent("dblclick", event);
}
	
glam.Picker.prototype.onMouseScroll = function(event)
{
    this.dispatchEvent("mousescroll", event);
}

glam.Picker.prototype.onTouchMove = function(event)
{
	this.dispatchEvent("touchmove", event);
}

glam.Picker.prototype.onTouchStart = function(event)
{	
    this.dispatchEvent("touchstart", event);
}

glam.Picker.prototype.onTouchEnd = function(event)
{
	this.dispatchEvent("touchend", event);
}


