/**
 * @fileoverview Effect - GLAM postprocessing effect, wraps Three.js
 * 
 * @author Tony Parisi
 */

goog.provide('glam.Effect');
goog.require('glam.EventDispatcher');

/**
 * @constructor
 */

glam.Effect = function(shader)
{
    glam.EventDispatcher.call(this);	
    
	this.isShaderEffect = false;

    if (shader.render && typeof(shader.render) == "function") {
    	this.pass = shader;
    }
    else {
    	this.pass = new THREE.ShaderPass(shader);
    	this.isShaderEffect = true;
    }
}

goog.inherits(glam.Effect, glam.EventDispatcher);

glam.Effect.prototype.update = function() {

	// hook for later - maybe we do
	// subclass with specific knowledge about shader uniforms
}

