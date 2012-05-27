var BOT_NAME = "Harvestor";

var FRUIT_LOCATIONS = new Object();
var OPPONENTS_ITEMS = new Object();

function new_game() {
  init_fruit_locations();

  // Init opponents items
  for (var t = 1; t <= get_number_of_item_types(); t++) {
    OPPONENTS_ITEMS[t] = 0;
  }
}

function make_move() {

  // Update opponenet's items
  for (var t = 1; t <= get_number_of_item_types(); t++) {
    trace("api count for item " + t + ": " + get_opponent_item_count(t));
    if (get_opponent_item_count(t) > OPPONENTS_ITEMS[t]) {
      trace("opponent picked up fruit! which one?");
      // Opponent just picked up a fruit!
      OPPONENTS_ITEMS[t] = get_opponent_item_count(t);
      update_fruit_locations(t);
      // Only one fruit per cell, so we can break here.
      break;
    }
  }

  var board = get_board();

  var total_types = get_number_of_item_types();
  for (var i = 1; i <= total_types; i++) {
//    trace("There are a total of " + get_total_item_count(i) +
//          " fruits of type " + i + ", " + get_my_item_count(i) +
//          " of them owned by " + BOT_NAME + ", " + get_opponent_item_count(i) +
//          " owned by opponent");
    var remaining_items = get_total_item_count(i) - get_my_item_count(i) - get_opponent_item_count(i);
    var worst_case_opponents_items = get_opponent_item_count(i) + remaining_items;
    var best_case_our_items = get_my_item_count(i) + remaining_items;
    if (get_my_item_count(i) > worst_case_opponents_items) {
//      trace("We have won this category!!");
    } else if (get_opponent_item_count(i) > best_case_our_items) {
//      trace("We have lost this category :(");
    } else {
//      trace("There is no winner for this category... yet!");
    }
  }
  return PASS;

  // we found an item! take it!
  if (board[get_my_x()][get_my_y()] > 0) {
    return TAKE;
  }

  var rand = Math.random() * 4;

  if (rand < 1) return NORTH;
  if (rand < 2) return SOUTH;
  if (rand < 3) return EAST;
  if (rand < 4) return WEST;

  trace("we are returning pass!");
  return PASS;
}

function get_move_nearest_fruit() {
  return EAST;
}

function init_fruit_locations() {
  var board = get_board();
  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      var item_in_cell = board[x][y];
      if (has_item(item_in_cell)) {
        if (FRUIT_LOCATIONS[item_in_cell] === undefined) {
          FRUIT_LOCATIONS[item_in_cell] = new Array();
        }
        FRUIT_LOCATIONS[item_in_cell].push({'x': x, 'y': y});
      }
    }
  }
}

function update_fruit_locations(type) {
  var fruits = FRUIT_LOCATIONS[type];
  for (var i = 0; i < fruits.length; i++) {
    if (!has_item(get_board()[fruits[i].x][fruits[i].y])) {
      trace("Found fruit at " + fruits[i].x + ", " + fruits[i].y + "! We want to remove it now");
      break;
    }
  }
}
