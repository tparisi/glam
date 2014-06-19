glam.Visual = {};

glam.Visual.add = function(docelt, obj) {

	var visuals = obj.getComponents(Vizi.Visual);
	var visual = visuals[0];

	if (visual) {
		// Is this the API?	
		docelt.geometry = visual.geometry;
		docelt.material = visual.material;
	}
}
