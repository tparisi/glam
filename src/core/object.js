/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 *
 * @author Tony Parisi
 */
module.exports = Object;

var EventDispatcher = require("../events/eventDispatcher");
var Transform = require("../scene/transform");
var System = require("../system/system");

var util = require("util");

util.inherits(Object, EventDispatcher);

/**
 * Creates a new Object.
 * @constructor
 * @extends {EventDispatcher}
 */
Object = function Object(param) {
    EventDispatcher.call(this);

    /**
     * @type {number}
     * @private
     */
    this._id = Object.nextId++;

    /**
     * @type {Object}
     * @private
     */
    this._parent = null;

    /**
     * @type {Array.<Object>}
     * @private
     */
    this._children = [];

    /**
     * @type {Array}
     * @private
     */
    this._components = [];

    /**
     * @type {String}
     * @public
     */
    this.name = "";

    /**
     * @type {Boolean}
     * @private
     */
    this._realizing = false;

    /**
     * @type {Boolean}
     * @private
     */
    this._realized = false;

    // Automatically create a transform component unless the caller says not to
    var autoCreateTransform = true;
    if (param && param.autoCreateTransform !== undefined)
    	autoCreateTransform = param.autoCreateTransform;

	if (autoCreateTransform)
	{
		this.addComponent(new Transform(param));
	}
}


/**
 * The next identifier to hand out.
 * @type {number}
 * @private
 */
Object.nextId = 0;

Object.prototype.getID = function() {
    return this._id;
}

//---------------------------------------------------------------------
// Hierarchy methods
//---------------------------------------------------------------------

/**
 * Sets the parent of the Object.
 * @param {Object} parent The parent of the Object.
 * @private
 */
Object.prototype.setParent = function(parent) {
    this._parent = parent;
}

/**
 * Adds a child to the Object.
 * @param {Object} child The child to add.
 */
Object.prototype.addChild = function(child) {
    if (!child)
    {
        throw new Error('Cannot add a null child');
    }

    if (child._parent)
    {
        throw new Error('Child is already attached to an Object');
    }

    child.setParent(this);
    this._children.push(child);

    if ((this._realizing || this._realized) && !child._realized)
    {
    	child.realize();
    }

}

/**
 * Removes a child from the Object
 * @param {Object} child The child to remove.
 */
Object.prototype.removeChild = function(child) {
    var i = this._children.indexOf(child);

    if (i != -1)
    {
        this._children.splice(i, 1);
        child.removeAllComponents();
        child.setParent(null);
        child._realized = child._realizing = false;
    }
}

/**
 * Removes a child from the Object
 * @param {Object} child The child to remove.
 */
Object.prototype.getChild = function(index) {
	if (index >= this._children.length)
		return null;

	return this._children[index];
}

//---------------------------------------------------------------------
// Component methods
//---------------------------------------------------------------------

/**
 * Adds a Component to the Object.
 * @param {Component} component.
 */
Object.prototype.addComponent = function(component) {
    if (!component)
    {
        throw new Error('Cannot add a null component');
    }

    if (component._object)
    {
        throw new Error('Component is already attached to an Object')
    }

    var proto = Object.getPrototypeOf(component);
    if (proto._componentProperty)
    {
    	if (this[proto._componentProperty])
    	{
    		var t = proto._componentPropertyType;
            System.warn('Object already has a ' + t + ' component');
            return;
    	}

    	this[proto._componentProperty] = component;
    }

    if (proto._componentCategory)
    {
    	if (!this[proto._componentCategory])
    		this[proto._componentCategory] = [];

    	this[proto._componentCategory].push(component);
    }

    this._components.push(component);
    component.setObject(this);

    if ((this._realizing || this._realized) && !component._realized)
    {
    	component.realize();
    }
}

/**
 * Removes a Component from the Object.
 * @param {Component} component.
 */
