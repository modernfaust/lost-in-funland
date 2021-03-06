// Constants
var prev_time = +new Date();
var time = 0;
var frametime = 0;
var normal_frametime = 16;
var frametime_coef = 0;
var generatedRow = "1"
var gameScore = 0;
var prevTile;
var levelColor=0
const clamp = (n, lo, hi) => n < lo ? lo : n > hi ? hi : n;

game = function(){
  // Handle framerate
  time = +new Date();
  frametime = time - prev_time;
  prev_time = time;
  frametime_coef = frametime / normal_frametime;
  l3.value = frametime_coef;

  if ((hero.y+gameScore)%240 === 0) {
    hero.boost_speed*=1/2
  } 

  //center camera around hero
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const camX = -hero.x + canvas.width /2;
  const camY = -hero.y + canvas.height / 2;
  ctx.fillStyle = "rgb("+levelColor+"," + 0 + "," + 0 + ")";
  ctx.fillRect(0,0,canvas.width,2000); 
  //clamp camera to map
  ctx.translate(clamp(camX,canvas.width - 800,0),clamp(camY,canvas.height-50*maps[current_map].length* tile_h,0));

  // Make the hero move, walk, jump, fall...
  move_hero();
  for(i=Math.floor((hero.y - 15*tile_h)/tile_h); i <= maps[current_map].length; i++){
    for(j in maps[current_map][i]){
      if(maps[current_map][i][j] != "0" && maps[current_map][i][j] != "6"){
        ctx.drawImage(tiles[maps[current_map][i][j]].sprite, j * tile_w, i * tile_h, tile_w, tile_h);
      }
    }
  }

  if (crawlingGas.isCrawling) {
    crawl()
    score.value = Math.floor(hero.y+gameScore/10);
    document.getElementById("score").innerHTML = score.value;
  }

  showInstructions()
  // Draw the hero
  ctx.save();
  ctx.translate(hero.x, hero.y);
  ctx.rotate(hero.angle);
  if (hero.walk_speed < 0) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(hero_sprite, -12, -16, tile_w, tile_h);
  ctx.restore();
  levelColor=Math.floor(hero.y/500);
// Next frame 
    requestAnimationFrame(game);
  };

var crawlingGas = {
  size: 0,
  speed: 2,
  fill: "fog",
  isCrawling: false
}

crawl = function () {
  if (crawlingGas.speed < hero.max_fall_speed){
    crawlingGas.size+=crawlingGas.speed
  }
  ctx.fillStyle=crawlingGas.fill
  ctx.drawImage(fog,0,0,tile_w*maps[0][0].length,crawlingGas.size)

  if (crawlingGas.size >= hero.y + hero.L4[1] + tile_h) {
    ctx.clearRect(0,0,5000,5000)
    location.href="404.html"
  }
}

function matrix(q) { // Function for matrix Effect
  // Define variables
  var s = window.screen; // The window
  var width = q.width = s.width; // Width of window
  var height = q.height = s.height; // Height of window
  var letters = Array(256).join(1).split(''); // Array with 256 start at 1 and split string in array

  var draw = function() { // Function to draw the canvas

      q.getContext('2d').fillStyle='rgba(0,0,0,.05)'; // Draw Black background with transparacy
      q.getContext('2d').fillRect(0,0,width,height); // Fill the whole screen
      q.getContext('2d').fillStyle='#0F0'; // Add Green Color
      letters.map( //Map function for Array
          function(y_pos, index) {

              text = String.fromCharCode(3e4+Math.random()*33); // Create random number for Char of matrix
              x_pos = index * 10; // Set the index value
              q.getContext('2d').fillText(text, x_pos, y_pos); // Fill canvas with letters
              letters[index] = (y_pos > 758 + Math.random() * 1e4) ? 0 : y_pos + 10; // Increment the Y coord and add randomizer for reset
          });
      };
      setInterval(draw, 40); // Set Refresh Intervals
}

// define typewriter variables
var i = 0;
var speed = 750;

typewriter =  function() {
  if (i < '404'.length) {
      document.getElementById("writer").innerHTML += '404'.charAt(i);
      i++;
      setTimeout(typewriter, speed);
  }
}


loadMatrix = function () { // Function to load canvas function
  var canvas = document.getElementById("canvas"); // Define canvas to grab from html
  matrix(canvas);
  typewriter();
  setTimeout(function(){
      location.href = 'index.html';
  }, 7000);
  
}

showInstructions = function () {
  ctx.fillStyle="green"
  ctx.font = "bold 30px Georgia";
  ctx.fillText("GO", 300,55)
  ctx.fillText("MOVE", 350, 525)
  ctx.fillText("AND DON'T LOOK BACK", 215, 750)
  ctx.drawImage(right,200,25,50,35)  
  ctx.drawImage(down,375,600,50,35)  
  ctx.drawImage(left,150,500,50,35)  
  ctx.drawImage(right,600,500,50,35)  
}

onload = function(){
  zzz = 0;//Math.floor(Math.random()*8) * 45;
  rotate_hero(zzz);
  //if true game runs
  game(); 
}