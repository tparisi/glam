glam.Transform = {};

glam.Transform.parse = function(docelt, obj) {
	
	var t = {
	};
	
	t.x = docelt.getAttribute('x') || 0;
	t.y = docelt.getAttribute('y') || 0;
	t.z = docelt.getAttribute('z') || 0;
	t.rx = docelt.getAttribute('rx') || 0;
	t.ry = docelt.getAttribute('ry') || 0;
	t.rz = docelt.getAttribute('rz') || 0;
	t.sx = docelt.getAttribute('sx') || 1;
	t.sy = docelt.getAttribute('sy') || 1;
	t.sz = docelt.getAttribute('sz') || 1;

	if (docelt.id) {
		var style = glam.getStyle("#" + docelt.id);
		if (style) {
			glam.Transform.parseStyle(style, t);
		}
	}
	
	obj.transform.position.set(t.x, t.y, t.z);
	obj.transform.rotation.set(t.rx, t.ry, t.rz);
	obj.transform.scale.set(t.sx, t.sy, t.sz);
}

glam.Transform.parseStyle = function(style, t) {
	function parseRotation(r) {
		return glam.Transform.parseRotation(r);
	}
	
	if (style) {
		if (style.x) {
			t.x = parseFloat(style.x);
		}
		if (style.y) {
			t.y = parseFloat(style.y);
		}
		if (style.z) {
			t.z = parseFloat(style.z);
		}
		if (style.rx) {
			t.rx = parseRotation(style.rx);
		}
		if (style.ry) {
			t.ry = parseRotation(style.ry);
		}
		if (style.rz) {
			t.rz = parseRotation(style.rz);
		}
		if (style.sx) {
			t.sx = parseFloat(style.sx);
		}
		if (style.sy) {
			t.sy = parseFloat(style.sy);
		}
		if (style.sz) {
			t.sz = parseFloat(style.sz);
		}
		if (style.transform) {
			var transforms = style.transform.split(" ");
			var i, len = transforms.length;
			for (i = 0; i < len; i++) {
				var transform = transforms[i];
				var op = transform.split("(")[0];
				var regExp = /\(([^)]+)\)/;
				var matches = regExp.exec(transform);
				var value = matches[1];
				
				
				switch(op) {
					case "translateX" :
						t.x = parseFloat(value);
						break;
					case "translateY" :
						t.y = parseFloat(value);
						break;
					case "translateZ" :
						t.z = parseFloat(value);
						break;
					case "rotateX" :
						t.rx = parseRotation(value);
						break;
					case "rotateY" :
						t.ry = parseRotation(value);
						break;
					case "rotateZ" :
						t.rz = parseRotation(value);
						break;
					case "scaleX" :
						t.sx = parseFloat(value);
						break;
					case "scaleY" :
						t.sy = parseFloat(value);
						break;
					case "scaleZ" :
						t.sz = parseFloat(value);
						break;
				}
				
			}
		}
	}
}

glam.Transform.parseRotation = function(r) {
	r = r.toLowerCase();
	var i = r.indexOf("deg");
	if (i != -1) {
		var degrees = r.split("deg");
		if (degrees.length) {
			var deg = parseFloat(degrees[0]);
			return THREE.Math.degToRad(deg);
		}
	}
	
	var i = r.indexOf("rad");
	if (i != -1) {
		var radians = r.split("rad");
		if (radians.length) {
			var rad = parseFloat(radians[0]);
			return rad;
		}
	}
	
	return parseFloat(r);
}
