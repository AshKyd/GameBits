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
	
	// Load up a PNG image we created earlier.
	var customImage = new Image();
	customImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAABGdBTUEAALGPC/xhBQAAABhQTFRFAAAAiYmJbGxse3t7WVlZQkJCZGRkaGho5q/OlAAAAAh0Uk5TABBWLo6Rg2zR4kHUAAAAN0lEQVR42mNggAJBASAhrKQswMBonpZuwMCo5uqmzMBcEhpSDCUZ1VzcFBkYjMqKDBgYmI2MGQDEbQg+s8VOJwAAAABJRU5ErkJggg==';
	
	// Smoke 1 renders the pre-made, low-res PNG image.
	var smoke1 = new CanvasSmoke({
		ctx : ctx,
		x : 300,
		y : 300,
		w : 50,
		h : 300,
		image: customImage,
		particleSize : 20,
		particleCount : 100,
		angle:Math.PI*1.5
	});
	
	// Smoke 2 just renders placeholder squares.
	var smoke2 = new CanvasSmoke({
		ctx : ctx,
		x : 400,
		y : 300,
		w : 50,
		h : 300,
		particleCount:50,
		particleSize:6
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
	
	window.setTimeout(function(){
		smoke1.stopSmoking();
		smoke2.stopSmoking();
	},10000);
}
