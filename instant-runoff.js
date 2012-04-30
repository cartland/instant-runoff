/*
Instant-runoff voting with Google Form
Author: Chris Cartland
Date created: 2012-04-29
Last update: 2012-04-29
*/


/* Settings */ 

var VOTE_SHEET = "Votes";
var BASE_ROW = 2;
var BASE_COLUMN = 3;
var NUM_COLUMNS = 10;

var KEYS_SHEET = "Keys";
var USING_KEY = true;
var KEY_COLUMN = 2;

var KEYS_USED_SHEET = "Keys Used";

/* End Settings */



/* Notification state */

var missing_keys_used_sheet_alert = false;

/* End notification state */


function run_instant_runoff() {
  /* Reset state */
  missing_keys_used_sheet_alert = false;
  
  /* Begin */
  clear_background_color();

  var results_range = get_range_with_values(VOTE_SHEET, BASE_ROW, BASE_COLUMN, NUM_COLUMNS);
  
  if (results_range == null) {
    Browser.msgBox("No votes. Looking for sheet: " + VOTE_SHEET);
    return;
  }
  // Keys are used to prevent voters from voting twice.
  // Keys also allow voters to change their vote.
  // If keys_range == null then we are not using keys. 
  var keys_range = null;
  
  // List of valid keys
  var valid_keys;
  
  if (USING_KEY) {
    keys_range = get_range_with_values(VOTE_SHEET, BASE_ROW, KEY_COLUMN, 1);
    if (keys_range == null) {
      Browser.msgBox("Using keys and could not find column with submitted keys. " + 
                     "Looking in column " + KEY_COLUMN + 
                     " in sheet: " + VOTE_SHEET);
      return;
    }
    var valid_keys_range = get_range_with_values(KEYS_SHEET, BASE_ROW, 1, 1);
    if (valid_keys_range == null) {
      Browser.msgBox("List of valid keys cannot be found. Looking for sheet: " + KEYS_SHEET);
      return;
    }
    valid_keys = range_to_array(valid_keys_range);
  }
  
  /* candidates is a list of names (strings) */
  var candidates = get_all_candidates(results_range);
  
  /* votes is an object mapping candidate names -> number of votes */
  var votes = get_votes(results_range, candidates, keys_range, valid_keys);
  
  /* winner is candidate name (string) or null */
  var winner = get_winner(votes, candidates);

  while (winner == null) {
    /* Modify candidates to only include remaining candidates */
    get_remaining_candidates(votes, candidates);
    if (candidates.length == 0) {
      if (missing_keys_used_sheet_alert) {
        Browser.msgBox("Unable to record keys used. Looking for sheet: " + KEYS_USED_SHEET);    
      }
      Browser.msgBox("Tie");
      return;
    }
    votes = get_votes(results_range, candidates, keys_range, valid_keys);
    winner = get_winner(votes, candidates);
  }
  
  if (missing_keys_used_sheet_alert) {
    Browser.msgBox("Unable to record keys used. Looking for sheet: " + KEYS_USED_SHEET);    
  }
  Browser.msgBox("Winner: " + winner);
}

function get_range_with_values(sheet_string, base_row, base_column, num_columns) {
  var results_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_string);
  if (results_sheet == null) {
    return null;
  }
  var a1string = String.fromCharCode(65 + base_column - 1) +
      base_row + ':' + 
      String.fromCharCode(65 + base_column + num_columns - 2);
  var results_range = results_sheet.getRange(a1string);
  // results_range contains the whole columns all the way to
  // the bottom of the spreadsheet. We only want the rows
  // with votes in them, so we're going to count how many
  // there are and then just return those.
  var num_rows = get_num_rows_with_values(results_range);
  if (num_rows == 0) {
    return null;
  }
  results_range = results_sheet.getRange(base_row, base_column, num_rows, num_columns);
  return results_range;
}

function range_to_array(results_range) {
  results_range.setBackground("#eeeeee");
  
  var candidates = [];
  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      continue;
    }
    for (var column = 1; column <= num_columns; column++) {
      var cell = results_range.getCell(row, column);
      if (cell.isBlank()) {
        break;
      }
      var cell_value = cell.getValue();
      cell.setBackground("#ffff00");
      if (!include(candidates, cell_value)) {
        candidates.push(cell_value);
      }
    }
  }
  return candidates;
}

