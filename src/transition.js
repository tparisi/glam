glam.Transition = {};

glam.Transition.DEFAULT_DURATION = glam.Animation.DEFAULT_DURATION;
glam.Transition.DEFAULT_TIMING_FUNCTION =  glam.Animation.DEFAULT_TIMING_FUNCTION;
glam.Transition.DEFAULT_PROPERTY = glam.Animation.DEFAULT_FRAME_PROPERTY;

glam.Transition.create = function(docelt, style, obj) {

	if (style.transition) {
		var transitions = glam.Transition.parse(style.transition);
	}
	
	var duration = style.duration || glam.Transition.DEFAULT_DURATION;
	var timingFunction = style.timingFunction || glam.Transition.DEFAULT_TIMING_FUNCTION;
	
	duration = glam.Transition.parseTime(duration);
	var easing = glam.Transition.parseTimingFunction(timingFunction);
	
	var poskeys = [];
	var posvalues = [];
	var rotkeys = [];
	var rotvalues = [];
	var sclkeys = [];
	var sclvalues = [];
	var opakeys = [];
	var opavalues = [];
	var colorkeys = [];
	var colorvalues = [];
	
	var i, len, children = docelt.childNodes, len = children.length;
	
	for (i = 0; i < len; i++) {
		var childelt = children[i];
		var tag = childelt.tagName;
		if (tag)
			tag = tag.toLowerCase();
		
		if (tag == "keyframe") {
			var frame = glam.Transition.createFrame(childelt);
			if (frame) {
				var val = frame.value;
				if (frame.type == "transform") {
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
				else if (frame.type == "material") {
					if ("opacity" in val) {
						opakeys.push(frame.time);
						opavalues.push( { opacity : parseFloat(val.opacity) });
					}
					if ("color" in val) {
						colorkeys.push(frame.time);
						var rgbColor = new THREE.Color(val.color);
						colorvalues.push( { r : rgbColor.r, g: rgbColor.g, b: rgbColor.b });
					}
				}
			}
		}
	}
	
	var anim = {
		duration : duration,
		loop : loop,
		easing : easing,
		poskeys : poskeys,
		posvalues : posvalues,
		rotkeys : rotkeys,
		rotvalues : rotvalues,
		sclkeys : sclkeys,
		sclvalues : sclvalues,
		opakeys : opakeys,
		opavalues : opavalues,
		colorkeys : colorkeys,
		colorvalues : colorvalues,
	};

	glam.addAnimation(id, anim);
	glam.Transition.callParseCallbacks(id, anim);
}

glam.Transition.createFrame = function(docelt) {

	var time = docelt.getAttribute('time') || glam.Transition.DEFAULT_FRAME_TIME;
	var frametime = glam.Transition.parseFrameTime(time);
	var property = docelt.getAttribute('property') || glam.Transition.DEFAULT_FRAME_PROPERTY;
	var value = docelt.getAttribute('value') || "";
	
	if (property == "transform") {
		var t = {};
		glam.Transform.parseTransform(value, t);

		return {
			time : frametime,
			value : t,
			type : "transform",
		};
	}
	else if (property == "material") {

		var s = glam.Transition.parseMaterial(value);
		var param = glam.Material.parseStyle(s);

		return {
			time : frametime,
			value : param,
			type : "material",
		};
	}
	
}

glam.Transition.parseTime = function(time) {
	var index = time.indexOf("ms");
	if (index != -1)
		return parseFloat(time.split("ms")[0]);
	
	var index = time.indexOf("s");
	if (index != -1)
		return parseFloat(time.split("s")[0] * 1000);
	
}

glam.Transition.parseFrameTime = function(time) {
	var index = time.indexOf("%");
	if (index != -1)
		return parseFloat(time.split("%")[0]) / 100;
	else
		return parseFloat(time);
}

glam.Transition.parseTimingFunction = function(timingFunction) {
	timingFunction = timingFunction.toLowerCase();
	switch (timingFunction) {
	
		case "linear" :
			return TWEEN.Easing.Linear.None;
			break;
		
		case "ease-in-out" :
		default :
			return TWEEN.Easing.Quadratic.InOut;
			break;
		
	}
}

glam.Transition.parseMaterial = function(value) {

	var s = {};
	
	var values = value.split(";");
	var i, len = values.length;
	for (i = 0; i < len; i++) {
		var val = values[i];
		if (val) {
			var valsplit = val.split(":");
			var valname = valsplit[0];
			var valval = valsplit[1];
			
			s[valname] = valval;
		}
	}
	
	return s;
}

glam.Transition.parse = function(transition) {
	var transitions = [];
	return transitions;
}

glam.Transition.addAnimationToObject = function(animation, obj) {
		
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
	if (animation.opakeys.length) {
		interps.push({
			keys : animation.opakeys,
			values : animation.opavalues,
			target : obj.visuals[0].material,
		});
	}
	if (animation.colorkeys.length) {
		interps.push({
			keys : animation.colorkeys,
			values : animation.colorvalues,
			target : obj.visuals[0].material.color,
		});
	}
	var loop = animation.iterationCount > 1;
	
	if (interps.length) {
		var kf = new Vizi.KeyFrameAnimator({ interps: interps, 
			duration : animation.duration, 
			loop : animation.loop, 
			easing: animation.easing
		});
		obj.addComponent(kf);
		
		kf.start();
	}
}

