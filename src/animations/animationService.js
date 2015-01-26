/**
 *
 */
goog.require('glam.Service');
goog.provide('glam.AnimationService');

/**
 * The AnimationService.
 *
 * @extends {glam.Service}
 */
glam.AnimationService = function() {};

goog.inherits(glam.AnimationService, glam.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
glam.AnimationService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
glam.AnimationService.prototype.terminate = function() {};


/**
 * Updates the AnimationService.
 */
glam.AnimationService.prototype.update = function()
{
	if (window.TWEEN)
		THREE.glTFAnimator.update();
}
