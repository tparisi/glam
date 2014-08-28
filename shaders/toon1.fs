varying vec3 vNormal;
varying vec3 vRefract;

vec3 uDirLightPos = vec3(1.0, 0.0, 1.0);

uniform vec3 uDirLightColor;
uniform vec3 uAmbientLightColor;
uniform vec3 uBaseColor;


void main() {

	float directionalLightWeighting = max( dot( normalize( vNormal ), uDirLightPos ), 0.0);
	vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;

	float intensity = smoothstep( - 0.5, 1.0, pow( length(lightWeighting), 20.0 ) );
	intensity += length(lightWeighting) * 0.2;

	float cameraWeighting = dot( normalize( vNormal ), vRefract );
	intensity += pow( 1.0 - length( cameraWeighting ), 6.0 );
	intensity = intensity * 0.2 + 0.3;

	if ( intensity < 0.50 ) {

		gl_FragColor = vec4( 2.0 * intensity * uBaseColor, 1.0 );

	} else {

		gl_FragColor = vec4( 1.0 - 2.0 * ( 1.0 - intensity ) * ( 1.0 - uBaseColor ), 1.0 );

	}
}


