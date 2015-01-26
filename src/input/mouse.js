/**
 *
 */
goog.provide('glam.Mouse');

glam.Mouse = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.state = 
	{ x : glam.Mouse.NO_POSITION, y: glam.Mouse.NO_POSITION,

	buttons : { left : false, middle : false, right : false },
	scroll : 0,
	};

	glam.Mouse.instance = this;
};

glam.Mouse.prototype.onMouseMove = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
}

glam.Mouse.prototype.onMouseDown = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = true;
}

glam.Mouse.prototype.onMouseUp = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

glam.Mouse.prototype.onMouseClick = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

glam.Mouse.prototype.onMouseDoubleClick = function(event)
{
    this.state.x = event.elementX;
    this.state.y = event.elementY;	            
    this.state.buttons.left = false;	            
}

glam.Mouse.prototype.onMouseScroll = function(event, delta)
{
    this.state.scroll = 0; // PUNT!
}


glam.Mouse.prototype.getState = function()
{
	return this.state;
}

glam.Mouse.instance = null;
glam.Mouse.NO_POSITION = Number.MIN_VALUE;
