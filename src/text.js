glam.Text = {};

glam.Text.DEFAULT_SIZE = 10;
glam.Text.DEFAULT_HEIGHT = 2;

glam.Text.DEFAULT_VALUE = "glam.js",

glam.Text.create = function(docelt, sceneobj) {
	var size = docelt.getAttribute('size') || glam.Text.DEFAULT_SIZE;
	var height = docelt.getAttribute('height') || glam.Text.DEFAULT_HEIGHT;
	var value = docelt.getAttribute('value') || glam.Text.DEFAULT_VALUE;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style.radius)
			size = style.size;
		if (style.height)
			height = style.height;
	}
	
	var material = glam.Material.create(style);

	height = .2,
	size = 1,
	hover = .3,

	curveSegments = 4,

	bevelThickness = .02,
	bevelSize = .01,
	bevelSegments = 3,
	bevelEnabled = true,

	font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
	weight = "bold", // normal bold
	style = "normal"; // normal italic

	var textGeo = new THREE.TextGeometry( value, {

		size: size,
		height: height,
		curveSegments: curveSegments,

		font: font,
		weight: weight,
		style: style,

		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled,

		material: 0,
		extrudeMaterial: 1

	});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	var textmat = new THREE.MeshFaceMaterial( [ 
	                    					new THREE.MeshPhongMaterial( 
	                    							{ color: material.color.getHex(), 
	                    								envMap : material.envMap, 
	                    								wireframe : material.wireframe,
	                    								shading: THREE.FlatShading,
	                    								} ), // front
	                    					new THREE.MeshPhongMaterial( 
	                    							{ color: material.color.getHex(), 
	                    								envMap : material.envMap, 
	                    								wireframe : material.wireframe,
	                    								shading: THREE.SmoothShading,
	                    								} ) // side
	                    				] );


	var text = new Vizi.Object;	
	var visual = new Vizi.Visual(
			{ geometry: textGeo,
				material: textmat
			});
	text.addComponent(visual);

	THREE.GeometryUtils.center(textGeo);
	
	glam.Transform.parse(docelt, text);
	glam.Animation.parse(docelt, text);
	glam.Input.add(docelt, text);
	glam.Material.addHandlers(docelt, text);
	

	return text;
}
