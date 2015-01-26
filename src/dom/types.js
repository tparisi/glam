/**
 * @fileoverview built-in types and utilities to support glam parser
 * 
 * @author Tony Parisi
 */

glam.DOM.Types = {
};

// statics
glam.DOM.Types.types = {
		"box" :  { cls : glam.BoxElement, transform:true, animation:true, input:true, visual:true },
		"cone" :  { cls : glam.ConeElement, transform:true, animation:true, input:true, visual:true },
		"cylinder" :  { cls : glam.CylinderElement, transform:true, animation:true, input:true, visual:true },
		"sphere" :  { cls : glam.SphereElement, transform:true, animation:true, input:true, visual:true },
		"rect" :  { cls : glam.RectElement, transform:true, animation:true, input:true, visual:true },
		"circle" :  { cls : glam.CircleElement, transform:true, animation:true, input:true, visual:true },
		"arc" :  { cls : glam.ArcElement, transform:true, animation:true, input:true, visual:true },
		"group" :  { cls : glam.GroupElement, transform:true, animation:true, input:true },
		"animation" :  { cls : glam.AnimationElement },
		"background" :  { cls : glam.BackgroundElement },
		"import" :  { cls : glam.ImportElement, transform:true, animation:true },
		"camera" :  { cls : glam.CameraElement, transform:true, animation:true },
		"controller" :  { cls : glam.ControllerElement },
		"text" :  { cls : glam.TextElement, transform:true, animation:true, input:true, visual:true },
		"mesh" :  { cls : glam.MeshElement, transform:true, animation:true, input:true, visual:true },
		"line" :  { cls : glam.LineElement, transform:true, animation:true, visual:true },
		"light" :  { cls : glam.LightElement, transform:true, animation:true },
		"particles" :  { cls : glam.ParticlesElement, transform:true, animation:true },
		"effect" :  { cls : glam.EffectElement, },
};


glam.DOM.Types.parseVector3Array = function(element, vertices) {

	var text = element.textContent;
	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	for (i = 0; i < len; i += 3) {
		
		var x = parseFloat(nums[i]), 
			y = parseFloat(nums[i + 1]), 
			z = parseFloat(nums[i + 2]);
		
		var vec = new THREE.Vector3(x, y, z);
		vertices.push(vec);
	}
}

glam.DOM.Types.parseVector3 = function(text, vec) {

	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	var x = parseFloat(nums[0]), 
		y = parseFloat(nums[1]), 
		z = parseFloat(nums[2]);
	
	vec.set(x, y, z);
}

glam.DOM.Types.parseVector2Array = function(element, uvs) {
	var text = element.textContent;
	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 2)
		return;
	
	for (i = 0; i < len; i += 2) {
		
		var x = parseFloat(nums[i]), 
			y = parseFloat(nums[i + 1]);
		
		var vec = new THREE.Vector2(x, y);
		uvs.push(vec);
	}

}

glam.DOM.Types.parseColor3Array = function(element, colors) {
	var text = element.textContent;
	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	for (i = 0; i < len; i += 3) {
		
		var r = parseFloat(nums[i]), 
			g = parseFloat(nums[i + 1]), 
			b = parseFloat(nums[i + 2]);
		
		var c = new THREE.Color(r, g, b);
		colors.push(c);
	}

}


glam.DOM.Types.parseColor3 = function(text, c) {

	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 3)
		return;
	
	var r = parseFloat(nums[0]), 
		g = parseFloat(nums[1]), 
		b = parseFloat(nums[2]);
	
	c.setRGB(r, g, b);
}

glam.DOM.Types.parseFaceArray = function(element, faces) {
	
	var text = element.textContent;
	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 1)
		return;
	
	for (i = 0; i < len; i += 3) {
		
		var a = parseInt(nums[i]), 
			b = parseInt(nums[i + 1]), 
			c = parseInt(nums[i + 2]);
		
		var face = new THREE.Face3(a, b, c);
		faces.push(face);
	}

}

glam.DOM.Types.parseUVArray = function(element, uvs) {
	var text = element.textContent;
	var nums = text.split(" ");
	
	var i, len = nums.length;
	if (len < 6)
		return;
	
	for (i = 0; i < len; i += 6) {
		
		var faceUvs = [];
		
		for (var j = 0; j < 3; j++) {
			var x = parseFloat(nums[i + j * 2]);
			var y = parseFloat(nums[i + j * 2 + 1]);
			var vec = new THREE.Vector2(x, y);
			faceUvs.push(vec);
		}
		
		uvs.push(faceUvs);
	}

}
