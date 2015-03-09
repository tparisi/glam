/**
 * @fileoverview text primitive parser/implementation. only supports helvetiker and optimer fonts right now.
 * 
 * @author Tony Parisi
 */

goog.provide('glam.TextElement');

glam.TextElement.DEFAULT_FONT_SIZE = 1;
glam.TextElement.DEFAULT_FONT_DEPTH = .2;
glam.TextElement.DEFAULT_FONT_BEVEL = "none";
glam.TextElement.DEFAULT_BEVEL_SIZE = .01;
glam.TextElement.DEFAULT_BEVEL_THICKNESS = .02;
glam.TextElement.DEFAULT_FONT_FAMILY = "helvetica";
glam.TextElement.DEFAULT_FONT_WEIGHT = "normal";
glam.TextElement.DEFAULT_FONT_STYLE = "normal";
glam.TextElement.DEFAULT_FONT_RENDER = "polygon";

glam.TextElement.BEVEL_EPSILON = 0.0001;

glam.TextElement.DEFAULT_VALUE = "";

// these are for bitmap text
glam.TextElement.DEFAULT_WIDTH = 2;
glam.TextElement.DEFAULT_HEIGHT = .5;

glam.TextElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.TextElement);
}

glam.TextElement.getAttributes = function(docelt, style, param) {

	// Font stuff
	// for now: helvetiker, optimer - typeface.js stuff
	// could also do: gentilis, droid sans, droid serif but the files are big.
	var fontFamily = docelt.getAttribute('fontFamily') || glam.TextElement.DEFAULT_FONT_FAMILY; // "optimer";
	var fontWeight = docelt.getAttribute('fontWeight') || glam.TextElement.DEFAULT_FONT_WEIGHT; // "bold"; // normal bold
	var fontStyle = docelt.getAttribute('fontStyle') || glam.TextElement.DEFAULT_FONT_STYLE; // "normal"; // normal italic

	// Size, depth, bevel etc.
	var fontSize = docelt.getAttribute('fontSize') || glam.TextElement.DEFAULT_FONT_SIZE;
	var fontDepth = docelt.getAttribute('fontDepth') || glam.TextElement.DEFAULT_FONT_DEPTH;
	var fontBevel = docelt.getAttribute('fontBevel') || glam.TextElement.DEFAULT_FONT_BEVEL;
	var bevelSize = docelt.getAttribute('bevelSize') || glam.TextElement.DEFAULT_BEVEL_SIZE;
	var bevelThickness = docelt.getAttribute('bevelThickness') || glam.TextElement.DEFAULT_BEVEL_THICKNESS;

	// Render style
	var fontRender = docelt.getAttribute('fontRender') || glam.TextElement.DEFAULT_FONT_RENDER;
	
	// Size - for bitmap text
	var width = docelt.getAttribute('width') || glam.TextElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.TextElement.DEFAULT_HEIGHT;

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
		if (style["font-render"])
			fontRender = style["font-render"];
	}

	// set up defaults, safeguards; convert to typeface.js names
	fontFamily = fontFamily.toLowerCase();
	fontRender = fontRender.toLowerCase();

	if (fontRender == "polygon") {
		switch (fontFamily) {
			case "optima" :
				fontFamily = "optimer"; 
				break;
			case "helvetica" :
			default :
				fontFamily = "helvetiker"; 
				break;
		}		
	}

	// final safeguard, make sure font is there. if not, use helv
	var face = THREE.FontUtils.faces[fontFamily];
	if (!face && fontRender == "polygon") {
		fontFamily = "helvetiker"; 
	}
	
	fontWeight = fontWeight.toLowerCase();
	if (fontWeight != "bold" && fontRender == "polygon") {
		fontWeight = "normal";
	}

	fontStyle = fontStyle.toLowerCase();
	// N.B.: for now, just use normal, italic doesn't seem to work 
	if (fontRender == "polygon") { // fontStyle != "italic") {
		fontStyle = "normal";
	}
	
	fontSize = parseFloat(fontSize);
	fontDepth = parseFloat(fontDepth);
	bevelSize = parseFloat(bevelSize);
	bevelThickness = parseFloat(bevelThickness);
	var bevelEnabled = (fontBevel.toLowerCase() == "bevel") ? true : false;
	if (!fontDepth) {
		bevelEnabled = false;
	}
	// hack because no-bevel shading has bad normals along text edge
	if (!bevelEnabled) {
		bevelThickness = bevelSize = glam.TextElement.BEVEL_EPSILON;
		bevelEnabled = true;
	}

	// The text value
	var value = docelt.getAttribute('value') || glam.TextElement.DEFAULT_VALUE;

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
	param.fontRender = fontRender;
	param.width = width;
	param.height = height;

	if (style)
		param.color = style.color;
}

glam.TextElement.createVisual = function(docelt, material, param) {

	if (!param.value) {
		return null;
	}
	
	if (param.fontRender == "polygon")
		return glam.TextElement.createPolygonText(docelt, material, param);
	else if (param.fontRender == "bitmap")
		return glam.TextElement.createBitmapText(docelt, material, param);

	return null;
}

glam.TextElement.createPolygonText = function(docelt, material, param) {

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


	var visual = new glam.Visual(
			{ geometry: textGeo,
				material: textmat
			});

	textGeo.center();
	
	return visual;
}

glam.TextElement.createBitmapText = function(docelt, material, param) {
	var surfaceMaterial = material.clone();
	surfaceMaterial.color.setRGB(1, 1, 1);

	surfaceMaterial.map = this.createTexture(param);
	surfaceMaterial.transparent = true;
	surfaceMaterial.depthWrite = false;

	var visual = new glam.Visual(
			{ geometry: new THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments),
				material: surfaceMaterial
			});

	return visual;

}

glam.TextElement.createTexture = function(param) {

	var totalSize = 2048;
	var FONT_MULTIPLIER = 144;

	var hAspect = 1, vAspect = param.height / param.width;

    var canvas = document.createElement('canvas');
    canvas.width = totalSize * hAspect;
    canvas.height = totalSize * vAspect;

    /*  canvas.style.position = 'fixed';
     canvas.style.zIndex = '999';
     document.body.appendChild( canvas );*/

    var ctx = canvas.getContext('2d');


    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

	var fontSize = param.fontSize * FONT_MULTIPLIER;
	var fontName = param.fontFamily; // "Helvetica Neue";
	var fontStyle = param.fontStyle;
	var font = fontStyle + " " + fontSize.toString() + "px " + fontName;
	ctx.font = font;
    ctx.fillStyle = param.color;
	ctx.fillText(param.value,FONT_MULTIPLIER,FONT_MULTIPLIER);


    // Creates a texture
    var texture = new THREE.Texture(canvas);


    texture.needsUpdate = true;

    return texture;
}
