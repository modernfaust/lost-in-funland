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
var aboveTile;
var prevTile;
var currentTile=""
var maxFloor=50
var latestFloor=0
var inTransition=false
var generateLevel=false
var currentMap=maps[0]
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
  if (!inTransition) {
    for(i in currentMap){
      for(j in currentMap[i]){
        if(currentMap[i][j] != "0"){
          ctx.drawImage(tiles[currentMap[i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
        }
      }
    }
  }

  if (hero.y >= -50) {
    generateLevel = true
    currentMap=maps[1]
  }

  // Draw the hero
  ctx.save();
  ctx.translate(hero.x, hero.y);
  ctx.rotate(hero.angle);
  ctx.drawImage(hero_sprite, -12, -16, tile_w, tile_h);
  ctx.restore();

if (generateLevel) {
  //scrolling map tied to frame refresh
  if (latestFloor < maxFloor) {
    //capping floor generation to maintain performance
    for (i = 1; i < currentMap[maps.length].length-1;i++) {
      aboveTile = currentMap[maps.length][i]
      prevTile = generatedRow[i - 1]
      currentTile=generateTile(aboveTile, prevTile)
      generatedRow+=currentTile
      currentTile=""
    }
    latestFloor+=1
  }
  else if (latestFloor === maxFloor) {
    //create basic platform for next level
    generatedRow = "2".repeat(Math.floor(currentMap[maps.length].length/2)) + "0".repeat(Math.floor(currentMap[maps.length].length/2)-1)
    latestFloor=0
    generateLevel=false
  }
  currentMap.push(generatedRow+"1")
  currentMap.shift()
  generatedRow="1"
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