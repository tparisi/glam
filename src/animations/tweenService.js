/**
 *
 */
// goog.provide('TweenService');

module.exports = TweenService;

var Service = require("../core/service");
var util = require("util");

/**
 * The TweenService.
 *
 * @extends {Service}
 */
TweenService = function() {};

goog.inherits(TweenService, Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
TweenService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
TweenService.prototype.terminate = function() {};


/**
 * Updates the TweenService.
 */
TweenService.prototype.update = function()
{
	if (window.TWEEN)
		TWEEN.update();
}
