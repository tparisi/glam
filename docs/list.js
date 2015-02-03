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
			[ "Coordinate system, units and transformations", "manual/concepts", "coordinate-system" ],
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
			[ "Elements Reference", "reference/elementsreference" ],
			[ "Transformable Elements", "reference/elementsreference", "transformable-elements"],
			[ "Visual Elements", "reference/elementsreference", "visual-elements"],
			[ "<glam>", "reference/elementsreference", "glam-element"],
			[ "<scene>", "reference/elementsreference", "scene-element"],
			[ "<group>", "reference/elementsreference", "group-element"],
			[ "<box>", "reference/elementsreference", "box-element"],
			[ "<cone>", "reference/elementsreference", "cone-element"],
			[ "<cylinder>", "reference/elementsreference", "cylinder-element"],
			[ "<sphere>", "reference/elementsreference", "sphere-element"],
			[ "<text>", "reference/elementsreference", "text-element"],
			[ "<mesh>", "reference/elementsreference", "mesh-element"],
			[ "<vertices>", "reference/elementsreference", "vertices-element"],
			[ "<normals>", "reference/elementsreference", "normals-element"],
			[ "<uvs>", "reference/elementsreference", "uvs-element"],
			[ "<colors>", "reference/elementsreference", "colors-element"],
			[ "<faces>", "reference/elementsreference", "faces-element"],
			[ "<points>", "reference/elementsreference", "points-element"],
			[ "<line>", "reference/elementsreference", "line-element"],
			[ "<particles>", "reference/elementsreference", "particles-element"],
			[ "<emitter>", "reference/elementsreference", "emitter-element"],
			[ "<arc>", "reference/elementsreference", "2D-elements"],
			[ "<circle>", "reference/elementsreference", "2D-elements"],
			[ "<rect>", "reference/elementsreference", "2D-elements"],
			[ "<camera>", "reference/elementsreference", "camera-element"],
			[ "<light>", "reference/elementsreference", "light-element"],
			[ "<import>", "reference/elementsreference", "import-element"],
			[ "<animation>", "reference/elementsreference", "animation-element"],
			[ "<keyframe>", "reference/elementsreference", "keyframe-element"],
			[ "<transition>", "reference/elementsreference", "transition-element"],
			[ "<controller>", "reference/elementsreference", "controller-element"],
			[ "<renderer>", "reference/elementsreference", "renderer-element"],
			[ "<background>", "reference/elementsreference", "background-element"],
			[ "<effect>", "reference/elementsreference", "effect-element"],
		],
		"CSS Properties Reference": [
			[ "CSS Properties Reference", "reference/cssreference"],
			[ "transform", "reference/cssreference", "transform"],
			[ "animation", "reference/cssreference", "animation"],
			[ "transition", "reference/cssreference", "transition"],
			[ "color", "reference/cssreference", "diffuse-color"],
			[ "ambient-color", "reference/cssreference", "ambient-color"],
			[ "diffuse-color", "reference/cssreference", "diffuse-color"],
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
			[ "sphere-image", "reference/cssreference", "sphere-image"],
			[ "shader", "reference/cssreference", "shader"],
			[ "fragment-shader", "reference/cssreference", "fragment-shader"],
			[ "vertex-shader", "reference/cssreference", "vertex-shader"],
			[ "shader-uniforms", "reference/cssreference", "shader-uniforms"],
			[ "render-mode", "reference/cssreference", "render-mode"],
			[ "dash-size", "reference/cssreference", "dash-size"],
			[ "gap-size", "reference/cssreference", "gap-size"],
			[ "line-width", "reference/cssreference", "line-width"],
			[ "point-size", "reference/cssreference", "point-size"],
			[ "bevel-size", "reference/cssreference", "bevel-size"],
			[ "bevel-thickness", "reference/cssreference", "bevel-thickness"],
			[ "font-bevel", "reference/cssreference", "font-bevel"],
			[ "font-depth", "reference/cssreference", "font-depth"],
		],
		"Events Reference": [
			[ "Events Reference", "reference/eventsreference"],
			[ "MouseEvent3D", "reference/eventsreference", "MouseEvent3D"],
			[ "TouchEvent3D", "reference/eventsreference", "TouchEvent3D"],
			[ "Touch3D", "reference/eventsreference", "Touch3D"],
			[ "ViewEvent3D", "reference/eventsreference", "ViewEvent3D"],
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
