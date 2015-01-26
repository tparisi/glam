/**
 * @fileoverview Behavior component - base class for time-based behaviors
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Behavior');
goog.require('glam.Component');

glam.Behavior = function(param) {
	param = param || {};
	this.startTime = 0;
	this.running = false;
	this.loop = (param.loop !== undefined) ? param.loop : false;
	this.autoStart = (param.autoStart !== undefined) ? param.autoStart : false;
    glam.Component.call(this, param);
}

goog.inherits(glam.Behavior, glam.Component);

glam.Behavior.prototype._componentCategory = "behaviors";

glam.Behavior.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	
	if (this.autoStart)
		this.start();
}

glam.Behavior.prototype.start = function()
{
	this.startTime = glam.Time.instance.currentTime;
	this.running = true;
}

glam.Behavior.prototype.stop = function()
{
	this.startTime = 0;
	this.running = false;
}

glam.Behavior.prototype.toggle = function()
{
	if (this.running)
		this.stop();
	else
		this.start();
}

glam.Behavior.prototype.update = function()
{
	if (this.running)
	{
		// N.B.: soon, add logic to subtract suspend times
		var now = glam.Time.instance.currentTime;
		var elapsedTime = (now - this.startTime) / 1000;
		
		this.evaluate(elapsedTime);
	}
}

glam.Behavior.prototype.evaluate = function(t)
{
	if (glam.Behavior.WARN_ON_ABSTRACT)
		glam.System.warn("Abstract Behavior.evaluate called");
}

glam.Behavior.WARN_ON_ABSTRACT = true;
