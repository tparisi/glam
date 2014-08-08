/**
 * @fileoverview camera parser/implementation
 * 
 * @author Tony Parisi
 */

glam.Camera = {};

glam.Camera.DEFAULT_FOV = 45;
glam.Camera.DEFAULT_NEAR = 1;
glam.Camera.DEFAULT_FAR = 10000;

glam.Camera.create = function(docelt, style, app) {
	
	var fov = docelt.getAttribute('fov') || glam.Camera.DEFAULT_FOV;
	var near = docelt.getAttribute('near') || glam.Camera.DEFAULT_NEAR;
	var far = docelt.getAttribute('far') || glam.Camera.DEFAULT_FAR;
	var aspect = docelt.getAttribute('aspect');
	
	if (style) {
		if (style.fov)
			fov = style.fov;
		if (style.near)
			near = style.near;
		if (style.far)
			far = style.far;
		if (style.aspect)
			aspect = style.aspect;
	}
	
	fov = parseFloat(fov);
	near = parseFloat(near);
	far = parseFloat(far);
	
	var param = {
			fov : fov,
			near : near,
			far : far,
	};

	if (aspect) {
		aspect = parseFloat(aspect);
		param.aspect = aspect;
	}
	
	var camera = new Vizi.Object;	
	var cam = new Vizi.PerspectiveCamera(param);
	camera.addComponent(cam);
	
	app.addCamera(cam, docelt.id);
	
	return camera;
}
