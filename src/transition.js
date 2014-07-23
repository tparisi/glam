glam.Transition = {};

glam.Transition.DEFAULT_DURATION = glam.Animation.DEFAULT_DURATION;
glam.Transition.DEFAULT_TIMING_FUNCTION =  glam.Animation.DEFAULT_TIMING_FUNCTION;

// transition:transform 2s, background-color 5s linear 2s;

glam.Transition.parse = function(docelt, style, obj) {

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
			var timingFunction = params[2] || glam.Transition.DEFAULT_TIMING_FUNCTION;
			var delay = params[3] || "";
			
			duration = glam.Animation.parseTime(duration);
			timingFunction = glam.Animation.parseTimingFunction(timingFunction);
			delay = glam.Animation.parseTime(delay);
			
			transitions[propname] = {
					duration : duration,
					timingFunction : timingFunction,
					delay : delay
			};
		}
	}
	
}
