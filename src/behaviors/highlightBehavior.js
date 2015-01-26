/**
 * @fileoverview HighlightBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.HighlightBehavior');
goog.require('glam.Behavior');

glam.HighlightBehavior = function(param) {
	param = param || {};
	this.highlightColor = (param.highlightColor !== undefined) ? param.highlightColor : 0xffffff;
	this.savedColors = [];
    glam.Behavior.call(this, param);
}

goog.inherits(glam.HighlightBehavior, glam.Behavior);

glam.HighlightBehavior.prototype.start = function()
{
	glam.Behavior.prototype.start.call(this);
	
	if (this._realized && this._object.visuals) {
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			this.savedColors.push(visuals[i].material.color.getHex());
			visuals[i].material.color.setHex(this.highlightColor);
		}	
	}
}

glam.HighlightBehavior.prototype.evaluate = function(t)
{
}

glam.HighlightBehavior.prototype.stop = function()
{
	glam.Behavior.prototype.stop.call(this);

	if (this._realized && this._object.visuals)
	{
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			visuals[i].material.color.setHex(this.savedColors[i]);
		}	
	}

}

// Alias a few functions - syntactic sugar
glam.HighlightBehavior.prototype.on = glam.HighlightBehavior.prototype.start;
glam.HighlightBehavior.prototype.off = glam.HighlightBehavior.prototype.stop;
