/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

/* Hacked-up version of Three.js orbit controls for GLAM
 * Adds mode for one-button operation and optional userMinY
 *
 */

module.exports = OrbitControls;

function OrbitControls( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3();

	this.userZoom = true;
	this.userZoomSpeed = 1.0;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.userPan = true;
	this.userPanSpeed = 2.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	this.oneButton = false;

	this.usekeys = false;

	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};

	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	this.pan = function ( distance ) {

		distance.transformDirection( this.object.matrix );
		distance.multiplyScalar( scope.userPanSpeed );

		this.object.position.add( distance );
		this.center.add( distance );

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		position.copy( this.center ).add( offset );

		this.object.lookAt( this.center );

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;

		if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 1 / 0.95, scope.userZoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event.preventDefault();

		if ( event.button === 0 || (scope.oneButton && event.button === 2)) {

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === 1 && (scope.userZoom)) {

			state = STATE.ZOOM;

			zoomStart.set( event.clientX, event.clientY );

		} else if ( event.button === 2 && (scope.userPan)) {

			state = STATE.PAN;

		}

		scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.addEventListener( 'mouseup', onMouseUp, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchStart( event ) {
		if ( event.touches.length > 1 ) {
			scope.touchDistance = calcDistance(event.touches[0], event.touches[1]);
			scope.touchId0 = event.touches[0].identifier;
			scope.touchId1 = event.touches[1].identifier;
		}
		else {
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mousedown',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': event.touches[0].screenX,
			    'screenY': event.touches[0].screenY,
			    'clientX': event.touches[0].clientX,
			    'clientY': event.touches[0].clientY,
			    'pageX': event.touches[0].pageX,
			    'pageY': event.touches[0].pageY,
			    'button': 0,
			    'preventDefault' : function() {}
				};

			onMouseDown(mouseEvent);
		}
	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.ZOOM ) {

			zoomEnd.set( event.clientX, event.clientY );
			zoomDelta.subVectors( zoomEnd, zoomStart );

			if ( zoomDelta.y > 0 ) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy( zoomEnd );

		} else if ( state === STATE.PAN ) {

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

	}

	function onTouchMove( event ) {
		if ( scope.enabled === false ) return;

		if ( event.changedTouches.length > 1 ) {
			var touch0 = null;
			var touch1 = null;
			for (var i = 0; i < event.changedTouches.length; i++) {
				if (event.changedTouches[i].identifier == scope.touchId0)
					touch0 = event.changedTouches[i];
				else if (event.changedTouches[i].identifier == scope.touchId1)
					touch1 = event.changedTouches[i];

			}
			if (touch0 && touch1 && scope.userZoom) {
				 var touchDistance = calcDistance(touch0, touch1);
				 var deltaDistance = touchDistance - scope.touchDistance;
				 if (deltaDistance > 0) {
					 scope.zoomIn();
				 }
				 else if (deltaDistance < 0) {
					 scope.zoomOut();
				 }
				 scope.touchDistance = touchDistance;
			}
		}
		else if (scope.userRotate){
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mousemove',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': event.changedTouches[0].screenX,
			    'screenY': event.changedTouches[0].screenY,
			    'clientX': event.changedTouches[0].clientX,
			    'clientY': event.changedTouches[0].clientY,
			    'pageX': event.changedTouches[0].pageX,
			    'pageY': event.changedTouches[0].pageY,
			    'button': 0,
			    'preventDefault' : function() {}
				};

			onMouseMove(mouseEvent);
		}
	}

	function calcDistance( touch0, touch1 ) {
		var dx = touch1.clientX - touch0.clientX;
		var dy = touch1.clientY - touch0.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );

		state = STATE.NONE;

	}


	function onTouchEnd( event ) {
		if ( event.changedTouches.length > 1 ) {
			// nothing to do
		}
		else {
			// synthesize a left mouse button event
			var mouseEvent = {
				'type': 'mouseup',
			    'view': event.view,
			    'bubbles': event.bubbles,
			    'cancelable': event.cancelable,
			    'detail': event.detail,
			    'screenX': event.changedTouches[0].screenX,
			    'screenY': event.changedTouches[0].screenY,
			    'clientX': event.changedTouches[0].clientX,
			    'clientY': event.changedTouches[0].clientY,
			    'pageX': event.changedTouches[0].pageX,
			    'pageY': event.changedTouches[0].pageY,
			    'button': 0,
			    'preventDefault' : function() {}
			};

			onMouseUp(mouseEvent);
		}
	}

	function onMouseWheel( event ) {

		event.preventDefault();
		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomIn();

		} else {

			scope.zoomOut();

		}

	}

	function onKeyDown( event ) {

		if ( !scope.usekeys) {
			return;
		}

		if ( scope.enabled === false ) return;
		if ( scope.userPan === false ) return;

		switch ( event.keyCode ) {

			case scope.keys.UP:
				scope.pan( new THREE.Vector3( 0, 1, 0 ) );
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector3( 0, - 1, 0 ) );
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector3( - 1, 0, 0 ) );
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector3( 1, 0, 0 ) );
				break;
		}

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'touchstart', onTouchStart, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	this.domElement.addEventListener( 'keydown', onKeyDown, false );

};

OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
