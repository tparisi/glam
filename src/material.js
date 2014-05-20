glam.Material = {};

glam.Material.create = function(style) {
	var material = null;
	
	if (style) {
		var param = glam.Material.parseStyle(style);
		if (style.shader) {
			switch (style.shader.toLowerCase()) {
				case "phong" :
					material = new THREE.MeshPhongMaterial(param);
					break;
				case "lambert" :
					material = new THREE.MeshLambertMaterial(param);
					break;
				case "basic" :
				default :
					material = new THREE.MeshBasicMaterial(param);
					break;
			}
		}
		else if (style["shader-vertex"] && style["shader-fragment"] && style["shader-uniforms"]) {
			material = glam.Material.createShaderMaterial(style, param);
		}
		else {
			material = new THREE.MeshBasicMaterial(param);
		}
	}
	else {
		material = new THREE.MeshBasicMaterial();
	}
	
	return material;
}

glam.Material.parseStyle = function(style) {
	var image = "";
	if (style.image) {
		image = glam.Material.parseUrl(style.image);
	}
	
	var reflectivity;
	if (style.reflectivity)
		reflectivity = parseFloat(style.reflectivity);
	
	var refractionRatio;
	if (style.refractionRatio)
		refractionRatio = parseFloat(style.refractionRatio);
	
	var envMap = glam.Material.tryParseEnvMap(style);
	
	var diffuse;
	var specular;
	var css = "";

	if (css = style["color-diffuse"]) {
		diffuse = new THREE.Color().setStyle(css).getHex();
	}
	if (css = style["color-specular"]) {
		specular = new THREE.Color().setStyle(css).getHex();
	}
	
	var opacity;
	if (style.opacity)
		opacity = parseFloat(style.opacity);

	var wireframe;
	if (style.hasOwnProperty("render-mode"))
		wireframe = style["render-mode"] == "wireframe";
	
	var param = {
	};
	
	if (image)
		param.map = THREE.ImageUtils.loadTexture(image);
	if (envMap)
		param.envMap = envMap;
	if (diffuse !== undefined)
		param.color = diffuse;
	if (specular !== undefined)
		param.specular = specular;
	if (opacity !== undefined) {
		param.opacity = opacity;
		param.transparent = opacity < 1;
	}
	if (wireframe !== undefined) {
		param.wireframe = true;
	}
	if (reflectivity !== undefined)
		param.reflectivity = reflectivity;
	if (refractionRatio !== undefined)
		param.refractionRatio = refractionRatio;
	
	return param;
}

glam.Material.parseUrl = function(image) {
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(image);
	image = matches[1];
	return image;
}

glam.Material.tryParseEnvMap = function(style) {
	var urls = [];
	
	if (style["envmap-right"])
		urls.push(glam.Material.parseUrl(style["envmap-right"]));
	if (style["envmap-left"])
		urls.push(glam.Material.parseUrl(style["envmap-left"]));
	if (style["envmap-top"])
		urls.push(glam.Material.parseUrl(style["envmap-top"]));
	if (style["envmap-bottom"])
		urls.push(glam.Material.parseUrl(style["envmap-bottom"]));
	if (style["envmap-front"])
		urls.push(glam.Material.parseUrl(style["envmap-front"]));
	if (style["envmap-back"])
		urls.push(glam.Material.parseUrl(style["envmap-back"]));
	
	if (urls.length == 6) {
		var cubeTexture = THREE.ImageUtils.loadTextureCube( urls );
		return cubeTexture;
	}
	
	if (style["envmap"])
		return THREE.ImageUtils.loadTexture(glam.Material.parseUrl(style["envmap"]), THREE.SphericalRefractionMapping);
	
	return null;
}

glam.Material.createShaderMaterial = function(style, param) {
	
	var vs = style["shader-vertex"];
	var fs = style["shader-fragment"];
	var uniforms = glam.Material.parseUniforms(style["shader-uniforms"], param);

	var vselt = document.getElementById(vs);
	var vstext = vselt.textContent;
	var fselt = document.getElementById(fs);
	var fstext = fselt.textContent;
	
	return new THREE.ShaderMaterial({
		vertexShader : vstext,
		fragmentShader : fstext,
		uniforms: uniforms,
	});
	
	/*
	var vsurl = glam.Material.parseUrl(vs);
	var fsurl = glam.Material.parseUrl(fs);
	
	var vstext = "";
	var fstext = "";
	
	$.ajax({
	      type: 'GET',
	      url: vsurl,
	      dataType: "text",
	      success: function(result) { vstext = result; if (fstext) done(); },
	});	
	
	
	$.ajax({
	      type: 'GET',
	      url: fsurl,
	      dataType: "text",
	      success: function(result) { fstext = result; if (vstext) done(); },
	});	
	*/
}

glam.Material.parseUniforms = function(uniformsText, param) {
	
	var uniforms = {
	};
	
	var tokens = uniformsText.split(" ");

	var i, len = tokens.length / 3;
	for (i = 0; i < len; i++) {
		var name = tokens[i * 3];
		var type = tokens[i * 3 + 1];
		var value = tokens[i * 3 + 2];
		
		if (type == "f")
			value = parseFloat(value);
		else if (type == "t")
			value = param.envMap; // hack hack
		
		var uniform =  {
			type : type,
			value : value,
		};
		
		uniforms[name] = uniform;
	}
		
	return uniforms;
}
