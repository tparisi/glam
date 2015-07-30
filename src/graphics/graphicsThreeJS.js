/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.require('glam.Graphics');
goog.provide('glam.GraphicsThreeJS');

glam.GraphicsThreeJS = function()
{
	glam.Graphics.call(this);
}

goog.inherits(glam.GraphicsThreeJS, glam.Graphics);

glam.GraphicsThreeJS.prototype.initialize = function(param)
{
	param = param || {};
	
	// call all the setup functions
	this.initOptions(param);
	this.initPageElements(param);
	this.initScene();
	this.initRenderer(param);
	this.initMouse();
	this.initKeyboard();
	this.addDomHandlers();
}

glam.GraphicsThreeJS.prototype.focus = function()
{
	if (this.renderer && this.renderer.domElement)
	{
		this.renderer.domElement.focus();
	}
}

glam.GraphicsThreeJS.prototype.initOptions = function(param)
{
	this.displayStats = (param && param.displayStats) ? 
			param.displayStats : glam.GraphicsThreeJS.default_display_stats;
}

glam.GraphicsThreeJS.prototype.initPageElements = function(param)
{
    if (param.container)
    {
    	this.container = param.container;
    }
   	else
   	{
		this.container = document.createElement( 'div' );
	    document.body.appendChild( this.container );
   	}

    this.saved_cursor = this.container.style.cursor;
    
    if (this.displayStats)
    {
    	if (window.Stats)
    	{
	        var stats = new Stats();
	        stats.domElement.style.position = 'absolute';
	        stats.domElement.style.top = '0px';
	        stats.domElement.style.left = '0px';
	        stats.domElement.style.height = '40px';
	        this.container.appendChild( stats.domElement );
	        this.stats = stats;
    	}
    	else
    	{
    		glam.System.warn("No Stats module found. Make sure to include stats.min.js");
    	}
    }
}

glam.GraphicsThreeJS.prototype.initScene = function()
{
    var scene = new THREE.Scene();

//    scene.add( new THREE.AmbientLight(0xffffff) ); //  0x505050 ) ); // 
	
    var camera = new THREE.PerspectiveCamera( 45, 
    		this.container.offsetWidth / this.container.offsetHeight, 1, 10000 );
    camera.position.copy(glam.Camera.DEFAULT_POSITION);

    scene.add(camera);
    
    this.scene = scene;
	this.camera = camera;
	
	this.backgroundLayer = {};
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, 
    		this.container.offsetWidth / this.container.offsetHeight, 0.01, 10000 );
    camera.position.set( 0, 0, 10 );	
    scene.add(camera);
    
    this.backgroundLayer.scene = scene;
    this.backgroundLayer.camera = camera;
}

glam.GraphicsThreeJS.prototype.initRenderer = function(param)
{
	var antialias = (param.antialias !== undefined) ? param.antialias : true;
	var alpha = (param.alpha !== undefined) ? param.alpha : true;
	//var devicePixelRatio = (param.devicePixelRatio !== undefined) ? param.devicePixelRatio : 1;
	
    var renderer = // glam.Config.USE_WEBGL ?
    	new THREE.WebGLRenderer( { antialias: antialias, 
    		alpha: alpha,
    		/*devicePixelRatio : devicePixelRatio */ } ); // :
    	// new THREE.CanvasRenderer;
    	
    renderer.sortObjects = false;
    renderer.setSize( this.container.offsetWidth, this.container.offsetHeight );

    if (param && param.backgroundColor)
    {
    	renderer.domElement.style.backgroundColor = param.backgroundColor;
    	renderer.domElement.setAttribute('z-index', -1);
    }
    
    this.container.appendChild( renderer.domElement );

    var projector = new THREE.Projector();

    this.renderer = renderer;
    this.projector = projector;

    this.lastFrameTime = 0;
    
    if (param.riftRender) {
    	this.riftCam = new THREE.VREffect(this.renderer, function(err) {
			if (err) {
				glam.System.warn("Unable to create VR renderer: ", err);
			}
    	});
    }
    
    if (param.cardboard) {
    	this.cardboard = new THREE.StereoEffect(this.renderer);
    	this.cardboard.setSize( this.container.offsetWidth, this.container.offsetHeight );
    }
    
    // Placeholder for effects composer
    this.composer = null;
}

