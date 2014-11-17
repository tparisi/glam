/**
 * @fileoverview class list - emulate DOM classList property for glam
 * 
 * @author Tony Parisi
 */

glam.ClassList = function(docelt) {
	this.docelt = docelt;
	Array.call(this);
}

glam.ClassList.prototype = new Array;

glam.ClassList.prototype.item = function(i) {
	return this[i];
}

glam.ClassList.prototype.add = function(item) {
	return this.push(item);
}

glam.ClassList.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if (i != -1) {
		this.splice(i, 1)
	}
}

