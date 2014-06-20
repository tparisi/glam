glam.Text = {};

glam.Text.DEFAULT_FONT_SIZE = 1;
glam.Text.DEFAULT_FONT_DEPTH = .2;
glam.Text.DEFAULT_FONT_BEVEL = "none";
glam.Text.DEFAULT_BEVEL_SIZE = .01;
glam.Text.DEFAULT_BEVEL_THICKNESS = .02;
glam.Text.BEVEL_EPSILON = 0.0001;

glam.Text.DEFAULT_VALUE = "",

glam.Text.create = function(docelt) {
	return glam.Visual.create(docelt, glam.Text);
}

glam.Text.getAttributes = function(docelt, style, param) {

	// Font stuff
	// for now: helvetiker, optimer - typeface.js stuff
	// could also do: gentilis, droid sans, droid serif but the files are big.
	var fontFamily = "optimer";
	var fontWeight = "bold"; // normal bold
	var fontStyle = "normal"; // normal italic

	// Size, depth, bevel etc.
	var fontSize = docelt.getAttribute('fontSize') || glam.Text.DEFAULT_FONT_SIZE;
	var fontDepth = docelt.getAttribute('fontDepth') || glam.Text.DEFAULT_FONT_DEPTH;
	var fontBevel = docelt.getAttribute('fontBevel') || glam.Text.DEFAULT_FONT_BEVEL;
	var bevelSize = docelt.getAttribute('bevelSize') || glam.Text.DEFAULT_BEVEL_SIZE;
	var bevelThickness = docelt.getAttribute('bevelThickness') || glam.Text.DEFAULT_BEVEL_THICKNESS;
	
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

	// The text value
	var value = docelt.getAttribute('value') || glam.Text.DEFAULT_VALUE;

	if (!value) {
		value = docelt.textContent;
	}
	
	param.value = value;
	param.fontSize = fontSize;
	param.fontDepth = fontDepth;
	param.bevelSize = bevelSize;
	param.bevelThickness = bevelThickness;
	param.bevelEnabled = bevelEnabled;
	param.fontFamily = fontFamily;
	param.fontWeight = fontWeight;
	param.fontStyle = fontStyle;
}

glam.Text.createVisual = function(docelt, material, param) {

	if (!param.value) {
		return null;
	}
	
	var curveSegments = 4;

	var textGeo = new THREE.TextGeometry( param.value, {

		font: param.fontFamily,
		weight: param.fontWeight,
		style: param.fontStyle,

		size: param.fontSize,
		height: param.fontDepth,
		curveSegments: curveSegments,

		bevelThickness: param.bevelThickness,
		bevelSize: param.bevelSize,
		bevelEnabled: param.bevelEnabled,

		material: 0,
		extrudeMaterial: 1

	});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	var frontMaterial = material.clone();
	frontMaterial.shading = THREE.FlatShading;
	var extrudeMaterial = material.clone();
	extrudeMaterial.shading = THREE.SmoothShading;
	var textmat = new THREE.MeshFaceMaterial( [ frontMaterial,  // front
	                                            extrudeMaterial // side
	                                            ]);


	var visual = new Vizi.Visual(
			{ geometry: textGeo,
				material: textmat
			});

	THREE.GeometryUtils.center(textGeo);
	
	return visual;
}
