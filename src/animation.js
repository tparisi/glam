glam.Animation = {};

glam.Animation.DEFAULT_DURATION = "1s";
glam.Animation.DEFAULT_ITERATION_COUNT = "1";
glam.Animation.DEFAULT_TIMING_FUNCTION = "linear";
glam.Animation.DEFAULT_FRAME_TIME = "0%";
glam.Animation.DEFAULT_FRAME_PROPERTY = "transform";

glam.Animation.create = function(docelt, sceneobj) {

	var duration = docelt.getAttribute('duration') || glam.Animation.DEFAULT_DURATION;
	var iterationCount = docelt.getAttribute('iteration-count') || glam.Animation.DEFAULT_ITERATION_COUNT;
	var timingFunction = docelt.getAttribute('timing-function') || glam.Animation.DEFAULT_TIMING_FUNCTION;
	
	var interps = [];
	
	var i, len, children = docelt.childNodes, len = children.length;
	
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		console.log("  child element ", childelt.tagName);
		
		if (childelt.tagName == "frame") {
			var interp = glam.Animation.createInterpolator(childelt);
		}
	}
}

glam.Animation.createInterpolator = function(docelt, sceneobj) {

	var time = docelt.getAttribute('time') || glam.Animation.DEFAULT_FRAME_TIME;
	var frametime = glam.Animation.parseTime(time);
	var property = docelt.getAttribute('property') || glam.Animation.DEFAULT_FRAME_PROPERTY;
	var value = docelt.getAttribute('value') || "";
	
	if (property == "transform") {
		var t = {};
		var s = { transform : value };
		glam.Transform.parseStyle(s, t);
	}
}

glam.Animation.parseTime = function(time) {
	var index = time.indexOf("%");
	if (index != -1)
		return parseFloat(time.split("%")[0]) / 100;
	else
		return parseFloat(time);
}

	
