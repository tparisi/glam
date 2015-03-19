/**
 * @fileoverview 2D rectangle parser/implementation
 * 
 * @author Tony Parisi
 */


goog.provide('glam.SurfaceElement');

glam.SurfaceElement.DEFAULT_WIDTH = 2;
glam.SurfaceElement.DEFAULT_HEIGHT = 2;
glam.SurfaceElement.DEFAULT_WIDTH_SEGMENTS = 16;
glam.SurfaceElement.DEFAULT_HEIGHT_SEGMENTS = 16;
glam.SurfaceElement.DEFAULT_CURVATURE = 0;
glam.SurfaceElement.DEFAULT_VALUE = "";
glam.SurfaceElement.DEFAULT_COLOR = "black";
glam.SurfaceElement.DEFAULT_BACKGROUND_COLOR = "white";
glam.SurfaceElement.DEFAULT_FONT_FAMILY = "helvetica";
glam.SurfaceElement.DEFAULT_FONT_WEIGHT = "normal";
glam.SurfaceElement.DEFAULT_FONT_STYLE = "normal";
glam.SurfaceElement.DEFAULT_FONT_SIZE = 10;

glam.SurfaceElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.SurfaceElement);
}

glam.SurfaceElement.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.SurfaceElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.SurfaceElement.DEFAULT_HEIGHT;
	var widthSegments = docelt.getAttribute('width') || glam.SurfaceElement.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height') || glam.SurfaceElement.DEFAULT_HEIGHT_SEGMENTS;
	var curvature = docelt.getAttribute('curvature') || glam.SurfaceElement.DEFAULT_CURVATURE;
	var color = docelt.getAttribute('color') || glam.SurfaceElement.DEFAULT_COLOR;
	var backgroundColor = docelt.getAttribute('backgroundColor') || glam.SurfaceElement.DEFAULT_BACKGROUND_COLOR;
	var fontFamily = docelt.getAttribute('fontFamily') || glam.SurfaceElement.DEFAULT_FONT_FAMILY; 
	var fontWeight = docelt.getAttribute('fontWeight') || glam.SurfaceElement.DEFAULT_FONT_WEIGHT; 
	var fontStyle = docelt.getAttribute('fontStyle') || glam.SurfaceElement.DEFAULT_FONT_STYLE; 
	var fontSize = docelt.getAttribute('fontSize') || glam.SurfaceElement.DEFAULT_FONT_SIZE;
	var elementID = docelt.getAttribute('element');

	var border = 0,
		borderRadius = 0,
		borderRadiusLeft = 0,
		borderRadiusTop = 0,
		borderRadiusRight = 0,
		borderRadiusBottom = 0;

	if (style) {
		if (style.width)
			width = style.width;
		if (style.height)
			height = style.height;
		if (style.widthSegments)
			widthSegments = style.widthSegments;
		if (style.heightSegments)
			heightSegments = style.heightSegments;
		if (style.curvature)
			curvature = style.curvature;
		if (style.border)
			border = style.border;
		if (style["border-radius"])
			borderRadius = style["border-radius"];
		if (style["border-top-radius"]) {
			borderRadiusTop = style["border-top-radius"];			
		}
		else {
			borderRadiusTop = borderRadius;
		}
		if (style["border-left-radius"]) {
			borderRadiusLeft = style["border-left-radius"];			
		}
		else {
			borderRadiusLeft = borderRadius;
		}
		if (style["border-right-radius"]) {			
			borderRadiusRight = style["border-right-radius"];
		}
		else {
			borderRadiusRight = borderRadius;
		}
		if (style["border-bottom-radius"]) {
			borderRadiusBottom = style["border-bottom-radius"];			
		}
		else {
			borderRadiusBottom = borderRadius;
		}

		if (style.color)
			color = style.color;

		if (style["background-color"])
			backgroundColor = style["background-color"];

		if (style["font-family"])
			fontFamily = style["font-family"];
		if (style["font-weight"])
			fontWeight = style["font-weight"];
		if (style["font-style"])
			fontStyle = style["font-style"];
		if (style["font-size"])
			fontSize = style["font-size"];

	}
	
	// The text value
	var value = docelt.getAttribute('value') || glam.SurfaceElement.DEFAULT_VALUE;

	if (!value) {
		value = docelt.textContent;
	}

	width = parseFloat(width);
	height = parseFloat(height);
	widthSegments = parseInt(widthSegments);
	heightSegments = parseInt(heightSegments);
	curvature = parseInt(curvature);
	border = parseInt(border);
	borderRadius = parseInt(borderRadius);
	borderRadiusTop = parseInt(borderRadiusTop);
	borderRadiusLeft = parseInt(borderRadiusLeft);
	borderRadiusRight = parseInt(borderRadiusRight);
	borderRadiusBottom = parseInt(borderRadiusBottom);
	fontSize = parseFloat(fontSize);

	param.width = width;
	param.height = height;
	param.widthSegments = widthSegments;
	param.heightSegments = heightSegments;
	param.curvature = curvature;
	param.border = border;
	param.borderRadius = borderRadius;
	param.borderRadiusTop = borderRadiusTop;
	param.borderRadiusLeft = borderRadiusLeft;
	param.borderRadiusRight = borderRadiusRight;
	param.borderRadiusBottom = borderRadiusBottom;
	param.value = value;
	param.color = color;
	param.backgroundColor = backgroundColor;
	param.fontFamily = fontFamily;
	param.fontWeight = fontWeight;
	param.fontStyle = fontStyle;
	param.fontSize = fontSize;
	param.elementID = elementID;
	param.docelt = docelt;
}

