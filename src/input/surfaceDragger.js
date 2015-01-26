/**
 * @fileoverview Picker component - get drag for an object along the surface of a reference object
 * 
 * @author Tony Parisi
 */

goog.provide('glam.SurfaceDragger');
goog.require('glam.Picker');

glam.SurfaceDragger = function(param) {
	
	param = param || {};
	
    glam.Picker.call(this, param);
    
    this.reference = param.reference;
	this.dragPlane = new THREE.Plane();
}

goog.inherits(glam.SurfaceDragger, glam.Picker);

glam.SurfaceDragger.prototype.realize = function()
{
	glam.Picker.prototype.realize.call(this);

}

glam.SurfaceDragger.prototype.update = function()
{
}

glam.SurfaceDragger.prototype.onMouseDown = function(event)
{
	glam.Picker.prototype.onMouseDown.call(this, event);
	
	var visual = this.reference.visuals[0];
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, visual.object);
	if (intersection) {

		var hitpoint = intersection.point.clone();
		this.dragOffset = event.point.clone().sub(this._object.transform.position);
        this.dispatchEvent("dragstart", {
            type : "dragstart",
            offset : hitpoint
        });
	}

}

glam.SurfaceDragger.prototype.onMouseUp = function(event) {
	glam.Picker.prototype.onMouseUp.call(this, event);
    this.dispatchEvent("dragend", {
        type : "dragend",
    });
}

glam.SurfaceDragger.prototype.onMouseMove = function(event)
{
	glam.Picker.prototype.onMouseMove.call(this, event);
	
	var visual = this.reference.visuals[0];
	var intersection = glam.Graphics.instance.getObjectIntersection(event.elementX, event.elementY, visual.object);
	
	if (intersection) {
		var hitpoint = intersection.point.clone();
		var hitnormal = intersection.face.normal.clone();
		var verts = visual.geometry.vertices;
		var v1 = verts[intersection.face.a];
		var v2 = verts[intersection.face.b];
		var v3 = verts[intersection.face.c];

		this.dragPlane = new THREE.Plane().setFromCoplanarPoints(v1, v2, v3);

		//var projectedPoint = hitpoint.clone();
		//projectedPoint.sub(this.dragOffset);
		var offset = hitpoint.clone();; // .sub(this.dragOffset);
		var vec = offset.clone().add(hitnormal);
		var up = new THREE.Vector3(0, hitnormal.z, -hitnormal.y).normalize();
		if (!up.lengthSq())
			up.set(0, hitnormal.x, hitnormal.y).normalize();
		if (hitnormal.x < 0 || hitnormal.z < 0)
			up.negate();
		
		this.dispatchEvent("drag", {
				type : "drag", 
				offset : offset,
				normal : hitnormal,
				up : up,
				lookAt : vec
			}
		);
		
	}
}