function get_all_candidates(results_range) {
  results_range.setBackground("#eeeeee");
  
  var candidates = [];
  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      continue;
    }
    for (var column = 1; column <= num_columns; column++) {
      var cell = results_range.getCell(row, column);
      if (cell.isBlank()) {
        break;
      }
      var cell_value = cell.getValue();
      cell.setBackground("#ffff00");
      if (!include(candidates, cell_value)) {
        candidates.push(cell_value);
      }
    }
  }
  return candidates;
}

function get_votes(results_range, candidates, keys_range, valid_keys) {
  if (typeof keys_range === "undefined") {
    keys_range = null;
  }
  var votes = {};
  var keys_used = [];
  
  for (var c = 0; c < candidates.length; c++) {
    votes[candidates[c]] = 0;
  }
  
  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      break;
    }
    
    if (keys_range != null) {
      // Only use key once.
      var key_cell = keys_range.getCell(row, 1);
      var key_cell_value = key_cell.getValue();
      if (!include(valid_keys, key_cell_value) ||
          include(keys_used, key_cell_value)) {
        key_cell.setBackground('#ffaaaa');
        continue;
      } else {
        key_cell.setBackground('#aaffaa');
        keys_used.push(key_cell_value);
      }
    }
    
    for (var column = 1; column <= num_columns; column++) {
      var cell = results_range.getCell(row, column);
      if (cell.isBlank()) {
        break;
      }
      
      var cell_value = cell.getValue();
      if (include(candidates, cell_value)) {
        votes[cell_value] += 1;
        cell.setBackground("#aaffaa");
        break;
      }
      cell.setBackground("#aaaaaa");
    }
  }
  if (keys_range != null) {
    update_keys_used(keys_used);
  }
  return votes;
}

function update_keys_used(keys_used) {
  var keys_used_range = get_range_with_values(KEYS_USED_SHEET, BASE_ROW, 1, 1);
  if (keys_used_range != null) {
    keys_used_range.setBackground('#ffffff');
    if (keys_used_range != null) {
      var num_rows = keys_used_range.getNumRows();
      for (var row = num_rows; row >= 1; row--) {
        keys_used_range.getCell(row, 1).setValue('');
      }
    }
  }
  
  var keys_used_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(KEYS_USED_SHEET);
  if (keys_used_sheet == null) {
    missing_keys_used_sheet_alert = true;
    return;
  }
  var a1string = String.fromCharCode(65 + 1 - 1) +
    BASE_ROW + ':' + 
    String.fromCharCode(65 + 1 + 1 - 2);
  var keys_used_range = keys_used_sheet.getRange(a1string);
  for (var k = 0; k < keys_used.length; k++) {
    var cell = keys_used_range.getCell(k+1, 1);
    cell.setValue(keys_used[k]);
    cell.setBackground('#eeeeee');
  }
}


function get_winner(votes, candidates) {
  var total = 0;
  var winning = null;
  var max = 0;
  for (var c = 0; c < candidates.length; c++) {
    var name = candidates[c];
    var count = votes[name];
    total += count;
    if (count > max) {
      winning = name;
      max = count;
    }
  }
  
  if (max * 2 > total) {
    return winning;
  }
  return null;
}

function get_remaining_candidates(votes, candidates) {
  var min = -1;
  for (var c = 0; c < candidates.length; c++) {
    var name = candidates[c];
    var count = votes[name];
    if (count < min || min == -1) {
      min = count;
    }
  }
  
  var c = 0;
  while (c < candidates.length) {
    var name = candidates[c];
    var count = votes[name];
    if (count == min) {
      candidates.splice(c, 1);
    } else {
      c++;
    }
  }
  return candidates;
}
  
/*
http://stackoverflow.com/questions/143847/best-way-to-find-an-item-in-a-javascript-array
*/
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

/*
http://stackoverflow.com/questions/4169914/selecting-the-last-value-of-a-column
*/
function get_num_rows_with_values(results_range) {
  var num_rows_with_votes = 0;
  var num_rows = results_range.getNumRows();
  for (var row = 1; row <= num_rows; row++) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      break;
    }
    num_rows_with_votes += 1;
  }
  return num_rows_with_votes;
}

function clear_background_color() {
  /* Settings */
  var base_row = 2, base_column = 2, num_columns = 10;
  
  var results_range = get_range_with_values(VOTE_SHEET, base_row, base_column, num_columns);
  if (results_range == null) {
    return;
  }
  results_range.setBackground('#eeeeee');
  
  if (USING_KEY) {
    var keys_range = get_range_with_values(VOTE_SHEET, BASE_ROW, KEY_COLUMN, 1);
    keys_range.setBackground('#eeeeee');
  }
}