glam.GraphicsThreeJS.prototype.initMouse = function()
{
	var dom = this.renderer.domElement;
	
	var that = this;
	dom.addEventListener( 'mousemove', 
			function(e) { that.onDocumentMouseMove(e); }, false );
	dom.addEventListener( 'mousedown', 
			function(e) { that.onDocumentMouseDown(e); }, false );
	dom.addEventListener( 'mouseup', 
			function(e) { that.onDocumentMouseUp(e); }, false ); 
 	dom.addEventListener( 'click', 
			function(e) { that.onDocumentMouseClick(e); }, false );
	dom.addEventListener( 'dblclick', 
			function(e) { that.onDocumentMouseDoubleClick(e); }, false );

	dom.addEventListener( 'mousewheel', 
			function(e) { that.onDocumentMouseScroll(e); }, false );
	dom.addEventListener( 'DOMMouseScroll', 
			function(e) { that.onDocumentMouseScroll(e); }, false );
	
	dom.addEventListener( 'touchstart', 
			function(e) { that.onDocumentTouchStart(e); }, false );
	dom.addEventListener( 'touchmove', 
			function(e) { that.onDocumentTouchMove(e); }, false );
	dom.addEventListener( 'touchend', 
			function(e) { that.onDocumentTouchEnd(e); }, false );
}

glam.GraphicsThreeJS.prototype.initKeyboard = function()
{
	var dom = this.renderer.domElement;
	
	var that = this;
	dom.addEventListener( 'keydown', 
			function(e) { that.onKeyDown(e); }, false );
	dom.addEventListener( 'keyup', 
			function(e) { that.onKeyUp(e); }, false );
	dom.addEventListener( 'keypress', 
			function(e) { that.onKeyPress(e); }, false );

	// so it can take focus
	dom.setAttribute("tabindex", 1);
    
}

glam.GraphicsThreeJS.prototype.addDomHandlers = function()
{
	var that = this;
	window.addEventListener( 'resize', function(event) { that.onWindowResize(event); }, false );

	setTimeout(function(event) { that.onWindowResize(event); }, 10);
	
	var fullScreenChange =
		this.renderer.domElement.mozRequestFullScreen? 'mozfullscreenchange' : 'webkitfullscreenchange';
	
	document.addEventListener( fullScreenChange, 
			function(e) {that.onFullScreenChanged(e); }, false );

}

glam.GraphicsThreeJS.prototype.objectFromMouse = function(event)
{
	var eltx = event.elementX, elty = event.elementY;
	
	// translate client coords into vp x,y
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;
    
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = pos.applyMatrix4(this.camera.matrixWorld);
	
    var raycaster = new THREE.Raycaster( pos, vector.sub( pos ).normalize() );

	var intersects = raycaster.intersectObjects( this.scene.children, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(i < intersects.length && (!intersects[i].object.visible || 
    			intersects[i].object.ignorePick))
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	
    	if (i >= intersects.length)
    	{
        	return { object : null, point : null, normal : null };
    	}
    	
    	return (this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face));        	    	                             
    }
    else
    {
    	return { object : null, point : null, normal : null };
    }
}

glam.GraphicsThreeJS.prototype.objectFromRay = function(hierarchy, origin, direction, near, far)
{
    var raycaster = new THREE.Raycaster(origin, direction, near, far);

    var objects = null;
    if (hierarchy) {
    	objects = hierarchy.transform.object.children; 
    }
    else {
    	objects = this.scene.children;
    }
    
	var intersects = raycaster.intersectObjects( objects, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(i < intersects.length && (!intersects[i].object.visible || 
    			intersects[i].object.ignoreCollision))
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	
    	if (i >= intersects.length)
    	{
        	return { object : null, point : null, normal : null };
    	}
    	
    	return (this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face));        	    	                             
    }
    else
    {
    	return { object : null, point : null, normal : null };
    }
}


