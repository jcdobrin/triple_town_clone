
//initializes game board
function initGame()
{
	//set pointer to hover piece
	$hover_piece = $('#hover_piece');

	//set hoverpiece width and height
	$hover_piece.width(cellWidth-2);
	$hover_piece.height(cellHeight-2);

	//set pointer to game_board
	$game_board = $('#game_board');

	//set board width and height
	$game_board.width(cellWidth * numCols);
	$game_board.height(cellHeight * numRows);


	//set game title
	$('#title').html(GAME_TITLE);

	//instantiate the current playing piece
	getNextPiece();

	//instantiate the score
	$('#score').html(score);
	$('#head').append('<div style="position:absolute;color:white;top:'+($('#score').position().top+parseInt($('#score').css('margin'))+4)+'px;left:15px;">SCORE</div>')

	//instantiate game board cells
	var row, col;
	for(row=0;row<numRows;row++)
	{
		for(col=0;col<numCols;col++)
		{
			board[row][col] = new Cell(row,col);

			//randomly add pieces
			if(Math.random() >= 0.85)
			{
				//add piece to the game board
				//board[row][col].makeCell(curr_piece);
			}
		}
	}

	//create a SwapCell
	board[0][0] = new SwapCell(0,0);

	//draw the board pieces
	drawBoard();

	//set the current piece in the hover icon
	setCursor();

	//show hover icon
	$hover_piece.show();


	//create input handlers
	$game_board.live('mousemove', function(){moveHoverPiece(event)});
	$game_board.live('mouseup', function(){handleClick( event );});
	$(window).keypress(function(event){
		switch(event.charCode)
		{
			case 49: curr_piece=makePiece(0);break;
			case 50: curr_piece=makePiece(1);break;
			case 51: curr_piece=makePiece(2);break;
			case 52: curr_piece=makePiece(3);break;
			case 53: curr_piece=makePiece(4);break;
			case 54: curr_piece=makePiece(5);break;
			case 55: curr_piece=makePiece(6);break;
			case 56: curr_piece=makePiece(7);break;
			case 57: curr_piece=makePiece(8);break;

			//make board bigger by pressing 0
			case 48:
				cellWidth  = 64;

				//height of game cell;
				cellHeight = 64;

				//piece border width
				border_width = 4;

				$('#container img').css({'width':'56px', 'height':'56px'});
				innerWidth = (cellWidth - (border_width * 2))

				//innerHeight of piece
				innerHeight = (cellHeight - (border_width * 2))

				$game_board.width(cellWidth * numCols);
				$game_board.height(cellHeight * numRows);

				//set hoverpiece width and height
				//$hover_piece.width(cellWidth-2);
				//$hover_piece.height(cellHeight-2);
				$hover_piece.css({
					top: 0,
					left: 0
				})
				setCursor();
				for(row=0;row<numRows;row++)
				{
					for(col=0;col<numCols;col++)
					{
						board[row][col].x = col * cellWidth;
						board[row][col].y = row * cellHeight;
						board[row][col].reset();
					}
				}

				drawBoard();
				//remake current piece with new properties
				curr_piece = makePiece(curr_piece.label);
		}
		setCursor();
	});
}

function moveHoverPiece(e)
{
	//hack to keep mouse cursor from displaying in game board
	$("link")[0].disabled = true;
	$("link")[0].disabled = false;

	//get the position of the hover piece in the game board
	curr_pos = $hover_piece.position();
	posY = Math.floor( (e.pageY - $game_board.offset().top) / cellHeight) * cellHeight;
	posX = Math.floor( (e.pageX - $game_board.offset().left) / cellWidth) * cellWidth;

	//if the position of hover icon has changed and the new position is inside the board
	if( (posY != curr_pos.top || posX !=curr_pos.left)
	&&  (posX < $game_board.width() && posY < $game_board.height() )
	)
	{
		//move hover icon to new position
		$hover_piece.css({
			top: posY,
			left: posX
		})
	}
}

/**
 * Set the image of the hover icon
 */
function setCursor()
{
	$hover_piece.html(
	$(curr_piece.image).css('top','')
	.css({
	//width: (innerWidth / 1.5)+'px',
	//height:(innerHeight / 1.5)+'px',
	position:'absolute',
	left:( (cellWidth / 2) - ((innerWidth / 1.5) / 2 ) ) +'px',
	bottom:'16px',
	})
	);
}

