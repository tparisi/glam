glam.Animation = {};

glam.Animation.DEFAULT_DURATION = "1s";
glam.Animation.DEFAULT_ITERATION_COUNT = "1";
glam.Animation.DEFAULT_TIMING_FUNCTION = "linear";
glam.Animation.DEFAULT_FRAME_TIME = "0%";
glam.Animation.DEFAULT_FRAME_PROPERTY = "transform";

glam.Animation.create = function(docelt, sceneobj) {

	var id = docelt.id;
	var duration = docelt.getAttribute('duration') || glam.Animation.DEFAULT_DURATION;
	var iterationCount = docelt.getAttribute('iteration-count') || glam.Animation.DEFAULT_ITERATION_COUNT;
	var timingFunction = docelt.getAttribute('timing-function') || glam.Animation.DEFAULT_TIMING_FUNCTION;
	
	var poskeys = [];
	var posvalues = [];
	var rotkeys = [];
	var rotvalues = [];
	var sclkeys = [];
	var sclvalues = [];
	
	var i, len, children = docelt.childNodes, len = children.length;
	
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		console.log("  child element ", childelt.tagName);
		
		if (childelt.tagName == "frame") {
			var frame = glam.Animation.createFrame(childelt);
			var val = frame.value;
			if ("x" in val || "y" in val || "z" in val) {
				poskeys.push(frame.time);
				var value = {
				};
				if ("x" in val) {
					value.x = val.x;
				}
				if ("y" in val) {
					value.y = val.y;
				}
				if ("z" in val) {
					value.z = val.z;
				}
				posvalues.push(value);
			}
			if ("rx" in val || "ry" in val || "rz" in val) {
				rotkeys.push(frame.time);
				var value = {
				};
				if ("rx" in val) {
					value.x = val.rx;
				}
				if ("ry" in val) {
					value.y = val.ry;
				}
				if ("rz" in val) {
					value.z = val.rz;
				}
				rotvalues.push(value);
			}
			if ("sx" in val || "sy" in val || "sz" in val) {
				sclkeys.push(frame.time);
				var value = {
				};
				if ("sx" in val) {
					value.x = val.sx;
				}
				if ("sy" in val) {
					value.y = val.sy;
				}
				if ("sz" in val) {
					value.z = val.sz;
				}
				sclvalues.push(value);
			}
		}
	}
	
	var anim = {
		duration : duration,
		iterationCount : iterationCount,
		timingFunction : timingFunction,
		poskeys : poskeys,
		posvalues : posvalues,
		rotkeys : rotkeys,
		rotvalues : rotvalues,
		sclkeys : sclkeys,
		sclvalues : sclvalues,
	};

	glam.addAnimation(id, anim);
}

glam.Animation.createFrame = function(docelt, sceneobj) {

	var time = docelt.getAttribute('time') || glam.Animation.DEFAULT_FRAME_TIME;
	var frametime = glam.Animation.parseTime(time);
	var property = docelt.getAttribute('property') || glam.Animation.DEFAULT_FRAME_PROPERTY;
	var value = docelt.getAttribute('value') || "";
	
	if (property == "transform") {
		var t = {};
		var s = { transform : value };
		glam.Transform.parseStyle(s, t);
	}
	
	return {
		time : frametime,
		value : t
	};
}

glam.Animation.parseTime = function(time) {
	var index = time.indexOf("%");
	if (index != -1)
		return parseFloat(time.split("%")[0]) / 100;
	else
		return parseFloat(time);
}

glam.Animation.parse = function(docelt, obj) {
	var animationId = docelt.getAttribute('animation');
	if (animationId) {
		var animation = glam.getAnimation(animationId);
		if (animation) {
			
			var interps = [];
			if (animation.poskeys.length) {
				interps.push({
					keys : animation.poskeys,
					values : animation.posvalues,
					target : obj.transform.position,
				});
			}
			if (animation.rotkeys.length) {
				interps.push({
					keys : animation.rotkeys,
					values : animation.rotvalues,
					target : obj.transform.rotation,
				});
			}
			if (animation.sclkeys.length) {
				interps.push({
					keys : animation.sclkeys,
					values : animation.sclvalues,
					target : obj.transform.scale,
				});
			}
			var loop = animation.iterationCount > 1;
			
			if (interps.length) {
				var kf = new Vizi.KeyFrameAnimator({ interps: interps, duration : 5000, loop : true });
				obj.addComponent(kf);
				
				kf.start();
			}
		}
	}
}
	
