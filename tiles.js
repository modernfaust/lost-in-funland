/* Tiles */

// Size
tile_w = 32;
tile_h = 32;


// Sprites / tileset
// Solid => 0: non-solid, 1: solid, 2: other (slope)
// Solidity(x,y) => tells if a pixel is solid in a given tile

tiles = {
  
  // 0: void
  "0": {
    sprite: void_sprite,
    solid: 0,
    isTrigger: false,
    isSpike: false,
    isBuff: false,
    //probabilities out of 10
    nextTiles : {
      "0": 6,
      "1": 0,
      "2": 4,
      "3": 0,
      "4": 0,
      "5": 0
    }
  },
  
  // 1: wall "unportalable"
  "1": {
    sprite: wall_unportalable_sprite,
    solid: 1,
    isTrigger: false,
    isSpike: false,
    isBuff: false,
    nextTiles : {
      "0": 0,
      "1": 5,
      "2": 0,
      "3": 3,
      "4": 1,
      "5": 0
    }
  },
  
  // 2: slope 45deg right
  "2": {
    sprite: slope_45deg_right,
    solid: 2,
    isTrigger: false,
    isSpike: false,
    isBuff: false,
    solidity: function(x,y){
      return y > tile_w - x;
    },
    nextTiles : {
      "0": 0,
      "1": 10,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0

    }
  },
  
  // 3: left slope
  "3": {
    sprite: slope_45deg_left,
    solid: 2,
    isTrigger: false,
    isSpike: false,
    isBuff: false,
    solidity: function(x,y){
      return y > x;
    },
    nextTiles : {
      "0": 10,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0

    }
  },
  
  // 4: spike
  "4": {
    sprite: spike,
    solid: 2,
    isTrigger: false,
    isSpike: true,
    isBuff: false,
    solidity: function(x,y){
      return y < x;
    },
    nextTiles : {
      "0": 0,
      "1": 4,
      "2": 0,
      "3": 3,
      "4": 3,
      "5": 0

    }
  },
  
  // 5: buff
  "5": {
    sprite: buff,
    solid: 2,
    isTrigger: false,
    isSpike: false,
    isBuff: true,
    solidity: function(x,y){
      return y < tile_w - x;
    },
    nextTiles : {
      "0": 0,
      "1": 4,
      "2": 0,
      "3": 3,
      "4": 3,
      "5": 0

    }
  },

  // trigger block for game start
  "6": {
    sprite: trigger,
    solid: 0,
    isTrigger: true,
    isSpike: false,
    isBuff: false
  }
};

// Check if a coordinate (x:y) is on a solid pixel or not
is_solid = function(x,y){

  var tile_y = Math.floor(y / tile_h);
  var tile_x = Math.floor(x / tile_w);

  // Return false if the tile is not solid
  if(tiles[maps[current_map][tile_y][tile_x]].solid === 0){
    return false;
  }
  
  // Return true if the tile is solid
  if(tiles[maps[current_map][tile_y][tile_x]].solid === 1){
    return true;
  }
  
  // Finally, return the solidity of the current pixel if the tile is semi-solid
  var pixel_x = x - tile_x * tile_w;
  var pixel_y = y - tile_y * tile_h;
  return tiles[maps[current_map][tile_y][tile_x]].solidity(pixel_x, pixel_y);
}

is_trigger = function(x,y){
  var tile_y = Math.floor(y / tile_h);
  var tile_x = Math.floor(x / tile_w); 

  return tiles[maps[current_map][tile_y][tile_x]].isTrigger
}

is_spike = function(x,y){
  var tile_y = Math.floor(y / tile_h);
  var tile_x = Math.floor(x / tile_w); 
  
  return tiles[maps[current_map][tile_y][tile_x]].isSpike
}

is_buff = function(x,y){
  var tile_y = Math.floor(y / tile_h);
  var tile_x = Math.floor(x / tile_w); 
  
  return tiles[maps[current_map][tile_y][tile_x]].isBuff
}

is_badFloor = function (generatedRow){
  //test if floor is a "bad floor"
  //if there's a bad facing ramp
  //if there's not an opening of at least 3 spaces
  var voidCounter=0
  if (generatedRow[generatedRow.length-1] === "3") {
    return true
  }
  for (t in generatedRow) {
    if (generatedRow[t] === "0") {
      voidCounter++
    }
    else {
      voidCounter=0
    }
    if (voidCounter > 3) {
      return false
    }
  }
  return true
}

generateLevel = function(numFloors){
  var currentTile;
  var generatedRow;
  var transition=generateTransition(25)
  var level=[]
  var triggerRow=[]
  for (floors = 0; floors <= numFloors; floors++) {
    generatedRow="1"
    for (i = 1; i < map_maxWidth-1;i++) {
      prevTile = generatedRow[i - 1]
      currentTile=generateTile(prevTile)
      generatedRow+=currentTile
      currentTile=""
    }
    if (!is_badFloor(generatedRow)) {
      level.push(generatedRow+"1")
      level.push("1"+"0".repeat(map_maxWidth-2)+"1")
      level.push("1"+"0".repeat(map_maxWidth-2)+"1")
    }
  }

  triggerRow="1"+"6".repeat(map_maxWidth-2)+"1"
  return transition.concat(level,generateTransition(10),triggerRow,generateTransition(10))
}

generateTransition = function(numFloors){
  var transitionLevels=[]
  for (floors = 0; floors <= numFloors; floors++){
    transitionLevels.push("1"+"0".repeat(map_maxWidth-2)+"1")
  }
  return (transitionLevels)
}

//generate appropriate tile in map
generateTile = function(prevTile) {
  var randomTiles = ""
  //build string of tiles to represent random draw
  for (var t in tiles[prevTile].nextTiles) {
    randomTiles += t.repeat(tiles[prevTile].nextTiles[t])
  }
  return randomTiles[Math.floor(Math.random() * randomTiles.length)]
}