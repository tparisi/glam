
/**
 * @fileoverview Service locator for various game services.
 */
goog.provide('glam.Services');
goog.require('glam.Time');
goog.require('glam.Input');
goog.require('glam.TweenService');
goog.require('glam.EventService');
goog.require('glam.GraphicsThreeJS');

glam.Services = {};

glam.Services._serviceMap = 
{ 
		"time" : { object : glam.Time },
		"input" : { object : glam.Input },
		"tween" : { object : glam.TweenService },
		"events" : { object : glam.EventService },
		"graphics" : { object : glam.GraphicsThreeJS },
};

glam.Services.create = function(serviceName)
{
	var serviceType = glam.Services._serviceMap[serviceName];
	if (serviceType)
	{
		var prop = serviceType.property;
		
		if (glam.Services[serviceName])
		{
	        throw new Error('Cannot create two ' + serviceName + ' service instances');
		}
		else
		{
			if (serviceType.object)
			{
				var service = new serviceType.object;
				glam.Services[serviceName] = service;

				return service;
			}
			else
			{
		        throw new Error('No object type supplied for creating service ' + serviceName + '; cannot create');
			}
		}
	}
	else
	{
        throw new Error('Unknown service: ' + serviceName + '; cannot create');
	}
}

glam.Services.registerService = function(serviceName, object)
{
	if (glam.Services._serviceMap[serviceName])
	{
        throw new Error('Service ' + serviceName + 'already registered; cannot register twice');
	}
	else
	{
		var serviceType = { object: object };
		glam.Services._serviceMap[serviceName] = serviceType;
	}
}