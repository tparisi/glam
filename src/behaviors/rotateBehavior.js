/**
 * @fileoverview RotateBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.RotateBehavior');
goog.require('glam.Behavior');

glam.RotateBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.velocity = (param.velocity !== undefined) ? param.velocity : (Math.PI / 2 / this.duration);
	this.startAngle = 0;
	this.angle = 0;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.RotateBehavior, glam.Behavior);

glam.RotateBehavior.prototype.start = function()
{
	this.angle = 0;
	this._object.transform.rotation.y = this._object.transform.rotation.y % (Math.PI * 2);
	this.startAngle = this._object.transform.rotation.y;
	
	glam.Behavior.prototype.start.call(this);
}

glam.RotateBehavior.prototype.evaluate = function(t)
{
	var twopi = Math.PI * 2;
	this.angle = this.velocity * t;
	if (this.angle >= twopi)
	{
		if (this.once) 
			this.angle = twopi;
		else
			this.angle = this.angle % twopi;
	}
		
	this._object.transform.rotation.y = this.startAngle + this.angle;
	
	if (this.once && this.angle >= twopi)
	{
		this.stop();
	}
}