glam.Types = {
};

// statics
glam.Types.types = {
		"cube" :  { ctor : glam.Cube },
		"cone" :  { ctor : glam.Cone },
		"cylinder" :  { ctor : glam.Cylinder },
		"sphere" :  { ctor : glam.Sphere },
		"rect" :  { ctor : glam.Rect },
		"circle" :  { ctor : glam.Circle },
		"arc" :  { ctor : glam.Arc },
		"group" :  { ctor : glam.Group },
		"animation" :  { ctor : glam.Animation },
		"background" :  { ctor : glam.Background },
		"import" :  { ctor : glam.Import },
		"camera" :  { ctor : glam.Camera },
		"controller" :  { ctor : glam.Controller },
		"text" :  { ctor : glam.Text },
		"mesh" :  { ctor : glam.Mesh },
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
