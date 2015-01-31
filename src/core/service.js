/**
 * @author Tony Parisi
 */

module.exports = Service;

/**
 * Interface for a Service.
 *
 * Allows multiple different backends for the same type of service.
 * @interface
 */
Service = function() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the Service - Abstract.
 */
Service.prototype.initialize = function(param) {};

/**
 * Terminates the Service - Abstract.
 */
Service.prototype.terminate = function() {};


/**
 * Updates the Service - Abstract.
 */
Service.prototype.update = function() {};
