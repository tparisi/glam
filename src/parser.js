glam.parser = {
		
	addDocument : function(script, document)
	{
		glam.documents[script.id] = document;
		glam.documentParents[script.id] = script.parentElement;
	},

	addStyle : function(declaration)
	{
		glam.styles.push(declaration);
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
				glam.parser.addDocument(scripts[i], scene);
			}
		}
		
		var styles = document.head.getElementsByTagName("style");
		var len = styles.length;
		for (i = 0; i < len; i++)
		{
			// if (styles[i].type == "text/glam")
			{
				$.parsecss(styles[i].childNodes[0].data,
						function(css) {
								glam.parser.addStyle(css);
							}
						);
			}
		}
	},
};
