glam.Style = function(docelt) {

	this.docelt = docelt;
}

glam.Style.prototype = new Object;

glam.Style.prototype.addProperties = function(props) {
	for (p in props) {
		this[p] = props[p];
	}
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
