/**
 * @fileoverview camera parser/implementation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CameraElement');

glam.CameraElement.DEFAULT_FOV = 45;
glam.CameraElement.DEFAULT_NEAR = 1;
glam.CameraElement.DEFAULT_FAR = 10000;

glam.CameraElement.create = function(docelt, style, app) {
	
	var fov = docelt.getAttribute('fov') || glam.CameraElement.DEFAULT_FOV;
	var near = docelt.getAttribute('near') || glam.CameraElement.DEFAULT_NEAR;
	var far = docelt.getAttribute('far') || glam.CameraElement.DEFAULT_FAR;
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
	
	var camera = new glam.Object;	
	var cam = new glam.PerspectiveCamera(param);
	camera.addComponent(cam);
	
	app.addCamera(cam, docelt.id);
	
	return camera;
}
