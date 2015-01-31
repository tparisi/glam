var list = {

	"Manual": {
		"Introduction": [
			[ "Getting Started", "manual/introduction/Getting-started" ],
			[ "Creating a scene", "manual/introduction/Creating-a-scene" ],
		],
		"Key Concepts": [
			[ "The 3D coordinate system", "manual/concepts/Coordinate-system" ],
			[ "The transformation hierarchy", "manual/concepts/Transformation-hierarchy" ],
			[ "Visuals", "manual/concepts/Visuals" ],
			[ "Cameras", "manual/concepts/Cameras" ],
			[ "Materials", "manual/concepts/Materials" ],
			[ "Lights", "manual/concepts/Lights" ],
			[ "Shaders", "manual/concepts/Shaders" ],
			[ "Animation", "manual/concepts/Animation" ],
			[ "Importing external models", "manual/concepts/Imports" ],
			[ "Postprocessing effects", "manual/concepts/Postprocessing-effects" ],
			[ "Events", "manual/concepts/events" ],
			[ "Viewing models", "manual/concepts/Viewing-models" ],
			[ "Rendering", "manual/concepts/rendering" ],
			[ "Styling GLAM with CSS", "manual/concepts/styling" ],
		],
	},

	"Reference": {
		"Elements Reference": [
			[ "Transformable Elements", "reference/elements/scene/transformable-elements"],
			[ "Visual Elements", "reference/elements/visuals/visual-elements"],
			[ "<glam>", "reference/elements/scene/glam"],
			[ "<scene>", "reference/elements/scene/scene"],
			[ "<group>", "reference/elements/scene/group"],
			[ "<box>", "reference/elements/visuals/box"],
			[ "<cone>", "reference/elements/visuals/cone"],
			[ "<cylinder>", "reference/elements/visuals/cylinder"],
			[ "<sphere>", "reference/elements/visuals/sphere"],
			[ "<mesh>", "reference/elements/visuals/mesh"],
			[ "<vertices>", "reference/elements/visuals/vertices"],
			[ "<normals>", "reference/elements/visuals/normals"],
			[ "<uvs>", "reference/elements/visuals/uvs"],
			[ "<colors>", "reference/elements/visuals/colors"],
			[ "<faces>", "reference/elements/visuals/faces"],
			[ "<particles>", "reference/elements/visuals/particles"],
			[ "<arc>", "reference/elements/visuals2d/arc"],
			[ "<circle>", "reference/elements/visuals2d/circle"],
			[ "<rect>", "reference/elements/visuals2d/rect"],
			[ "<camera>", "reference/elements/camera/camera"],
			[ "<light>", "reference/elements/lighting/light"],
			[ "<animation>", "reference/elements/animation/animation"],
			[ "<keyframe>", "reference/elements/animation/keyframe"],
			[ "<transition>", "reference/elements/animation/transition"],
			[ "<import>", "reference/elements/imports/import"],
			[ "<effect>", "reference/elements/effects/effect"],
			[ "<background>", "reference/elements/backgrounds/background"],
			[ "<controller>", "reference/elements/controllers/controller"],
			[ "<renderer>", "reference/elements/rendering/renderer"],
		],
		"CSS Properties Reference": [
			[ "transform", "reference/css/transform"],
			[ "animation", "reference/css/animation"],
			[ "transition", "reference/css/transition"],
			[ "ambient-color", "reference/css/ambient-color"],
			[ "color", "reference/css/color"],
			[ "diffuse-color", "reference/css/color"],
			[ "emissive-color", "reference/css/emissive-color"],
			[ "specular-color", "reference/css/specular-color"],
			[ "texture", "reference/css/texture"],
			[ "shader", "reference/css/shader"],
			[ "fragment-shader", "reference/css/fragment-shader"],
			[ "vertex-shader", "reference/css/vertex-shader"],
			[ "shader-uniforms", "reference/css/shader-uniforms"],
		],
		"Events Reference": [
			[ "MouseEvent3D", "reference/events/MouseEvent3D"],
			[ "TouchEvent3D", "reference/events/TouchEvent3D"],
			[ "Touch3D", "reference/events/Touch3D"],
			[ "ViewEvent3D", "reference/events/ViewEvent3D"],
		],
	},

};

var pages = {};

for ( var section in list ) {

	pages[ section ] = {};

	for ( var category in list[ section ] ) {

		pages[ section ][ category ] = {};

		for ( var i = 0; i < list[ section ][ category ].length; i ++ ) {

			var page = list[ section ][ category ][ i ];
			pages[ section ][ category ][ page[ 0 ] ] = page[ 1 ];

		}

	}

}
