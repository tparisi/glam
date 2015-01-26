/**
 * @author mrdoob / http://mrdoob.com/
 */

goog.provide('glam.PointerLockControls');

glam.PointerLockControls = function ( camera ) {

  var scope = this;
  this.speed = 0.05
  this.speedMultiplier = 1;
  this.fly = false;
  this.jumpPower = .1;
  this.gravity = 0.0;

  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add( pitchObject );

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;


  var speedBoost = 10
  var speedSlow = .5

  var velocity = new THREE.Vector3();

  var PI_2 = Math.PI / 2;

  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

  };

  var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
      case 82:
        break;
      case 16:
        this.speedMultiplier = speedBoost;
        break

      case 17:
        this.speedMultiplier = speedSlow;
        break;

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 67: // c
        velocity.y += this.jumpPower;
        break;
      case 32: // space
        velocity.y -= this.jumpPower;
        break;

    }

  };

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {
      case 16:
        this.speedMultiplier = 1;
        break;
      case 17:
        this.speedMultiplier = 1;
        break;
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
      case 32: //space
        velocity.y = 0;
        break;
      case 67: //c
        velocity.y = 0;
        break;

    }

  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown.bind(this), false );
  document.addEventListener( 'keyup', onKeyUp.bind(this), false );

  this.enabled = false;

  this.getObject = function () {

    return yawObject;

  };


  this.getPosition = function() {
    return new THREE.Vector3().copy(yawObject.position)
  }

  this.getDirection = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3( 0, 0, -1 );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return function( ) {
      v = new THREE.Vector3()

      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

      v.copy( direction ).applyEuler( rotation );

      return v;

    }

  }();

  this.update = function ( delta ) {

    if ( scope.enabled === false ) return;

    delta *= 0.1;

    velocity.x += ( - velocity.x ) * 0.08 * delta;
    velocity.z += ( - velocity.z ) * 0.08 * delta;

    velocity.y -= this.gravity * delta;

    if ( moveForward ) velocity.z -= this.speed * delta * this.speedMultiplier;
    if ( moveBackward ) velocity.z += this.speed * delta * this.speedMultiplier;

    if ( moveLeft ) velocity.x -= this.speed * delta * this.speedMultiplier;
    if ( moveRight ) velocity.x += this.speed * delta * this.speedMultiplier;



    yawObject.translateX( velocity.x );
    yawObject.translateY( velocity.y ); 
    yawObject.translateZ( velocity.z );

    if ( yawObject.position.y < 10 ) {

      velocity.y = 0;
      yawObject.position.y = 10;


    }

  };

};
