glam.Node = {};

glam.Node.getStyle = function(docelt) {
	
	function addStyle(styl) {
		for (s in styl) {
			style[s] = styl[s];
		}
	}
	
	var style = {
	};
	
	if (docelt.id) {
		style = glam.getStyle("#" + docelt.id);
	}
	
	var klass = docelt.getAttribute('class')
	if (klass) {
		var klasses = klass.split(" ");
		for (klassname in klasses) {
			var kls = klasses[klassname];
			if (kls) {
				var styl = glam.getStyle("." + kls);
				addStyle(styl);
			}
		}
	}
	
	return style;
}