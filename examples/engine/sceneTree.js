/**
 * @fileoverview Scene Tree Display - Uses Dynatree to Display glam Scene Tree
 * @author Tony Parisi
 */

sceneTreeMap = {};

buildSceneTree = function(scene, tree) {
	
	function build(object, node, level) {
		
		var noname = level ? "[object]" : "Scene";
		if (object instanceof glam.Visual)
			noname = "[visual]";
		
		var childNode = node.addChild({
			title: object.name ? object.name : noname,
			expand: level <= 1,
			activeVisible:true,
			glam:object,
		});

		sceneTreeMap[object._id] = childNode;

		if (object._children) {
			var i, len = object._children.length;
			for (i = 0; i < len; i++) {	
				build(object._children[i], childNode, level+1);
			}
		}

		if (object.visuals) {
			len = object.visuals.length;
			for (i = 0; i < len; i++) {
				build(object.visuals[i], childNode, level+1);
			}
		}
	}
	
	build(scene, tree, 0);
	
}

var selectedSceneNode = null;

selectSceneNode = function(viewer, node) {
	
	if (node.data.glam) {
		
		setTimeout(function() {
			viewer.highlightObject(node.data.glam);
		}, 10);
	}
	
	node.focus();
	node.activate(true);
	node.select(true);
	selectedSceneNode = node;
	
}

vec3toString = function(vec) {
	return "" + vec.x.toFixed(6) + "," + vec.y.toFixed(6) + "," + vec.z.toFixed(6) + "";
}

colorToString = function(color) {
	return "" + color.r.toFixed(6) + "," + color.g.toFixed(6) + "," + color.b.toFixed(6) + "";
}

transformToString = function(transform) {

	var str = "<b>Transform</b><br><table border='0' width='95%'>" +
		"<tr><td>Position:</td><td> " + vec3toString(transform.position) +
		"</td><tr><td>Rotation:</td><td> " + vec3toString(transform.rotation) +
		"</td><tr><td>Scale:</td><td> " + vec3toString(transform.scale) +
		"</td></tr></tr></table>";		
	
	return str;
}

visualToString = function(visual) {
	
	var name = visual.name ? visual.name : "";
	var geometry = visual.geometry;
	
	var str = "<b>Visual: </b>" + name + "<br>";

	var nFaces = geometry.faces ? geometry.faces.length : geometry.attributes.index.array.length / 3;
	var nVertices = geometry.vertices ? geometry.vertices.length :
		geometry.attributes.position.array.length;
	
	str += (nFaces.toString() + " faces<br>");
	str += (nVertices.toString() + " vertices<br>");
	
	if (!geometry.boundingBox)
		geometry.computeBoundingBox();
	
	var size = geometry.boundingBox.size();
	var boundingBoxSize = 
		"[" + size.x.toFixed(2) + ", " + 
	size.y.toFixed(2) + ", " + 
	size.z.toFixed(2) +
	"]<br>";

	str += ("Bounds " + boundingBoxSize);
	return str;
}

visualsToStrings = function(visuals) {

	var str = "";
	
	var i, len = visuals.length;
	for (i = 0; i < len; i++) {
		var visual = visuals[i];
		str += visualToString(visual);
		str += "<br>";
	}
	
	return str;
	
}

textureUrl = function(map) {
	var parts = map.image.src.split("/");
	return parts[parts.length-1];
}

materialToString = function(material) {

	if (material instanceof THREE.MeshFaceMaterial) {
		material = material.materials[0];
	}
	
	var str = "<b>Material</b><br>";
	
	var shading = "Unknown";
	if (material instanceof THREE.MeshLambertMaterial) {
		shading = "Lambert";
	}
	else if (material instanceof THREE.MeshPhongMaterial) {
		shading = "Phong";
	}
	else if (material instanceof THREE.MeshBasicMaterial) {
		shading = "Basic (unlit)";
	}
		
	str += ("Shading: " + shading + "<br>");
	
	str += "<table border='0' width='95%'>";
	
	if (material.ambient) { 
		str += ("<tr><td>Ambient:</td><td> " + colorToString(material.ambient));
	}
	
	if (material.color) {
		str += ("<tr><td>Diffuse:</td><td> " + colorToString(material.color));
	}
	
	if (material.specular) {
		str += ("</td><tr><td>Specular:</td><td> " + colorToString(material.specular));
	}
	
	if (material.emissive) {
		str += ("</td><tr><td>Emissive:</td><td> " + colorToString(material.emissive));
	}
	
	str += ("</td><tr><td>Opacity:</td><td> " + material.opacity);

	if (material.map) {
		str += ("</td><tr><td>Map:</td><td> " + textureUrl(material.map));
	}
	
	str += "</td></tr></tr></table>";		

	return str;
}

