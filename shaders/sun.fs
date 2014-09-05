uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 texCoord;

void main( void ) {

	vec4 noise = texture2D( texture1, texCoord );
	
	vec2 T1 = texCoord + vec2( 1.5, -1.5 ) * time  * 0.01;
	vec2 T2 = texCoord + vec2( -0.5, 2.0 ) * time *  0.01;

	T1.x -= noise.r * 2.0;
	T1.y += noise.g * 4.0;
	T2.x += noise.g * 0.2;
	T2.y += noise.b * 0.2;

	float p = texture2D( texture1, T1 * 2.0 ).a + 0.25;

	vec4 color = texture2D( texture2, T2 );
	vec4 temp = color * 2.0 * ( vec4( p, p, p, p ) ) + ( color * color );
	gl_FragColor = temp;
}
