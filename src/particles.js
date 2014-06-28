glam.Particles = {};

glam.Particles.create = function(docelt) {

	var style = glam.Node.getStyle(docelt);
	
	var param = {};
	glam.Particles.getAttributes(docelt, style, param);
	

	/*
	var size = this.param.size || 20;
	var sizeEnd = this.param.sizeEnd || 10;
	var colorStart = this.param.colorStart || new THREE.Color(1, 1, 0);
	var colorEnd = this.param.colorEnd || new THREE.Color(0, 1, 0);
	var particlesPerSecond = this.param.particlesPerSecond || 50;
	var opacityStart = this.param.opacityStart || 0.2;
	var opacityMiddle = this.param.opacityMiddle || 0.4;
	var opacityEnd = this.param.opacityEnd || 0.0;
	        acceleration: new THREE.Vector3(0, 3, 0),
	        velocity: new THREE.Vector3(0, 10, 0),
	        accelerationSpread: new THREE.Vector3(3, 1, 3)

	*/

	var ps = Vizi.ParticleSystem(param);

	var pscript = ps.getComponent(Vizi.ParticleSystemScript);
	
	glam.Particles.initParticleSystem(docelt, ps, param);
	
	pscript.active = true;
	return ps;
}

glam.Particles.getAttributes = function(docelt, style, param) {
	param.texture = THREE.ImageUtils.loadTexture('../images/smokeparticle.png');
	param.maxAge = 5;
}

glam.Particles.initParticleSystem = function(docelt, ps, param) {
	var emitters = docelt.getElementsByTagName('emitter');
	if (emitters) {
		var i, len = emitters.length;
		for (i = 0; i < len; i++) {
			
			var eparam = {
			};
			
			var emitter = emitters[0];
			if (emitter) {
				glam.Particles.parseEmitter(emitter, eparam);

				var pe = new Vizi.ParticleEmitter(eparam);
				ps.addComponent(pe);
			}
		}
	}
}

glam.Particles.parseEmitter = function(emitter, param) {
	param.size = 20,
	param.sizeEnd = 10,
	param.colorStart = new THREE.Color(1, 1, 0),
	param.colorEnd = new THREE.Color(0, 1, 0),
	param.particlesPerSecond = 50,
	param.opacityStart = 0.2,
	param.opacityMiddle = 0.4,
	param.opacityEnd = 0.0,
	param.acceleration = new THREE.Vector3(0, 3, 0),
	param.velocity = new THREE.Vector3(0, 10, 0),
	param.accelerationSpread = new THREE.Vector3(3, 1, 3)
}
