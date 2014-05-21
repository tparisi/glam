glam.parser = {
		
	addDocument : function(script, doc)
	{
		function overrideElementMethods(elt) {
			elt.eventListeners = {};
			elt.addEventListener = function(type, listener) {
				if (!elt.eventListeners[type]) {
					elt.eventListeners[type] = [];
				}
				
				elt.eventListeners[type].push(listener);
			}
			
			elt.dispatchEvent = function(event) {
				var listeners = elt.eventListeners[event.type];
				var i, len = listeners.length;
				for (i = 0; i < len; i++) {
					listeners[i](event);
				}
			}
		}
		
		doc.getEltOrig = doc.getElementById;
		doc.getElementById = function(id) {
			var elt = doc.getEltOrig(id);
			overrideElementMethods(elt);
			return elt;
		}
		
		doc.createElement = function(type) {
			var elt = document.createElement(type);
			overrideElementMethods(elt);
			return elt;
		}
		
		glam.documents[script.id] = doc;
		glam.documentParents[script.id] = script.parentElement;
		
		// create an observer instance
		var observer = new WebKitMutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
		    if (mutation.type == "childList") {
		    	var i, len = mutation.addedNodes.length;
		    	// console.log("len: ", len);
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.addedNodes[i];
		    		var viewer = glam.viewers[script.id];
			    	viewer.addNode(node);
		    	}
		    	var i, len = mutation.removedNodes.length;
		    	// console.log("len: ", len);
		    	for (i = 0; i < len; i++) {
		    		var node = mutation.removedNodes[i];
		    		var viewer = glam.viewers[script.id];
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
			$.parsecss(styles[i].childNodes[0].data,
					function(css) {
							glam.parser.addStyle(css);
						}
					);
		}
	},
};
