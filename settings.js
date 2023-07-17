//var GAME_TITLE = "LETTER BUILDER";
var GAME_TITLE = "Triple Town Clone";

//number of rows in the game
var numRows = 6;

//number of cells in the game
var numCols = 6;

//width of game cell
var cellWidth  = 45;

//height of game cell;
var cellHeight = 45;

//piece background-color
var cell_background = '#DFFFA5';

//piece border color
var cell_border = '#238E23';

//piece border width
var border_width = 4;

//innerWidth of piece
var innerWidth = (cellWidth - (border_width * 2))

//innerHeight of piece
var innerHeight = (cellHeight - (border_width * 2))

//jquery pointer to the game board
var $game_board;

//jquery pointer to hover piece
var $hover_piece;

//all individual cells in the game board
var board = new Array();
for(var j =0; j < numRows; j++)
{
	board[j] = new Array(numCols);
}

//score value
var score = 0;

//y position of mouse action
var posY = 0;

//x position of mouse action
var posX = 0;

//current active piece
var curr_piece;

//storage for found matches
var matches = new Array();

//playable pieces
var piece_array = new Array('G', 'B', 'T', 'h', 'H', 'M', 'C', 'F', 'U');

//number of matches required to make new piece
var piece_match_count = new Array(3, 3, 3, 3, 3, 3, 3,4);

//scores for adding each piece
var piece_score = new Array(10, 20, 30, 40, 50, 60, 70, 80, 90);