glam.SurfaceElement.createVisual = function(docelt, material, param) {


	var surfaceMaterial = material.clone();
	surfaceMaterial.color.setRGB(1, 1, 1);
	surfaceMaterial.map = glam.SurfaceElement.createTexture(param);
	surfaceMaterial.transparent = true;
	surfaceMaterial.depthWrite = false;

	var visual = new glam.Visual(
			{ geometry: new THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments),
				material: surfaceMaterial
			});

	return visual;
}

glam.SurfaceElement.createTexture = function(param) {

	var totalSize = 1024;
	var FONT_MULTIPLIER = 1;

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

    if (param.elementID) {
    	glam.SurfaceElement.createHTMLTexture(param);
    }

    ctx.fillStyle = param.backgroundColor;
    ctx.strokeStyle = param.color;
    ctx.lineWidth = param.border;

    glam.SurfaceElement.roundRect(ctx, 0, 0, canvas.width, canvas.height, 
    		{
    			left:param.borderRadiusLeft, right:param.borderRadiusRight, 
    			top:param.borderRadiusTop, bottom:param.borderRadiusBottom
    		}, 
    	true, param.border);
    
	var fontSize = param.fontSize * FONT_MULTIPLIER;
	var fontName = param.fontFamily; // "Helvetica Neue";
	var fontStyle = param.fontStyle;
	var font = fontStyle + " " + fontSize.toString() + "px " + fontName;
	ctx.font = font;

//	var fontSize = 72;
//	var fontName = "Helvetica Neue";
//	ctx.font= fontSize.toString() + "px " + fontName;

    ctx.fillStyle = param.color;
	ctx.fillText(param.value,20,100);


    // Creates a texture
    var texture = new THREE.Texture(canvas);


    texture.needsUpdate = true;

    return texture;
}

glam.SurfaceElement.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius.left, y);
  ctx.lineTo(x + width - radius.right, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.top);
  ctx.lineTo(x + width, y + height - radius.bottom);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.right, y + height);
  ctx.lineTo(x + radius.left, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bottom);
  ctx.lineTo(x, y + radius.top);
  ctx.quadraticCurveTo(x, y, x + radius.left, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();	
  }
}

glam.SurfaceElement.createHTMLTexture = function(param) {
	var element = document.getElementById(param.elementID);
	var cloned = element.cloneNode(true);
	document.body.appendChild(cloned);

	var docelt = param.docelt;

    html2canvas(cloned).then(function(canvas) {
        document.body.removeChild(cloned);

	    var map = new THREE.Texture(canvas);
	    map.needsUpdate = true;

	    var obj = docelt.glam.object;
	    var visual = obj.visuals[0];

	    var geometry = visual.geometry.clone();
	    var material = visual.material.clone();
		material.map = map;

	    visual.material.color.setRGB(1, 0, 0);

		obj.removeComponent(visual);

		var visual = new glam.Visual(
				{ geometry: geometry,
					material: material
				});

		obj.addComponent(visual);
    });

}
