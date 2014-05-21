glam.Input = {};

glam.Input.add = function(docelt, obj) {
	
	function addListener(evt) {
		picker.addEventListener(evt, function(event){
			var domEvent = new CustomEvent(
					evt, 
					{
						detail: {
						},
						bubbles: false,
						cancelable: true
					}
				);
			for (propName in event) {
				domEvent[propName] = event[propName];
			}
			var res = docelt.dispatchEvent(domEvent);
			
		});
	}
	
	var picker = new Vizi.Picker;
	
	var events = ["click", "mouseover", "mouseout", "mousedown", "mouseup", "mousemove"];
	for (index in events) {
		var evt = events[index];
		addListener(evt);
	}
		
	obj.addComponent(picker);
	
}