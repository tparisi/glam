/**
 * @fileoverview General-purpose transitions
 * @author Tony Parisi
 */
// goog.provide('glam.Transition');

module.exports = Transition;

var Component = require("../core/component");
var util = require("util");

util.inherits(Transition, Component);

// Transition class
// Construction/initialization
function Transition(param)
{
    Component.call(this, param);

	param = param || {};

	this.running = false;
	this.duration = param.duration ? param.duration : Transition.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.autoStart = param.autoStart || false;
	this.easing = param.easing || Transition.default_easing;
	this.target = param.target;
	this.to = param.to;
}

Transition.prototype.realize = function()
{
	Component.prototype.realize.call(this);
	this.createTweens();
	if (this.autoStart) {
		this.start();
	}
}

Transition.prototype.createTweens = function()
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
Transition.prototype.start = function()
{
	if (this.running)
		return;

	this.running = true;

	this.tween.start();
}

Transition.prototype.stop = function()
{
	if (!this.running)
		return;

	this.running = false;
	this.dispatchEvent("complete");

	this.tween.stop();
}

Transition.prototype.onTweenComplete = function()
{
	this.running = false;
	this.dispatchEvent("complete");
}
// Statics
Transition.default_duration = 1000;
Transition.default_easing = TWEEN.Easing.Linear.None;
