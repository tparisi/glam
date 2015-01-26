/**
 * @author Tony Parisi
 */
goog.provide('glam.Service');

/**
 * Interface for a Service.
 *
 * Allows multiple different backends for the same type of service.
 * @interface
 */
glam.Service = function() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the Service - Abstract.
 */
glam.Service.prototype.initialize = function(param) {};

/**
 * Terminates the Service - Abstract.
 */
glam.Service.prototype.terminate = function() {};


/**
 * Updates the Service - Abstract.
 */
glam.Service.prototype.update = function() {};