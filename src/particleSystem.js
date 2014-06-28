goog.provide('glam.ParticleSystemScript');
goog.require('Vizi.Script');

glam.ParticleSystemPrefab = function(param) {

	param = param || {};
	
	var obj = new Vizi.Object;

	var pScript = new glam.ParticleSystemScript();
	obj.addComponent(pScript);
	
	var emitter = new glam.ParticleEmitter();
	obj.addComponent(emitter);
	
	return obj;
}


glam.ParticleSystemScript = function(param) {
	Vizi.Script.call(this, param);

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

goog.inherits(glam.ParticleSystemScript, Vizi.Script);

glam.ParticleSystemScript.prototype.realize = function()
{
	var texture = null;
	var maxAge = 5;

	texture = THREE.ImageUtils.loadTexture('../images/smokeparticle.png');
	
    this.particleGroup = new ShaderParticleGroup({
        texture: texture,
        maxAge: maxAge,
      });
    
    this.initEmitters();

    var obj = new Vizi.Object;
    var visual = new Vizi.Visual({object:this.particleGroup.mesh});
    obj.addComponent(visual);
    this._object.addChild(obj);

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
    return this.particleGroup.tick();
}
