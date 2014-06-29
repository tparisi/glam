glam.Particles = {};

glam.Particles.create = function(docelt) {

	var style = glam.Node.getStyle(docelt);
	
	var mparam = glam.Material.parseStyle(style);
	
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

	param.texture = mparam.map;
	
	var ps = Vizi.ParticleSystem(param);

	var pscript = ps.getComponent(Vizi.ParticleSystemScript);
	
	glam.Particles.parseEmitters(docelt, ps);
	
	pscript.active = true;
	return ps;
}

glam.Particles.getAttributes = function(docelt, style, param) {
	var maxAge = docelt.getAttribute('maxAge') || glam.Particles.DEFAULT_MAX_AGE;
	param.maxAge = parseFloat(maxAge);
}

glam.Particles.parseEmitters = function(docelt, ps) {
	var emitters = docelt.getElementsByTagName('emitter');
	if (emitters) {
		var i, len = emitters.length;
		for (i = 0; i < len; i++) {
			
			var param = {
			};
			
			var emitter = emitters[0];
			if (emitter) {
				glam.Particles.parseEmitter(emitter, param);

				var pe = new Vizi.ParticleEmitter(param);
				ps.addComponent(pe);
			}
		}
	}
}

glam.Particles.parseEmitter = function(emitter, param) {
	
	var size = parseFloat(emitter.getAttribute('size'));
	var sizeEnd = parseFloat(emitter.getAttribute('sizeEnd'));
	var particlesPerSecond = parseInt(emitter.getAttribute('particlesPerSecond'));
	var opacityStart = parseFloat(emitter.getAttribute('opacityStart'));
	var opacityMiddle = parseFloat(emitter.getAttribute('opacityMiddle'));
	var opacityEnd = parseFloat(emitter.getAttribute('opacityEnd'));
	
	var colorStart, colorEnd;
	if (css = emitter.getAttribute('color-start')) {
		colorStart = new THREE.Color().setStyle(css);
	}
	if (css = emitter.getAttribute('color-end')) {
		colorEnd = new THREE.Color().setStyle(css);
	}
	
	var t = {
	};
	
	t.ax = parseFloat(emitter.getAttribute('ax')) || 0;
	t.ay = parseFloat(emitter.getAttribute('ay')) || 0;
	t.az = parseFloat(emitter.getAttribute('az')) || 0;
	t.vx = parseFloat(emitter.getAttribute('vx')) || 0;
	t.vy = parseFloat(emitter.getAttribute('vy')) || 0;
	t.vz = parseFloat(emitter.getAttribute('vz')) || 0;
	t.sx = parseFloat(emitter.getAttribute('sx')) || 0;
	t.sy = parseFloat(emitter.getAttribute('sy')) || 0;
	t.sz = parseFloat(emitter.getAttribute('sz')) || 0;

	param.size = size;
	param.sizeEnd = sizeEnd;
	if (colorStart !== undefined) {
		param.colorStart = colorStart;
	}
	if (colorEnd !== undefined) {
		param.colorEnd = colorEnd;
	}	
	param.particlesPerSecond = particlesPerSecond;	
	param.opacityStart = opacityStart;
	param.opacityMiddle = opacityMiddle;
	param.opacityEnd = opacityEnd;
	param.acceleration = new THREE.Vector3(t.ax, t.ay, t.az),
	param.velocity = new THREE.Vector3(t.vx, t.vy, t.vy),
	param.accelerationSpread = new THREE.Vector3(t.sx, t.sy, t.sz)
}

glam.Particles.DEFAULT_MAX_AGE = 1;

