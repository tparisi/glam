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
	
	glam.Particles.parse(docelt, ps);
	
	pscript.active = true;
	return ps;
}

glam.Particles.getAttributes = function(docelt, style, param) {
	var maxAge = docelt.getAttribute('maxAge') || glam.Particles.DEFAULT_MAX_AGE;
	param.maxAge = parseFloat(maxAge);
}

glam.Particles.parse = function(docelt, ps) {
	// Any emitters?
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
	
	// Or just static vertices...? Not working yet
	var verts = docelt.getElementsByTagName('vertices');
	if (verts) {
		verts = verts[0];
		if (verts) {
			var visual = ps.getComponent(Vizi.Visual);
			var geometry = visual.geometry;
			glam.Types.parseVector3Array(verts, geometry.vertices);
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
	if (css = emitter.getAttribute('colorStart')) {
		colorStart = new THREE.Color().setStyle(css);
	}
	if (css = emitter.getAttribute('colorEnd')) {
		colorEnd = new THREE.Color().setStyle(css);
	}
	
	var vx = parseFloat(emitter.getAttribute('vx')) || 0;
	var vy = parseFloat(emitter.getAttribute('vy')) || 0;
	var vz = parseFloat(emitter.getAttribute('vz')) || 0;
	var ax = parseFloat(emitter.getAttribute('ax')) || 0;
	var ay = parseFloat(emitter.getAttribute('ay')) || 0;
	var az = parseFloat(emitter.getAttribute('az')) || 0;
	var psx = parseFloat(emitter.getAttribute('psx')) || 0;
	var psy = parseFloat(emitter.getAttribute('psy')) || 0;
	var psz = parseFloat(emitter.getAttribute('psz')) || 0;
	var asx = parseFloat(emitter.getAttribute('asx')) || 0;
	var asy = parseFloat(emitter.getAttribute('asy')) || 0;
	var asz = parseFloat(emitter.getAttribute('asz')) || 0;

	var velocity = new THREE.Vector3(vx, vy, vz);
	var acceleration = new THREE.Vector3(ax, ay, az);
	var positionSpread = new THREE.Vector3(psx, psy, psz);
	var accelerationSpread = new THREE.Vector3(asx, asy, asz);

	var vel = emitter.getAttribute('velocity');
	if (vel) {
		glam.Types.parseVector3(vel, velocity);
	}
	
	var accel = emitter.getAttribute('acceleration');
	if (accel) {
		glam.Types.parseVector3(accel, acceleration);
	}
	
	var posSpread = emitter.getAttribute('positionSpread');
	if (posSpread) {
		glam.Types.parseVector3(posSpread, positionSpread);
	}

	var accelSpread = emitter.getAttribute('accelerationSpread');
	if (accelSpread) {
		glam.Types.parseVector3(accelSpread, accelerationSpread);
	}

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
	param.velocity = velocity;
	param.acceleration = acceleration;
	param.positionSpread = positionSpread;
	param.accelerationSpread = accelerationSpread; 
}

glam.Particles.DEFAULT_MAX_AGE = 1;

