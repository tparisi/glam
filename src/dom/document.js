/**
 * @fileoverview glam document class
 * 
 * @author Tony Parisi
 */

goog.provide('glam.DOMDocument');

glam.DOMDocument = {
		
	scenes : {},
	
	styles : [],

	animations : {},
	
	addScene : function(script, scene)
	{
		glam.DOMDocument.scenes[script.id] = { parentElement : script.parentElement, scene : scene };
	},

	addStyle : function(declaration)
	{
		glam.DOMDocument.styles.push(declaration);
	},
	
	addAnimation : function(id, animation)
	{
		glam.DOMDocument.animations[id] = animation;
	},

	parseDocument : function()
	{
		var dp = new DOMParser;

		var i, len;
		
		var scripts = document.getElementsByTagName("script");
		var len = scripts.length;
		for (i = 0; i < len; i++)
		{
			if (scripts[i].type == "text/glam")
			{
				var scene = dp.parseFromString(scripts[i].textContent, "text/xml");
				glam.DOMDocument.addScene(scripts[i], scene);
			}
		}
		
		var styles = document.head.getElementsByTagName("style");
		var len = styles.length;
		for (i = 0; i < len; i++)
		{
			{
				glam.CSSParser.parsecss(styles[i].childNodes[0].data,
						function(css) {
								glam.DOMDocument.addStyle(css);
							}
						);
			}
		}
	},
};
