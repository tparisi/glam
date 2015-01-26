/**
 *
 */
goog.require('glam.Service');
goog.provide('glam.EventService');

/**
 * The EventService.
 *
 * @extends {glam.Service}
 */
glam.EventService = function() {};

goog.inherits(glam.EventService, glam.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
glam.EventService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
glam.EventService.prototype.terminate = function() {};


/**
 * Updates the EventService.
 */
glam.EventService.prototype.update = function()
{
	do
	{
		glam.EventService.eventsPending = false;
		glam.Application.instance.updateObjects();
	}
	while (glam.EventService.eventsPending);
}