/**
 *
 */
module.exports = AnimationService;

var Service = require('../core/service');
var util = require("util");

util.inherits(AnimationService, Service);

//goog.provide('glam.AnimationService');

/**
 * The AnimationService.
 *
 * @extends {glam.Service}
 */
function AnimationService() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
AnimationService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
AnimationService.prototype.terminate = function() {};


/**
 * Updates the AnimationService.
 */
AnimationService.prototype.update = function()
{
	if (window.TWEEN)
		THREE.glTFAnimator.update();
}
