/**
 * @fileoverview EventDispatcher is the base class for any object that sends/receives messages
 *
 * @author Tony Parisi
 */
module.exports = EventDispatcher;

var EventService = require("./eventService");
var Time = require("./time/time");

/**
 * @constructor
 */
function EventDispatcher() {
    this.eventTypes = {};
    this.timestamps = {};
    this.connections = {};
}

EventDispatcher.prototype.addEventListener = function(type, listener) {
    var listeners = this.eventTypes[type];
    if (listeners)
    {
        if (listeners.indexOf(listener) != -1)
        {
            return;
        }
    }
    else
    {
    	listeners = [];
        this.eventTypes[type] = listeners;
        this.timestamps[type] = 0;
    }

    listeners.push(listener);
}

EventDispatcher.prototype.removeEventListener =  function(type, listener) {
    if (listener)
    {
        var listeners = this.eventTypes[type];

        if (listeners)
        {
            var i = listeners.indexOf(listener);
            if (i != -1)
            {
            	listeners.splice(i, 1);
            }
        }
    }
    else
    {
        delete this.eventTypes[type];
        delete this.timestamps[type];
    }
}

EventDispatcher.prototype.dispatchEvent = function(type) {
    var listeners = this.eventTypes[type];

    if (listeners)
    {
    	var now = Time.instance.currentTime;

    	if (this.timestamps[type] < now)
    	{
    		this.timestamps[type] = now;
	    	EventService.eventsPending = true;

    		[].shift.call(arguments);
	    	for (var i = 0; i < listeners.length; i++)
	        {
                listeners[i].apply(this, arguments);
	        }
    	}
    }
}

EventDispatcher.prototype.hasEventListener = function (subscribers, subscriber) {
    var listeners = this.eventTypes[type];
    if (listeners)
        return (listeners.indexOf(listener) != -1)
    else
    	return false;
}

EventDispatcher.prototype.connect = function(type, target, targetProp) {
    var connections = this.connections[type];
    if (connections)
    {
    	/*
        if (connections.indexOf(target) != -1)
        {
            return;
        }
        */
    }
    else
    {
    	connections = [];
        this.connections[type] = connections;
    }

    var that = this;
    var listener = (function() { return function() { that.handleConnection(null, target, targetProp, arguments); } }) ();
    var connection = { listener : listener, sourceProp : null, target : target,
    		targetProp : targetProp };
    connections.push(connection);
    var connection = this.addEventListener(type, listener);
}

EventDispatcher.prototype.handleConnection = function(sourceProp, target, targetProp, args) {
	var targetValue = target[targetProp];

	if (typeof targetValue == "function") {
		targetValue.apply(target, args);
	}
	else if (typeof targetValue == "object") {
		if (targetValue.copy && typeof targetValue.copy == "function") {
			targetValue.copy(sourceProp ? args[0][sourceProp] : args[0]);
			}
	}
	else {
		target[targetProp] = sourceProp ? args[0][sourceProp] : args[0];
	}
}