//handles clicking a cell
function handleClick(e)
{
	//get the position of the cell that was clicked
	posY = Math.floor((e.pageY - $game_board.offset().top)  / cellHeight);
	posX = Math.floor((e.pageX - $game_board.offset().left) / cellWidth );
	cell = board[posY][posX];

	if(cell.check())
	{
		var piece = cell.getPiece();
		cell.makeCell(piece);
		drawBoard();
		setCursor();
		if(!(cell instanceof SwapCell)) {

			moveMovablePieces();
			getNextPiece();
			setCursor();
			clearChecks();


			drawBoard();

			if( endGame() ) {
				$hover_piece.hide();
				$('#end_game').fadeIn(100);
			}
		}
	}
}

function draw_surface(top, left, width, height, background, contents)
{
	surface = document.createElement('div');
	surface.style.position = 'absolute';
	surface.style.width =  width+'px';
	surface.style.height = height + 'px';
	surface.style.top =  top+'px';
	surface.style.left = left + 'px';
	surface.style.background = background;
	//surface.innerHTML = contents['HTML'];
	return surface;
}

function checkBorder(cell, type)
{
	background = ''+cell_background+'';
	border = ''+cell_border+'';
	var bg_type;
	switch(type)
	{
		case 0:
			if(cell.row-1 >= 0 && cell.col-1 >=0)
			{
				if(
					board[cell.row-1][cell.col-1].content != -1 && !(board[cell.row-1][cell.col-1] instanceof SwapCell) &&
					board[cell.row][cell.col-1].content != -1  && !(board[cell.row][cell.col-1] instanceof SwapCell) &&
					board[cell.row-1][cell.col].content != -1 && !(board[cell.row-1][cell.col] instanceof SwapCell)
				)
					return background;

				bg_type = (board[cell.row][cell.col-1].content == -1 && board[cell.row-1][cell.col].content == -1) ? 'tl' : '';
			}
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 1:
			if(cell.row-1 >= 0 && cell.col+1 < numCols)
			{
				if(
					board[cell.row-1][cell.col+1].content != -1 && !(board[cell.row-1][cell.col+1] instanceof SwapCell) &&
					board[cell.row][cell.col+1].content != -1 && !(board[cell.row][cell.col+1] instanceof SwapCell) &&
					board[cell.row-1][cell.col].content != -1 && !(board[cell.row-1][cell.col] instanceof SwapCell)
					)
					return background;

				bg_type = (board[cell.row][cell.col+1].content == -1 && board[cell.row-1][cell.col].content == -1) ? 'tr' : '';
			}
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 2:
			if(cell.row+1 < numRows && cell.col-1 >=0)
			{
				if(
				board[cell.row+1][cell.col-1].content != -1 && !(board[cell.row+1][cell.col-1] instanceof SwapCell) &&
				board[cell.row][cell.col-1].content != -1 && !(board[cell.row][cell.col-1] instanceof SwapCell) &&
				board[cell.row+1][cell.col].content != -1 && !(board[cell.row+1][cell.col] instanceof SwapCell)
				)
					return background;

				bg_type = (board[cell.row][cell.col-1].content == -1 && board[cell.row+1][cell.col].content == -1) ? 'bl' : '';
			}
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 3:
			if(cell.row+1 < numRows && cell.col+1 < numCols)
			{
				if(
					board[cell.row+1][cell.col+1].content != -1 && !(board[cell.row+1][cell.col+1] instanceof SwapCell) &&
					board[cell.row][cell.col+1].content != -1 && !(board[cell.row][cell.col+1] instanceof SwapCell) &&
					board[cell.row+1][cell.col].content != -1 && !(board[cell.row+1][cell.col] instanceof SwapCell)
				)
					return background;
				bg_type = (board[cell.row][cell.col+1].content == -1 && board[cell.row+1][cell.col].content == -1) ? 'br' : '';
			}
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 4:
			if(cell.row-1 >= 0)
				if(board[cell.row-1][cell.col].content != -1 && !(board[cell.row-1][cell.col] instanceof SwapCell))
					return background;
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 5:
			if(cell.col+1 < numCols)
				if(board[cell.row][cell.col+1].content != -1 && !(board[cell.row][cell.col+1] instanceof SwapCell))
					return background;
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 6:
			if(cell.row+1 < numRows)
				if(board[cell.row+1][cell.col].content != -1 && !(board[cell.row+1][cell.col] instanceof SwapCell))
					return background;
			//return 'url("image.php?corner=true&type='+bg_type+'&length='+border_width+'")';
			return 'url("borders/'+bg_type+'.png")';

		case 7:
			if(cell.col-1 >= 0)
				if(board[cell.row][cell.col-1].content != -1 && !(board[cell.row][cell.col-1] instanceof SwapCell))
					return background;
			return border;

		default: return border;
	}
}

