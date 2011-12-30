/**
 * CanvasExplosion
 * Render an explosion somewhere on the canvas.
 */
var CanvasExplosion = function(config){
	if(typeof config != 'object'){
		throw 'Must pass one config of type object.';
	}
	
	/**
	 * Required fields.
	 */
	var reqs = ['ctx','x','y','w'];
	for(var i=0; i<reqs.length; i++){
		if(typeof config[reqs[i]] == 'undefined'){
			throw 'Required field is undefined: '+reqs[i];
		}
		this[reqs[i]] = config[reqs[i]];
	}	
	
	this.layers = [
		{fill:this.makeCircularGradient(192,128,0), size:this.w/2, count:1, life:.8, speed:0,growth:20},
		{fill:this.makeCircularGradient(128,128,128), size:this.w/60, count:20, life:.9, speed:0,growth:50},
		{fill:this.makeCircularGradient(128,128,128), size:this.w/30, count:10, life:1, speed:this.w/20,growth:50},
		{fill:this.makeCircularGradient(255,0,0), size:this.w/20, count:5, life:.8, speed:0,growth:50, grav:.01},
		{fill:this.makeCircularGradient(255,64,0), size:this.w/20, count:5, life:.6, speed:0,growth:50, grav:.01},
		{fill:this.makeCircularGradient(255,128,0), size:this.w/20, count:5, life:.5, speed:0,growth:80, grav:.01},
		{fill:'grey', size:1, count:10, life:.8, speed:this.w/2,growth:1, grav:.03},
		{fill:'black', size:1, count:10, life:.6, speed:this.w/4,growth:0, grav:.03},
		{fill:'yellow', size:1, count:10, life:.4, speed:this.w/6,growth:0, grav:.03},
		{fill:this.makeCircularGradient(192,128,0,.8), size:10, count:3, life:.6, speed:this.w/2.5,growth:0,grav:.01},
		{fill:this.makeCircularGradient(192,64,0,.8), size:10, count:2, life:.8, speed:this.w/3.25,growth:0,grav:.01},
		{fill:this.makeCircularGradient(255,255,255,.8), size:this.w/30, count:5, life:.6, speed:this.w/100,growth:50,grav:.01}
	];
	
	//~ this.layers = [
		//~ {fill:'rgb(192,128,0)', size:this.w/2, count:1, life:.8, speed:0,growth:20},
		//~ {fill:'rgb(128,128,128)', size:this.w/30, count:10, life:1, speed:0,growth:50},
		//~ {fill:'rgb(255,0,0)', size:this.w/20, count:5, life:.8, speed:0,growth:50},
		//~ {fill:'rgb(255,64,0)', size:this.w/20, count:5, life:.6, speed:0,growth:50},
		//~ {fill:'rgb(255,128,0)', size:this.w/20, count:5, life:.5, speed:0,growth:80},
		//~ {fill:'grey', size:1, count:10, life:.8, speed:this.w/2,growth:1},
		//~ {fill:'black', size:1, count:10, life:.6, speed:this.w/4,growth:0},
		//~ {fill:'yellow', size:1, count:10, life:.4, speed:this.w/6,growth:0},
		//~ {fill:'rgb(192,128,0,.8)', size:10, count:3, life:.6, speed:this.w/2.5,growth:0},
		//~ {fill:'rgb(192,64,0,.8)', size:10, count:2, life:.8, speed:this.w/3.25,growth:0},
		//~ {fill:'rgb(255,255,255,.8)', size:this.w/30, count:5, life:.6, speed:this.w/100,growth:50}
	//~ ];
	
	
	this.duration = 2;
	this.startTime = +new Date();
	this.lifetimeVariation = .1;
	this.speedVariation = 0;
	this.particles = [];
	this.gravity = 1.001;
	
	this.prepare();
}

CanvasExplosion.prototype = {
	makeCircularGradient : function(r,g,b,a){
		var a = typeof a == 'undefined' ? 1 : a;
		var canvas = document.createElement('canvas');
		canvas.width=100;
		canvas.height=100;
		var ctx = canvas.getContext('2d');
		var grd = ctx.createRadialGradient(50,50,0,50,50,50);
		grd.addColorStop(0,'rgba('+r+','+g+','+b+','+a+')');
		grd.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
		ctx.fillStyle = grd;
		ctx.fillRect(0,0,100,100);
		return canvas;
	},
	prepare : function(){
		this.particles = [];
		for(var i=0; i<this.layers.length; i++){
			// For easy access, this is our current layer.
			var thisLayer = this.layers[i];
			
			for(var p=0; p<thisLayer.count; p++){
				// Work out a trajectory between 0 and 1 radian.
				var trajectory = Math.random() * (2*Math.PI);
				var initialSize = thisLayer.size;//Math.random() * thisLayer.size/2 + thisLayer.size/2;
				var isImage = typeof thisLayer.fill == 'object' ? true : false;
				var startPos = Math.random()*this.w/4;
				var life = thisLayer.life + (Math.random()*(this.lifetimeVariation*2)-this.lifetimeVariation);
				//~ var explosiveness = 1 - (1/(i+1))+.05;
				var speed = thisLayer.speed;
				if(this.speedVariation){
					speed = speed * (Math.random()*this.speedVariation);
				}
				var gravity = typeof thisLayer.grav == 'undefined' ? 0 : thisLayer.grav;
				
				this.particles.push({
					fill : thisLayer.fill,
					size : initialSize,
					trajectory : trajectory,
					speed : speed,
					isImage : isImage,
					life : life,
					y : 0,
					opacity : 1,
					growth:thisLayer.growth,
					grav:gravity
				});
			}
		}
	},
	tick : function(){
		this.ctx.save();
		this.ctx.translate(this.x,this.y);
		
		var delta = new Date() - this.startTime;
		var durationRelative = delta/1000/this.duration;
		if(durationRelative > 1){
			this.ctx.restore();
			return;
		}
		
		var up = Math.PI/2;
		var newVal = 0;
				
		for(var i=0; i<this.particles.length; i++){
			var particle = this.particles[i];
			
			// Work out the distance travelled (1 = 100% of allowed distance)
			var positionRelative = particle.y/this.w;
			positionRelative = positionRelative > durationRelative ? positionRelative : durationRelative;
			
			positionRelative = positionRelative / particle.life;
						
			this.ctx.save();
			this.ctx.rotate(particle.trajectory);
			
			// If the particle is visible, adjust the visibility.
			if(particle.opacity > 0 && positionRelative < 1){
				particle.opacity = 1-positionRelative;
			}else{
				this.ctx.restore();
				continue;
			}
			
			// Set the global alpha based on particle visibility.
			this.ctx.globalAlpha = particle.opacity;

			var particleY = particle.speed*this.duration*positionRelative - particle.size/2;
			var particleSize = particle.size + particle.growth*positionRelative;
			
			if(particle.isImage){
				this.ctx.drawImage(particle.fill,-particleSize/2,particleY,particleSize,particleSize);
			} else {
				this.ctx.fillStyle = particle.fill;
				this.ctx.fillRect(0,particleY,particleSize,particleSize);
			}
			
			if(particle.trajectory > Math.PI/2 && particle.trajectory < Math.PI * 1.5) {
				if(particle.trajectory > Math.PI){
					particle.trajectory = particle.trajectory + particle.grav;
				} else {
					particle.trajectory = particle.trajectory - particle.grav;
				}
			}
			
			//~ particle.trajectory = 0;
			this.ctx.restore();
		}
		
		// Restore the settings as they were.
		this.ctx.restore();
	}
}
