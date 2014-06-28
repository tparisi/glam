goog.provide('glam.ParticleEmitter');
goog.require('Vizi.Component');

glam.ParticleEmitter = function(param) {
	this.param = param || {};
	
	Vizi.Component.call(this, param);

	var size = this.param.size || 20;
	var sizeEnd = this.param.sizeEnd || 10;
	var colorStart = this.param.colorStart || new THREE.Color(1, 1, 0);
	var colorEnd = this.param.colorEnd || new THREE.Color(0, 1, 0);
	var particlesPerSecond = this.param.particlesPerSecond || 50;
	var opacityStart = this.param.opacityStart || 0.2;
	var opacityMiddle = this.param.opacityMiddle || 0.4;
	var opacityEnd = this.param.opacityEnd || 0.0;

	this._active = false;

	this.object = new ShaderParticleEmitter({
        positionSpread: new THREE.Vector3(4, 7, 4),
		size: size,
        sizeEnd: sizeEnd,
        colorStart: colorStart,
        colorEnd: colorEnd,
        particlesPerSecond: particlesPerSecond,
        opacityStart: opacityStart,
        opacityMiddle: opacityMiddle,
        opacityEnd: opacityEnd,
        acceleration: new THREE.Vector3(0, 3, 0),
        velocity: new THREE.Vector3(0, 10, 0),
        accelerationSpread: new THREE.Vector3(3, 1, 3)
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

goog.inherits(glam.ParticleEmitter, Vizi.Component);

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
