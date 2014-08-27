/**
 * @fileoverview styles support - emulate built-in DOM style object
 * 
 * @author Tony Parisi
 */

glam.Style = function(docelt) {

	this.docelt = docelt;
	this._properties = {
	};
	
	this.setPropertyHandlers = [];
	this.defineStandardProperties();
}

glam.Style.prototype = new Object;

glam.Style.prototype.addProperties = function(props) {
	for (p in props) {
		this.addProperty(p, props[p]);
	}
}

glam.Style.prototype.addProperty = function(propName, propValue) {

	this.defineProperty(propName, propValue);

	this._properties[propName] = propValue;
}

glam.Style.prototype.addPropertiesFromString = function(str) {
	var propstrs = str.split(';');
	var props = {
	};
	
	var i, len = propstrs.length;
	for (i = 0; i < len; i++) {
		var prop = propstrs[i];
		var elts = prop.split(':');
		var propName = elts[0];
		propName = propName.replace(/ /g,'');
		if (propName) {
			var propValue = elts[1];
			props[propName] = propValue;
		}
	}
	
	this.addProperties(props);
}

glam.Style.prototype.onPropertyChanged = function(propName, propValue) {

	// console.log(this.docelt.id, "property", propName, "value changed to", propValue);

	var i, len = this.setPropertyHandlers.length;
	for (i = 0; i < len; i++) {
		var handler = this.setPropertyHandlers[i];
		if (handler) {
			handler(propName, propValue);
		}
	}
}

glam.Style.prototype.defineProperty = function(propName, propValue) {
	Object.defineProperty(this, propName, {
			enumerable : true,
			configurable : true,
	        get: function() {
	            return this._properties[propName];
	        },
	        set: function(v) {
	        	this._properties[propName] = v;
	        	this.onPropertyChanged(propName, v);
	        }
		});
}

glam.Style.prototype.defineStandardProperties = function() {

	var props = glam.Style._standardProperties
	var propName;
	for (propName in props) {
		var propValue = props[propName];
		this.defineProperty(propName, propValue)
	}
}

glam.Style._standardProperties = {
		"angle" : "",
		"backface-visibility" : "visible",
		"background-type" : "",
		"bevel-size" : "",
		"bevel-thickness" : "",
		"color" : "",
		"color-diffuse" : "",
		"colorDiffuse" : "",
		"color-specular" : "",
		"colorSpecular" : "",
		"dash-size" : "",
		"depth" : "",
		"distance" : "",
		"end-angle" : "",
		"envmap" : "",
		"envmap-back" : "",
		"envmap-bottom" : "",
		"envmap-front" : "",
		"envmap-left" : "",
		"envmap-right" : "",
		"envmap-top" : "",
		"font-bevel" : "",
		"font-depth" : "",
		"font-family" : "",
		"font-size" : "",
		"font-style" : "",
		"font-weight" : "",
		"gap-size" : "",
		"height" : "",
		"line-width" : "",
		"image" : "",
		"image-normal" : "",
		"opacity" : "",
		"radius" : "",
		"radius-segments" : "",
		"reflectivity" : "",
		"refraction-ratio" : "",
		"render-mode" : "",
		"rx" : "",
		"ry" : "",
		"rz" : "",
		"shader" : "phong",
		"shader-fragment" : "",
		"shader-uniforms" : "",
		"shader-vertex" : "",
		"start-angle" : "",
		"sx" : "",
		"sy" : "",
		"sz" : "",
		"vertex-colors" : "",
		"vertex-normals" : "",
		"width" : "",
		"x" : "",
		"y" : "",
		"z" : "",
};

