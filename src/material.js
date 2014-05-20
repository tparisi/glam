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
		image = glam.Material.parseImage(style.image);
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

glam.Material.parseImage = function(image) {
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(image);
	image = matches[1];
	return image;
}

glam.Material.tryParseEnvMap = function(style) {
	var urls = [];
	
	if (style["envmap-right"])
		urls.push(glam.Material.parseImage(style["envmap-right"]));
	if (style["envmap-left"])
		urls.push(glam.Material.parseImage(style["envmap-left"]));
	if (style["envmap-top"])
		urls.push(glam.Material.parseImage(style["envmap-top"]));
	if (style["envmap-bottom"])
		urls.push(glam.Material.parseImage(style["envmap-bottom"]));
	if (style["envmap-front"])
		urls.push(glam.Material.parseImage(style["envmap-front"]));
	if (style["envmap-back"])
		urls.push(glam.Material.parseImage(style["envmap-back"]));
	
	if (urls.length == 6) {
		var cubeTexture = THREE.ImageUtils.loadTextureCube( urls );
		return cubeTexture;
	}
	
	if (style["envmap"])
		return THREE.ImageUtils.loadTexture(glam.Material.parseImage(style["envmap"]), THREE.SphericalRefractionMapping);
	
	return null;
}