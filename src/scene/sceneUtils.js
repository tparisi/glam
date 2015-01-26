/**
 * @fileoverview GLAM scene utilities
 * @author Tony Parisi
 */
goog.provide('glam.SceneUtils');

// Compute the bounding box of an object or hierarchy of objects
glam.SceneUtils.computeBoundingBox = function(obj) {
	
	var computeBoundingBox = function(obj) {
		if (obj instanceof THREE.Mesh && !obj.ignoreBounds) {
			var geometry = obj.geometry;
			if (geometry) {
				if (!geometry.boundingBox) {
					geometry.computeBoundingBox();
				}
				
				var geometryBBox = geometry.boundingBox.clone();
				obj.updateMatrix();
				geometryBBox.applyMatrix4(obj.matrix);
				return geometryBBox;
			}
			else {
				return new THREE.Box3(new THREE.Vector3, new THREE.Vector3);
			}
		}
		else {
			var i, len = obj.children.length;
			
			var boundingBox = new THREE.Box3; // (new THREE.Vector3, new THREE.Vector3);
			
			for (i = 0; i < len; i++) {
				var bbox = computeBoundingBox(obj.children[i]);
				if ( bbox.min.x < boundingBox.min.x ) {

					boundingBox.min.x = bbox.min.x;

				}
				
				if ( bbox.max.x > boundingBox.max.x ) {

					boundingBox.max.x = bbox.max.x;

				}

				if ( bbox.min.y < boundingBox.min.y ) {

					boundingBox.min.y = bbox.min.y;

				}
				
				if ( bbox.max.y > boundingBox.max.y ) {

					boundingBox.max.y = bbox.max.y;

				}

				if ( bbox.min.z < boundingBox.min.z ) {

					boundingBox.min.z = bbox.min.z;

				}
				
				if ( bbox.max.z > boundingBox.max.z ) {

					boundingBox.max.z = bbox.max.z;

				}
			}

			if (isFinite(boundingBox.min.x)) {
				obj.updateMatrix();
				boundingBox.applyMatrix4(obj.matrix);
			}
			return boundingBox;
		}
	}
	
	if (obj instanceof glam.Object) {
		return computeBoundingBox(obj.transform.object);
	}
	else if (obj instanceof glam.Visual) {
		return computeBoundingBox(obj.object);
	}
	else {
		return new THREE.Box3(new THREE.Vector3, new THREE.Vector3);
	}
}


