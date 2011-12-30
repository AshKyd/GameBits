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
	
	var beam = new CanvasLaserbeam({
		x:10,
		y:10,
		length:200,
		rotation:0,
		ctx : ctx
	});
	
	var doTick = true;
	var tick = function(){
		if(doTick == false){
			return;
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		beam.tick();
		
		window.setTimeout(function(){window.requestAnimFrame(tick);},100);
	}
	tick();
	
	//~ canvas.onclick=function(e){
		//~ var pos = getCursorPosition(e,canvas);
		//~ console.log('New explosion at ',pos);
		//~ explosions.push(new CanvasExplosion({
			//~ ctx : ctx,
			//~ x:pos[0],
			//~ y:pos[1],
			//~ w:200
		//~ }));		
	//~ };
	
}
















