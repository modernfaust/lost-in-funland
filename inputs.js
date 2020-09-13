/* Inputs */

// Keys pressed
keys = {
  left: false,
  up: false,
  top: false,
  pause: false,
  down: false
};


// Key down / keypress (left, top, right)
onkeydown = onkeypress = function(e){
  switch(e.keyCode){
    case 37:
      keys.left = true;
      break;
    case 38:
      keys.up = true;
      break;
    case 39:
      keys.right = true;
      break;
    case 40:
      keys.down = true;
      break;
    case 80:
      keys.pause = true;
      break;

  }
};

// Key up (left, top, right)
onkeyup = function(e){
  switch(e.keyCode){
    case 37:
      keys.left = false;
      break;
    case 38:
      keys.up = false;
      break;
    case 39:
      keys.right = false;
      break;
    case 40:
      keys.down = false;
      break;
    case 80:
      keys.pause = false;
      break;
  }
};