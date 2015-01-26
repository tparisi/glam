/**
 *
 */
goog.require('glam.Service');
goog.provide('glam.TweenService');

/**
 * The TweenService.
 *
 * @extends {glam.Service}
 */
glam.TweenService = function() {};

goog.inherits(glam.TweenService, glam.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
glam.TweenService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
glam.TweenService.prototype.terminate = function() {};


/**
 * Updates the TweenService.
 */
glam.TweenService.prototype.update = function()
{
	if (window.TWEEN)
		TWEEN.update();
}