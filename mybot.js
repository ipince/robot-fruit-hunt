var BOT_NAME = "Harvestor";

var FRUIT_LOCATIONS = new Object();
var VALUABLE_FRUIT_LOCATIONS = new Object();
var OPPONENTS_ITEMS = new Object();

function new_game() {
  init_fruit_locations();

  // Init opponents items
  OPPONENTS_ITEMS = new Object();
  for (var t = 1; t <= get_number_of_item_types(); t++) {
    OPPONENTS_ITEMS[t] = 0;
  }
}

function make_move() {

  // Update opponent's items
  for (var t = 1; t <= get_number_of_item_types(); t++) {
    update_fruit_locations(t);
    if (get_opponent_item_count(t) > OPPONENTS_ITEMS[t]) {
      // Opponent just picked up a fruit! Update counts and locations.
      OPPONENTS_ITEMS[t] = get_opponent_item_count(t);
      // Only one fruit per cell, so we can break here.
    }
  }
  update_valuable_fruits();

  // Go to nearest fruit
  return get_move_nearest_valuable_fruit();
}

function update_valuable_fruits() {
  for (var type in FRUIT_LOCATIONS) {
//    trace("There are a total of " + get_total_item_count(i) +
//          " fruits of type " + i + ", " + get_my_item_count(i) +
//          " of them owned by " + BOT_NAME + ", " + get_opponent_item_count(i) +
//          " owned by opponent");
    var remaining_items = get_total_item_count(type) - get_my_item_count(type) - get_opponent_item_count(type);
    var valuable = true;
    if (get_my_item_count(type) > get_opponent_item_count(type) + remaining_items) {
      // We have won this category, so any other remaining fruits are worthless
      valuable = false;
    } else if (get_opponent_item_count(type) > get_my_item_count(type) + remaining_items) {
      // We have lost this category, so any other remaining fruits are worthless
      valuable = false;
    } else {
      // The category is still up for grabs. Only consider the first n fruits needed to actually
      // win this category.
      // TODO(ipince): implement.
    }
    var fruits = FRUIT_LOCATIONS[type];
    for (var i = 0; i < fruits.length; i++) {
      fruits[i].valuable = valuable;
    }
  }
}

function get_move_nearest_valuable_fruit() {
  var bot_position = {'x': get_my_x(), 'y': get_my_y()};
  var min_dist = Number.MAX_VALUE;
  var nearest_fruit_pos;
  for (var type in FRUIT_LOCATIONS) {
    var fruits = FRUIT_LOCATIONS[type];
    for (var i = 0; i < fruits.length; i++) {
      if (fruits[i].valuable && dist(bot_position, fruits[i]) < min_dist) {
        min_dist = dist(bot_position, fruits[i]);
        nearest_fruit_pos = fruits[i];
      }
    }
  }
  if (nearest_fruit_pos == undefined) {
    // No fruit left?
    trace("Did not find nearest fruit!");
    return PASS;
  }
  return get_move(bot_position, nearest_fruit_pos);
}

function get_move(position, target) {
  // TODO(ipince): decide between PASS or TAKE.
  if (position.x == target.x) {
    if (position.y == target.y) {
      return TAKE;
    } else if (position.y > target.y) {
      return NORTH;
    } else {
      return SOUTH;
    }
  } else if (position.x > target.x) {
    if (position.y == target.y) {
      return WEST;
    } else if (position.y > target.y) {
      // We can go west or north here; choose one based on other metrics?
      return NORTH;
    } else {
      // We can go west or south here; choose one based on other metrics?
      return SOUTH;
    }
  } else { // position.x < target.x
    if (position.y == target.y) {
      return EAST;
    } else if (position.y > target.y) {
      // We can go east or north here; choose one based on other metrics?
      return NORTH;
    } else {
      // We can go east or south here; choose one based on other metrics?
      return SOUTH;
    }
  }
}

// Manhattan distance.
function dist(here, there) {
  return Math.abs(here.x - there.x) + Math.abs(here.y - there.y);
}

function init_fruit_locations() {
  FRUIT_LOCATIONS = new Object();
  var board = get_board();
  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      var item_in_cell = board[x][y];
      if (has_item(item_in_cell)) {
        if (FRUIT_LOCATIONS[item_in_cell] === undefined) {
          FRUIT_LOCATIONS[item_in_cell] = new Array();
        }
        FRUIT_LOCATIONS[item_in_cell].push({'x': x, 'y': y, 'valuable': true});
      }
    }
  }
}

function update_fruit_locations(type) {
  var fruits = FRUIT_LOCATIONS[type];
  for (var i = 0; i < fruits.length; i++) {
    if (!has_item(get_board()[fruits[i].x][fruits[i].y])) {
      fruits.splice(i, 1);
      break;
    }
  }
}
