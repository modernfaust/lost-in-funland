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
var startScrolling = false
var aboveTile;
var prevTile;
var currentTile=""
var finalScore= "0"

//var upTranslate=0.1

game = function(){
  
  // Handle framerate
  time = +new Date();
  frametime = time - prev_time;
  prev_time = time;
  frametime_coef = frametime / normal_frametime;
  l3.value = frametime_coef;
  map_updateCounter++
  score.value = gameScore++;
  //zzz+=1;
  //rotate_hero(zzz);


  //Temp Final Score
  finalScore="100";

  //center camera around hero
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const camX = -hero.x + canvas.width / 2;
  const camY = -hero.y + canvas.height / 2;
  ctx.translate(camX, camY);
  
  // Make the hero move, walk, jump, fall...
  move_hero();

  // Draw the scene
  //canvas.width = canvas.width;
  var pat = ctx.createPattern(bgimg, "repeat");
  ctx.fillStyle = pat;
  ctx.fillRect(0,0,5000,5000); 
  
  
  ctx.fillStyle = "black";
  for(i in maps[0]){
    for(j in maps[0][i]){
      if(maps[0][i][j] != "0"){
        ctx.drawImage(tiles[maps[0][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
      }
    }
  }

  if (hero.y >= 400) {
    startScrolling = true
  }

  // Draw the hero
  ctx.save();
  ctx.translate(hero.x, hero.y);
  ctx.rotate(hero.angle);
  ctx.drawImage(hero_sprite, -12, -16, tile_w, tile_h);
  ctx.restore();
  
if (startScrolling) {
  //scrolling map tied to frame refresh
  if (hero.loadLevels) {
    //generate level ONLY when hero is at max fall velocity
    for (i = 1; i < maps[0][maps.length].length;i++) {
      aboveTile = maps[0][maps.length][i]
      prevTile = generatedRow[i - 1]
      currentTile=generateTile(aboveTile, prevTile)
      generatedRow+=currentTile
      currentTile=""
    }
  maps[0].push(generatedRow)
  generatedRow="1"
  }
}


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

/* function draw() {
  ctx.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
  ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset

  //Clamp the camera position to the world bounds while centering the camera around the player                                             
  var camX = clamp(-player.x + canvas.width/2, yourWorld.minX, yourWorld.maxX - canvas.width);
  var camY = clamp(-player.y + canvas.height/2, yourWorld.minY, yourWorld.maxY - canvas.height);

  ctx.translate( camX, camY );    
} */

function clamp(value, min, max){
  if(value < min) return min;
  else if(value > max) return max;
  return value;
}


onload = function(){
  zzz = 0;//Math.floor(Math.random()*8) * 45;
  rotate_hero(zzz);
  game();
}