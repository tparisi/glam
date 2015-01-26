/**
 * @fileoverview class list - emulate DOM classList property for glam
 * 
 * @author Tony Parisi
 */

glam.DOMClassList = function(docelt) {
	this.docelt = docelt;
	Array.call(this);
}

glam.DOMClassList.prototype = new Array;

glam.DOMClassList.prototype.item = function(i) {
	return this[i];
}

glam.DOMClassList.prototype.add = function(item) {
	return this.push(item);
}

glam.DOMClassList.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if (i != -1) {
		this.splice(i, 1)
	}
}

