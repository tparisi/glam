var list = {

	"Manual": {
		"Introduction": [
			[ "Introduction", "manual/introduction"],
			[ "What is GLAM?", "manual/introduction", "What-is-GLAM" ],
			[ "Getting started", "manual/introduction", "Getting-started" ],
			[ "Creating a scene", "manual/introduction", "Creating-a-scene" ],
			[ "A complete example", "manual/introduction", "A-complete-example" ],
		],
		"Key Concepts": [
			[ "Key concepts", "manual/concepts" ],
			[ "The 3D coordinate system", "manual/concepts", "coordinate-system" ],
			[ "The transformation hierarchy", "manual/concepts", "transformation-hierarchy" ],
			[ "Cameras and perspective transformations", "manual/concepts", "cameras-perspective" ],
			[ "Visuals", "manual/concepts", "visuals" ],
			[ "Shading, materials and lights", "manual/concepts", "shading-materials" ],
			[ "Importing models", "manual/concepts", "imports" ],
			[ "3D interaction and DOM events", "manual/concepts", "events" ],
			[ "Animation", "manual/concepts", "animation" ],
			[ "Navigation and viewing", "manual/concepts", "navigation-and-viewing" ],
			[ "Rendering, compositing and postprocessing", 
				"manual/concepts", "rendering-compositing-postprocessing" ],
			[ "Styling GLAM with CSS", "manual/concepts", "styling" ],
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
			[ "<animation>", "reference/elements/animation/animation"],
			[ "<keyframe>", "reference/elements/animation/keyframe"],
			[ "<transition>", "reference/elements/animation/transition"],
		],
		"CSS Properties Reference": [
			[ "transform", "reference/cssreference", "transform"],
			[ "animation", "reference/cssreference", "animation"],
			[ "transition", "reference/cssreference", "transition"],
			[ "color", "reference/cssreference", "color"],
			[ "ambient-color", "reference/cssreference", "ambient-color"],
			[ "diffuse-color", "reference/cssreference", "color"],
			[ "emissive-color", "reference/cssreference", "emissive-color"],
			[ "specular-color", "reference/cssreference", "specular-color"],
			[ "image", "reference/cssreference", "image"],
			[ "normal-image", "reference/cssreference", "normal-image"],
			[ "specular-image", "reference/cssreference", "specular-image"],
			[ "cube-image-right", "reference/cssreference", "cube-image-right"],
			[ "cube-image-left", "reference/cssreference", "cube-image-left"],
			[ "cube-image-top", "reference/cssreference", "cube-image-top"],
			[ "cube-image-bottom", "reference/cssreference", "cube-image-bottom"],
			[ "cube-image-front", "reference/cssreference", "cube-image-front"],
			[ "cube-image-back", "reference/cssreference", "cube-image-back"],
			[ "render-mode", "reference/cssreference", "render-mode"],
			[ "shader", "reference/cssreference", "shader"],
			[ "fragment-shader", "reference/cssreference", "fragment-shader"],
			[ "vertex-shader", "reference/cssreference", "vertex-shader"],
			[ "shader-uniforms", "reference/cssreference", "shader-uniforms"],
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
