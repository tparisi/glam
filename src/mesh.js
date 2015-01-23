/**
 * @fileoverview mesh parser/implementation. currently only supports triangle sets
 * 
 * @author Tony Parisi
 */

glam.DOM.Mesh = {};
glam.DOM.Mesh.VERTEX_NORMALS = false;
glam.DOM.Mesh.VERTEX_COLORS = false;

glam.DOM.Mesh.create = function(docelt, style) {
	
	return glam.DOM.Visual.create(docelt, style, glam.DOM.Mesh);
}

glam.DOM.Mesh.getAttributes = function(docelt, style, param) {
	
	var vertexNormals = docelt.getAttribute('vertexNormals');
	if (vertexNormals !== null) {
		vertexNormals = true;
	}
	else {
		vertexNormals = glam.DOM.Mesh.VERTEX_NORMALS;
	}
	
	var vertexColors = docelt.getAttribute('vertexColors');
	if (vertexColors !== null) {
		vertexColors = true;
	}
	else {
		vertexColors = glam.DOM.Mesh.VERTEX_COLORS;
	}
	
	if (style) {
		if (style.vertexNormals)
			vertexNormals = style.vertexNormals;
		if (style.vertexColors)
			vertexColors = style.vertexColors;
	}
	
	param.vertexNormals = vertexNormals;
	param.vertexColors = vertexColors;
}

glam.DOM.Mesh.createVisual = function(docelt, material, param) {

	var geometry = new THREE.Geometry;
	
	glam.DOM.Mesh.parse(docelt, geometry, material, param);
	
	var mesh = new THREE.Mesh(geometry, material);
	var visual = new Vizi.Visual(
			{
				object : mesh,
			});
	
	return visual;
}

glam.DOM.Mesh.parse = function(docelt, geometry, material, param) {

	var verts = docelt.getElementsByTagName('vertices');
	if (verts) {
		verts = verts[0];
		if (verts) {
			glam.DOM.Types.parseVector3Array(verts, geometry.vertices);
		}
	}
	
	var uvs = docelt.getElementsByTagName('uvs');
	if (uvs) {
		uvs = uvs[0];
		if (uvs) {
			glam.DOM.Types.parseUVArray(uvs, geometry.faceVertexUvs[0]);
		}
	}

	var faces = docelt.getElementsByTagName('faces');
	if (faces) {
		faces = faces[0];
		if (faces) {
			glam.DOM.Types.parseFaceArray(faces, geometry.faces);
		}
	}

	var vertexNormals = [];
	var normals = docelt.getElementsByTagName('normals');
	if (normals) {
		normals = normals[0];
		if (normals) {
			glam.DOM.Types.parseVector3Array(normals, vertexNormals);
			
			if (param.vertexNormals) {
				
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var norm = vertexNormals[face.a].normalize().clone();
						face.vertexNormals[0] = norm;
						var norm = vertexNormals[face.b].normalize().clone();
						face.vertexNormals[1] = norm;
						var norm = vertexNormals[face.c].normalize().clone();
						face.vertexNormals[2] = norm;
					}
				}
			}
			else {
				
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var norm = vertexNormals[i].normalize();
						face.normal.copy(norm);
					}
				}
			}
		}
	}
	
	var vertexColors = [];
	var colors = docelt.getElementsByTagName('colors');
	if (colors) {
		colors = colors[0];
		if (colors) {
			glam.DOM.Types.parseColor3Array(colors, vertexColors);
	
			if (param.vertexColors) {
	
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var c = vertexColors[face.a];
						if (c) {
							face.vertexColors[0] = c.clone();
						}
						var c = vertexColors[face.b];
						if (c) {
							face.vertexColors[1] = c.clone();
						}
						var c = vertexColors[face.c];
						if (c) {
							face.vertexColors[2] = c.clone();
						}
					}
				}
	
				material.vertexColors = THREE.VertexColors;
			}
			else {
				
				var i, len = geometry.faces.length;
	
				for (i = 0; i < len; i++) {
					
					var face = geometry.faces[i];
					if (face) {
						var c = vertexColors[i];
						if (c) {
							face.color.copy(c);
						}
					}
				}
				
				material.vertexColors = THREE.FaceColors; 
			}
		
			geometry.colorsNeedUpdate = true;
			geometry.buffersNeedUpdate = true;
		}
	}
}

