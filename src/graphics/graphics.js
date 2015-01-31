/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 *
 * @author Tony Parisi
 */

module.exports = Graphics;

function Graphics()
{
	// Freak out if somebody tries to make 2
    if (Graphics.instance)
    {
        throw new Error('Graphics singleton already exists')
    }

	Graphics.instance = this;
}

Graphics.instance = null;
