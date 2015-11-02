/**
 * @fileoverview FadeBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.FadeBehavior');
goog.require('glam.Behavior');

glam.FadeBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.opacity = (param.opacity !== undefined) ? param.opacity : 0.5;
	this.savedOpacities = [];
	this.savedTransparencies = [];
	this.tween = null;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.FadeBehavior, glam.Behavior);

glam.FadeBehavior.prototype.start = function()
{
	if (this.running)
		return;

	if (this._realized && this._object.visuals) {
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			this.savedOpacities.push(visuals[i].material.opacity);
			this.savedTransparencies.push(visuals[i].material.transparent);
			visuals[i].material.transparent = this.opacity < 1 ? true : false;
		}	
	}
	
	this.value = { opacity : this.savedOpacities[0] };
	this.targetValue = { opacity : this.opacity };
	this.tween = new TWEEN.Tween(this.value).to(this.targetValue, this.duration * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.start();
	
	glam.Behavior.prototype.start.call(this);
}

glam.FadeBehavior.prototype.evaluate = function(t)
{
	if (t >= this.duration)
	{
		this.stop();
		if (this.loop)
			this.start();
	}
	
	if (this._object.visuals)
	{
		var visuals = this._object.visuals;
		var i, len = visuals.length;
		for (i = 0; i < len; i++) {
			visuals[i].material.opacity = this.value.opacity;
		}	
	}

}


glam.FadeBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();

	glam.Behavior.prototype.stop.call(this);
}
