/**
 * @fileoverview MoveBehavior - simple angular rotation
 * 
 * @author Tony Parisi
 */

goog.provide('glam.MoveBehavior');
goog.require('glam.Behavior');

glam.MoveBehavior = function(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.moveVector = (param.moveVector !== undefined) ? param.moveVector : new THREE.Vector3(0, 1, 0);
	this.tween = null;
    glam.Behavior.call(this, param);
}

goog.inherits(glam.MoveBehavior, glam.Behavior);

glam.MoveBehavior.prototype.start = function()
{
	if (this.running)
		return;

	this.movePosition = new THREE.Vector3;
	this.moveEndPosition = this.moveVector.clone();
	this.prevMovePosition = new THREE.Vector3;
	this.moveDelta = new THREE.Vector3;
	this.tween = new TWEEN.Tween(this.movePosition).to(this.moveEndPosition, this.duration * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();
	
	glam.Behavior.prototype.start.call(this);
}

glam.MoveBehavior.prototype.evaluate = function(t)
{
	if (t >= this.duration)
	{
		this.stop();
		if (this.loop) {
			this.start();
		}
		else {
			this.dispatchEvent("complete");
		}
	}
	
	this.moveDelta.copy(this.movePosition).sub(this.prevMovePosition);
	this.prevMovePosition.copy(this.movePosition);
	this._object.transform.position.add(this.moveDelta);
}


glam.MoveBehavior.prototype.stop = function()
{
	if (this.tween)
		this.tween.stop();
	
	glam.Behavior.prototype.stop.call(this);
}