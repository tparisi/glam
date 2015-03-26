
goog.provide('glam.Billboard');
goog.require('glam.Component');

glam.Billboard = function(param) {
	param = param || {};

	this.enabled = (param.enabled !== undefined) ? param.enabled : glam.Billboard.DEFAULT_ENABLED;
	this.screenAlign = (param.screenAlign !== undefined) ? param.screenAlign : 
		glam.Billboard.DEFAULT_SCREENALIGN;

	this.origin = new THREE.Vector3;
	this.up = new THREE.Vector3(0, 1, 0);
	this.z = new THREE.Vector3(0, 0, 1);
	this.campos = new THREE.Vector3;
	this.prevcampos = new THREE.Vector3;
	this.plane = new THREE.Plane(this.up);
	this.invMat = new THREE.Matrix4;
	this.projectedPoint = new THREE.Vector3;

    glam.Component.call(this, param);
}

goog.inherits(glam.Billboard, glam.Component);

glam.Billboard.prototype.realize = function() {
	glam.Component.prototype.realize.call(this);
	
}

glam.Billboard.prototype.update = function() {

	if (this.enabled) {

		var obj = this._object;
		var camera = glam.Graphics.instance.camera;

		this.origin.set(0, 0, 0);
		this.origin.applyMatrix4(camera.matrixWorld);

		this.campos.copy(camera.position);
		if (this.campos.distanceTo(this.prevcampos) > glam.Billboard.EPSILON) {

			// Tuck away the camera position
			this.prevcampos.copy(this.campos);
			
			if (this.screenAlign) {
				// this doesn't work yet
				/*
				var mat = obj.transform.object.matrixWorld;
				this.invMat.getInverse(mat);
				this.campos.applyMatrix4(this.invMat);
				*/
				obj.transform.lookAt(this.campos);
			}
			else {
			
				this.plane.projectPoint(this.campos, this.projectedPoint);
				console.log(this.projectedPoint);

				this.projectedPoint.normalize();
				var theta = Math.acos(this.z.dot(this.projectedPoint));
				// theta = THREE.Math.radToDeg(theta);
				console.log("theta", theta);

				this.up.crossVectors(this.projectedPoint, this.z);
				if (this.up.y < 0) {
					this.up.y = 1;
					theta = -theta;
				}

				obj.transform.rotation.y = -theta;

			}

		}		
	}
}

glam.Billboard.DEFAULT_ENABLED = true;
glam.Billboard.DEFAULT_SCREENALIGN = true;

glam.Billboard.EPSILON = 0.001;

