/**
 * @fileoverview effect parser/implementation. supports built-in postprocessing effects
 * 
 * @author Tony Parisi
 */

glam.EffectElement = {};

glam.EffectElement.DEFAULT_BLOOM_STRENGTH = 1;
glam.EffectElement.DEFAULT_FILM_GRAYSCALE = 0;
glam.EffectElement.DEFAULT_FILM_SCANLINECOUNT = 512;
glam.EffectElement.DEFAULT_FILM_INTENSITY = 0.5;
glam.EffectElement.DEFAULT_RGBSHIFT_AMOUNT = 0.0015;
glam.EffectElement.DEFAULT_DOTSCREEN_SCALE = 1;

glam.EffectElement.create = function(docelt, style, app) {
	
	var type = docelt.getAttribute("type");
	
	var effect = null;
	
	switch (type) {

		case "Bloom" :
			var strength = glam.EffectElement.DEFAULT_BLOOM_STRENGTH;
			var str = docelt.getAttribute("strength");
			if (str != undefined) {
				strength = parseFloat(str);
			}
			effect = new Vizi.Effect(new THREE.BloomPass(strength));
			break;

		case "FXAA" :
			effect = new Vizi.Effect(THREE.FXAAShader);
			var w = Vizi.Graphics.instance.renderer.domElement.offsetWidth;
			var h = Vizi.Graphics.instance.renderer.domElement.offsetHeight;
			effect.pass.uniforms['resolution'].value.set(1 / w, 1 / h);
			break;
			
		case "Film" :
			effect = new Vizi.Effect( THREE.FilmShader );
			effect.pass.uniforms['grayscale'].value = glam.EffectElement.DEFAULT_FILM_GRAYSCALE;
			effect.pass.uniforms['sCount'].value = glam.EffectElement.DEFAULT_FILM_SCANLINECOUNT;
			effect.pass.uniforms['nIntensity'].value = glam.EffectElement.DEFAULT_FILM_INTENSITY;
			break;
			
		case "RGBShift" :
			effect = new Vizi.Effect( THREE.RGBShiftShader );
			effect.pass.uniforms[ 'amount' ].value = glam.EffectElement.DEFAULT_RGBSHIFT_AMOUNT;
			break;
			
		case "DotScreen" :
			effect = new Vizi.Effect(THREE.DotScreenShader);
			effect.pass.uniforms[ 'scale' ].value = glam.EffectElement.DEFAULT_DOTSCREEN_SCALE;
			break;

		case "DotScreenRGB" :
			effect = new Vizi.Effect(THREE.DotScreenRGBShader);
			effect.pass.uniforms[ 'scale' ].value = glam.EffectElement.DEFAULT_DOTSCREEN_SCALE;
			break;
	}
	
	if (effect) {
		glam.EffectElement.parseAttributes(docelt, effect, style);
		Vizi.Graphics.instance.addEffect(effect);
	}
	
	return null;
}

glam.EffectElement.parseAttributes = function(docelt, effect, style) {
	
	var disabled = docelt.getAttribute("disabled");
	if (disabled != undefined) {
		effect.pass.enabled = false;
	}
	
	var uniforms = effect.pass.uniforms;
	
	for (var u in uniforms) {
		
		var attr = docelt.getAttribute(u);
		if (attr) {
			
			var value = null;
			var uniform = uniforms[u];

			if (uniform) {
				
				switch (uniform.type) {
				
					case "t" :
						
						var image = glam.DOMMaterial.parseUrl(attr);
						value = THREE.ImageUtils.loadTexture(image);
						value.wrapS = value.wrapT = THREE.Repeat;
						break;
						
					case "f" :
						
						value = parseFloat(attr);						
						break;

					case "i" :
						
						value = parseInt(attr);						
						break;
				}
				
				if (value) {
					uniform.value = value;
				}
			}
		}
	}
}

