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
	var reqs = ['tick','w','h','deltaStart','deltaRange','deltaIncrement'];
	for(var i=0; i<reqs.length; i++){
		if(typeof config[reqs[i]] == 'undefined'){
			throw 'Required field is undefined: '+reqs[i];
		}
		this[reqs[i]] = config[reqs[i]];
	}
	
	this.canvas = document.createElement('canvas');
	this.canvas.id = 'anicache';
	this.canvas.width = this.w * this.getFrameCount();
	console.log('Sprite width:' +this.w*this.getFrameCount());
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext('2d');
	
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

			this.tick(tempCtx,delta);
			
			try{
				this.ctx.drawImage(tempCanvas,this.w*i++,0);
			}catch(e){
				console.log(e);
			}
		}
	},
	getFrameCount : function(){
		return this.deltaRange / this.deltaIncrement;
	}
}
