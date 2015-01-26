/**
 * @fileoverview Base class for visual decoration - like glam.Visual but not pickable.
 * @author Tony Parisi
 */
goog.provide('glam.Decoration');
goog.require('glam.Visual');

/**
 * @constructor
 */
glam.Decoration = function(param)
{
	param = param || {};
	
	glam.Visual.call(this, param);

}

goog.inherits(glam.Decoration, glam.Visual);

glam.Decoration.prototype._componentCategory = "decorations";

glam.Decoration.prototype.realize = function()
{
	glam.Visual.prototype.realize.call(this);
	this.object.ignorePick = true;
}