glam.GraphicsThreeJS.prototype.findObjectFromIntersected = function(object, point, face)
{
	if (object.data)
	{
		// The intersect point comes in as world units
		var hitPointWorld = point.clone();
		// Get the model space units for our event
		var modelMat = new THREE.Matrix4;
		modelMat.getInverse(object.matrixWorld);
		point.applyMatrix4(modelMat);
		// Use the intersected face's normal if it's there
		var normal = face ? face.normal : null
		return { object: object.data, point: point, hitPointWorld : hitPointWorld, face: face, normal: normal };
	}
	else if (object.parent)
	{
		return this.findObjectFromIntersected(object.parent, point, face);
	}
	else
	{
		return { object : null, point : null, face : null, normal : null };
	}
}

glam.GraphicsThreeJS.prototype.getObjectIntersection = function(x, y, object)
{
	// Translate client coords into viewport x,y
	var vpx = ( x / this.renderer.domElement.offsetWidth ) * 2 - 1;
	var vpy = - ( y / this.renderer.domElement.offsetHeight ) * 2 + 1;
	
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = pos.applyMatrix4(this.camera.matrixWorld);
	
    var raycaster = new THREE.Raycaster( pos, vector.sub( pos ).normalize() );

	var intersects = raycaster.intersectObject( object, true );
	if (intersects.length)
	{
		var intersection = intersects[0];
		var modelMat = new THREE.Matrix4;
		modelMat.getInverse(intersection.object.matrixWorld);
		intersection.point.applyMatrix4(modelMat);
		return intersection;
	}
	else
		return null;
		
}

glam.GraphicsThreeJS.prototype.calcElementOffset = function(offset) {

	offset.left = this.renderer.domElement.offsetLeft;
	offset.top = this.renderer.domElement.offsetTop;
	
	var parent = this.renderer.domElement.offsetParent;
	while(parent) {
		offset.left += parent.offsetLeft;
		offset.top += parent.offsetTop;
		parent = parent.offsetParent;
	}
}

glam.GraphicsThreeJS.prototype.onDocumentMouseMove = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey };
	
    glam.Mouse.instance.onMouseMove(evt);
    
    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseMove(evt);
    }
    
    glam.Application.handleMouseMove(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseDown = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
		
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
	
    glam.Mouse.instance.onMouseDown(evt);
    
    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseDown(evt);
    }

    if (glam.ViewPicker)
    {
    	glam.ViewPicker.handleMouseDown(evt);
    }
    
    glam.Application.handleMouseDown(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseUp = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
    
    glam.Mouse.instance.onMouseUp(evt);
    
    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseUp(evt);
    }	            

    if (glam.ViewPicker)
    {
    	glam.ViewPicker.handleMouseUp(evt);
    }
    
    glam.Application.handleMouseUp(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseClick = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
    
    glam.Mouse.instance.onMouseClick(evt);
    
    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseClick(evt);
    }	            

    glam.Application.handleMouseClick(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseDoubleClick = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
	var evt = { type : event.type, pageX : event.pageX, pageY : event.pageY, 
	    	elementX : eltx, elementY : elty, button:event.button, altKey:event.altKey,
	    	ctrlKey:event.ctrlKey, shiftKey:event.shiftKey  };
    
    glam.Mouse.instance.onMouseDoubleClick(evt);
    
    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseDoubleClick(evt);
    }	            

    glam.Application.handleMouseDoubleClick(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentMouseScroll = function(event)
{
    event.preventDefault();

	var delta = 0;

	if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

		delta = event.wheelDelta;

	} else if ( event.detail ) { // Firefox

		delta = - event.detail;

	}

	var evt = { type : "mousescroll", delta : delta };
    
    glam.Mouse.instance.onMouseScroll(evt);

    if (glam.PickManager)
    {
    	glam.PickManager.handleMouseScroll(evt);
    }
    
    glam.Application.handleMouseScroll(evt);
}

