/**
 * @fileoverview Component is the base class for defining capabilities used within an Object
 * 
 * @author Tony Parisi
 */
goog.provide('glam.Component');
goog.require('glam.EventDispatcher');

/**
 * Creates a new Component.
 * @constructor
 */
glam.Component = function(param) {
    glam.EventDispatcher.call(this);
	
	param = param || {};

    /**
     * @type {glam.Object}
     * @private
     */
    this._object = null;
    
    /**
     * @type {Boolean}
     * @private
     */
    this._realized = false;
}

goog.inherits(glam.Component, glam.EventDispatcher);

/**
 * Gets the Object the Component is associated with.
 * @returns {glam.Object} The Object the Component is associated with.
 */
glam.Component.prototype.getObject = function() {
    return this._object;
}

/**
 * Sets the Object the Component is associated with.
 * @param {glam.Object} object
 */
glam.Component.prototype.setObject = function(object) {
    this._object = object;
}

glam.Component.prototype.realize = function() {
    this._realized = true;
}

glam.Component.prototype.update = function() {
}
