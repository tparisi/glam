goog.provide('glam.Camera');
goog.require('glam.SceneComponent');

glam.Camera = function(param)
{
	param = param || {};
	
	glam.SceneComponent.call(this, param);

    // Accessors
    Object.defineProperties(this, {
        active: {
	        get: function() {
	            return this._active;
	        },
	        set: function(v) {
	        	this._active = v;
	        	// N.B.: trying this out for now... TP
	        	if (/*this._realized && */ this._active)
	        	{
	        		glam.CameraManager.setActiveCamera(this);
	        	}
	        }
    	},    	

    });
	
	this._active = param.active || false;
	var position = param.position || glam.Camera.DEFAULT_POSITION;
    //this.position.copy(position);	
}

goog.inherits(glam.Camera, glam.SceneComponent);

glam.Camera.prototype._componentProperty = "camera";
glam.Camera.prototype._componentPropertyType = "Camera";

glam.Camera.prototype.realize = function() 
{
	glam.SceneComponent.prototype.realize.call(this);
	
	this.addToScene();
	
	glam.CameraManager.addCamera(this);
	
	if (this._active && !glam.CameraManager.activeCamera)
	{
		glam.CameraManager.setActiveCamera(this);
	}
}

glam.Camera.prototype.lookAt = function(v) 
{
	this.object.lookAt(v);
}

glam.Camera.DEFAULT_POSITION = new THREE.Vector3(0, 0, 0);
glam.Camera.DEFAULT_NEAR = 1;
glam.Camera.DEFAULT_FAR = 10000;
