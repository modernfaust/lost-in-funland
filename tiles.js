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
    //probabilities out of 10
    nextTiles : {
      "0": 6,
      "1": 2,
      "2": 2,
      "3": 0,
      "4": 0
    }
  },
  
  // 1: wall "unportalable"
  "1": {
    sprite: wall_unportalable_sprite,
    solid: 1,
    nextTiles : {
      "0": 3,
      "1": 5,
      "2": 0,
      "3": 2,
      "4": 0
    }
  },
  
  // 2: slope 45deg right
  "2": {
    sprite: slope_45deg_right,
    solid: 2,
    solidity: function(x,y){
      return y > tile_w - x;
    },
    nextTiles : {
      "0": 0,
      "1": 10,
      "2": 0,
      "3": 0,
      "4": 0
    }
  },
  
  // 3: slope 45deg left
  "3": {
    sprite: slope_45deg_left,
    solid: 2,
    solidity: function(x,y){
      return y > x;
    },
    nextTiles : {
      "0": 10,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    }
  },
  
  // 4: slope 45deg right
  "4": {
    sprite: slope_minus_45deg_right,
    solid: 2,
    solidity: function(x,y){
      return y < x;
    },
    nextTiles : {
      "0": 2,
      "1": 4,
      "2": 1,
      "3": 1,
      "4": 2
    }
  },
  
  // 5: slope 45deg right
  "5": {
    sprite: slope_minus_45deg_left,
    solid: 2,
    solidity: function(x,y){
      return y < tile_w - x;
    }
  }
};


// Check if a coordinate (x:y) is on a solid pixel or not
is_solid = function(x,y){
  
  var tile_y = Math.floor(y / tile_h);

  // Return false if the pixel is at undefined map coordinates
  if(!maps[current_map][tile_y]){
    return false;
  }
  
  var tile_x = Math.floor(x / tile_w);
  
  if(!maps[current_map][tile_y][tile_x]){
    return false;
  }
  
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

generateLevel = function(){
  var currentTile;
  var generatedRow;
  var transition=generateTransition()
  var level=[]
  for (floors = 0; floors < 500; floors++) {
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
    }
  } 
  return (transition.concat(level))
}

generateTransition = function(){
  var transitionLevels=[]
  for (floors = 0; floors < 25; floors++){
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