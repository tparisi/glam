var list = {

	"Manual": {
		"Introduction": [
			[ "Getting started", "manual/introduction/Getting-started" ],
			[ "Creating a scene", "manual/introduction/Creating-a-scene" ],
		],
		"Key Concepts": [
			[ "The 3D coordinate system", "manual/concepts/coordinate-system" ],
			[ "The transformation hierarchy", "manual/concepts/transformation-hierarchy" ],
			[ "Cameras and perspective transformations", "manual/concepts/cameras-perspective" ],
			[ "Visuals", "manual/concepts/visuals" ],
			[ "Shading, materials and lights", "manual/concepts/shading-materials" ],
			[ "Events", "manual/concepts/events" ],
			[ "Animation", "manual/concepts/animation" ],
			[ "Importing models", "manual/concepts/imports" ],
			[ "Camera controllers", "manual/concepts/camera-controllers" ],
			[ "Rendering, compositing and postprocessing", "manual/concepts/rendering" ],
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
			[ "<text>", "reference/elements/visuals/text"],
			[ "<mesh>", "reference/elements/visuals/mesh"],
			[ "<vertices>", "reference/elements/visuals/vertices"],
			[ "<normals>", "reference/elements/visuals/normals"],
			[ "<uvs>", "reference/elements/visuals/uvs"],
			[ "<colors>", "reference/elements/visuals/colors"],
			[ "<faces>", "reference/elements/visuals/faces"],
			[ "<points>", "reference/elements/visuals/points"],
			[ "<lines>", "reference/elements/visuals/lines"],
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
			[ "<controller>", "reference/elements/controllers/controller"],
			[ "<renderer>", "reference/elements/rendering/renderer"],
			[ "<background>", "reference/elements/backgrounds/background"],
			[ "<effect>", "reference/elements/effects/effect"],
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
