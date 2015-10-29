/**
 *
 * This is the main entry point for the re.flow application
 *
 * created by Jason Marsh for Flow  http://flow.gl
 *
 */


// global variables

var app;
var container;
var camera, scene, renderer;

var stats;
var engine;


var isAndroid;



 function init(e) {
    var ua = navigator.userAgent.toLowerCase();
    isAndroid = ua.indexOf("android") > -1;
    var isNotVRReady = !navigator.mozGetVRDevices && !navigator.getVRDevices;

    container = document.getElementById("glContainer");

    app = new Application({
        container: container,
        useFullScreenButton: true,
        useVRControls: true,
        useDeviceOrientationControls: false,//isAndroid,
        useVREffect: !isNotVRReady,
        useStereoEffect: isAndroid,
        tabstop: true
    });

    initAll();
    app.focus();

    app.run();

};

function initAll() {

    addTexturedEtherPlane( {x:0, y:1, z:1}, {x:0.1, y:0, z:-2.3}, 1);
    onWindowResize();

}



