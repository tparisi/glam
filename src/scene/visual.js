/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('glam.Visual');
goog.require('glam.SceneComponent');

/**
 * @constructor
 */
glam.Visual = function(param)
{
	param = param || {};
	
	glam.SceneComponent.call(this, param);

	if (param.object) {
		this.object = param.object;
		this.geometry = this.object.geometry;
		this.material = this.object.material;
	}
	else {
		this.geometry = param.geometry;
		this.material = param.material;
	}
}

goog.inherits(glam.Visual, glam.SceneComponent);

// We're going to let this slide until we figure out the glTF mulit-material mesh
//glam.Visual.prototype._componentProperty = "visual";
//glam.Visual.prototype._componentPropertyType = "Visual";
glam.Visual.prototype._componentCategory = "visuals";

glam.Visual.prototype.realize = function()
{
	glam.SceneComponent.prototype.realize.call(this);
	
	if (!this.object && this.geometry && this.material) {
		this.object = new THREE.Mesh(this.geometry, this.material);
		this.object.ignorePick = false;
	    this.addToScene();
	}	
}

