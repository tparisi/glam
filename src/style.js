/**
 * @fileoverview styles support - emulate built-in DOM style object
 * 
 * @author Tony Parisi
 */

glam.Style = function(docelt) {

	this.docelt = docelt;
	this._properties = {
	};
}

glam.Style.prototype = new Object;

glam.Style.prototype.addProperties = function(props) {
	for (p in props) {
		this.addProperty(p, props[p]);
	}
}

glam.Style.prototype.addProperty = function(propName, propValue) {

	this._properties[propName] = propValue;
	
	Object.defineProperty(this, propName, {
			enumerable : true,
	        get: function() {
	            return this._properties[propName];
	        },
	        set: function(v) {
	        	this._properties[propName] = v;
	        	this.onPropertyChanged(propName, v);
	        }
		});
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

	console.log(this.docelt.id, "property", propName, "value changed to", propValue);
}
