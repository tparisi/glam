/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Time');

glam.Time = function()
{
	// Freak out if somebody tries to make 2
    if (glam.Time.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
}


glam.Time.prototype.initialize = function(param)
{
	this.currentTime = Date.now();

	glam.Time.instance = this;
}

glam.Time.prototype.update = function()
{
	this.currentTime = Date.now();
}

glam.Time.instance = null;
	        
