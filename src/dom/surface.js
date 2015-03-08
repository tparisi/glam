/**
 * @fileoverview 2D rectangle parser/implementation
 * 
 * @author Tony Parisi
 */


goog.provide('glam.SurfaceElement');

glam.SurfaceElement.DEFAULT_WIDTH = 2;
glam.SurfaceElement.DEFAULT_HEIGHT = 2;
glam.SurfaceElement.DEFAULT_WIDTH_SEGMENTS = 1;
glam.SurfaceElement.DEFAULT_CURVATURE = 0;

glam.SurfaceElement.create = function(docelt, style) {
	return glam.VisualElement.create(docelt, style, glam.SurfaceElement);
}

glam.SurfaceElement.getAttributes = function(docelt, style, param) {

	var width = docelt.getAttribute('width') || glam.SurfaceElement.DEFAULT_WIDTH;
	var height = docelt.getAttribute('height') || glam.SurfaceElement.DEFAULT_HEIGHT;
	var widthSegments = docelt.getAttribute('width') || glam.SurfaceElement.DEFAULT_WIDTH_SEGMENTS;
	var heightSegments = docelt.getAttribute('height') || glam.SurfaceElement.DEFAULT_HEIGHT_SEGMENTS;
	var curvature = docelt.getAttribute('curvature') || glam.SurfaceElement.DEFAULT_CURVATURE;

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

}

glam.SurfaceElement.createVisual = function(docelt, material, param) {


	var surfaceMaterial = material.clone();
//	surfaceMaterial.color.setRGB(1, 0, 0);
//	surfaceMaterial.map = null;

	surfaceMaterial.map = this.createTexture(param);
	surfaceMaterial.depthWrite = false;

	var visual = new glam.Visual(
			{ geometry: new THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments),
				material: surfaceMaterial
			});

	return visual;
}

glam.SurfaceElement.createTexture = function(param) {

	var totalSize = 2048;

	var hAspect = 1, vAspect = param.height / param.width;

    this.canvas = document.createElement('canvas');
    this.canvas.width = totalSize * hAspect;
    this.canvas.height = totalSize * vAspect;

    /*  canvas.style.position = 'fixed';
     canvas.style.zIndex = '999';
     document.body.appendChild( canvas );*/

    var ctx = this.canvas.getContext('2d');


    ctx.fillStyle = "white";
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = param.border;
    this.roundRect(ctx, 0, 0, this.canvas.width, this.canvas.height, 
    		{
    			left:param.borderRadiusLeft, right:param.borderRadiusRight, 
    			top:param.borderRadiusTop, bottom:param.borderRadiusBottom
    		}, 
    	false, param.border);
//     ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     ctx.fillStyle = "rgba( 255 , 255 , 255 , 0.95 )";

	var fontSize = 72;
	var fontName = "Helvetica Neue";
	ctx.font= fontSize.toString() + "px " + fontName;
    ctx.fillStyle = "cyan";
	ctx.fillText("GLAM <surface> Prototype",50,200);


    // Creates a texture
    var texture = new THREE.Texture(this.canvas);


    texture.needsUpdate = true;

    return texture;
}

glam.SurfaceElement.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
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