var BOT_NAME = "Harvestor";

var FRUIT_LOCATIONS = new Object();

function new_game() {
  init_fruit_locations();
}

function make_move() {
  trace(FRUIT_LOCATIONS);

  var board = get_board();

  var total_types = get_number_of_item_types();
  for (var i = 1; i <= total_types; i++) {
    trace("There are a total of " + get_total_item_count(i) +
          " fruits of type " + i + ", " + get_my_item_count(i) +
          " of them owned by " + BOT_NAME + ", " + get_opponent_item_count(i) +
          " owned by opponent");
    var remaining_items = get_total_item_count(i) - get_my_item_count(i) - get_opponent_item_count(i);
    var worst_case_opponents_items = get_opponent_item_count(i) + remaining_items;
    var best_case_our_items = get_my_item_count(i) + remaining_items;
    if (get_my_item_count(i) > worst_case_opponents_items) {
      trace("We have won this category!!");
    } else if (get_opponent_item_count(i) > best_case_our_items) {
      trace("We have lost this category :(");
    } else {
      trace("There is no winner for this category... yet!");
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