// Touch events
glam.GraphicsThreeJS.prototype.translateTouch = function(touch, offset) {

	var eltx = touch.pageX - offset.left;
	var elty = touch.pageY - offset.top;

	return {
	    'screenX': touch.screenX,
	    'screenY': touch.screenY,
	    'clientX': touch.clientX,
	    'clientY': touch.clientY,
	    'pageX': touch.pageX,
	    'pageY': touch.pageY,
	    'elementX': eltx,
	    'elementY': elty,
	}
}

glam.GraphicsThreeJS.prototype.onDocumentTouchStart = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);

	var touches = [];
	var i, len = event.touches.length;
	for (i = 0; i < len; i++) {
		touches.push(this.translateTouch(event.touches[i], offset));
	}

	var evt = { type : event.type, touches : touches };
	
    if (glam.PickManager)
    {
    	glam.PickManager.handleTouchStart(evt);
    }
    
    glam.Application.handleTouchStart(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentTouchMove = function(event)
{
    event.preventDefault();
    
	var offset = {};
	this.calcElementOffset(offset);
	
	var touches = [];
	var i, len = event.touches.length;
	for (i = 0; i < len; i++) {
		touches.push(this.translateTouch(event.touches[i], offset));
	}

	var changedTouches = [];
	var i, len = event.changedTouches.length;
	for (i = 0; i < len; i++) {
		changedTouches.push(this.translateTouch(event.changedTouches[i], offset));
	}

	var evt = { type : event.type, touches : touches, changedTouches : changedTouches };
		    
    if (glam.PickManager)
    {
    	glam.PickManager.handleTouchMove(evt);
    }
    
    glam.Application.handleTouchMove(evt);
}

glam.GraphicsThreeJS.prototype.onDocumentTouchEnd = function(event)
{
    event.preventDefault();

	var offset = {};
	this.calcElementOffset(offset);
	
	var touches = [];
	var i, len = event.touches.length;
	for (i = 0; i < len; i++) {
		touches.push(this.translateTouch(event.touches[i], offset));
	}

	var changedTouches = [];
	var i, len = event.changedTouches.length;
	for (i = 0; i < len; i++) {
		changedTouches.push(this.translateTouch(event.changedTouches[i], offset));
	}

	var evt = { type : event.type, touches : touches, changedTouches : changedTouches };
    
    if (glam.PickManager)
    {
    	glam.PickManager.handleTouchEnd(evt);
    }	            

    glam.Application.handleTouchEnd(evt);
}


glam.GraphicsThreeJS.prototype.onKeyDown = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    glam.Keyboard.instance.onKeyDown(event);
    
	glam.Application.handleKeyDown(event);
}

glam.GraphicsThreeJS.prototype.onKeyUp = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    glam.Keyboard.instance.onKeyUp(event);
    
	glam.Application.handleKeyUp(event);
}
	        
glam.GraphicsThreeJS.prototype.onKeyPress = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    glam.Keyboard.instance.onKeyPress(event);
    
	glam.Application.handleKeyPress(event);
}

glam.GraphicsThreeJS.prototype.onWindowResize = function(event)
{
	var width = this.container.offsetWidth,
		height = this.container.offsetHeight;

	// HACK HACK HACK seems to be the only reliable thing and even this
	// is dicey on Chrome. Is there a race condition?
	if (this.riftCam  && this.riftCam._vrHMD) {
		width = window.innerWidth;
		height = window.innerHeight;
	}

	if (this.cardboard) {
		this.cardboard.setSize(width, height);
	}
	
	this.renderer.setSize(width, height);
	
	if (this.composer) {
		this.composer.setSize(width, height);
	}
	
	
	if (glam.CameraManager && glam.CameraManager.handleWindowResize(this.container.offsetWidth, this.container.offsetHeight))
	{		
	}
	else
	{
		this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
		this.camera.updateProjectionMatrix();
	}
}

