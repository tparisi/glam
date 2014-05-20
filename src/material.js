glam.Material = {};

glam.Material.create = function(style) {
	var material = null;
	
	if (style) {
		var image = "";
		if (style.image) {
			var regExp = /\(([^)]+)\)/;
			var matches = regExp.exec(style.image);
			image = matches[1];
		}
		
		var diffuse = 0xffffff;
		var specular = null;
		var css = "";
		if (css = style["color-diffuse"]) {
			diffuse = new THREE.Color().setStyle(css).getHex();
		}
		if (css = style["color-specular"]) {
			specular = new THREE.Color().setStyle(css).getHex();
		}
		
		var opacity = 1;
		if (style.opacity)
			opacity = style.opacity;
		
		var param = {
				map : image ? THREE.ImageUtils.loadTexture(image) : null,
				color: diffuse,
				specular : specular,
				opacity : opacity,
				transparent : opacity < 1 ? true : false,
		};
		
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
