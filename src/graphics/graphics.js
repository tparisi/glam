/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Graphics');

glam.Graphics = function()
{
	// Freak out if somebody tries to make 2
    if (glam.Graphics.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
	
	glam.Graphics.instance = this;
}
	        
glam.Graphics.instance = null;
