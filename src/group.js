glam.Group = {};

glam.Group.create = function(docelt, sceneobj) {

	var style = glam.Node.getStyle(docelt);
	
	// Create the group
	var group = new Vizi.Object;
	glam.Transform.parse(docelt, group);
	glam.Animation.parse(docelt, group);
	
	return group;
}
