/**
 * @fileoverview Pick Manager - singleton to manage currently picked object(s)
 * 
 * @author Tony Parisi
 */

goog.provide('glam.PickManager');

glam.PickManager.handleMouseMove = function(event)
{
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseMove) {
    			pickers[i].onMouseMove(event);
    		}
    	}
    }
    else
    {
        var oldObj = glam.PickManager.overObject;
        glam.PickManager.overObject = glam.PickManager.objectFromMouse(event);

        if (glam.PickManager.overObject != oldObj)
        {
    		if (oldObj)
    		{
    			glam.Graphics.instance.setCursor(null);

    			event.type = "mouseout";
    	    	var pickers = oldObj.pickers;
    	    	var i, len = pickers.length;
    	    	for (i = 0; i < len; i++) {
    	    		if (pickers[i].enabled && pickers[i].onMouseOut) {
    	    			pickers[i].onMouseOut(event);
    	    		}
    	    	}
    		}

            if (glam.PickManager.overObject)
            {            	
        		event.type = "mouseover";
    	    	var pickers = glam.PickManager.overObject.pickers;
    	    	var i, len = pickers.length;
    	    	for (i = 0; i < len; i++) {
    	    		
    	    		if (pickers[i].enabled && pickers[i].overCursor) {
    	        		glam.Graphics.instance.setCursor(pickers[i].overCursor);
    	    		}
    	    		
    	        	if (pickers[i].enabled && pickers[i].onMouseOver) {
    	        		pickers[i].onMouseOver(event);
    	        	}
    	    	}

            }
        }
        
        if (glam.PickManager.overObject) {
	    	var pickers = glam.PickManager.overObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		
	    		if (pickers[i].enabled && pickers[i].moveWithoutCapture && pickers[i].onMouseMove) {
	        		event.type = "mousemove";
	    			pickers[i].onMouseMove(event);
	    		}
	    	}
        }
    }
}

glam.PickManager.handleMouseDown = function(event)
{
    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseDown) {
    			pickers[i].onMouseDown(event);
    		}
    	}
    }
}

glam.PickManager.handleMouseUp = function(event)
{
    if (glam.PickManager.clickedObject)
    {
    	var overobject = glam.PickManager.objectFromMouse(event);
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseUp) {
    			pickers[i].onMouseUp(event);
    			// Also deliver a click event if we're over the same object as when
    			// the mouse was first pressed
    			if (overobject == glam.PickManager.clickedObject) {
    				event.type = "click";
    				pickers[i].onMouseClick(event);
    			}
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
}

glam.PickManager.handleMouseClick = function(event)
{
	/* N.B.: bailing out here, not sure why, leave this commented out
	return;
	
    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
    
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseClick) {
    			pickers[i].onMouseClick(event);
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
    */
}

glam.PickManager.handleMouseDoubleClick = function(event)
{
    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
    
    if (glam.PickManager.clickedObject)
    {
    	var pickers = glam.PickManager.clickedObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseDoubleClick) {
    			pickers[i].onMouseDoubleClick(event);
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
}

glam.PickManager.handleMouseScroll = function(event)
{
    if (glam.PickManager.overObject)
    {
    	var pickers = glam.PickManager.overObject.pickers;
    	var i, len = pickers.length;
    	for (i = 0; i < len; i++) {
    		if (pickers[i].enabled && pickers[i].onMouseScroll) {
    			pickers[i].onMouseScroll(event);
    		}
    	}
    }

    glam.PickManager.clickedObject = null;
}

glam.PickManager.handleTouchStart = function(event)
{
	if (event.touches.length > 0) {
		event.screenX = event.touches[0].screenX;
		event.screenY = event.touches[0].screenY;
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
		event.pageX = event.touches[0].pageX;
		event.pageY = event.touches[0].pageY;
		event.elementX = event.touches[0].elementX;
		event.elementY = event.touches[0].elementY;
	    glam.PickManager.clickedObject = glam.PickManager.objectFromMouse(event);
	    if (glam.PickManager.clickedObject)
	    {
	    	var pickers = glam.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchStart) {
	    			pickers[i].onTouchStart(event);
	    		}
	    	}
	    }
	}
}

glam.PickManager.handleTouchMove = function(event)
{
	if (event.touches.length > 0) {
		event.screenX = event.touches[0].screenX;
		event.screenY = event.touches[0].screenY;
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
		event.pageX = event.touches[0].pageX;
		event.pageY = event.touches[0].pageY;
		event.elementX = event.touches[0].elementX;
		event.elementY = event.touches[0].elementY;

		if (glam.PickManager.clickedObject) {
	    	var pickers = glam.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchMove) {
	    			pickers[i].onTouchMove(event);
	    		}
	    	}
	    }
	}
}

glam.PickManager.handleTouchEnd = function(event)
{
	if (event.changedTouches.length > 0) {
		event.screenX = event.changedTouches[0].screenX;
		event.screenY = event.changedTouches[0].screenY;
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		event.elementX = event.changedTouches[0].elementX;
		event.elementY = event.changedTouches[0].elementY;
	    if (glam.PickManager.clickedObject)
	    {
	    	var pickers = glam.PickManager.clickedObject.pickers;
	    	var i, len = pickers.length;
	    	for (i = 0; i < len; i++) {
	    		if (pickers[i].enabled && pickers[i].onTouchEnd) {
	    			pickers[i].onTouchEnd(event);
	    		}
	    	}
	    }
	    
	    glam.PickManager.clickedObject = null;
	}	
}

glam.PickManager.objectFromMouse = function(event)
{
	var intersected = glam.Graphics.instance.objectFromMouse(event);
	if (intersected.object)
	{
		event.face = intersected.face;
		event.normal = intersected.normal;
		event.point = intersected.point;
		event.object = intersected.object;
		
    	if (intersected.object._object.pickers)
    	{
    		var pickers = intersected.object._object.pickers;
    		var i, len = pickers.length;
    		for (i = 0; i < len; i++) {
    			if (pickers[i].enabled) { // just need one :-)
    				return intersected.object._object;
    			}
    		}
    	}

		return glam.PickManager.findObjectPicker(event, intersected.hitPointWorld, intersected.object.object);
	}
	else
	{
		return null;
	}
}

glam.PickManager.findObjectPicker = function(event, hitPointWorld, object) {
	while (object) {
		
		if (object.data && object.data._object.pickers) {
    		var pickers = object.data._object.pickers;
    		var i, len = pickers.length;
    		for (i = 0; i < len; i++) {
    			if (pickers[i].enabled) { // just need one :-)
    				// Get the model space units for our event
    				var modelMat = new THREE.Matrix4;
    				modelMat.getInverse(object.matrixWorld);
    				event.point = hitPointWorld.clone();
    				event.point.applyMatrix4(modelMat);
    				return object.data._object;
    			}
    		}
		}

		object = object.parent;
	}
	
	return null;
}


glam.PickManager.clickedObject = null;
glam.PickManager.overObject  =  null;