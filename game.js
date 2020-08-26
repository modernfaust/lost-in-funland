/* Game loop */


// Constants
var prev_time = +new Date();
var time = 0;
var frametime = 0;
var normal_frametime = 16;
var frametime_coef = 0;
var map_updateCounter = 0;
var setTile;
var lastRow = ""
var gameScore = 0;
var bgimg = document.getElementById("background");

game = function(){
  
  // Handle framerate
  time = +new Date();
  frametime = time - prev_time;
  prev_time = time;
  frametime_coef = frametime / normal_frametime;
  l3.value = frametime_coef;
  map_updateCounter++
  console.log(map_updateCounter)
  score.value = gameScore++;
  //zzz+=1;
  //rotate_hero(zzz);
  
  // Make the hero move, walk, jump, fall...
  move_hero();
  
  // Draw the scene

  
  canvas.width = canvas.width;
  
  var pat = ctx.createPattern(bgimg, "repeat");
  ctx.fillStyle = pat;
  ctx.fillRect(0,0,400,600);
  
  ctx.fillStyle = "#aca";
  ctx.fillRect(0,0,640,800);
  
  ctx.fillStyle = "black";
  for(i in maps[0]){
    for(j in maps[0][i]){
      if(maps[0][i][j] != "0"){
        ctx.drawImage(tiles[maps[0][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
      }
    }
  }


  //scrolling map logic tied to frame refresh
/*   if (map_updateCounter%40 === 0){
    maps[0].shift()
  }
  for (i in maps[0][maps.length])
  {
    setTile = Math.floor((Math.random() * 5)+0)
    lastRow+=String(setTile)
  } */
/*   maps[0].push(lastRow) */
  lastRow=""

  // Draw the hero
  ctx.save();
  ctx.translate(hero.x, hero.y);
  ctx.rotate(hero.angle);
  ctx.drawImage(hero_sprite, 0, -16, tile_w, tile_h);
  ctx.restore();
  
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

onload = function(){
  zzz = 0;//Math.floor(Math.random()*8) * 45;
  rotate_hero(zzz);
  game();
}