/**
 * @fileoverview BounceBehavior - simple angular rotation
 *
 * @author Tony Parisi
 */

// goog.provide('BounceBehavior');

module.exports = BounceBehavior;

var Behavior = require("./behavior");
var util = require("util");

util.inherits(BounceBehavior, Behavior);

function BounceBehavior(param) {
	param = param || {};
	this.duration = (param.duration !== undefined) ? param.duration : 1;
	this.bounceVector = (param.bounceVector !== undefined) ? param.bounceVector : new THREE.Vector3(0, 1, 0);
	this.tweenUp = null;
	this.tweenDown = null;
    Behavior.call(this, param);
}

BounceBehavior.prototype.start = function()
{
	if (this.running)
		return;

	this.bouncePosition = new THREE.Vector3;
	this.bounceEndPosition = this.bounceVector.clone();
	this.prevBouncePosition = new THREE.Vector3;
	this.bounceDelta = new THREE.Vector3;
	this.tweenUp = new TWEEN.Tween(this.bouncePosition).to(this.bounceEndPosition, this.duration / 2 * 1000)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.repeat(0)
	.start();

	Behavior.prototype.start.call(this);
}

BounceBehavior.prototype.evaluate = function(t)
{
	this.bounceDelta.copy(this.bouncePosition).sub(this.prevBouncePosition);
	this.prevBouncePosition.copy(this.bouncePosition);

	this._object.transform.position.add(this.bounceDelta);

	if (t >= (this.duration / 2))
	{
		if (this.tweenUp)
		{
			this.tweenUp.stop();
			this.tweenUp = null;
		}

		if (!this.tweenDown)
		{
			this.bouncePosition = this._object.transform.position.clone();
			this.bounceEndPosition = this.bouncePosition.clone().sub(this.bounceVector);
			this.prevBouncePosition = this.bouncePosition.clone();
			this.bounceDelta = new THREE.Vector3;
			this.tweenDown = new TWEEN.Tween(this.bouncePosition).to(this.bounceEndPosition, this.duration / 2 * 1000)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.repeat(0)
			.start();
		}
	}

	if (t >= this.duration)
	{
		this.tweenDown.stop();
		this.tweenDown = null;
		this.stop();

		if (this.loop)
			this.start();
	}
}
