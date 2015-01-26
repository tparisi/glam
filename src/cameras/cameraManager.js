/**
 * @fileoverview Camera Manager - singleton to manage cameras, active, resize etc.
 * 
 * @author Tony Parisi
 */

goog.provide('glam.CameraManager');

glam.CameraManager.addCamera = function(camera)
{
	glam.CameraManager.cameraList.push(camera);
}

glam.CameraManager.removeCamera = function(camera)
{
    var i = glam.CameraManager.cameraList.indexOf(camera);

    if (i != -1)
    {
    	glam.CameraManager.cameraList.splice(i, 1);
    }
}

glam.CameraManager.setActiveCamera = function(camera)
{
	if (glam.CameraManager.activeCamera && glam.CameraManager.activeCamera != camera)
		glam.CameraManager.activeCamera.active = false;
	
	glam.CameraManager.activeCamera = camera;
	glam.Graphics.instance.setCamera(camera.object);
}


glam.CameraManager.handleWindowResize = function(width, height)
{
	var cameras = glam.CameraManager.cameraList;
	
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


glam.CameraManager.cameraList = [];
glam.CameraManager.activeCamera = null;