glam.GraphicsThreeJS.prototype.onFullScreenChanged = function(event) {
	
	if ( !document.mozFullscreenElement && !document.webkitFullscreenElement ) {
		this.fullscreen = false;
	}
	else {
		this.fullscreen = true;
	}
}




glam.GraphicsThreeJS.prototype.setCursor = function(cursor)
{
	if (!cursor)
		cursor = this.saved_cursor;
	
	this.container.style.cursor = cursor;
}


glam.GraphicsThreeJS.prototype.update = function()
{
    var frameTime = Date.now();
    var deltat = (frameTime - this.lastFrameTime) / 1000;
    this.frameRate = 1 / deltat;

    this.lastFrameTime = frameTime;

    if (glam.ViewPicker) {
    	glam.ViewPicker.update();
    }

	// N.B.: start with hack, let's see how it goes...
	if (this.composer) {
		this.renderEffects(deltat);
	}
	else if (this.cardboard) {
		this.renderStereo();
	}
    else if (this.riftCam && this.riftCam._vrHMD) {
		this.renderVR();
	}
	else {
		this.render();
	}
	
    if (this.stats)
    {
    	this.stats.update();
    }
}

glam.GraphicsThreeJS.prototype.render = function() {
    this.renderer.setClearColor( 0, 0 );
	this.renderer.autoClearColor = true;
    this.renderer.render( this.backgroundLayer.scene, this.backgroundLayer.camera );
    this.renderer.setClearColor( 0, 1 );
	this.renderer.autoClearColor = false;
    this.renderer.render( this.scene, this.camera );
}

glam.GraphicsThreeJS.prototype.renderVR = function() {
	// start with 2 layer to test; will need to work in postprocessing when that's ready
    this.riftCam.render([this.backgroundLayer.scene, this.scene], [this.backgroundLayer.camera, this.camera]);
}

glam.GraphicsThreeJS.prototype.renderEffects = function(deltat) {
	this.composer.render(deltat);
}

glam.GraphicsThreeJS.prototype.renderStereo = function() {
	// start with 2 layer to test; will need to work in postprocessing when that's ready
    this.cardboard.render([this.backgroundLayer.scene, this.scene], [this.backgroundLayer.camera, this.camera]);
//    this.cardboard.render(this.scene, this.camera);
}

glam.GraphicsThreeJS.prototype.enableShadows = function(enable)
{
	this.renderer.shadowMapEnabled = enable;
	this.renderer.shadowMapSoft = enable;
	this.renderer.shadowMapCullFrontFaces = false;
}

glam.GraphicsThreeJS.prototype.setFullScreen = function(enable)
{
	if (this.riftCam && this.riftCam._vrHMD) {

		this.fullscreen = enable;
		
		this.riftCam.setFullScreen(enable);
	}
	else if (this.cardboard) {

		var canvas = this.renderer.domElement;
		
		if (enable) {
			if ( this.container.mozRequestFullScreen ) {
				this.container.mozRequestFullScreen();
			} else {
				this.container.webkitRequestFullscreen();
			}
		}
		else {
			if ( document.mozCancelFullScreen ) {
				document.mozCancelFullScreen();
			} else {
				document.webkitExitFullscreen();
			}
		}
	}
}

glam.GraphicsThreeJS.prototype.setCamera = function(camera) {
	this.camera = camera;
	if (this.composer) {
		this.composer.setCamera(camera);
	}
}

glam.GraphicsThreeJS.prototype.addEffect = function(effect) {
	
	if (!this.composer) {
		this.composer = new glam.Composer();
	}
	
	if (!this.effects) {
		this.effects  = [];
	}
	
	if (effect.isShaderEffect) {
		for (var i = 0; i < this.effects.length; i++) {
			var ef = this.effects[i];
//			ef.pass.renderToScreen = false;
		}	
//		effect.pass.renderToScreen = true;
	}
	
	this.effects.push(effect);
	this.composer.addEffect(effect);
}

glam.GraphicsThreeJS.default_display_stats = false;
