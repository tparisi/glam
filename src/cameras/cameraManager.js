/**
* @fileoverview Camera Manager - singleton to manage cameras, active, resize etc.
*
* @author Tony Parisi
*/

// goog.provide('CameraManager');

var CameraManager = {};

module.exports = CameraManager;

var Graphics = require("../graphics/graphics");

CameraManager.addCamera = function(camera)
{
	CameraManager.cameraList.push(camera);
}

CameraManager.removeCamera = function(camera)
{
		var i = CameraManager.cameraList.indexOf(camera);

		if (i != -1)
		{
			CameraManager.cameraList.splice(i, 1);
		}
}

CameraManager.setActiveCamera = function(camera)
{
	if (CameraManager.activeCamera && CameraManager.activeCamera != camera)
		CameraManager.activeCamera.active = false;

	CameraManager.activeCamera = camera;
	Graphics.instance.setCamera(camera.object);
}


CameraManager.handleWindowResize = function(width, height)
{
	var cameras = CameraManager.cameraList;

	if (cameras.length == 0)
		return false;

	var i, len = cameras.length;
	for (i = 0; i < len; i++)
	{
		var camera = cameras[i];
		camera.aspect = width / height;
	}

	return true;
}


CameraManager.cameraList = [];
CameraManager.activeCamera = null;
