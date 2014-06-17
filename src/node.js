glam.Node = {};

glam.Node.getStyle = function(docelt) {
	
	var style = new glam.Style(docelt);
	
	if (docelt.id) {
		var styl = glam.getStyle("#" + docelt.id);
		style.addProperties(styl);
	}
	
	var klass = docelt.getAttribute('class');
	if (!klass)
		klass = docelt['class'];
	
	if (klass) {
		var klasses = klass.split(" ");
		for (klassname in klasses) {
			var kls = klasses[klassname];
			if (kls) {
				var styl = glam.getStyle("." + kls);
				style.addProperties(styl);
			}
		}
	}
	
	docelt.glamStyle = style;
	
	return style;
}
