
/**
 * @fileoverview Service locator for various game services.
 */
var Services = {};

module.exports = services;

Services._serviceMap =
{
		"time" : { object : require("../time/time")},
		"input" : { object : require("../input/input") },
		"tween" : { object : require("../animations/tweenService") },
		"events" : { object : require("../events/eventService") },
		"graphics" : { object : require("../graphics/graphicsThreeJS") },
};

Services.create = function(serviceName)
{
	var serviceType = Services._serviceMap[serviceName];
	if (serviceType)
	{
		var prop = serviceType.property;

		if (Services[serviceName])
		{
	        throw new Error('Cannot create two ' + serviceName + ' service instances');
		}
		else
		{
			if (serviceType.object)
			{
				var service = new serviceType.object;
				Services[serviceName] = service;

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

Services.registerService = function(serviceName, object)
{
	if (Services._serviceMap[serviceName])
	{
        throw new Error('Service ' + serviceName + 'already registered; cannot register twice');
	}
	else
	{
		var serviceType = { object: object };
		Services._serviceMap[serviceName] = serviceType;
	}
}
