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


game = function(){
  
  // Handle framerate
  time = +new Date();
  frametime = time - prev_time;
  prev_time = time;
  frametime_coef = frametime / normal_frametime;
  l3.value = frametime_coef;
  map_updateCounter++
  score.value = gameScore++;
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
  //DRAW COLLISION POINTS FOR DEBUGGING
  ctx.save();
  ctx.fillStyle = "red"
  ctx.fillRect(hero.x + hero.L1[0], hero.y + hero.L1[1],3,3)
  ctx.fillRect(hero.x + hero.C1[0], hero.y + hero.C1[1],3,3)
  ctx.fillRect(hero.x + hero.R1[0], hero.y + hero.R1[1],3,3)
  ctx.fillRect(hero.x + hero.L2[0], hero.y + hero.L2[1],3,3)
  ctx.fillRect(hero.x + hero.R2[0], hero.y + hero.R2[1],3,3)
  ctx.fillRect(hero.x + hero.L3[0], hero.y + hero.L3[1],3,3)
  ctx.fillRect(hero.x + hero.L4[0], hero.y + hero.L4[1],3,3)
  ctx.fillRect(hero.x + hero.L5[0], hero.y + hero.L5[1],3,3)
  ctx.fillRect(hero.x + hero.C3[0], hero.y + hero.C3[1],3,3)
  ctx.fillRect(hero.x + hero.R5[0], hero.y + hero.R5[1],3,3)
  ctx.fillRect(hero.x + hero.R4[0], hero.y + hero.R4[1],3,3)
  ctx.fillRect(hero.x + hero.R3[0], hero.y + hero.R3[1],3,3)
  ctx.fillRect(hero.x + hero.R2[0], hero.y + hero.R2[1],3,3)
  ctx.restore();

  // Draw the scene
  //canvas.width = canvas.width;
  var pat = ctx.createPattern(bgimg, "repeat");
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,5000,5000); 
  
  var tile_count = 0;

  ctx.fillStyle = "black";
  for(i in maps[current_map]){
    for(j in maps[current_map][i]){
      if (i*tile_h < hero.y-(15*32) || i*tile_h > hero.y+(20*32)) {
        break
      }
      if(maps[current_map][i][j] != "0" || maps[current_map][i][j] != "6"){
        ctx.drawImage(tiles[maps[current_map][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
        tile_count++
      }
    }
  }

  if (crawlingGas.isCrawling) {
    crawl()
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

  //generate level functions HERE

  // Debug
  /*for(var i in vectors){
    ctx.fillStyle = "red";
    ctx.fillRect(hero.x + hero[i][0]-1, hero.y + hero[i][1]-1,2,2);
  }*/
  
  /*for(var j = 0; j < hero_w; j++){
    ctx.fillStyle = "green";
    ctx.fillRect(hero.x + hero.L4[0] + j * hero.right[0], hero.y + hero.L4[1] + j * hero.right[1],2,2);
  }*/
  
  // Next frame
  requestAnimationFrame(game);
};
/* 
function clamp(value, min, max){
  if(value < min) return min;
  else if(value > max) return max;
  return value;
} */

onload = function(){
  zzz = 0;//Math.floor(Math.random()*8) * 45;
  rotate_hero(zzz);
  game();
}