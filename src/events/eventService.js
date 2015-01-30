/**
 *
 */
module.exports = EventService;

var Application = require("../core/application");
var util = require("util");

util.inherits(EventService, Service);

/**
 * The EventService.
 *
 * @extends {Service}
 */
function EventService() {};


//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the events system.
 */
EventService.prototype.initialize = function(param) {};

/**
 * Terminates the events world.
 */
EventService.prototype.terminate = function() {};


/**
 * Updates the EventService.
 */
EventService.prototype.update = function()
{
	do
	{
		EventService.eventsPending = false;
		Application.instance.updateObjects();
	}
	while (EventService.eventsPending);
}
