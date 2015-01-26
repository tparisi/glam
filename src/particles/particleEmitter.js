goog.provide('glam.ParticleEmitter');
goog.require('glam.Component');

glam.ParticleEmitter = function(param) {
	this.param = param || {};
	
	glam.Component.call(this, param);

	var size = this.param.size || glam.ParticleEmitter.DEFAULT_SIZE;
	var sizeEnd = this.param.sizeEnd || glam.ParticleEmitter.DEFAULT_SIZE_END;
	var colorStart = this.param.colorStart || glam.ParticleEmitter.DEFAULT_COLOR_START;
	var colorEnd = this.param.colorEnd || glam.ParticleEmitter.DEFAULT_COLOR_END;
	var particlesPerSecond = this.param.particlesPerSecond || glam.ParticleEmitter.DEFAULT_PARTICLES_PER_SECOND;
	var opacityStart = this.param.opacityStart || glam.ParticleEmitter.DEFAULT_OPACITY_START;
	var opacityMiddle = this.param.opacityMiddle || glam.ParticleEmitter.DEFAULT_OPACITY_MIDDLE;
	var opacityEnd = this.param.opacityEnd || glam.ParticleEmitter.DEFAULT_OPACITY_END;
	var velocity = this.param.velocity || glam.ParticleEmitter.DEFAULT_VELOCITY;
	var acceleration = this.param.acceleration || glam.ParticleEmitter.DEFAULT_ACCELERATION;
	var positionSpread = this.param.positionSpread || glam.ParticleEmitter.DEFAULT_POSITION_SPREAD;
	var accelerationSpread = this.param.accelerationSpread || glam.ParticleEmitter.DEFAULT_ACCELERATION_SPREAD;
	var blending = this.param.blending || glam.ParticleEmitter.DEFAULT_BLENDING;

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

goog.inherits(glam.ParticleEmitter, glam.Component);

glam.ParticleEmitter.prototype.realize = function() {

}

glam.ParticleEmitter.prototype.update = function() {

}

glam.ParticleEmitter.prototype.setActive = function(active) {

    this._active = active;
    
    if (this._active) {
    	this.object.enable();
    }
    else {
    	this.object.disable();
    }
}

glam.ParticleEmitter.DEFAULT_SIZE = 1;
glam.ParticleEmitter.DEFAULT_SIZE_END = 1;
glam.ParticleEmitter.DEFAULT_COLOR_START = new THREE.Color;
glam.ParticleEmitter.DEFAULT_COLOR_END = new THREE.Color;
glam.ParticleEmitter.DEFAULT_PARTICLES_PER_SECOND = 10;
glam.ParticleEmitter.DEFAULT_OPACITY_START = 0.1;
glam.ParticleEmitter.DEFAULT_OPACITY_MIDDLE = 0.5;
glam.ParticleEmitter.DEFAULT_OPACITY_END = 0.0;
glam.ParticleEmitter.DEFAULT_VELOCITY = new THREE.Vector3(0, 10, 0);
glam.ParticleEmitter.DEFAULT_ACCELERATION = new THREE.Vector3(0, 1, 0);
glam.ParticleEmitter.DEFAULT_POSITION_SPREAD = new THREE.Vector3(0, 0, 0);
glam.ParticleEmitter.DEFAULT_ACCELERATION_SPREAD = new THREE.Vector3(0, 1, 0);
glam.ParticleEmitter.DEFAULT_BLENDING = THREE.NoBlending;