Object.prototype.removeComponent = function(component) {
	if (!component)
		return;

    var i = this._components.indexOf(component);

    if (i != -1)
    {
    	if (component.removeFromScene)
    	{
    		component.removeFromScene();
    	}

        this._components.splice(i, 1);
        component.setObject(null);
    }

    var proto = Object.getPrototypeOf(component);
    if (proto._componentProperty)
    {
    	this[proto._componentProperty] = null;
    }

    if (proto._componentCategory)
    {
    	if (this[proto._componentCategory]) {
    		var cat = this[proto._componentCategory];
    		i = cat.indexOf(component);
    		if (i != -1)
    			cat.splice(i, 1);
    	}
    }

}

/**
 * Removes all Components from the Object in one call
 * @param {Component} component.
 */
Object.prototype.removeAllComponents = function() {
    var i, len = this._components.length;

    for (i = 0; i < len; i++)
    {
    	var component = this._components[i];
    	if (component.removeFromScene)
    	{
    		component.removeFromScene();
    		component._realized = component._realizing = false;
    	}

        component.setObject(null);
    }
}

/**
 * Retrieves a Component of a given type in the Object.
 * @param {Object} type.
 */
Object.prototype.getComponent = function(type) {
	var i, len = this._components.length;

	for (i = 0; i < len; i++)
	{
		var component = this._components[i];
		if (component instanceof type)
		{
			return component;
		}
	}

	return null;
}

/**
 * Retrieves a Component of a given type in the Object.
 * @param {Object} type.
 */
Object.prototype.getComponents = function(type) {
	var i, len = this._components.length;

	var components = [];

	for (i = 0; i < len; i++)
	{
		var component = this._components[i];
		if (component instanceof type)
		{
			components.push(component);
		}
	}

	return components;
}

//---------------------------------------------------------------------
//Initialize methods
//---------------------------------------------------------------------

Object.prototype.realize = function() {
    this._realizing = true;

    this.realizeComponents();
    this.realizeChildren();

    this._realized = true;
}

/**
 * @private
 */
Object.prototype.realizeComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        if (!this._components[i]._realized) {
        	// in case we're part of a previously-removed object getting re-parented
        	this._components[i].setObject(this);
        	this._components[i].realize();
        }
    }
}

/**
 * @private
 */
Object.prototype.realizeChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        if (!this._children[i]._realized) {
        	this._children[i].realize();
        }
    }
}

//---------------------------------------------------------------------
// Update methods
//---------------------------------------------------------------------

Object.prototype.update = function() {
    this.updateComponents();
    this.updateChildren();
}

/**
 * @private
 */
Object.prototype.updateComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._components[i].update();
    }
}

/**
 * @private
 */
Object.prototype.updateChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._children[i].update();
    }
}

//---------------------------------------------------------------------
// Traversal and query methods
//---------------------------------------------------------------------

Object.prototype.traverse = function (callback) {

	callback(this);

    var i, count = this._children.length;
	for (i = 0; i < count ; i ++ ) {

		this._children[ i ].traverse( callback );
	}
}

Object.prototype.findCallback = function(n, query, found) {
	if (typeof(query) == "string")
	{
		if (n.name == query)
			found.push(n);
	}
	else if (query instanceof RegExp)
	{
		var match  = n.name.match(query);
		if (match && match.length)
			found.push(n);
	}
	else if (query instanceof Function) {
		if (n instanceof query)
			found.push(n);
		else {
			var components = n.getComponents(query);
			var i, len = components.length;
			for (i = 0; i < len; i++)
				found.push(components[i]);
		}
	}
}

Object.prototype.findNode = function(str) {
	var that = this;
	var found = [];
	this.traverse(function (o) { that.findCallback(o, str, found); });

	return found[0];
}

Object.prototype.findNodes = function(query) {
	var that = this;
	var found = [];
	this.traverse(function (o) { that.findCallback(o, query, found); });

	return found;
}

Object.prototype.map = function(query, callback){
	var found = this.findNodes(query);
	var i, len = found.length;

	for (i = 0; i < len; i++) {
		callback(found[i]);
	}
}
