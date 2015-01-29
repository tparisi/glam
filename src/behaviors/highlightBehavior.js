/**
 * @fileoverview HighlightBehavior - simple angular rotation
 *
 * @author Tony Parisi
 */

// goog.provide('HighlightBehavior');

module.exports = HighlightBehavior;

var Behavior = require("./behaviour");
var util = require("util");

util.inherits(HighlightBehavior, Behavior);

function HighlightBehavior(param) {
	param = param || {};
	this.highlightColor = (param.highlightColor !== undefined) ? param.highlightColor : 0xffffff;
	this.savedColors = [];
    Behavior.call(this, param);
}


HighlightBehavior.prototype.start = function()
{
	Behavior.prototype.start.call(this);

	if (this._realized && this._object.visuals) {
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			this.savedColors.push(visuals[i].material.color.getHex());
			visuals[i].material.color.setHex(this.highlightColor);
		}
	}
}

HighlightBehavior.prototype.evaluate = function(t)
{
}

HighlightBehavior.prototype.stop = function()
{
	Behavior.prototype.stop.call(this);

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
HighlightBehavior.prototype.on = HighlightBehavior.prototype.start;
HighlightBehavior.prototype.off = HighlightBehavior.prototype.stop;
