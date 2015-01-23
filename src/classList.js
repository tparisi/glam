/**
 * @fileoverview class list - emulate DOM classList property for glam
 * 
 * @author Tony Parisi
 */

glam.DOM.ClassList = function(docelt) {
	this.docelt = docelt;
	Array.call(this);
}

glam.DOM.ClassList.prototype = new Array;

glam.DOM.ClassList.prototype.item = function(i) {
	return this[i];
}

glam.DOM.ClassList.prototype.add = function(item) {
	return this.push(item);
}

glam.DOM.ClassList.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if (i != -1) {
		this.splice(i, 1)
	}
}

