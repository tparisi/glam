/**
 *
 */
goog.provide('glam.Gamepad');
goog.require('glam.EventDispatcher');

glam.Gamepad = function()
{
    glam.EventDispatcher.call(this);

    // N.B.: freak out if somebody tries to make 2
	// throw (...)

    this.controllers = {
    };
    
    this.values = {
    };
    
	glam.Gamepad.instance = this;
}       

goog.inherits(glam.Gamepad, glam.EventDispatcher);

glam.Gamepad.prototype.update = function() {

	this.scanGamepads();

	var buttonsChangedEvent = {
			changedButtons: [],
	};

	var axesChangedEvent = {
			changedAxes: [],
	};
	
	for (var c in this.controllers) {
	    var controller = this.controllers[c];
	    this.testValues(controller, buttonsChangedEvent, axesChangedEvent);
	    this.saveValues(controller);
	}
	
	if (buttonsChangedEvent.changedButtons.length) {
		this.dispatchEvent("buttonsChanged", buttonsChangedEvent);
	}

	if (axesChangedEvent.changedAxes.length) {
		this.dispatchEvent("axesChanged", axesChangedEvent);
	}
}

glam.Gamepad.prototype.testValues = function(gamepad, buttonsChangedEvent, axesChangedEvent) {
	var values = this.values[gamepad.index];
	if (values) {
	    for (var i = 0; i < gamepad.buttons.length; i++) {
	        
	        var val = gamepad.buttons[i];
	        var pressed = val == 1.0;
	        
	        if (typeof(val) == "object") {
	          pressed = val.pressed;
	          val = val.value;
	        }

	        if (pressed != values.buttons[i]) {
//	        	console.log("Pressed: ", i);
	        	buttonsChangedEvent.changedButtons.push({
	        		gamepad : gamepad.index,
	        		button : i,
	        		pressed : pressed,
	        	});
	        }	        	
	      }

	    for (var i = 0; i < gamepad.axes.length; i++) {
	        var val = gamepad.axes[i];
	        if (val != values.axes[i]) {
//	        	console.log("Axis: ", i, val);
	        	axesChangedEvent.changedAxes.push({
	        		gamepad : gamepad.index,
	        		axis : i,
	        		value : val,
	        	});
	        }
	      }		
	}
}

glam.Gamepad.prototype.saveValues = function(gamepad) {
	var values = this.values[gamepad.index];
	if (values) {
	    for (var i = 0; i < gamepad.buttons.length; i++) {
	        
	        var val = gamepad.buttons[i];
	        var pressed = val == 1.0;
	        
	        if (typeof(val) == "object") {
	          pressed = val.pressed;
	          val = val.value;
	        }

	        values.buttons[i] = pressed;
	      }

	    for (var i = 0; i < gamepad.axes.length; i++) {
	        var val = gamepad.axes[i];
	        values.axes[i] = val;
	      }		
	}
}

glam.Gamepad.prototype.addGamepad = function(gamepad) {
	  this.controllers[gamepad.index] = gamepad;
	  this.values[gamepad.index] = {
			  buttons : [],
			  axes : [],
	  };
	  
	  this.saveValues(gamepad);
	  console.log("Gamepad added! ", gamepad.id);
}

glam.Gamepad.prototype.scanGamepads = function() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in this.controllers)) {
    	  this.addGamepad(gamepads[i]);
      } else {
    	  this.controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

glam.Gamepad.instance = null;

/* input codes
*/
glam.Gamepad.BUTTON_A = glam.Gamepad.BUTTON_CROSS 		= 0;
glam.Gamepad.BUTTON_B = glam.Gamepad.BUTTON_CIRCLE 		= 1;
glam.Gamepad.BUTTON_X = glam.Gamepad.BUTTON_SQUARE 		= 2;
glam.Gamepad.BUTTON_Y = glam.Gamepad.BUTTON_TRIANGLE 	= 3;
glam.Gamepad.SHOULDER_LEFT 								= 4;
glam.Gamepad.SHOULDER_RIGHT 							= 5;
glam.Gamepad.TRIGGER_LEFT 								= 6;
glam.Gamepad.TRIGGER_RIGHT 								= 7;
glam.Gamepad.SELECT = glam.Gamepad.BACK 				= 8;
glam.Gamepad.START 										= 9;
glam.Gamepad.STICK_LEFT 								= 10;
glam.Gamepad.STICK_RIGHT 								= 11;
glam.Gamepad.DPAD_UP	 								= 12;
glam.Gamepad.DPAD_DOWN	 								= 13;
glam.Gamepad.DPAD_LEFT	 								= 14;
glam.Gamepad.DPAD_RIGHT	 								= 15;
glam.Gamepad.HOME = glam.Gamepad.MENU					= 16;
glam.Gamepad.AXIS_LEFT_H								= 0;
glam.Gamepad.AXIS_LEFT_V								= 1;
glam.Gamepad.AXIS_RIGHT_H								= 2;
glam.Gamepad.AXIS_RIGHT_V								= 3;
