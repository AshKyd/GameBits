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
	var explosions = [];
	
	explosions.push(new CanvasExplosion({
		ctx : ctx,
		x:200,
		y:200,
		w:300
	}));
	
	var doTick = true;
	var tick = function(){
		if(doTick == false){
			return;
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		// Tick all queued explosions. Note: No cleanup is performed.
		for(var i=explosions.length-1; i >=0; i--){
			explosions[i].tick();
		}
		
		window.requestAnimFrame(tick);
	}
	tick();
	
	canvas.onclick=function(e){
		var pos = getCursorPosition(e,canvas);
		//~ console.log('New explosion at ',pos);
		explosions.push(new CanvasExplosion({
			ctx : ctx,
			x:pos[0],
			y:pos[1],
			w:200
		}));		
	};
	
}
