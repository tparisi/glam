/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Geometry2Loader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.Geometry2Loader.prototype = {

	constructor: THREE.Geometry2Loader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader();
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		} );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometry = new THREE.Geometry2( json.vertices.length / 3 );

		var attributes = [ 'vertices', 'normals', 'uvs' ];
		var boundingSphere = json.boundingSphere;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];
			geometry[ attribute ].set( json[ attribute ] );

		}

		if ( boundingSphere !== undefined ) {

			var center = new THREE.Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new THREE.Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

};
