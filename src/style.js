glam.Style = function(docelt) {

	this.docelt = docelt;
}

glam.Style.prototype = new Object;

glam.Style.prototype.addProperties = function(props) {
	for (p in props) {
		this[p] = props[p];
	}
}