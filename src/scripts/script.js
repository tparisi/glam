/**
 * @fileoverview Behavior component - base class for time-based behaviors
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Script');
goog.require('glam.Component');

glam.Script = function(param) {
	param = param || {};
    glam.Component.call(this, param);
}

goog.inherits(glam.Script, glam.Component);

glam.Script.prototype._componentCategory = "scripts";

glam.Script.prototype.realize = function()
{
	glam.Component.prototype.realize.call(this);
}

glam.Script.prototype.update = function()
{
	if (glam.Script.WARN_ON_ABSTRACT)
		glam.System.warn("Abstract Script.evaluate called");
}

glam.Script.WARN_ON_ABSTRACT = true;
