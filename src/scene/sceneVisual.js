/**
 * @fileoverview A visual containing a model in Collada format
 * @author Tony Parisi
 */
goog.provide('glam.SceneVisual');
goog.require('glam.Visual');

glam.SceneVisual = function(param) 
{
	param = param || {};
	
    glam.Visual.call(this, param);

    this.object = param.scene;
}

goog.inherits(glam.SceneVisual, glam.Visual);

glam.SceneVisual.prototype.realize = function()
{
	glam.Visual.prototype.realize.call(this);
	
    this.addToScene();
}
