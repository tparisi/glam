glam.Text = {};

glam.Text.DEFAULT_FONT_SIZE = 1;
glam.Text.DEFAULT_FONT_DEPTH = .2;
glam.Text.DEFAULT_FONT_BEVEL = "none";
glam.Text.DEFAULT_BEVEL_SIZE = .01;
glam.Text.DEFAULT_BEVEL_THICKNESS = .02;
glam.Text.BEVEL_EPSILON = 0.0001;

glam.Text.DEFAULT_VALUE = "glam.js",

glam.Text.create = function(docelt) {
	var fontSize = docelt.getAttribute('fontSize') || glam.Text.DEFAULT_FONT_SIZE;
	var fontDepth = docelt.getAttribute('fontDepth') || glam.Text.DEFAULT_FONT_DEPTH;
	var fontBevel = docelt.getAttribute('fontBevel') || glam.Text.DEFAULT_FONT_BEVEL;
	var bevelSize = docelt.getAttribute('bevelSize') || glam.Text.DEFAULT_BEVEL_SIZE;
	var bevelThickness = docelt.getAttribute('bevelThickness') || glam.Text.DEFAULT_BEVEL_THICKNESS;
	var value = docelt.getAttribute('value') || glam.Text.DEFAULT_VALUE;
	
	var style = glam.Node.getStyle(docelt);

	if (style) {
		if (style["font-size"])
			fontSize = style["font-size"];
		if (style["font-depth"])
			fontDepth = style["font-depth"];
		if (style["font-bevel"])
			fontBevel = style["font-bevel"];
		if (style["bevel-size"])
			bevelSize = style["bevel-size"];
		if (style["bevel-thickness"])
			bevelThickness = style["bevel-thickness"];
	}
	
	fontSize = parseFloat(fontSize);
	fontDepth = parseFloat(fontDepth);
	bevelSize = parseFloat(bevelSize);
	bevelThickness = parseFloat(bevelThickness);
	bevelEnabled = (fontBevel.toLowerCase() == "bevel") ? true : false;
	if (!fontDepth) {
		bevelEnabled = false;
	}
	// hack because no-bevel shading has bad normals along text edge
	if (!bevelEnabled) {
		bevelThickness = bevelSize = glam.Text.BEVEL_EPSILON;
		bevelEnabled = true;
	}
	
	var material = glam.Material.create(style);

	var height = fontDepth;
	var size = fontSize;
	var hover = .3;
	var curveSegments = 4;

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
	
	return text;
}
