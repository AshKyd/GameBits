/**
 * CanvasExplosion
 * Render an explosion somewhere on the canvas.
 */
var CanvasLaserbeam = function(config){
	if(typeof config != 'object'){
		throw 'Must pass one config of type object.';
	}
	
	/**
	 * Required fields.
	 */
	var reqs = ['ctx','x','y','length'];
	for(var i=0; i<reqs.length; i++){
		if(typeof config[reqs[i]] == 'undefined'){
			throw 'Required field is undefined: '+reqs[i];
		}
		this[reqs[i]] = config[reqs[i]];
	}
	
	this.beams = [];
	this.angle = 1;
	this.prepare();
	
	// Round the ends of our beam.
	this.ctx.lineCap = 'round';
}

CanvasLaserbeam.prototype = {
	functions : {
		sin : function(delta){
			delta = Math.round(delta/100);
			return (Math.sin(delta) + 1) / 2;
		},
		cos : function(delta){
			delta = Math.round(delta/100);
			return (Math.cos(delta) + 1) / 2;
		}
	},
	prepare : function(){
		this.beams.push({
			offset : .5,
			w : 10,
			color : 'rgba(255,128,192,.3)',
			opacity : 1
		});
		this.beams.push({
			offset : .5,
			w : 7,
			color : 'rgba(255,0,0,.3)',
			opacity : 'sin'
		});
		this.beams.push({
			offset : 0,
			w : 5,
			color : 'rgba(128,192,255,.7)',
			opacity : 'sin'
		});
		this.beams.push({
			offset : .5,
			w : 2,
			color : 'rgba(255,255,255,1)',
			opacity : 'sin'
		});
		this.beams.push({
			offset : 0,
			w : 1,
			color : 'rgba(128,192,255,1)',
			opacity : 'cos'
		});
	},
	tick : function(){
		this.ctx.save();
		this.ctx.translate(this.x,this.y);
		
		this.ctx.rotate(this.angle);
		
		for(var i=0; i<this.beams.length; i++){
			this.ctx.save();
			var thisBeam = this.beams[i];
			this.ctx.beginPath();
			this.ctx.moveTo(0,thisBeam.offset);
			this.ctx.lineTo(this.length,thisBeam.offset);
			
			
			// Adjust the alpha
			var alpha = 1;
			switch (typeof thisBeam.opacity){
				case 'undefined':
					alpha = 1;
					break;
				case 'function':
					alpha = thisBeam.opacity(+new Date());
					break;
				case 'string':
					alpha = this.functions[thisBeam.opacity](+new Date());
					break;
				case 'number':
					alpha = thisBeam.opacity;
					break;
			}
			//~ console.log(alpha);
			this.ctx.globalAlpha = alpha;
			
			
			this.ctx.strokeStyle = thisBeam.color;
			this.ctx.lineWidth = thisBeam.w;
			this.ctx.stroke();
			this.ctx.restore();
		}
		
		// Restore the settings as they were.
		this.ctx.restore();
	}
}






















