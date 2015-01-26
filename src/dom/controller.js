/**
 * @fileoverview controller parser/implementation. supports model, FPS and Rift
 * 
 * @author Tony Parisi
 */

goog.provide('glam.ControllerElement');

glam.ControllerElement.create = function(docelt, style, app) {
	var on = true;
	
	var noheadlight = docelt.getAttribute("noheadlight");
	if (noheadlight !== null) {
		on = false;
		app.controllerScript.headlightOn = false;
	}
	
	var type = docelt.getAttribute("type");
	if (type !== null) {
		type = type.toLowerCase();
		if (type == "fps") {
			
			var x = parseFloat(docelt.getAttribute('x')) || 0;
			var y = parseFloat(docelt.getAttribute('y')) || 0;
			var z = parseFloat(docelt.getAttribute('z')) || 0;
			
			var controller = glam.Prefabs.FirstPersonController({active:true, headlight:on});
			var controllerScript = controller.getComponent(glam.FirstPersonControllerScript);
			app.addObject(controller);

			var object = new glam.Object;	
			var camera = new glam.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
		}
		else if (type == "rift") {
			var controller = glam.Prefabs.RiftController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(glam.RiftControllerScript);			
			app.addObject(controller);

			var object = new glam.Object;	
			var camera = new glam.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
			if (app.controllerScript) {
				app.controllerScript.enabled = false;
			}
			
			// hack because existing FPS or model controller
			// will clobber our values
			app.controller = controller;
			app.controllerScript = controllerScript;
		}
		else if (type == "deviceorientation") {
			var controller = glam.Prefabs.DeviceOrientationController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(glam.DeviceOrientationControllerScript);			
			app.addObject(controller);

			var object = new glam.Object;	
			var camera = new glam.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
			if (app.controllerScript) {
				app.controllerScript.enabled = false;
			}
			
			// hack because existing FPS or model controller
			// will clobber our values
			app.controller = controller;
			app.controllerScript = controllerScript;
		}
	}
	
	return null;
}
