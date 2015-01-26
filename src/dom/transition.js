/**
 * @fileoverview transition parser/implementation - still WIP
 * 
 * @author Tony Parisi
 */

goog.provide('glam.TransitionElement');
goog.require('glam.AnimationElement');

glam.TransitionElement.DEFAULT_DURATION = glam.AnimationElement.DEFAULT_DURATION;
glam.TransitionElement.DEFAULT_TIMING_FUNCTION =  glam.AnimationElement.DEFAULT_TIMING_FUNCTION;

// transition:transform 2s, background-color 5s linear 2s;

glam.TransitionElement.parse = function(docelt, style, obj) {

	var transition = style.transition || "";
	
	var transitions = {
	};
	
	var comps = transition.split(",");
	var i, len = comps.length;
	for (i = 0; i < len; i++) {
		var comp = comps[i];
		if (comp) {
			var params = comp.split(" ");
			if (params[0] == "")
				params.shift();
			var propname = params[0];
			var duration = params[1];
			var timingFunction = params[2] || glam.TransitionElement.DEFAULT_TIMING_FUNCTION;
			var delay = params[3] || "";
			
			duration = glam.AnimationElement.parseTime(duration);
			timingFunction = glam.AnimationElement.parseTimingFunction(timingFunction);
			delay = glam.AnimationElement.parseTime(delay);
			
			transitions[propname] = {
					duration : duration,
					timingFunction : timingFunction,
					delay : delay
			};
		}
	}
	
}
