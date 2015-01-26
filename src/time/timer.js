/**
 * @fileoverview Timer - component that generates time events
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Timer');
goog.require('glam.Component');

glam.Timer = function(param)
{
    glam.Component.call(this);
    param = param || {};
    
    this.currentTime = glam.Time.instance.currentTime;
    this.running = false;
    this.duration = param.duration ? param.duration : 0;
    this.loop = (param.loop !== undefined) ? param.loop : false;
    this.lastFraction = 0;
}

goog.inherits(glam.Timer, glam.Component);

glam.Timer.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = glam.Time.instance.currentTime;
	var deltat = now - this.currentTime;
	
	if (deltat)
	{
	    this.dispatchEvent("time", now);		
	}
	
	if (this.duration)
	{
		var mod = now % this.duration;
		var fract = mod / this.duration;
		
		this.dispatchEvent("fraction", fract);
		
		if (fract < this.lastFraction)
		{
			this.dispatchEvent("cycleTime");
			
			if (!this.loop)
			{
				this.stop();
			}
		}
		
		this.lastFraction = fract;
	}
	
	this.currentTime = now;
	
}

glam.Timer.prototype.start = function()
{
	this.running = true;
	this.currentTime = glam.Time.instance.currentTime;
}

glam.Timer.prototype.stop = function()
{
	this.running = false;
}

