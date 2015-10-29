/**
 *
 */

// Main application
goog.provide('Application');
goog.require('glam.Application');

Application = function(param) {
    param.riftRender = param.useVREffect;
    param.cardboard = param.useStereoEffect;

    glam.Application.call(this, param);
    glam.Graphics.instance.renderer.domElement.focus();

    this.data = {};

    this.focusObject = null;
    this.modalDialog = null;

    this.sceneRoot = new glam.Object;
    this.addObject(this.sceneRoot);

    // this.useRiftController = param.useRiftController || false;
    this.cameraZposition = param.cameraZposition || 0;


    var that = this;


    var cam = new glam.PerspectiveCamera;
    var cameraObject = new glam.Object;
    cameraObject.addComponent(cam);
    cam.active = true;

    if (isAndroid) {
        cameraObject.transform.position.z = 5;
    } else {
        cameraObject.transform.position.z = 6;
    }
    cam.fov = 90;
    cam.near = 0.1;

    camera = cam;
    this.addObject(cameraObject);

    renderer = glam.Graphics.instance.renderer;


/*    var controller = glam.Prefabs.FirstPersonController({active:true, headlight:true, turn:false, tilt:false,
        useArrows : false});
    this.controllerScript = controller.getComponent(glam.FirstPersonControllerScript);
    this.controllerScript.moveSpeed = 2;
    this.controllerScript.camera = cam;


    this.addObject(controller);*/
/*
    var isNotVRReady =  !navigator.mozGetVRDevices && !navigator.getVRDevices ;
    console.log("GLAM: isNotVRReady= " +isNotVRReady);
    if (param.useVRControls && isNotVRReady) {
        console.log("GLAM: attempted to use VRControls but browser not VRready.")
    }

    if (param.useVRControls && !isNotVRReady) { //(!param.cardboard)
        console.log("GLAM: using VRControls");
        var riftController = glam.Prefabs.RiftController({active:true, headlight:true, //uses THREE.VRcontrols
        });
        var riftControllerScript = riftController.getComponent(glam.RiftControllerScript);
        riftControllerScript.addEventListener("create", function(event) {

            if (event.error) {
                console.log("GLAM: failed to use VRControls; ", event.error);
               // fullScreenButton.style.display = 'none';
            }
            else {
                riftControllerScript.camera = cam;
               // that.addObject(controller);
                riftControllerScript.enabled = true;
                //fullScreenButton.style.display = 'block';
            }
        });
        riftControllerScript.camera = cam;

        this.addObject(riftController);


       // glam.Graphics.instance.setFullScreen(true);
        glam.Graphics.instance.renderer.domElement.focus();
    }
   else if (param.useDeviceOrientationControls || (param.useVRControls && !isNotVRReady)) {
        console.log("GLAM: using useDeviceOrientationControls");
        var docontroller = glam.Prefabs.DeviceOrientationController({enabled:true});
        var docontrollerScript = docontroller.getComponent(glam.DeviceOrientationControllerScript);
        docontrollerScript.camera = cam;
        this.addObject(docontrollerScript);

       // glam.Graphics.instance.setFullScreen(true);
        glam.Graphics.instance.renderer.domElement.focus();
        $('#fullScreen').children('.expand').css('display', "none");
        $('#fullScreen').children('.collapse').css('display', "inline");
    }
*/

   // this.loadEnvironment()
}

goog.inherits(Application, glam.Application);


Application.prototype.loadEnvironment = function(param) {

    engine = new ParticleEngine();
    engine.setValues( Examples.fireflies );
    var fireflyParticles = engine.initialize();

    glam.Graphics.instance.scene.add(fireflyParticles);

    var addParticles = function() {


        function getColor(type) {

            var randomBetween = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            function c(start, end) {
                return randomBetween(start, end);
            }

            type = !type ? "#ffffff" : type;
            switch (type) {
                case  'green-bluish' :
                    return "#" + "00" + c(100, 200) + c(100, 200);
                case  'cyanish' :
                    //return "#" + "17" + c(215, 230) + c(240, 255);
                    return new THREE.Color(5 / 256, c(125, 210) / 256, c(175, 235) / 256);
                case  'bluish' :
                    var color = new THREE.Color(0, c(100, 120) / 256, c(180, 255) / 256);
                    return color;
                case "purplish":
                    return "#" + c(100, 200) + "cc" + "ff";
                default:
                    return type;
            }

        }

        var geometry = new THREE.Geometry;

        var fieldWidth = 100;
        for (var i = 0; i < 500; i++) {

            var x = (0.5 - Math.random()) * fieldWidth;
            var y = (0.5 - Math.random()) * fieldWidth;
            var z = (0.5 - Math.random()) * fieldWidth;
            // console.log(z);
            var vert = new THREE.Vector3(x, y, z);

            // don't stand, don't stand so close to me
            if (vert.length() > 20) {
                geometry.vertices.push(vert);
                var color = getColor("cyanish");

                geometry.colors.push(color);
            }


        }

        geometry.verticesNeedUpdate = true;

        var map = THREE.ImageUtils.loadTexture("textures/spark3.png")
        var obj = glam.ParticleSystem({geometry: geometry, map:map, size:0.4});

        return obj;
    }

    //if (!isAndroid) { //Too many particles looks strange in VR
        var particles = addParticles();
        this.addObject(particles);
   // }
}



Application.prototype.setFocus = function(obj) {
    if (this.focusObject && this.focusObject != obj) {
        if (this.focusObject.onLoseFocus) {
            this.focusObject.onLoseFocus();
        }
    }

    this.focusObject = obj;

    if (this.focusObject) {
        if (this.focusObject.onSetFocus) {
            this.focusObject.onSetFocus();
        }
    }
}


Application.prototype.onMouseMove = function(event) {
    if (this.focusObject && this.focusObject.onMouseMove) {
        this.focusObject.onMouseMove(event);
    }
}

Application.prototype.onMouseDown = function(event) {
    if (this.focusObject && this.focusObject.onMouseDown) {
        this.focusObject.onMouseDown(event);
    }
}


Application.prototype.onMouseUp = function(event) {
    if (this.focusObject && this.focusObject.onMouseUp) {
        this.focusObject.onMouseUp(event);
    }
}


Application.prototype.onKeyDown = function(event) {
    if (this.focusObject && this.focusObject.onKeyDown) {
        this.focusObject.onKeyDown(event);
    }
}

Application.prototype.onKeyUp = function(event) {

    // ESC to terminate (non-VR),
    // B, M and N in VR mode
    switch (event.keyCode) {

        case 27: // ESC
        case 66: // B
        case 77: // M
        case 78: // N

            if (this.modalDialog) {
                this.modalDialog.hide();
            }

        break;

    }



    if (this.focusObject && this.focusObject.onKeyUp) {
        this.focusObject.onKeyUp(event);
    }
}

Application.prototype.onKeyPress = function(event) {
    if (this.focusObject && this.focusObject.onKeyPress) {
        this.focusObject.onKeyPress(event);
    }
}



