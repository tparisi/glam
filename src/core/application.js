/**
 * @fileoverview The base Application class
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Application');
goog.require('glam.EventDispatcher');
goog.require('glam.Time');
goog.require('glam.Input');
goog.require('glam.Services');

/**
 * @constructor
 */
glam.Application = function(param)
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	glam.EventDispatcher.call(this);
	glam.Application.instance = this;
	this.initialize(param);
}

goog.inherits(glam.Application, glam.EventDispatcher);

glam.Application.prototype.initialize = function(param)
{
	param = param || {};

	this.running = false;
	this.tabstop = param.tabstop;
	
	this._services = [];
	this._objects = [];

	// Add required services first
	this.addService("time");
	this.addService("input");
	
	// Add optional (game-defined) services next
	this.addOptionalServices();

	// Add events and rendering services last - got to;
	this.addService("tween");
	this.addService("events");
	this.addService("graphics");
	
	// Start all the services
	this.initServices(param);
}

glam.Application.prototype.addService = function(serviceName)
{
	var service = glam.Services.create(serviceName);
	this._services.push(service);	
}

glam.Application.prototype.initServices = function(param)
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].initialize(param);
	}
}

glam.Application.prototype.addOptionalServices = function()
{
}

glam.Application.prototype.focus = function()
{
	// Hack hack hack should be the input system
	glam.Graphics.instance.focus();
}

glam.Application.prototype.run = function()
{
    // core game loop here
	this.realizeObjects();
	glam.Graphics.instance.scene.updateMatrixWorld();
	this.lastFrameTime = Date.now();
	this.running = true;
	this.runloop();
}
	        
glam.Application.prototype.runloop = function()
{
	var now = Date.now();
	var deltat = now - this.lastFrameTime;
	
	if (deltat >= glam.Application.minFrameTime)
	{
		this.updateServices();
        this.lastFrameTime = now;
	}
	
	var that = this;
    requestAnimationFrame( function() { that.runloop(); } );
}

glam.Application.prototype.updateServices = function()
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].update();
	}
}

glam.Application.prototype.updateObjects = function()
{
	var i, len = this._objects.length;
	
	for (i = 0; i < len; i++)
	{
		this._objects[i].update();
	}
	
}

glam.Application.prototype.addObject = function(o)
{
	this._objects.push(o);
	if (this.running) {
		o.realize();
	}
}

glam.Application.prototype.removeObject = function(o) {
    var i = this._objects.indexOf(o);
    if (i != -1) {
    	// N.B.: I suppose we could be paranoid and check to see if I actually own this component
        this._objects.splice(i, 1);
    }
}

glam.Application.prototype.realizeObjects = function()
{
	var i, len = this._objects.length;
	
	for (i = 0; i < len; i++)
	{
		this._objects[i].realize();
	}
	
}
	
glam.Application.prototype.onMouseMove = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseMove)
	{
		this.mouseDelegate.onMouseMove(event);
	}
}

glam.Application.prototype.onMouseDown = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDown)
	{
		this.mouseDelegate.onMouseDown(event);
	}
}

glam.Application.prototype.onMouseUp = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseUp)
	{
		this.mouseDelegate.onMouseUp(event);
	}
}

glam.Application.prototype.onMouseClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseClick)
	{
		this.mouseDelegate.onMouseClick(event);
	}
}

glam.Application.prototype.onMouseDoubleClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDoubleClick)
	{
		this.mouseDelegate.onMouseDoubleClick(event);
	}
}

glam.Application.prototype.onMouseScroll = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseScroll)
	{
		this.mouseDelegate.onMouseScroll(event);
	}
}

glam.Application.prototype.onKeyDown = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyDown)
	{
		this.keyboardDelegate.onKeyDown(event);
	}
}

glam.Application.prototype.onKeyUp = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyUp)
	{
		this.keyboardDelegate.onKeyUp(event);
	}
}

glam.Application.prototype.onKeyPress = function(event)
{
	if (this.keyboardDelegate  && this.keyboardDelegate.onKeyPress)
	{
		this.keyboardDelegate.onKeyPress(event);
	}
}	

/* statics */

glam.Application.instance = null;
glam.Application.curObjectID = 0;
glam.Application.minFrameTime = 1;
	    	
glam.Application.handleMouseMove = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseMove)
    	glam.Application.instance.onMouseMove(event);	            	
}

glam.Application.handleMouseDown = function(event)
{
    // Click to focus
    if (glam.Application.instance.tabstop)
    	glam.Application.instance.focus();
        
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseDown)
    	glam.Application.instance.onMouseDown(event);	            	
}

glam.Application.handleMouseUp = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseUp)
    	glam.Application.instance.onMouseUp(event);	            	
}

glam.Application.handleMouseClick = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseClick)
    	glam.Application.instance.onMouseClick(event);	            	
}

glam.Application.handleMouseDoubleClick = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onMouseDoubleClick)
    	glam.Application.instance.onMouseDoubleClick(event);	            	
}

glam.Application.handleMouseScroll = function(event)
{
    if (glam.PickManager && glam.PickManager.overObject)
    	return;
    
    if (glam.Application.instance.onMouseScroll)
    	glam.Application.instance.onMouseScroll(event);	            	
}

glam.Application.handleTouchStart = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onTouchStart)
    	glam.Application.instance.onTouchStart(event);	            	
}

glam.Application.handleTouchMove = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onTouchMove)
    	glam.Application.instance.onTouchMove(event);	            	
}

glam.Application.handleTouchEnd = function(event)
{
    if (glam.PickManager && glam.PickManager.clickedObject)
    	return;
    
    if (glam.Application.instance.onTouchEnd)
    	glam.Application.instance.onTouchEnd(event);	            	
}

glam.Application.handleKeyDown = function(event)
{
    if (glam.Application.instance.onKeyDown)
    	glam.Application.instance.onKeyDown(event);	            	
}

glam.Application.handleKeyUp = function(event)
{
    if (glam.Application.instance.onKeyUp)
    	glam.Application.instance.onKeyUp(event);	            	
}

glam.Application.handleKeyPress = function(event)
{
    if (glam.Application.instance.onKeyPress)
    	glam.Application.instance.onKeyPress(event);	            	
}

glam.Application.prototype.onTouchMove = function(event)
{
	if (this.touchDelegate  && this.touchDelegate.onTouchMove)
	{
		this.touchDelegate.onTouchMove(event);
	}
}

glam.Application.prototype.onTouchStart = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchStart)
	{
		this.touchDelegate.onTouchStart(event);
	}
}

glam.Application.prototype.onTouchEnd = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchEnd)
	{
		this.touchDelegate.onTouchEnd(event);
	}
}

