// Constants
var hero_w = 22;
var hero_h = 28;

// Base vectors (Right and Bottom vectors of length 1)
// These two vectors get rotated according to the hero's angle
// then all the other vectors are deduced from them 
var uright = [1,0];
var ubottom = [0,1];

// Working vectors
// These vectors are not used as-is but rotated according to the hero's angle and stored in the hero's properties
var uL1 = [-11, -14];
var uC1 = [0, -14];
var uR1 = [11, -14];
var uL2 = [-11, 0];
var uR2 = [11, 0];
var uL3 = [-11, 8];
var uC3 = [0, 14];
var uR3 = [11, 8];
var uL4 = [-11, 14];
var uR4 = [11, 14];
var uL5 = [-7, 14];
var uR5 = [7, 14];

// The names of the base vectors to rotate using maths, and their const equivalent
base_vectors = {
  "right": uright,
  "bottom": ubottom
}
  
// The names of the immportant vectors to rotate using the base vectors, and their const equivalent
vectors = {
  "L1": uL1,
  "C1": uC1,
  "R1": uR1,
  "L2": uL2,
  "R2": uR2,
  "L3": uL3,
  "C3": uC3,
  "R3": uR3,
  "L4": uL4,
  "R4": uR4,
  "L5": uL5,
  "R5": uR5,
};


// Properties
var hero = {
  x: 55, // x position of C2
  y: 50, // y position of C2
  
  angle: 0, // angle in radians (0: head on top)
  
  // Vectors (rotated with the hero)
  right: [], // Normalized vector to the "right" (relative to the hero)
  bottom: [], // and "bottom"
  
  L1: [], // Position of L1 from center (C2)
  C1: [], // etc
  R1: [],
  L2: [],
  R2: [],
  L3: [],
  C3: [],
  R3: [],
  L4: [],
  R4: [],
  L5: [],
  R5: [],

  // Speeds and accelerations:
  // Constant
  max_walk_speed: 3,
  walk_acceleration: 1,
  walk_idle_deceleration: -1,
  jump_speed: -15,
  gravity: 0.5,
  // Variable
  boost_speed: 0,
  walk_speed: 0,
  fall_speed: 0,
  max_fall_speed: 5,
  
  // State
  freefall: true
};

var rotate_hero = function(angle_deg){
  
  // Convert in radians
  hero.angle = angle_deg * Math.PI / 180;
  
  // Rotate base vectors
  for(var i in base_vectors){
    hero[i] = [
      base_vectors[i][0] * Math.cos(hero.angle) - base_vectors[i][1] * Math.sin(hero.angle),
      base_vectors[i][0] * Math.sin(hero.angle) + base_vectors[i][1] * Math.cos(hero.angle)
    ];
  }
  
  // Rotate real vectors
  for(var i in vectors){
    hero[i] = [
      vectors[i][0] * hero.right[0] + vectors[i][1] * hero.bottom[0],
      vectors[i][0] * hero.right[1] + vectors[i][1] * hero.bottom[1]
    ];
  }
}

