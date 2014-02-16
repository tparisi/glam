glam = {

		documents : {},
		
		documentParents : {},
		
		styles : {},

		viewers : {},
};

glam.ready = function() {
	glam.parser.parseDocument();
	glam.createViewers();
}

glam.createViewers = function() {
	for (docname in glam.documents) {
		var doc = glam.documents[docname];
		var docParent = glam.documentParents[docname];
		var viewer = new glam.Viewer(doc, docParent);
		glam.viewers[docname] = viewer;
		viewer.go();
	}
}


glam.addStyle = function(selector, style)
{
	glam.styles[selector] = style;
}

glam.getStyle = function(selector)
{
	return glam.styles[selector];
}
