/**
 * @fileoverview Contains prefab assemblies for core GLAM package
 * @author Tony Parisi
 */
goog.provide('glam.Helpers');

glam.Helpers.BoundingBoxDecoration = function(param) {
	param = param || {};
	if (!param.object) {
		glam.warn("glam.Helpers.BoundingBoxDecoration requires an object");
		return null;
	}
	
	var object = param.object;
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var bbox = glam.SceneUtils.computeBoundingBox(object);
	
	var width = bbox.max.x - bbox.min.x,
		height = bbox.max.y - bbox.min.y,
		depth = bbox.max.z - bbox.min.z;
	
	var mesh = new THREE.BoxHelper();
	mesh.material.color.setHex(color);
	mesh.scale.set(width / 2, height / 2, depth / 2);
	
	var decoration = new glam.Decoration({object:mesh});
	
	var center = bbox.max.clone().add(bbox.min).multiplyScalar(0.5);
	decoration.position.add(center);
	
	return decoration;
}

glam.Helpers.VectorDecoration = function(param) {

	param = param || {};
	
	var start = param.start || new THREE.Vector3;
	var end = param.end || new THREE.Vector3(0, 1, 0);
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var linegeom = new THREE.Geometry();
	linegeom.vertices.push(start, end); 

	var mat = new THREE.LineBasicMaterial({color:color});

	var mesh = new THREE.Line(linegeom, mat);
	
	var decoration = new glam.Decoration({object:mesh});
	return decoration;
}

glam.Helpers.PlaneDecoration = function(param) {

	param = param || {};
	
	if (!param.normal && !param.triangle) {
		glam.warn("glam.Helpers.PlaneDecoration requires either a normal or three coplanar points");
		return null;
	}

	var normal = param.normal;
	if (!normal) {
		// do this later
		glam.warn("glam.Helpers.PlaneDecoration creating plane from coplanar points not implemented yet");
		return null;
	}
	
	var position = param.position || new THREE.Vector3;	
	var size = param.size || 1;
	var color = param.color !== undefined ? param.color : 0x888888;
	
	var u = new THREE.Vector3(0, normal.z, -normal.y).normalize().multiplyScalar(size);
	var v = u.clone().cross(normal).normalize().multiplyScalar(size);
	
	var p1 = position.clone().sub(u).sub(v);
	var p2 = position.clone().add(u).sub(v);
	var p3 = position.clone().add(u).add(v);
	var p4 = position.clone().sub(u).add(v);
	
	var planegeom = new THREE.Geometry();
	planegeom.vertices.push(p1, p2, p3, p4); 
	var planeface = new THREE.Face3( 0, 1, 2 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	var planeface = new THREE.Face3( 0, 2, 3 );
	planeface.normal.copy( normal );
	planeface.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
	planegeom.faces.push(planeface);
	planegeom.computeFaceNormals();
	planegeom.computeCentroids();

	var mat = new THREE.MeshBasicMaterial({color:color, transparent: true, side:THREE.DoubleSide, opacity:0.1 });

	var mesh = new THREE.Mesh(planegeom, mat);
	
	var decoration = new glam.Decoration({object:mesh});
	return decoration;
}

