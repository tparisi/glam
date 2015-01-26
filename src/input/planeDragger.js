/**
 * @fileoverview Picker component - add one to get picking support on your object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.PlaneDragger');
goog.require('glam.Picker');

glam.PlaneDragger = function(param) {
	
	param = param || {};
	
    glam.Picker.call(this, param);
    
    this.normal = param.normal || new THREE.Vector3(0, 0, 1);
    this.position = param.position || new THREE.Vector3;
    this.color = 0x0000aa;
}

goog.inherits(glam.PlaneDragger, glam.Picker);

glam.PlaneDragger.prototype.realize = function()
{
	glam.Picker.prototype.realize.call(this);

    // And some helpers
    this.dragObject = null;
	this.dragOffset = new THREE.Vector3;
	this.dragHitPoint = new THREE.Vector3;
	this.dragStartPoint = new THREE.Vector3;
	this.dragPlane = this.createDragPlane();
	this.dragPlane.visible = glam.PlaneDragger.SHOW_DRAG_PLANE;
	this.dragPlane.ignorePick = true;
	this.dragPlane.ignoreBounds = true;
	this._object._parent.transform.object.add(this.dragPlane);
}

glam.PlaneDragger.prototype.createDragPlane = function() {

	var size = 2000;
	var normal = this.normal;
	var position = this.position;
	
	var u = new THREE.Vector3(0, normal.z, -normal.y).normalize().multiplyScalar(size);
	if (!u.lengthSq())
		u = new THREE.Vector3(-normal.z, normal.x, 0).normalize().multiplyScalar(size);

	var v = u.clone().cross(normal).normalize().multiplyScalar(size);
	
	var p1 = position.clone().sub(u).sub(v);
	var p2 = position.clone().add(u).sub(v);
	var p3 = position.clone().add(u).add(v);
	var p4 = position.clone().sub(u).add(v);
	
	var planegeom = new THREE.Geometry();
	planegeom.vertices.push(p1, p2, p3, p4); 
	var planeface = new THREE.Face3( 0, 2, 1 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	var planeface = new THREE.Face3( 0, 3, 2 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	planegeom.computeFaceNormals();

	var mat = new THREE.MeshBasicMaterial({color:this.color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	return mesh;
}

glam.PlaneDragger.prototype.update = function() {
}

glam.PlaneDragger.prototype.onMouseMove = function(event) {
	glam.Picker.prototype.onMouseMove.call(this, event);
	this.handleMouseMove(event);
}

glam.PlaneDragger.prototype.handleMouseMove = function(event) {
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
	if (intersection)
	{
		this.dragHitPoint.copy(intersection.point).sub(this.dragOffset);
		this.dragHitPoint.add(this.dragStartPoint);
		this.dispatchEvent("drag", {
									type : "drag", 
									object : this.dragObject, 
									offset : this.dragHitPoint
									}
		);
	}
}

glam.PlaneDragger.prototype.onMouseDown = function(event) {
	glam.Picker.prototype.onMouseDown.call(this, event);
	this.handleMouseDown(event);
}

glam.PlaneDragger.prototype.handleMouseDown = function(event) {
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, this.dragPlane);
	
	if (intersection)
	{
		this.dragOffset.copy(intersection.point);
		this.dragStartPoint.copy(event.object.position);
		this.dragHitPoint.copy(intersection.point).sub(this.dragOffset);
		this.dragHitPoint.add(this.dragStartPoint);
		this.dragObject = event.object;
		this.dispatchEvent("dragstart", {
			type : "dragstart", 
			object : this.dragObject, 
			offset : this.dragHitPoint
			}
);
	}
}

glam.PlaneDragger.prototype.onMouseUp = function(event) {
	glam.Picker.prototype.onMouseUp.call(this, event);
	this.handleMouseUp(event);
}

glam.PlaneDragger.prototype.handleMouseUp = function(event) {
}


glam.PlaneDragger.prototype.onTouchStart = function(event) {
	glam.Picker.prototype.onTouchStart.call(this, event);

	this.handleMouseDown(event);
}

glam.PlaneDragger.prototype.onTouchMove = function(event) {
	glam.Picker.prototype.onTouchMove.call(this, event);

	this.handleMouseMove(event);
}

glam.PlaneDragger.prototype.onTouchEnd = function(event) {
	glam.Picker.prototype.onTouchEnd.call(this, event);

	this.handleMouseUp(event);
}

glam.PlaneDragger.SHOW_DRAG_PLANE = false;
glam.PlaneDragger.SHOW_DRAG_NORMAL = false;