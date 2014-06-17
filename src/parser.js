glam.parser = {
		
	addDocument : function(doc)
	{
		// create an observer instance
		var mo = (window.WebKitMutationObserver !== undefined) ? window.WebKitMutationObserver : window.MutationObserver;
		var observer = new mo(function(mutations) {
		  mutations.forEach(function(mutation) {
		    if (mutation.type == "childList") {
		    	var i, len = mutation.addedNodes.length;
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.addedNodes[i];
		    		var viewer = glam.viewers[doc.id];
			    	viewer.addNode(node);
		    	}
		    	var i, len = mutation.removedNodes.length;
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.removedNodes[i];
		    		var viewer = glam.viewers[doc.id];
			    	viewer.removeNode(node);
		    	}
		    }
		    else if (mutation.type == "attributes") {
		    	var onSetAttribute = mutation.target.onSetAttribute;
		    	if (onSetAttribute) {
		    		var attr = mutation.attributeName;
		    		var val = mutation.target.getAttribute(attr);
		    		onSetAttribute(attr, val);
		    	}
		    }
		  });    
		});
		 
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true, subtree: true };
		 
		// pass in the target node, as well as the observer options
		observer.observe(doc, config);		
	},

	addStyle : function(declaration)
	{
		for (selector in declaration) {
			glam.addStyle(selector, declaration[selector]);
		}
	},
	
	getStyle : function(selector)
	{
		return glam.getStyle(selector);
	},
	
	parseDocument : function()
	{
		var dp = new DOMParser;

		var i, len;
		
		var docs = document.getElementsByTagName("glam");
		var len = docs.length;
		for (i = 0; i < len; i++)
		{
			var doc = docs[i];
			if (!doc.id) {
				doc.id = "#glamDocument" + glam.documentIndex++;
			}
			glam.parser.addDocument(doc);
			glam.documents[doc.id] = doc;
		}
		
		var styles = document.head.getElementsByTagName("style");
		var len = styles.length;
		for (i = 0; i < len; i++)
		{
			$.parsecss(styles[i].childNodes[0].data,
					function(css) {
							glam.parser.addStyle(css);
						}
					);
		}
	},
};

