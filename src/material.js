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
		var regExp = /\(([^)]+)\)/;
		var matches = regExp.exec(style.image);
		image = matches[1];
	}
	
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
		opacity = style.opacity;
	
	var param = {
	};
	
	if (image)
		param.map = THREE.ImageUtils.loadTexture(image);
	if (diffuse !== undefined)
		param.color = diffuse;
	if (specular !== undefined)
		param.specular = specular;
	if (opacity !== undefined) {
		param.opacity = opacity;
		param.transparent = opacity < 1;
	}
	
	return param;
}