glam.parser = {
		
	addDocument : function(doc)
	{
		// create an observer instance
		var observer = new WebKitMutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
		    if (mutation.type == "childList") {
		    	var i, len = mutation.addedNodes.length;
		    	// console.log("len: ", len);
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.addedNodes[i];
		    		var viewer = glam.viewers[doc.id];
			    	viewer.addNode(node);
		    	}
		    	var i, len = mutation.removedNodes.length;
		    	// console.log("len: ", len);
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.removedNodes[i];
		    		var viewer = glam.viewers[doc.id];
			    	viewer.removeNode(node);
		    	}
		    }
		  });    
		});
		 
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true, subtree: true };
		 
		// pass in the target node, as well as the observer options
		observer.observe(doc, config);
		
//		var r1 = document.childNodes[0];
//		r1.setAttribute('foo', 'hi');
//		r1.appendChild(document.createElement("foo"))
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
