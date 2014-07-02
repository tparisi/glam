goog.provide('Vizi.ParticleEmitter');
goog.require('Vizi.Component');

Vizi.ParticleEmitter = function(param) {
	this.param = param || {};
	
	Vizi.Component.call(this, param);

	var size = this.param.size || Vizi.ParticleEmitter.DEFAULT_SIZE;
	var sizeEnd = this.param.sizeEnd || Vizi.ParticleEmitter.DEFAULT_SIZE_END;
	var colorStart = this.param.colorStart || Vizi.ParticleEmitter.DEFAULT_COLOR_START;
	var colorEnd = this.param.colorEnd || Vizi.ParticleEmitter.DEFAULT_COLOR_END;
	var particlesPerSecond = this.param.particlesPerSecond || Vizi.ParticleEmitter.DEFAULT_PARTICLES_PER_SECOND;
	var opacityStart = this.param.opacityStart || Vizi.ParticleEmitter.DEFAULT_OPACITY_START;
	var opacityMiddle = this.param.opacityMiddle || Vizi.ParticleEmitter.DEFAULT_OPACITY_MIDDLE;
	var opacityEnd = this.param.opacityEnd || Vizi.ParticleEmitter.DEFAULT_OPACITY_END;
	var velocity = this.param.velocity || Vizi.ParticleEmitter.DEFAULT_VELOCITY;
	var acceleration = this.param.acceleration || Vizi.ParticleEmitter.DEFAULT_ACCELERATION;
	var positionSpread = this.param.positionSpread || Vizi.ParticleEmitter.DEFAULT_POSITION_SPREAD;
	var accelerationSpread = this.param.accelerationSpread || Vizi.ParticleEmitter.DEFAULT_ACCELERATION_SPREAD;
	var blending = this.param.blending || Vizi.ParticleEmitter.DEFAULT_BLENDING;

	this._active = false;

	this.object = new ShaderParticleEmitter({
		size: size,
        sizeEnd: sizeEnd,
        colorStart: colorStart,
        colorEnd: colorEnd,
        particlesPerSecond: particlesPerSecond,
        opacityStart: opacityStart,
        opacityMiddle: opacityMiddle,
        opacityEnd: opacityEnd,
        velocity: velocity,
        acceleration: acceleration,
        positionSpread: positionSpread,
        accelerationSpread: accelerationSpread,
        blending: blending,
      });
	
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

goog.inherits(Vizi.ParticleEmitter, Vizi.Component);

Vizi.ParticleEmitter.prototype.realize = function() {

}

Vizi.ParticleEmitter.prototype.update = function() {

}

Vizi.ParticleEmitter.prototype.setActive = function(active) {

    this._active = active;
    
    if (this._active) {
    	this.object.enable();
    }
    else {
    	this.object.disable();
    }
}

Vizi.ParticleEmitter.DEFAULT_SIZE = 1;
Vizi.ParticleEmitter.DEFAULT_SIZE_END = 1;
Vizi.ParticleEmitter.DEFAULT_COLOR_START = new THREE.Color;
Vizi.ParticleEmitter.DEFAULT_COLOR_END = new THREE.Color;
Vizi.ParticleEmitter.DEFAULT_PARTICLES_PER_SECOND = 10;
Vizi.ParticleEmitter.DEFAULT_OPACITY_START = 0.1;
Vizi.ParticleEmitter.DEFAULT_OPACITY_MIDDLE = 0.5;
Vizi.ParticleEmitter.DEFAULT_OPACITY_END = 0.0;
Vizi.ParticleEmitter.DEFAULT_VELOCITY = new THREE.Vector3(0, 10, 0);
Vizi.ParticleEmitter.DEFAULT_ACCELERATION = new THREE.Vector3(0, 1, 0);
Vizi.ParticleEmitter.DEFAULT_POSITION_SPREAD = new THREE.Vector3(0, 0, 0);
Vizi.ParticleEmitter.DEFAULT_ACCELERATION_SPREAD = new THREE.Vector3(0, 1, 0);
Vizi.ParticleEmitter.DEFAULT_BLENDING = THREE.NoBlending;