function getNextPiece(recursive_call)
{
	if(recursive_call == undefined)
	{
		curr_piece = 0;
	}

	if(curr_piece >= piece_array.length - 1)
		curr_piece = makePiece(curr_piece);
	else if(Math.random() < 0.03 && $('#score').html() >= 1000) {
		curr_piece = makePiece(11);
	}
	else if(Math.random() < 0.05 && $('#score').html() >= 100) {
		curr_piece = makePiece(10);
	}

	else if(Math.random() > 0.7)
	{
		curr_piece++;
		getNextPiece(true)
	}
	else
	{
		curr_piece = makePiece(curr_piece);
	}
}

//checks board to see if we have three matches
function checkBoard(cell, matching_piece)
{
	//reset matches so that previous checks do not count
	matches = new Array();

	if(!(matching_piece.canCombine))
	{
		return matching_piece;
	}

	cell.content = matching_piece;
	checkNeighbors(cell.row, cell.col, matching_piece);

	//check the number of matchs and see if it is >= the match necessary count
	//add one to include the cell that we have added
	if(matches.length >= matching_piece.combine_count)
	{
		//remove all the matching tile
		collapseMatches();
		//if the matching piece is less then run recursive check the board
		//for matches against the new tile

		//clear out our checks
		clearChecks();

		matching_piece = checkBoard(cell, makePiece(matching_piece.getCombined()));
	}

	//if there are not enough matches return the match piece
	return matching_piece;
}

function clearChecks()
{
	$.each(board, function(index, row){
		$.each(row, function(index2, cell){
			cell.clearCheck();
		})
	});
}

function checkNeighbors(row, col, matching_piece)
{
	if(!board[row][col].checked)
	{
		board[row][col].checked = true;
		if(board[row][col].content.label == matching_piece.label)
		{
			//push match
			matches.push( board[row][col] );

			//run checks against neighbors
			if(row+1 < numRows )
				checkNeighbors(row+1, col, matching_piece);

			if( col+1 < numCols)
				checkNeighbors(row, col+1, matching_piece);

			if( row-1 >= 0)
				 checkNeighbors(row-1, col, matching_piece);

			if( col-1 >= 0 )
				checkNeighbors(row, col-1, matching_piece);
		}
	}
	return false;
}

//collapses a set of matching tiles
function collapseMatches()
{
	for(var j in matches)
	{
		matches[j].clearCell();
	}
}

function drawBoard()
{
	for(var row in board)
	{
		for(var col in board[row])
		{
			if(board[row][col].content != -1)
			{
				board[row][col].makeInnerCell();
			}
		}
	}
}

function moveMovablePieces() {
	openSpots = [];
	var moveablePieces = [];

	for(var row in board) {
		for(var col in board[row]) {
			if(board[row][col].canMoveInto()) {
				openSpots.push(board[row][col]);
			}

			else if(!(board[row][col] instanceof SwapCell) && (board[row][col].content instanceof Soldier || board[row][col].content instanceof Helicopter)) {
				moveablePieces.push(board[row][col]);
			}
		}
	}
	var k = 0;
	for(var i in moveablePieces) {
		moveablePieces[i].content.move(moveablePieces[i], openSpots);
	}
}

//checks to see if end the gameplay
function endGame()
{
	//loop through all board cells
	for(row in board)
	{
		for(col in board[row])
		{
			//if content of cell is empty
			if(board[row][col].content == -1)
			{
				return false;
			}
		}
	}
	return true;
}