/**
 * AniCache
 * Cache object to make sprites from generative animations.
 */
var AniCache = function(config){
	if(typeof config != 'object'){
		throw 'Must pass one config of type object.';
	}
	
	/**
	 * Required fields.
	 */
	var reqs = ['callback','w','h','deltaStart','deltaRange','deltaIncrement','duration'];
	for(var i=0; i<reqs.length; i++){
		if(typeof config[reqs[i]] == 'undefined'){
			throw 'Required field is undefined: '+reqs[i];
		}
		this[reqs[i]] = config[reqs[i]];
	}
	
	
	var cacheWidth = Math.round(this.w * this.getFrameCount());
	var cacheHeight = Math.round(this.h);
	
	this.cacheCan = document.createElement('canvas');
	this.cacheCan.id = 'anicache';
	this.cacheCan.width = cacheWidth;
	this.cacheCan.height = cacheHeight;
	
	if(this.cacheCan.width != cacheWidth || this.cacheCan.height != cacheHeight){
		throw 'Cache size specified is too large. Try reducing your sprite size or delta interval.';
	}
	
	this.cacheCtx = this.cacheCan.getContext('2d');
	
	this.makeSprite();
	
	
}

AniCache.prototype = {
	makeSprite : function(){
		
		// Make a temporary canvas.
		var tempCanvas = document.createElement('canvas');
		tempCanvas.id='anicache-temp';
		tempCanvas.width = this.w;
		tempCanvas.height = this.h;
		var tempCtx = tempCanvas.getContext('2d');
		// Loop through each frame, and render it.
		var i=0;
		for(var delta=this.deltaStart; delta<this.deltaStart+this.deltaRange; delta += this.deltaIncrement){
			tempCtx.clearRect(0,0,this.w,this.h);

			this.callback(tempCtx,delta);
			
			try{
				this.cacheCtx.drawImage(tempCanvas,this.w*i++,0);
			}catch(e){
				console.log(e);
			}
		}
	},
	start : function(ctx,x,y){
		this.startTime = +new Date();
		this.playCtx = ctx;
		this.x = x;
		this.y = y;
	},
	tick : function(){
		var delta = +new Date() - this.startTime;
		var durationRelative = delta/1000/this.duration;
		var frames = this.getFrameCount();
		var thisFrame = Math.round(frames * durationRelative);
		if(durationRelative > 1){
			return;
		}
		
		// Fixme - I don't remember offhand how to specify a region to
		// draw from.
		this.playCtx.drawImage(this.cacheCan,this.x - this.w*thisFrame,this.y);
		
	},
	getFrameCount : function(){
		return this.deltaRange / this.deltaIncrement;
	}
}
