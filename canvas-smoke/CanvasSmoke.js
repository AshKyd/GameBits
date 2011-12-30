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
	this.particleCount = typeof config.particleCount == 'undefined' ? 50 : config.particleCount;
	//~ this.particleCount = 1;
	
	/**
	 * Size in pixels of our particles.
	 */
	this.particleSize = typeof config.particleSize == 'undefined' ? 3 : config.particleSize;
	
	/**
	 * How fast do particles travel?
	 */
	this.particleAcceleration = 1;
	
	/**
	 * How much bigger should the particles grow?
	 */
	this.particleGrowth = 3;
	
	/**
	 * Render a particular graphic in place of a box.
	 */
	this.particleImage = typeof config.image == 'undefined' ? false : config.image;
	 
	/**
	 * Sin inhibition.
	 * How wide do we want the sin function to be. Lower values give a 
	 * tornado effect, higher values a more natural plume.
	 */
	this.sinInhibition = 2000;
	
	/**
	 * Permissable randomness in size of particle.
	 * this.particleSize*this.maxSize;
	 */
	this.maxSize = 3;
	
	/**
	 * The randomness of the plume. Low values will give a wavy
	 * metronome style plume. Larger values a more even, randomised one.
	 */
	this.randomness = 10000;
	
	/**
	 * The angle to rotate the plume.
	 */
	this.angle = typeof config.angle == 'undefined' ? 0 : config.angle;
	
	/**
	 * Whether to renew particles and keep smoking.
	 */
	this.active = true;
	
	/**
	 * How many active particles were on screen last draw.
	 */
	this.activeParticles = 0;
	
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
			
			// The momentum does
			var momentum = Math.random()*this.randomness;
			var size = Math.random()*this.maxSize;
			
			// Set at the center of the plume.
			var x = this.w/2;
			
			// Set randomly anywhere in the plume.
			var y = Math.random() * this.h;
			
			// Add the particle to the array.
			this.particles.push([x,y,size,momentum,0]);
		}
	},
	startSmoking : function(){
		this.prepare();
		this.active = true;
	},
	stopSmoking : function(){
		this.active = false;
	},
	tick : function(){
		
		this.ctx.save();
		this.ctx.translate(this.x + this.w/2,this.y);
			
		// Rotate our canvas to the specified angle.
		if(this.angle){
			this.ctx.rotate(this.angle);
		}
		
		var particlesActive = 0;
		
		// For each particle
		for(var i=0; i<this.particles.length; i++){
			var particle = this.particles[i];
			
			// Work out the distance from the bottom (in decimal; 1=top).
			var positionRelative = particle[1]/this.h;
			
			// Particle size based on the relative growth specified.
			var particleSize = this.particleSize*(1+this.particleGrowth * positionRelative);

			// Work out the new x location based on the system time.
			var x = Math.sin((+new Date+particle[3])/this.sinInhibition)*(positionRelative*this.w*(particle[3]/10000))+particle[0];
			
			// Offset based on the particle size.s
			x -= particleSize/2;
			
			var y = 0-particle[1];
			
			// If the particle is visible, adjust the visibility.
			if(particle[4]>0){
				particle[4] = 1-positionRelative;
				particlesActive++;
			}
			
			// Set the global alpha based on particle visibility.
			this.ctx.globalAlpha = particle[4];
			
			// Draw our image or placeholder boxes.
			
			//~ console.log(x);
			if(this.particleImage){
				this.ctx.drawImage(this.particleImage,x,y,particleSize,particleSize);
			} else {
				this.ctx.fillRect(x,y,particleSize,particleSize);
			}
			
			particle[1]+=this.particleAcceleration;
			
			// Reset the particle when it gets to the top.
			if(particle[1] > this.h && this.active){
				particle[1] = 0;
				particle[4] = 1;
			}
		}
		
		this.activeParticles = particlesActive;
		
		// Restore the settings as they were.
		this.ctx.restore();
	}
}
