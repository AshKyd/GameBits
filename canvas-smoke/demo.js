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

window.onload = function(){
	var canvas = document.getElementById('demo');
	ctx = canvas.getContext('2d');
	
	var smoke1 = new CanvasSmoke({
		ctx : ctx,
		x : 100,
		y : 300,
		w : 20,
		h : 100
	});
	
	var smoke2 = new CanvasSmoke({
		ctx : ctx,
		x : 150,
		y : 275,
		w : 15,
		h : 75
	});
	
	var doTick = true;
	var tick = function(){
		if(doTick == false){
			return;
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		smoke1.tick();
		smoke2.tick();
		window.requestAnimFrame(tick);
	}
	tick();
}
