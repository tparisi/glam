/**
 * @fileoverview General-purpose transitions
 * @author Tony Parisi
 */
goog.provide('glam.Transition');
goog.require('glam.Component');

// Transition class
// Construction/initialization
glam.Transition = function(param) 
{
    glam.Component.call(this, param);
	    		
	param = param || {};
	
	this.running = false;
	this.duration = param.duration ? param.duration : glam.Transition.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.autoStart = param.autoStart || false;
	this.easing = param.easing || glam.Transition.default_easing;
	this.target = param.target;
	this.to = param.to;
}

goog.inherits(glam.Transition, glam.Component);
	
glam.Transition.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
	this.createTweens();
	if (this.autoStart) {
		this.start();
	}
}

glam.Transition.prototype.createTweens = function()
{
	var repeatCount = this.loop ? Infinity : 0;
	
	var that = this;
	this.tween = new TWEEN.Tween(this.target)
		.to(this.to, this.duration)
		.easing(this.easing)
		.repeat(repeatCount)
		.onComplete(function() {
			that.onTweenComplete();
		})
		;
}

// Start/stop
glam.Transition.prototype.start = function()
{
	if (this.running)
		return;
	
	this.running = true;
	
	this.tween.start();
}

glam.Transition.prototype.stop = function()
{
	if (!this.running)
		return;
	
	this.running = false;
	this.dispatchEvent("complete");

	this.tween.stop();
}

glam.Transition.prototype.onTweenComplete = function()
{
	this.running = false;
	this.dispatchEvent("complete");
}
// Statics
glam.Transition.default_duration = 1000;
glam.Transition.default_easing = TWEEN.Easing.Linear.None;