nodeTypeToString = function(node) {
	
	var type = "Unknown";
	
	if (node instanceof glam.Visual) {
		type = "Visual";
	}
	else if (node instanceof glam.AmbientLight) {
		type = "AmbientLight";
	}
	else if (node instanceof glam.DirectionalLight) {
		type = "DirectionalLight";
	}
	else if (node instanceof glam.PointLight) {
		type = "PointLight";
	}
	else if (node instanceof glam.SpotLight) {
		type = "SpotLight";
	}
	else if (node instanceof glam.PerspectiveCamera) {
		type = "PerspectiveCamera";
	}
	else if (node instanceof glam.Object) {
		type = "Group";
	}

	return type;
}

lightToString = function(light) {

	var str = "<b>Light</b><br>";

	var type = nodeTypeToString(light);
	
	str += ("Type: " + type + "<br>");

	str += "<table border='0' width='95%'>";

	str += ("<tr><td>Color:</td><td>" + colorToString(light.color) + "</td></tr>")
	
	if (type != "AmbientLight") {
		str += ("<tr><td>Position:</td><td>" + vec3toString(light.position) + "</td></tr>")
	}
	
	if (type == "DirectionalLight" || type == "SpotLight") {
		str += ("<tr><td>Direction:</td><td>" + vec3toString(light.direction) + "</td></tr>")
	}
	
	str += "</table>";		
	
	return str;
}

cameraToString = function(camera) {

	var str = "<b>Camera</b><br>";		
	
	var type = nodeTypeToString(camera);
	
	str += ("Type: " + type + "<br>");

	str += "<table border='0' width='95%'>";

	str += ("<tr><td>FOV:</td><td>" + camera.fov + "</td></tr>")
	str += ("<tr><td>Near:</td><td>" + camera.near + "</td></tr>")
	str += ("<tr><td>Far:</td><td>" + camera.far + "</td></tr>")
	str += ("<tr><td>Aspect:</td><td>" + camera.aspect + "</td></tr>")
		
	str += "</table>";		
	
	return str;
}

groupToString = function(object) {

	var str = "<b>Group</b><br>";		

	var bbox = glam.SceneUtils.computeBoundingBox(object);
	
	var size = bbox.size();
	var boundingBoxSize = 
		"[" + size.x.toFixed(2) + ", " + 
	size.y.toFixed(2) + ", " + 
	size.z.toFixed(2) +
	"]<br>";

	str += ("Bounds " + boundingBoxSize);

	var len = object._children.length;
	str += (len + " children");

	str += "<table border='0' width='95%'>";
	
	for (i = 0; i < len; i++) {
		str += ("<tr><td>" + object._children[i].name + "</td></tr>")
	}

	str += "</table>";		
	
	return str;
}

sceneNodeInfo = function(viewer, node) {

	var info = {};
	
	if (node.data.glam) {
		var object = node.data.glam;
		
		info.object = {
				name : object.name,
				id : object._id,
				components : {
					transform : object.transform,
					visuals : object.visuals,
					light : object.light,
					camera : object.camera,
				}
		};

		info.type = "unknown";
		if (info.object.components.visuals) {
			info.type = "Visuals";
		}
		else if (info.object.components.light) {
			info.type = nodeTypeToString(info.object.components.light)
		}
		else if (info.object.components.camera) {
			info.type = nodeTypeToString(info.object.components.camera)
		}
		else {
			info.type = "Group";
		}
		
		if (object instanceof glam.Object) {
			var transform = transformToString(object.transform);
			var visuals = object.visuals && object.visuals.length ? visualsToStrings(object.visuals) : "";
			var material = object.visuals && object.visuals.length ? materialToString(object.visuals[0].material) : "";
			var light = object.light? lightToString(object.light) : "";
			var camera = object.camera ? cameraToString(object.camera) : "";
			var group = groupToString(object);
			info.text = {
					name : object.name,
					id : object._id,
					components : {
						transform : transform,
						visuals : visuals,
						material : material,
						light : light,
						camera : camera,
						group : group
					}
			};
		}
		else if (object instanceof glam.Visual) {
			info.type = "Visual";
			info.object.components = {
					visual : object,
					material : object.material,
			}
			info.text = {
					name : object.name,
					id : object._id,
					components : {
						visual : visualToString(object),
						material : materialToString(object.material)
					}
			};
		}
	}

	return info;
}

selectSceneNodeFromId = function(viewer, id) {
		
	var node = sceneTreeMap[id];
	
	if (node) {
		node.focus();
		node.activate(true);
		node.select(true);
		selectedSceneNode = node;
	}

	return node;
}