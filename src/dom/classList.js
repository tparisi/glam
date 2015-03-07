/**
 * @fileoverview class list - emulate DOM classList property for glam
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMClassList');

glam.DOMClassList = function(docelt) {
	this.docelt = docelt;
	Array.call(this);
}

glam.DOMClassList.prototype = new Array;

glam.DOMClassList.prototype.item = function(i) {
	return this[i];
}

glam.DOMClassList.prototype.add = function(item) {
	var i = this.push(item);
	this.updateElement();
	return i;
}

glam.DOMClassList.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if (i != -1) {
		this.splice(i, 1)
		this.updateElement();
	}
}

glam.DOMClassList.prototype.updateElement = function() {

}
