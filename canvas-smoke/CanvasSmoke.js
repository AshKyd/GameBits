/**
 * CanvasSmoke
 * Designed to render a smoke plume on a specified canvas. Call tick to
 * render each frame.
 * @author Ash Kyd <ash@kyd.com.au>
 * @param {object} config
 * @param config.ctx The Canvas context to render to.
 * @param config.x The x position on the canvas to render to.
 * @param config.y The y position on the canvas to render to.
 * @param config.w The width of the smoke plume at its widest point.
 * @param config.h The height of the smoke plume.
 */
var CanvasSmoke = function(config){
	if(typeof config != 'object'){
		throw 'Must pass one config of type object.';
	}
	
	/**
	 * Required fields.
	 */
	var reqs = ['ctx','x','y','w','h'];
	for(var i=0; i<reqs.length; i++){
		if(typeof config[reqs[i]] == 'undefined'){
			throw 'Required field is undefined: '+reqs[i];
		}
		this[reqs[i]] = config[reqs[i]];
	}
	
	/**
	 * How many particles per plume?
	 */
	this.particleCount = 50;
	//~ this.particleCount = 1;
	
	/**
	 * Size in pixels of our particles.
	 */
	this.particleSize = 3;
	
	/**
	 * How fast do particles travel?
	 */
	 this.particleAcceleration = 1;
	 
	/**
	 * Sin inhibition.
	 * How wide do we want the sin function to be. Lower values give a 
	 * tornado effect, higher values a more natural plume.
	 */
	this.sinInhibition = 1000;
	
	this.prepare();
}

CanvasSmoke.prototype = {
	prepare : function(){
		// Reset our particle array.
		this.particles = [];
		
		// Make a whole bunch of new ones.
		for(var i=0; i<this.particleCount; i++){
			// particles have x, y, size, momentum, visibility.
			// I'm not sure if this is faster than making these objects.
			var momentum = Math.random()*20000;
			var size = Math.random()*3;
			var x = this.w/2;
			var y = Math.random() * this.h;
			this.particles.push([x,y,size,momentum,0]);
		}
	},
	tick : function(){
		// For each particle
		for(var i=0; i<this.particles.length; i++){
			var particle = this.particles[i];
			
			// Work out the distance from the bottom (in decimal; 1=top).
			var positionRelative = particle[1]/this.h;
			
			// Work out the new x location based on the system time.
			var x = Math.sin((+new Date+particle[3])/this.sinInhibition)*(positionRelative*this.w)+particle[0];
			if(particle[4]>0){
				particle[4] = 1-positionRelative;
			}
			this.ctx.globalAlpha = particle[4];
			//~ console.log(particle[4]);
			this.ctx.fillRect(x+this.x,0-particle[1]+this.y,this.particleSize,this.particleSize);
			particle[1]+=this.particleAcceleration;
			
			if(particle[1] > this.h){
				particle[1] = 0;
				particle[4] = 1;
			}
		}
		this.ctx.globalAlpha = 1;
	}
}
