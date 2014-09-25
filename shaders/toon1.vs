//		uDirLightPos:	{ type: v3, value: new THREE.Vector3() },
//		uDirLightColor: { type: c, value: new THREE.Color( 0xeeeeee ) },

//		uAmbientLightColor: { type: c, value: new THREE.Color( 0x050505 ) },


varying vec3 vNormal;
varying vec3 vRefract;

uniform vec3 uDirLightColor;
uniform vec3 uAmbientLightColor;
uniform vec3 uBaseColor;

void main() {

	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vec3 worldNormal = normalize ( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

	vNormal = normalize( normalMatrix * normal );

	vec3 I = worldPosition.xyz - cameraPosition;
	vRefract = refract( normalize( I ), worldNormal, 1.02 );

	gl_Position = projectionMatrix * mvPosition;
}

