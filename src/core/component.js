/**
 * @fileoverview Component is the base class for defining capabilities used within an Object
 *
 * @author Tony Parisi
 */
module.exports = Component;

var EventDispatcher = require("../events/eventDispatcher");

var util = require("util");

util.inherits(Component, EventDispatcher);


/**
 * Creates a new Component.
 * @constructor
 */
Component = function(param) {
    EventDispatcher.call(this);

	param = param || {};

    /**
     * @type {Object}
     * @private
     */
    this._object = null;

    /**
     * @type {Boolean}
     * @private
     */
    this._realized = false;
}


/**
 * Gets the Object the Component is associated with.
 * @returns {Object} The Object the Component is associated with.
 */
Component.prototype.getObject = function() {
    return this._object;
}

/**
 * Sets the Object the Component is associated with.
 * @param {Object} object
 */
Component.prototype.setObject = function(object) {
    this._object = object;
}

Component.prototype.realize = function() {
    this._realized = true;
}

Component.prototype.update = function() {
}
