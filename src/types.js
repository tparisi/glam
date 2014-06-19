glam.Types = {
};

// statics
glam.Types.types = {
		"cube" :  { ctor : glam.Cube, transform:true, animation:true, input:true, visual:true },
		"cone" :  { ctor : glam.Cone, transform:true, animation:true, input:true, visual:true },
		"cylinder" :  { ctor : glam.Cylinder, transform:true, animation:true, input:true, visual:true },
		"sphere" :  { ctor : glam.Sphere, transform:true, animation:true, input:true, visual:true },
		"rect" :  { ctor : glam.Rect, transform:true, animation:true, input:true, visual:true },
		"circle" :  { ctor : glam.Circle, transform:true, animation:true, input:true, visual:true },
		"arc" :  { ctor : glam.Arc, transform:true, animation:true, input:true, visual:true },
		"group" :  { ctor : glam.Group, transform:true, animation:true, input:true },
		"animation" :  { ctor : glam.Animation },
		"background" :  { ctor : glam.Background },
		"import" :  { ctor : glam.Import, transform:true, animation:true },
		"camera" :  { ctor : glam.Camera, transform:true, animation:true },
		"controller" :  { ctor : glam.Controller },
		"text" :  { ctor : glam.Text, transform:true, animation:true, input:true, visual:true },
		"mesh" :  { ctor : glam.Mesh, transform:true, animation:true, input:true, visual:true },
		"line" :  { ctor : glam.Line, transform:true, animation:true, visual:true },
		"light" :  { ctor : glam.Light, transform:true, animation:true },
};


glam.Types.parseVector3Array = function(element, vertices) {

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

glam.Types.parseVector2Array = function(element, uvs) {
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

glam.Types.parseColor3Array = function(element, colors) {
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

glam.Types.parseFaceArray = function(element, faces) {
	
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

glam.Types.parseUVArray = function(element, uvs) {
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
