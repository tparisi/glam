goog.provide('glam.ParticleSystemScript');
goog.require('glam.Script');
goog.require('glam.ParticleEmitter');

glam.ParticleSystem = function(param) {

	param = param || {};
	
	var obj = new glam.Object;

	var texture = param.texture || null;
	var maxAge = param.maxAge || glam.ParticleSystemScript.DEFAULT_MAX_AGE;

	var visual = null;
	if (param.geometry) {
		
		var color = (param.color !== undefined) ? param.color : glam.ParticleSystem.DEFAULT_COLOR;
		var material = new THREE.PointCloudMaterial({color:color, size:param.size, map:param.map,
			transparent: (param.map !== null), 
		    depthWrite: false,
			vertexColors: (param.geometry.colors.length > 0)});
		var ps = new THREE.PointCloud(param.geometry, material);
		ps.sortParticles = true;

		if (param.map)
			ps.sortParticles = true;
		
	    visual = new glam.Visual({object:ps});
	}
	else {
		
		var particleGroup = new ShaderParticleGroup({
	        texture: texture,
	        maxAge: maxAge,
	      });
		    
	    visual = new glam.Visual({object:particleGroup.mesh});
	}
	
    obj.addComponent(visual);
    
	param.particleGroup = particleGroup;
	
	var pScript = new glam.ParticleSystemScript(param);
	obj.addComponent(pScript);
	
	return obj;
}


glam.ParticleSystemScript = function(param) {
	glam.Script.call(this, param);

	this.particleGroup = param.particleGroup;
	
	this._active = true;
	
    Object.defineProperties(this, {
        active: {
	        get: function() {
	            return this._active;
	        },
	        set: function(v) {
	        	this.setActive(v);
	        }
    	},
    });

}

goog.inherits(glam.ParticleSystemScript, glam.Script);

glam.ParticleSystemScript.prototype.realize = function()
{
    this.initEmitters();

}

glam.ParticleSystemScript.prototype.initEmitters = function() {
	
	var emitters = this._object.getComponents(glam.ParticleEmitter);
	
	var i = 0, len = emitters.length;
	
    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	this.particleGroup.addEmitter(emitter.object);
    	emitter.active = this._active;
    }
    
    this.emitters = emitters;
}

glam.ParticleSystemScript.prototype.setActive = function(active) {

	var emitters = this.emitters;
	if (!emitters)
		return;
	
	var i = 0, len = emitters.length;
	
    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	emitter.active = active;
    }

    this._active = active;
}

glam.ParticleSystemScript.prototype.update = function() {
	if (this.particleGroup) {
		this.particleGroup.tick();
	}
}

glam.ParticleSystem.DEFAULT_COLOR = 0xffffff;
glam.ParticleSystemScript.DEFAULT_MAX_AGE = 1;

