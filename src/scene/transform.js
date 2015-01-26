/**
 *
 */
goog.provide('glam.Transform');
goog.require('glam.SceneComponent');

glam.Transform = function(param) {
	param = param || {};
    glam.SceneComponent.call(this, param);

    if (param.object) {
		this.object = param.object;    	
    }
    else {
    	this.object = new THREE.Object3D();
    }
}

goog.inherits(glam.Transform, glam.SceneComponent);

glam.Transform.prototype._componentProperty = "transform";
glam.Transform.prototype._componentPropertyType = "Transform";

glam.Transform.prototype.addToScene = function() {
	var scene = this.layer ? this.layer.scene : glam.Graphics.instance.scene;
	if (this._object)
	{
		var parent = (this._object._parent && this._object._parent.transform) ? this._object._parent.transform.object : scene;
		if (parent)
		{
		    parent.add(this.object);
		    this.object.data = this; // backpointer for picking and such
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
}

glam.Transform.prototype.removeFromScene = function() {
	var scene = this.layer ? this.layer.scene : glam.Graphics.instance.scene;
	if (this._object)
	{
		var parent = (this._object._parent && this._object._parent.transform) ? this._object._parent.transform.object : scene;
		if (parent)
		{
			this.object.data = null;
		    parent.remove(this.object);
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
}
