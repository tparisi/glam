/**
 * @fileoverview transition parser/implementation - still WIP
 * 
 * @author Tony Parisi
 */

glam.DOM.Transition = {};

glam.DOM.Transition.DEFAULT_DURATION = glam.DOM.Animation.DEFAULT_DURATION;
glam.DOM.Transition.DEFAULT_TIMING_FUNCTION =  glam.DOM.Animation.DEFAULT_TIMING_FUNCTION;

// transition:transform 2s, background-color 5s linear 2s;

glam.DOM.Transition.parse = function(docelt, style, obj) {

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
			var timingFunction = params[2] || glam.DOM.Transition.DEFAULT_TIMING_FUNCTION;
			var delay = params[3] || "";
			
			duration = glam.DOM.Animation.parseTime(duration);
			timingFunction = glam.DOM.Animation.parseTimingFunction(timingFunction);
			delay = glam.DOM.Animation.parseTime(delay);
			
			transitions[propname] = {
					duration : duration,
					timingFunction : timingFunction,
					delay : delay
			};
		}
	}
	
}