// Hero moves (left / right / jump / fall)
var move_hero = function(){

  // Walk left:
  if(keys.left && !keys.right) {


    // Apply a negative walk acceleration to the hero's speed
    hero.walk_speed -= hero.walk_acceleration + hero.boost_speed;
    
      // Limit the hero's speed
      if(hero.walk_speed < -hero.max_walk_speed - hero.boost_speed){
        hero.walk_speed = -hero.max_walk_speed - hero.boost_speed;
      }
        
    if (keys.down) {
      hero.walk_speed=-1
    }
    }

    else if(keys.right && !keys.left){
    
      // Apply a negative walk acceleration to the hero's speed
      hero.walk_speed += hero.walk_acceleration + hero.boost_speed;
      
      // Limit the hero's speed
      if(hero.walk_speed > hero.max_walk_speed + hero.boost_speed ){
        hero.walk_speed = hero.max_walk_speed + hero.boost_speed;
      }
      if (keys.down) {
        hero.walk_speed=1
      }
    }
  

  // Idle:
  
  else{
    
    if(Math.abs(hero.walk_speed) < 1){
      hero.walk_speed = 0;
    }
    
    else{
      
      // If the hero stops walking, decelerate
      if(hero.walk_speed > 0){
        hero.walk_speed += hero.walk_idle_deceleration;
      }
      else if(hero.walk_speed < 0){
        hero.walk_speed -= hero.walk_idle_deceleration;
      }
    }
  }
  
  // Move horizontally
  for(var i = 0; i < Math.abs(hero.walk_speed) * frametime_coef; i++){
    hero.x += hero.right[0] * Math.sign(hero.walk_speed);
    hero.y += hero.right[1] * Math.sign(hero.walk_speed);

    // Detect collision on the right (R1,R2,R3)
    if(hero.walk_speed > 0){
    
      // Climb a slope on the right (one solid between R4 and R3, but R1 + 3 "up", C1, L1, R2 and R3 not solid)
      if(
        !is_solid(hero.x + hero.R1[0] + -3 * hero.bottom[0], hero.y + hero.R1[1] + -3 * hero.bottom[1])
        &&
        !is_solid(hero.x + hero.C1[0], hero.y + hero.C1[1])
        &&
        !is_solid(hero.x + hero.L1[0], hero.y + hero.L1[1])
        &&
        !is_solid(hero.x + hero.R2[0], hero.y + hero.R2[1])
        &&
        !is_solid(hero.x + hero.R3[0], hero.y + hero.R3[1])
      ){
        for(var j = 0; j < 4; j++){
          if(is_solid(hero.x + hero.R4[0] + -j * hero.bottom[0], hero.y + hero.R4[1] + -j * hero.bottom[1])){
            hero.x += -hero.bottom[0] * 4;
            hero.y += -hero.bottom[1] * 4;
            break;
          }
        }
      }
          
      // Slide if the slope is too strong on the right
      // TODO

      // Collision
      if(is_solid(hero.x + hero.R1[0], hero.y + hero.R1[1])
        ||
        is_solid(hero.x + hero.R2[0], hero.y + hero.R2[1])
        ||
        is_solid(hero.x + hero.R3[0], hero.y + hero.R3[1])
      ){
        hero.walk_speed = 0;
        hero.x -= hero.right[0];
        hero.y -= hero.right[1];
        break;
      }
    }

    // Detect collision on the left (L1,L2,L3)
    else if(hero.walk_speed < 0){
        
      // Climb a slope on the left (one solid between L4 and L3, but L1 + 3 "up", C1, R1, L2 and L3 not solid)
      if(
        !is_solid(hero.x + hero.L1[0] + -3 * hero.bottom[0], hero.y + hero.L1[1] + -3 * hero.bottom[1])
        &&
        !is_solid(hero.x + hero.C1[0], hero.y + hero.C1[1])
        &&
        !is_solid(hero.x + hero.R1[0], hero.y + hero.R1[1])
        &&
        !is_solid(hero.x + hero.L2[0], hero.y + hero.L2[1])
        &&
        !is_solid(hero.x + hero.L3[0], hero.y + hero.L3[1])
      ){
        
        for(var j = 0; j < 4; j++){
          if(is_solid(hero.x + hero.L4[0] + -j * hero.bottom[0], hero.y + hero.L4[1] + -j * hero.bottom[1])){
            hero.x += -hero.bottom[0] * 4;
            hero.y += -hero.bottom[1] * 4;
            break;
          }
        }
      }
          
      // Slide if the slope is too strong on the left
      // TODO
      
      // Collision
      if(
          is_solid(hero.x + hero.L1[0], hero.y + hero.L1[1])
          ||
          is_solid(hero.x + hero.L2[0], hero.y + hero.L2[1])
          ||
          is_solid(hero.x + hero.L3[0], hero.y + hero.L3[1])
        ){
        hero.walk_speed = 0;
        hero.x -= -hero.right[0];
        hero.y -= -hero.right[1];
        break;
      }
    }
  }


  // Jump:
  if(keys.up && !hero.freefall){
    hero.freefall = true;
    hero.fall_speed += hero.jump_speed;
  }

  // Freefall:
  hero.fall_speed += hero.gravity;
  
  if(hero.fall_speed > hero.max_fall_speed){
    hero.fall_speed = hero.max_fall_speed;
  }
  
  l1.value = hero.fall_speed;
  
  // Move vertically
  mv: for(var i = 0; i < Math.abs(hero.fall_speed) * frametime_coef; i++){
    hero.x += hero.bottom[0] * Math.sign(hero.fall_speed);
    hero.y += hero.bottom[1] * Math.sign(hero.fall_speed);

    // Detect collision on the bottom (L4,C3,R4)
    if(hero.fall_speed > 0){
      for(var j = 0; j < hero_w; j++){
        x = hero.x + hero.L4[0] + j * hero.right[0]
        y = hero.y + hero.L4[1] + j * hero.right[1]
        if(is_solid(x, y)){
          if (is_spike(x,y)) {
            location.href = '404.html'
          }
          if (is_buff(x,y)) {
            if (hero.boost_speed <= 10) {
              hero.boost_speed+= 1
            }
            gameScore+=500
            var pointSpan = document.createElement("span");
            pointSpan.innerHTML = "50";
            pointSpan.setAttribute("style", "color: #4F4;");
            pointSpan.setAttribute("id", "box3");
            pointSpan.classList.add("moveFade");
            document.getElementById("heading").appendChild(pointSpan);
            setTimeout ( function() {pointSpan.remove()} , 1000 );
            //convert tile beneath to floor
            maps[current_map].splice([Math.floor(y / tile_h)],1,maps[current_map][Math.floor(y / tile_h)].substring(0,Math.floor(x / tile_w)) + "1" + maps[current_map][Math.floor(y / tile_h)].substring(Math.floor(x / tile_w)+1))
          }
          hero.fall_speed = 0;
          hero.x -= hero.bottom[0];
          hero.y -= hero.bottom[1];
          hero.freefall = false;
          break mv;
        }
        else if (is_trigger(x,y)){
          maps[current_map].pop()
          maps[1]=maps[1].concat(generateLevel(100)).splice(1)
          current_map=1
          crawlingGas.speed+= 1/10
          hero.fall_speed+=1/3
          hero.max_fall_speed +=1/3
          hero.jump_speed +=1/3
          hero.walk_speed +=1/3
          crawlingGas.isCrawling=true
        }
      }
    }

    // Detect collision on the top (L1,C1,R1)
    else if(
      (hero.fall_speed < 0 && 
        (
          is_solid(hero.x + hero.L1[0], hero.y + hero.L1[1])
          ||
          is_solid(hero.x + hero.C1[0], hero.y + hero.C1[1])
          ||
          is_solid(hero.x + hero.R1[0], hero.y + hero.R1[1])
        )
      )
    ){
      hero.fall_speed = 0;
      hero.x -= -hero.bottom[0];
      hero.y -= -hero.bottom[1];
      break;
    }
  }
}