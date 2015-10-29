/**
 * created by Jason Marsh for Flow  http://flow.gl
 *
 * Functions to create the 3D objects for the re.flow project.
 *
 * Each visualizer is connected to an AudioVisualizer track defined in AudioVisualizer.js
 */



function addPicker( ) {
    var picker = new glam.Picker;

    var selectFunction = function() {

        alert("selected!");
    }

    picker.addEventListener("mouseup", selectFunction);
    picker.addEventListener("touchend", selectFunction);

    return picker;
}



function addTexturedEtherPlane(  position, rotation, spinRadius) {
    var parentObj = new glam.Object;//we use a parent object to create an offset
    var obj = new glam.Object;
    parentObj.addChild(obj);

    var visual = addTexturedEtherPlaneVisual( );
    var picker = addPicker();
    var highlight = new glam.HighlightBehavior({});

    obj.addComponent(visual);
    obj.addComponent(picker);
    obj.addComponent(highlight);

    spinRadius = spinRadius ? spinRadius : 1;
    position = position? position : {x:0, y:0, z:0};
    parentObj.transform.position.set( position.x, position.y, position.z + spinRadius );
    obj.transform.position.set(0, 0, -spinRadius*2);
    if (rotation) {
        obj.transform.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    app.addObject(parentObj);
}

function addTexturedEtherPlaneVisual(  ){

    var planeShaderMaterial = new THREE.MeshBasicMaterial();

    //var geometry = new THREE.PlaneGeometry( 2,2 );
    var geometry = new THREE.PlaneBufferGeometry( 2,2 );

    var visual = new glam.Visual(
        { geometry: geometry,
            material: planeShaderMaterial
        });

    return visual;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function onWindowResize( event ) {

    if (camera) {
        camera.aspect = getWindowWidth() / getWindowHeight();
        // camera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    var elem = document.getElementById('glContainer');
    elem.width = getWindowWidth();
    elem.height = getWindowHeight();

}



function getWindowWidth(){ /// Android sometimes seems to respond better to window.outerWidth than innerWidth
    //return isAndroid? window.outerWidth: window.innerWidth;
    return  window.innerWidth;
}

function getWindowHeight(){
    //return isAndroid? window.outerHeight: window.innerHeight;
    return window.innerHeight;
}
