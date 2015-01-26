/**
 * @fileoverview Loader - loads level files
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Loader');
goog.require('glam.EventDispatcher');

/**
 * @constructor
 * @extends {glam.PubSub}
 */
glam.Loader = function()
{
    glam.EventDispatcher.call(this);	
}

goog.inherits(glam.Loader, glam.EventDispatcher);
        
glam.Loader.prototype.loadModel = function(url, userData)
{
	var spliturl = url.split('.');
	var len = spliturl.length;
	var ext = '';
	if (len)
	{
		ext = spliturl[len - 1];
	}
	
	if (ext && ext.length)
	{
	}
	else
	{
		return;
	}
	
	var loaderClass;
	
	switch (ext.toUpperCase())
	{
		case 'JS' :
			loaderClass = THREE.JSONLoader;
			break;
		default :
			break;
	}
	
	if (loaderClass)
	{
		var loader = new loaderClass;
		var that = this;
		
		loader.load(url, function (geometry, materials) {
			that.handleModelLoaded(url, userData, geometry, materials);
		});		
	}
}

glam.Loader.prototype.handleModelLoaded = function(url, userData, geometry, materials)
{
	// Create a new mesh with per-face materials
	var material = new THREE.MeshFaceMaterial(materials);
	var mesh = new THREE.Mesh( geometry, material  );
	
	var obj = new glam.Object;
	var visual = new glam.Visual({object:mesh});
	obj.addComponent(visual);

	var result = { scene : obj, cameras: [], lights: [], keyFrameAnimators:[] , userData: userData };
	
	this.dispatchEvent("loaded", result);
}

glam.Loader.prototype.loadScene = function(url, userData)
{
	var spliturl = url.split('.');
	var len = spliturl.length;
	var ext = '';
	if (len)
	{
		ext = spliturl[len - 1];
	}
	
	if (ext && ext.length)
	{
	}
	else
	{
		return;
	}
	
	var loaderClass;
	
	switch (ext.toUpperCase())
	{
		case 'DAE' :
			loaderClass = THREE.ColladaLoader;
			break;
		case 'JS' :
			return this.loadModel(url, userData);
			break;
		case 'JSON' :
			loaderClass = THREE.glTFLoader;
			break;
		default :
			break;
	}
	
	if (loaderClass)
	{
		var loader = new loaderClass;
		var that = this;
		
		loader.load(url, 
				function (data) {
					that.handleSceneLoaded(url, data, userData);
				},
				function (data) {
					that.handleSceneProgress(url, data);
				}
		);		
	}
}

glam.Loader.prototype.traverseCallback = function(n, result)
{
	// Look for cameras
	if (n instanceof THREE.Camera)
	{
		if (!result.cameras)
			result.cameras = [];
		
		result.cameras.push(n);
	}

	// Look for lights
	if (n instanceof THREE.Light)
	{
		if (!result.lights)
			result.lights = [];
		
		result.lights.push(n);
	}
}

glam.Loader.prototype.handleSceneLoaded = function(url, data, userData)
{
	var result = {};
	var success = false;
	
	if (data.scene)
	{
		// console.log("In loaded callback for ", url);
		
		var convertedScene = this.convertScene(data.scene);
		result.scene = convertedScene; // new glam.SceneVisual({scene:data.scene}); // 
		result.cameras = convertedScene.findNodes(glam.Camera);
		result.lights = convertedScene.findNodes(glam.Light);
		result.url = url;
		result.userData = userData;
		success = true;
	}
	
	if (data.animations)
	{
		result.keyFrameAnimators = [];
		var i, len = data.animations.length;
		for (i = 0; i < len; i++)
		{
			var animations = [];
			animations.push(data.animations[i]);
			result.keyFrameAnimators.push(new glam.KeyFrameAnimator({animations:animations}));
		}
	}
	
	/*
	if (data.skins && data.skins.length)
	{
		// result.meshAnimator = new glam.MeshAnimator({skins:data.skins});
	}
	*/
	
	if (success)
		this.dispatchEvent("loaded", result);
}

glam.Loader.prototype.handleSceneProgress = function(url, progress)
{
	this.dispatchEvent("progress", progress);
}

glam.Loader.prototype.convertScene = function(scene) {

	function convert(n) {
		if (n instanceof THREE.Mesh) {
			// cheap fixes for picking and animation; need to investigate
			// the general case longer-term for glTF loader
			n.matrixAutoUpdate = true;
			n.geometry.dynamic = true;
			var v = new glam.Visual({object:n});
			v.name = n.name;
			return v;
		}
		else if (n instanceof THREE.Camera) {
			if (n instanceof THREE.PerspectiveCamera) {
				return new glam.PerspectiveCamera({object:n});
			}
		}
		else if (n instanceof THREE.Light) {
			if (n instanceof THREE.AmbientLight) {
				return new glam.AmbientLight({object:n});
			}
			else if (n instanceof THREE.DirectionalLight) {
				return new glam.DirectionalLight({object:n});
			}
			else if (n instanceof THREE.PointLight) {
				return new glam.PointLight({object:n});
			}
			else if (n instanceof THREE.SpotLight) {
				return new glam.SpotLight({object:n});
			}
		}
		else if (n.children) {
			var o = new glam.Object({autoCreateTransform:false});
			o.addComponent(new glam.Transform({object:n}));
			o.name = n.name;
			n.matrixAutoUpdate = true;
			var i, len = n.children.length;
			for (i = 0; i < len; i++) {
				var childNode  = n.children[i];
				var c = convert(childNode);
				if (c instanceof glam.Object) {
					o.addChild(c);
				}
				else if (c instanceof glam.Component) {
					o.addComponent(c);
				}
				else {
					// N.B.: what???
				}
			}
		}
		
		return o;
	}

	// Pump through updates once so converted scene can pick up all the values
	scene.updateMatrixWorld();

	return convert(scene);
}
