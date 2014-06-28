goog.provide('Vizi.ParticleSystemScript');
goog.require('Vizi.Script');

Vizi.ParticleSystem = function(param) {

	param = param || {};
	
	var obj = new Vizi.Object;

	var pScript = new Vizi.ParticleSystemScript(param);
	obj.addComponent(pScript);
	
	return obj;
}


Vizi.ParticleSystemScript = function(param) {
	Vizi.Script.call(this, param);

	this.texture = param.texture || null;
	this.maxAge = param.maxAge || Vizi.ParticleSystemScript.DEFAULT_MAX_AGE;
	
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

goog.inherits(Vizi.ParticleSystemScript, Vizi.Script);

Vizi.ParticleSystemScript.prototype.realize = function()
{
    this.particleGroup = new ShaderParticleGroup({
        texture: this.texture,
        maxAge: this.maxAge,
      });
    
    this.initEmitters();

    var obj = new Vizi.Object;
    var visual = new Vizi.Visual({object:this.particleGroup.mesh});
    obj.addComponent(visual);
    this._object.addChild(obj);

}

Vizi.ParticleSystemScript.prototype.initEmitters = function() {
	
	var emitters = this._object.getComponents(Vizi.ParticleEmitter);
	
	var i = 0, len = emitters.length;
	
    for (i = 0; i < len; i++) {
    	var emitter = emitters[i];
    	this.particleGroup.addEmitter(emitter.object);
    	emitter.active = this._active;
    }
    
    this.emitters = emitters;
}

Vizi.ParticleSystemScript.prototype.setActive = function(active) {

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

Vizi.ParticleSystemScript.prototype.update = function() {
    return this.particleGroup.tick();
}

Vizi.ParticleSystemScript.DEFAULT_MAX_AGE = 1;

