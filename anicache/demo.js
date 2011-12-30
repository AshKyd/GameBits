window.onload = function(){
	var canvas = document.getElementById('demo');
	ctx = canvas.getContext('2d');
	
	var spriteWidth = 300;
	
	/**
	 * Instantiate a new explosion.
	 */
	var explosion = new CanvasExplosion({
		ctx : ctx,
		x:spriteWidth/2,
		y:spriteWidth/2,
		w:spriteWidth
	});
	
	/**
	 * The tick function renders a frame with the current delta to
	 * the specified context.
	 */
	var tick = function(ctx,delta){
		explosion.ctx = ctx;
		explosion.tick(delta);
	}
	
	
	var cache = new AniCache({
		tick : tick,
		w : spriteWidth,
		h : spriteWidth,
		deltaStart : explosion.startTime,
		deltaIncrement : 16,
		deltaRange : 1700 // Magic number, 2 seconds. Hard coded in CanvasExplosion
	});
	
	console.log(cache);
	ctx.drawImage(cache.canvas,0,0);
	
	
}
