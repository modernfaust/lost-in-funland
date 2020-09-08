/* Game loop */


// Constants
var prev_time = +new Date();
var time = 0;
var frametime = 0;
var normal_frametime = 16;
var frametime_coef = 0;
var map_updateCounter = 0;
var generatedRow = "1"
var gameScore = 0;
var bgimg = document.getElementById("background");
var prevTile;
var maxFloor=50
var gameStart=false

const clamp = (n, lo, hi) => n < lo ? lo : n > hi ? hi : n;

score.value=0
game = function(){
  
  // Handle framerate
  time = +new Date();
  frametime = time - prev_time;
  prev_time = time;
  frametime_coef = frametime / normal_frametime;
  l3.value = frametime_coef;
  map_updateCounter++
  xAxis.value = hero.x
  yAxis.value = hero.y
  //zzz+=1;
  //rotate_hero(zzz);

  //center camera around hero
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const camX = -hero.x + canvas.width /2;
  const camY = -hero.y + canvas.height / 2;
  //clamp camera to map
  x=clamp(camX,canvas.width - 800,0)
  y=clamp(camY,canvas.height-50*maps[current_map].length* tile_h,0)
  ctx.translate(x,y);
  
  // Make the hero move, walk, jump, fall...
  move_hero();
  // Draw the scene
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,5000,5000); 
  
  ctx.fillStyle = "black";
  for(i=Math.floor((hero.y - 15*32)/tile_h); i <= maps[current_map].length; i++){
/*     if (i*tile_h < hero.y-(15*32) || i*tile_h > hero.y+(30*32)) {
      console.log("this happened")
      break
    } */
    for(j in maps[current_map][i]){
      if(maps[current_map][i][j] != "0" && maps[current_map][i][j] != "6"){
        ctx.drawImage(tiles[maps[current_map][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
      }
    }
  }

  if (crawlingGas.isCrawling) {
    crawl()
    gameScore++
    score.value = Math.floor(gameScore/10);
  }

  // Draw the hero
  ctx.save();
  ctx.translate(hero.x, hero.y);
  ctx.rotate(hero.angle);
  if (hero.walk_speed < 0) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(hero_sprite, -12, -16, tile_w, tile_h);
  ctx.restore();
  // Next frame
  requestAnimationFrame(game);
};

var crawlingGas = {
  size: 0,
  speed: 1,
  fill: "red",
  isCrawling: false
}

crawl = function () {
  ctx.fillStyle=crawlingGas.fill
  crawlingGas.size+=crawlingGas.speed
  ctx.fillRect(0,0,tile_w*maps[0][0].length,crawlingGas.size)
  if (crawlingGas.size >= hero.y) {
    location.href = '404.html'
  }
}

onload = function(){
  zzz = 0;//Math.floor(Math.random()*8) * 45;
  rotate_hero(zzz);
  game();
}