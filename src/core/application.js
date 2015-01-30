/**
 * @fileoverview The base Application class
 *
 * @author Tony Parisi
 */

module.exports = Application;

var EventDispatcher = require("../events/eventDispatcher");
var Time = require("../time/time");
var Input = require("../input/input");
var Services = require("./services");
var Graphics = require("../graphics/graphics");
var PickManager = require("../input/pickManager");

var util = require("util");

util.inherits(Application, EventDispatcher);

/**
 * @constructor
 */
function Application(param)
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	EventDispatcher.call(this);
	Application.instance = this;
	this.initialize(param);
}


Application.prototype.initialize = function(param)
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

Application.prototype.addService = function(serviceName)
{
	var service = Services.create(serviceName);
	this._services.push(service);
}

Application.prototype.initServices = function(param)
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].initialize(param);
	}
}

Application.prototype.addOptionalServices = function()
{
}

Application.prototype.focus = function()
{
	// Hack hack hack should be the input system
	Graphics.instance.focus();
}

Application.prototype.run = function()
{
    // core game loop here
	this.realizeObjects();
	Graphics.instance.scene.updateMatrixWorld();
	this.lastFrameTime = Date.now();
	this.running = true;
	this.runloop();
}

Application.prototype.runloop = function()
{
	var now = Date.now();
	var deltat = now - this.lastFrameTime;

	if (deltat >= Application.minFrameTime)
	{
		this.updateServices();
        this.lastFrameTime = now;
	}

	var that = this;
    requestAnimationFrame( function() { that.runloop(); } );
}

Application.prototype.updateServices = function()
{
	var i, len;
	len = this._services.length;
	for (i = 0; i < len; i++)
	{
		this._services[i].update();
	}
}

Application.prototype.updateObjects = function()
{
	var i, len = this._objects.length;

	for (i = 0; i < len; i++)
	{
		this._objects[i].update();
	}

}

Application.prototype.addObject = function(o)
{
	this._objects.push(o);
	if (this.running) {
		o.realize();
	}
}

Application.prototype.removeObject = function(o) {
    var i = this._objects.indexOf(o);
    if (i != -1) {
    	// N.B.: I suppose we could be paranoid and check to see if I actually own this component
        this._objects.splice(i, 1);
    }
}

Application.prototype.realizeObjects = function()
{
	var i, len = this._objects.length;

	for (i = 0; i < len; i++)
	{
		this._objects[i].realize();
	}

}

Application.prototype.onMouseMove = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseMove)
	{
		this.mouseDelegate.onMouseMove(event);
	}
}

Application.prototype.onMouseDown = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDown)
	{
		this.mouseDelegate.onMouseDown(event);
	}
}

Application.prototype.onMouseUp = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseUp)
	{
		this.mouseDelegate.onMouseUp(event);
	}
}

Application.prototype.onMouseClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseClick)
	{
		this.mouseDelegate.onMouseClick(event);
	}
}

Application.prototype.onMouseDoubleClick = function(event)
{
	if (this.mouseDelegate && this.mouseDelegate.onMouseDoubleClick)
	{
		this.mouseDelegate.onMouseDoubleClick(event);
	}
}

Application.prototype.onMouseScroll = function(event)
{
	if (this.mouseDelegate  && this.mouseDelegate.onMouseScroll)
	{
		this.mouseDelegate.onMouseScroll(event);
	}
}

Application.prototype.onKeyDown = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyDown)
	{
		this.keyboardDelegate.onKeyDown(event);
	}
}

Application.prototype.onKeyUp = function(event)
{
	if (this.keyboardDelegate && this.keyboardDelegate.onKeyUp)
	{
		this.keyboardDelegate.onKeyUp(event);
	}
}

Application.prototype.onKeyPress = function(event)
{
	if (this.keyboardDelegate  && this.keyboardDelegate.onKeyPress)
	{
		this.keyboardDelegate.onKeyPress(event);
	}
}

/* statics */

Application.instance = null;
Application.curObjectID = 0;
Application.minFrameTime = 1;

Application.handleMouseMove = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onMouseMove)
    	Application.instance.onMouseMove(event);
}

Application.handleMouseDown = function(event)
{
    // Click to focus
    if (Application.instance.tabstop)
    	Application.instance.focus();

    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onMouseDown)
    	Application.instance.onMouseDown(event);
}

Application.handleMouseUp = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onMouseUp)
    	Application.instance.onMouseUp(event);
}

Application.handleMouseClick = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onMouseClick)
    	Application.instance.onMouseClick(event);
}

Application.handleMouseDoubleClick = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onMouseDoubleClick)
    	Application.instance.onMouseDoubleClick(event);
}

Application.handleMouseScroll = function(event)
{
    if (PickManager && PickManager.overObject)
    	return;

    if (Application.instance.onMouseScroll)
    	Application.instance.onMouseScroll(event);
}

Application.handleTouchStart = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onTouchStart)
    	Application.instance.onTouchStart(event);
}

Application.handleTouchMove = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onTouchMove)
    	Application.instance.onTouchMove(event);
}

Application.handleTouchEnd = function(event)
{
    if (PickManager && PickManager.clickedObject)
    	return;

    if (Application.instance.onTouchEnd)
    	Application.instance.onTouchEnd(event);
}

Application.handleKeyDown = function(event)
{
    if (Application.instance.onKeyDown)
    	Application.instance.onKeyDown(event);
}

Application.handleKeyUp = function(event)
{
    if (Application.instance.onKeyUp)
    	Application.instance.onKeyUp(event);
}

Application.handleKeyPress = function(event)
{
    if (Application.instance.onKeyPress)
    	Application.instance.onKeyPress(event);
}

Application.prototype.onTouchMove = function(event)
{
	if (this.touchDelegate  && this.touchDelegate.onTouchMove)
	{
		this.touchDelegate.onTouchMove(event);
	}
}

Application.prototype.onTouchStart = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchStart)
	{
		this.touchDelegate.onTouchStart(event);
	}
}

Application.prototype.onTouchEnd = function(event)
{
	if (this.touchDelegate && this.touchDelegate.onTouchEnd)
	{
		this.touchDelegate.onTouchEnd(event);
	}
}
