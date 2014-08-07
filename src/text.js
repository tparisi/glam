/**
 * @fileoverview text primitive parser/implementation. only supports helvetiker and optimer fonts right now.
 * 
 * @author Tony Parisi
 */

glam.Text = {};

glam.Text.DEFAULT_FONT_SIZE = 1;
glam.Text.DEFAULT_FONT_DEPTH = .2;
glam.Text.DEFAULT_FONT_BEVEL = "none";
glam.Text.DEFAULT_BEVEL_SIZE = .01;
glam.Text.DEFAULT_BEVEL_THICKNESS = .02;
glam.Text.DEFAULT_FONT_FAMILY = "helvetica";
glam.Text.DEFAULT_FONT_WEIGHT = "normal";
glam.Text.DEFAULT_FONT_STYLE = "normal";

glam.Text.BEVEL_EPSILON = 0.0001;

glam.Text.DEFAULT_VALUE = "",

glam.Text.create = function(docelt, style) {
	return glam.Visual.create(docelt, style, glam.Text);
}

glam.Text.getAttributes = function(docelt, style, param) {

	// Font stuff
	// for now: helvetiker, optimer - typeface.js stuff
	// could also do: gentilis, droid sans, droid serif but the files are big.
	var fontFamily = docelt.getAttribute('fontFamily') || glam.Text.DEFAULT_FONT_FAMILY; // "optimer";
	var fontWeight = docelt.getAttribute('fontWeight') || glam.Text.DEFAULT_FONT_WEIGHT; // "bold"; // normal bold
	var fontStyle = docelt.getAttribute('fontStyle') || glam.Text.DEFAULT_FONT_STYLE; // "normal"; // normal italic

	// Size, depth, bevel etc.
	var fontSize = docelt.getAttribute('fontSize') || glam.Text.DEFAULT_FONT_SIZE;
	var fontDepth = docelt.getAttribute('fontDepth') || glam.Text.DEFAULT_FONT_DEPTH;
	var fontBevel = docelt.getAttribute('fontBevel') || glam.Text.DEFAULT_FONT_BEVEL;
	var bevelSize = docelt.getAttribute('bevelSize') || glam.Text.DEFAULT_BEVEL_SIZE;
	var bevelThickness = docelt.getAttribute('bevelThickness') || glam.Text.DEFAULT_BEVEL_THICKNESS;
	
	if (style) {
		if (style["font-family"])
			fontFamily = style["font-family"];
		if (style["font-weight"])
			fontWeight = style["font-weight"];
		if (style["font-style"])
			fontStyle = style["font-style"];
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

	// set up defaults, safeguards; convert to typeface.js names
	fontFamily = fontFamily.toLowerCase();
	switch (fontFamily) {
		case "optima" :
			fontFamily = "optimer"; 
			break;
		case "helvetica" :
		default :
			fontFamily = "helvetiker"; 
			break;
	}

	// final safeguard, make sure font is there. if not, use helv
	var face = THREE.FontUtils.faces[fontFamily];
	if (!face) {
		fontFamily = "helvetiker"; 
	}
	
	fontWeight = fontWeight.toLowerCase();
	if (fontWeight != "bold") {
		fontWeight = "normal";
	}

	fontStyle = fontStyle.toLowerCase();
	// N.B.: for now, just use normal, italic doesn't seem to work 
	if (true) { // fontStyle != "italic") {
		fontStyle = "normal";
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
