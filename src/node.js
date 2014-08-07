glam.Node = {};


glam.Node.init = function(docelt) {

	docelt.setAttributeHandlers = [];
	docelt.onSetAttribute = function(attr, val) {
		var i, len = docelt.setAttributeHandlers.length;
		for (i = 0; i < len; i++) {
			var handler = docelt.setAttributeHandlers[i];
			if (handler) {
				handler(attr, val);
			}
		}
	}
}

glam.Node.getStyle = function(docelt) {
	
	var glamClassList = new glam.ClassList(docelt);
	docelt.glamClassList = glamClassList;
	
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
				
				glamClassList.add(kls);
			}
		}
	}
	
	var styl = docelt.getAttribute("style");
	if (styl) {
		style.addPropertiesFromString(styl);
	}
	
	docelt.glamStyle = style;
	
	return style;
}
