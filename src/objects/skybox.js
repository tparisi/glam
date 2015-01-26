/**
 * @fileoverview Object collects a group of Components that define an object and its behaviors
 * 
 * @author Tony Parisi
 */


goog.require('glam.Prefabs');

glam.Prefabs.Skybox = function(param)
{
	param = param || {};
	
	var box = new glam.Object({layer:glam.Graphics.instance.backgroundLayer});

	var textureCube = null;

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		side: THREE.BackSide

	} );

	var visual = new glam.Visual(
			{ geometry: new THREE.BoxGeometry( 10000, 10000, 10000 ),
				material: material,
			});
	box.addComponent(visual);
	
	var script = new glam.SkyboxScript(param);
	box.addComponent(script);
	
	box.realize();

	return box;
}

goog.provide('glam.SkyboxScript');
goog.require('glam.Script');

glam.SkyboxScript = function(param)
{
	glam.Script.call(this, param);

	this.maincampos = new THREE.Vector3; 
	this.maincamrot = new THREE.Quaternion; 
	this.maincamscale = new THREE.Vector3; 
	
    Object.defineProperties(this, {
    	texture: {
			get : function() {
				return this.uniforms[ "tCube" ].value;
			},
			set: function(texture) {
				this.uniforms[ "tCube" ].value = texture;
			}
		},
    });
}

goog.inherits(glam.SkyboxScript, glam.Script);

glam.SkyboxScript.prototype.realize = function()
{
	var visual = this._object.getComponent(glam.Visual);
	this.uniforms = visual.material.uniforms;

	this.camera = glam.Graphics.instance.backgroundLayer.camera;
	this.camera.far = 20000;
	this.camera.position.set(0, 0, 0);
}

glam.SkyboxScript.prototype.update = function()
{
	var maincam = glam.Graphics.instance.camera;
	maincam.updateMatrixWorld();
	maincam.matrixWorld.decompose(this.maincampos, this.maincamrot, this.maincamscale);
	this.camera.quaternion.copy(this.maincamrot);
}

