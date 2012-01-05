// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

function getCursorPosition(e,rel) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    // Convert to coordinates relative to the canvas
    x -= rel.offsetLeft;
    y -= rel.offsetTop;

    return [x,y]
}

window.onload = function(){
	var canvas = document.getElementById('demo');
	ctx = canvas.getContext('2d');
	
	var spriteWidth = 350;
	var spriteDuration = 2000; // 1 second.
	
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
	var drawCallback = function(ctx,delta){
		explosion.ctx = ctx;
		explosion.tick(delta);
	}
	
	
	var cache = new AniCache({
		callback : drawCallback,
		w : spriteWidth,
		h : spriteWidth,
		deltaStart : explosion.startTime,
		deltaIncrement : 30, // Ideally 16 for 60 fps, but we're hitting memory limits :/
		deltaRange : spriteDuration, // Magic number, 2 seconds. Hard coded in CanvasExplosion
		duration : spriteDuration/1000
	});
	
	//~ console.log(cache);
	//~ ctx.drawImage(cache.canvas,0,0);
	
	
	/**
	 * Start the animation loop.
	 */
	cache.start(ctx,0,0);
	var tick = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		cache.tick();
		
		window.requestAnimFrame(tick);
	}
	tick();
	
	canvas.onclick=function(e){
		var pos = getCursorPosition(e,canvas);
		var offset = spriteWidth/2;
		cache.start(ctx,pos[0]-offset,pos[1]-offset);
				
	};
}
