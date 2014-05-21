glam.Node = {};

glam.Node.getStyle = function(docelt) {
	if (docelt.id) {
		var style = glam.getStyle("#" + docelt.id);
	}
	
	var klass = docelt.getAttribute('class')
	if (klass) {
		var style = glam.getStyle("." + klass);
	}
	
	return style;
}