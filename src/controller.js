/**
 * @fileoverview controller parser/implementation. supports model, FPS and Rift
 * 
 * @author Tony Parisi
 */

glam.DOM.Controller = {};

glam.DOM.Controller.create = function(docelt, style, app) {
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
			
			var controller = Vizi.Prefabs.FirstPersonController({active:true, headlight:on});
			var controllerScript = controller.getComponent(Vizi.FirstPersonControllerScript);
			app.addObject(controller);

			var object = new Vizi.Object;	
			var camera = new Vizi.PerspectiveCamera();
			object.addComponent(camera);
			app.addObject(object);

			controllerScript.camera = camera;
			camera.active = true;
			
		}
		else if (type == "rift") {
			var controller = Vizi.Prefabs.RiftController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(Vizi.RiftControllerScript);			
			app.addObject(controller);

			var object = new Vizi.Object;	
			var camera = new Vizi.PerspectiveCamera();
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
			var controller = Vizi.Prefabs.DeviceOrientationController({active:true, 
				headlight:on,
				mouseLook:false,
				useVRJS : true,
			});
			var controllerScript = controller.getComponent(Vizi.DeviceOrientationControllerScript);			
			app.addObject(controller);

			var object = new Vizi.Object;	
			var camera = new Vizi.PerspectiveCamera();
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
