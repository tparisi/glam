/**
 * @fileoverview Behavior component - base class for time-based behaviors
 *
 * @author Tony Parisi
 */

// goog.provide('glam.Behavior');

module.exports = Behavior;

var Component = require("../core/component");
var Time = require("../time/time");
var System = require("../system/system");
var util = require("util");

util.inherits(Behavior, Component);

function  Behavior(param) {
	param = param || {};
	this.startTime = 0;
	this.running = false;
	this.loop = (param.loop !== undefined) ? param.loop : false;
	this.autoStart = (param.autoStart !== undefined) ? param.autoStart : false;
    Component.call(this, param);
}


Behavior.prototype._componentCategory = "behaviors";

Behavior.prototype.realize = function()
{
	Component.prototype.realize.call(this);

	if (this.autoStart)
		this.start();
}

Behavior.prototype.start = function()
{
	this.startTime = Time.instance.currentTime;
	this.running = true;
}

Behavior.prototype.stop = function()
{
	this.startTime = 0;
	this.running = false;
}

Behavior.prototype.toggle = function()
{
	if (this.running)
		this.stop();
	else
		this.start();
}

Behavior.prototype.update = function()
{
	if (this.running)
	{
		// N.B.: soon, add logic to subtract suspend times
		var now = Time.instance.currentTime;
		var elapsedTime = (now - this.startTime) / 1000;

		this.evaluate(elapsedTime);
	}
}

Behavior.prototype.evaluate = function(t)
{
	if (Behavior.WARN_ON_ABSTRACT)
		System.warn("Abstract Behavior.evaluate called");
}

Behavior.WARN_ON_ABSTRACT = true;
