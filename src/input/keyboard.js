/**
 *
 */
goog.provide('glam.Keyboard');

glam.Keyboard = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	glam.Keyboard.instance = this;
}

glam.Keyboard.prototype.onKeyDown = function(event)
{
}

glam.Keyboard.prototype.onKeyUp = function(event)
{
}

glam.Keyboard.prototype.onKeyPress = function(event)
{
}	        

glam.Keyboard.instance = null;

/* key codes
37: left
38: up
39: right
40: down
*/
glam.Keyboard.KEY_LEFT  = 37;
glam.Keyboard.KEY_UP  = 38;
glam.Keyboard.KEY_RIGHT  = 39;
glam.Keyboard.KEY_DOWN  = 40;
