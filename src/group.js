glam.Group = {};

glam.Group.create = function(docelt, sceneobj) {

	// Create the group
	var group = new Vizi.Object;
	glam.Transform.parse(docelt, group);
	
	return group;
}
