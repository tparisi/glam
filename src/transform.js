glam.Transform = {};

glam.Transform.parse = function(docelt, obj) {
	
	function parseRotation(r) {
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
	
	var x = docelt.getAttribute('x') || 0;
	var y = docelt.getAttribute('y') || 0;
	var z = docelt.getAttribute('z') || 0;
	var rx = docelt.getAttribute('rx') || 0;
	var ry = docelt.getAttribute('ry') || 0;
	var rz = docelt.getAttribute('rz') || 0;
	var sx = docelt.getAttribute('sx') || 1;
	var sy = docelt.getAttribute('sy') || 1;
	var sz = docelt.getAttribute('sz') || 1;

	if (docelt.id) {
		var style = glam.getStyle("#" + docelt.id);
		if (style) {
			if (style.x) {
				x = parseFloat(style.x);
			}
			if (style.y) {
				y = parseFloat(style.y);
			}
			if (style.z) {
				z = parseFloat(style.z);
			}
			if (style.rx) {
				rx = parseRotation(style.rx);
			}
			if (style.ry) {
				ry = parseRotation(style.ry);
			}
			if (style.rz) {
				rz = parseRotation(style.rz);
			}
			if (style.sx) {
				sx = parseFloat(style.sx);
			}
			if (style.sy) {
				sy = parseFloat(style.sy);
			}
			if (style.sz) {
				sz = parseFloat(style.sz);
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
							x = parseFloat(value);
							break;
						case "translateY" :
							y = parseFloat(value);
							break;
						case "translateZ" :
							z = parseFloat(value);
							break;
						case "rotateX" :
							rx = parseRotation(value);
							break;
						case "rotateY" :
							ry = parseRotation(value);
							break;
						case "rotateZ" :
							rz = parseRotation(value);
							break;
						case "scaleX" :
							sx = parseFloat(value);
							break;
						case "scaleY" :
							sy = parseFloat(value);
							break;
						case "scaleZ" :
							sz = parseFloat(value);
							break;
					}
					
				}
			}
		}
	}
	
	obj.transform.position.set(x, y, z);
	obj.transform.rotation.set(rx, ry, rz);
	obj.transform.scale.set(sx, sy, sz);
}