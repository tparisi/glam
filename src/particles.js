glam.Particles = {};

glam.Particles.create = function(docelt) {

	var style = glam.Node.getStyle(docelt);
	
	var param = {};
	glam.Particles.getAttributes(docelt, style, param);
	
	var ps = glam.ParticleSystemPrefab();
	var pscript = ps.getComponent(glam.ParticleSystemScript);
	
	glam.Particles.initParticleSystem(ps, pscript, param);
	
	pscript.active = true;
	return ps;
}

glam.Particles.getAttributes = function(docelt, style, param) {
}

glam.Particles.initParticleSystem = function(ps, pscript, param) {
}

