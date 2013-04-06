glam.document = {
		
	scenes : [],
	
	styles : [],

	addScene : function(scene)
	{
		glam.document.scenes.push(scene);
	},

	addStyle : function(declaration)
	{
		glam.document.styles.push(declaration);
	},
	
	parseDocument : function()
	{
		var dp = new DOMParser;

		var i, len;
		
		var scripts = document.head.getElementsByTagName("script");
		var len = scripts.length;
		for (i = 0; i < len; i++)
		{
			if (scripts[i].type == "text/glam")
			{
				var scene = dp.parseFromString(scripts[i].textContent, "text/xml");
				glam.document.addScene(scene);
			}
		}
		
		var styles = document.head.getElementsByTagName("style");
		var len = styles.length;
		for (i = 0; i < len; i++)
		{
			if (styles[i].type == "text/glam")
			{
				$.parsecss(styles[i].childNodes[0].data,
						function(css) {
								glam.document.addStyle(css);
							}
						);
			}
		}
	},
};
