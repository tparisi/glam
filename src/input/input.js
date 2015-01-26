/**
 *
 */
goog.provide('glam.Input');
goog.require('glam.Service');
goog.require('glam.Mouse');
goog.require('glam.Keyboard');

glam.Input = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.mouse = new glam.Mouse();
	this.keyboard = new glam.Keyboard();
	this.gamepad = new glam.Gamepad();
	glam.Input.instance = this;
}

goog.inherits(glam.Input, glam.Service);

glam.Input.prototype.update = function() {
	if (this.gamepad && this.gamepad.update)
		this.gamepad.update();
}

glam.Input.instance = null;