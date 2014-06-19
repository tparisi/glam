glam.Text = {};

glam.Text.DEFAULT_FONT_SIZE = 1;
glam.Text.DEFAULT_FONT_DEPTH = .2;
glam.Text.DEFAULT_FONT_BEVEL = "none";
glam.Text.DEFAULT_BEVEL_SIZE = .01;
glam.Text.DEFAULT_BEVEL_THICKNESS = .02;
glam.Text.BEVEL_EPSILON = 0.0001;

glam.Text.DEFAULT_VALUE = "glam.js",

glam.Text.create = function(docelt) {
	return glam.Visual.create(docelt, glam.Text);
}

glam.Text.getAttributes = function(docelt, style, param) {

	var fontSize = docelt.getAttribute('fontSize') || glam.Text.DEFAULT_FONT_SIZE;
	var fontDepth = docelt.getAttribute('fontDepth') || glam.Text.DEFAULT_FONT_DEPTH;
	var fontBevel = docelt.getAttribute('fontBevel') || glam.Text.DEFAULT_FONT_BEVEL;
	var bevelSize = docelt.getAttribute('bevelSize') || glam.Text.DEFAULT_BEVEL_SIZE;
	var bevelThickness = docelt.getAttribute('bevelThickness') || glam.Text.DEFAULT_BEVEL_THICKNESS;
	var value = docelt.getAttribute('value') || glam.Text.DEFAULT_VALUE;
	
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
	
	param.value = value;
	param.fontSize = fontSize;
	param.fontDepth = fontDepth;
	param.bevelSize = bevelSize;
	param.bevelThickness = bevelThickness;
	param.bevelEnabled = bevelEnabled;
}

glam.Text.createVisual = function(docelt, material, param) {

	var height = param.fontDepth;
	var size = param.fontSize;
	var hover = .3;
	var curveSegments = 4;

	font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
	weight = "bold", // normal bold
	style = "normal"; // normal italic

	var textGeo = new THREE.TextGeometry( param.value, {

		size: size,
		height: height,
		curveSegments: curveSegments,

		font: font,
		weight: weight,
		style: style,

		bevelThickness: param.bevelThickness,
		bevelSize: param.bevelSize,
		bevelEnabled: param.bevelEnabled,

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


	var visual = new Vizi.Visual(
			{ geometry: textGeo,
				material: textmat
			});

	THREE.GeometryUtils.center(textGeo);
	
	return visual;
}
