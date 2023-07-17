function SwapCell(row, col)
{
	this.content = -1; //cell has no content
	this.checked = true; //whether cell has been checked for content
	this.row = row; //row position
	this.col = col; //col position
	this.x = col * cellWidth; //x position
	this.y = row * cellHeight; //y position

	//draw init swap cell
	$cell = $('<DIV></DIV>');
	$cell.attr('id', 'cell'+this.row+'_'+this.col);
	$cell.attr('class', 'cell');
	$cell.css({
		'width': cellWidth,
		'height': cellHeight,
		'background-color': '#FAEBD7',
		'position': 'absolute',
		'top': this.y,
		'left': this.x
	});
	$game_board.prepend($cell);
	this.$cell = $('#cell'+this.row+'_'+this.col);

	this.clearCheck = function(){};
	this.makeInnerCell = function()
	{
		$('#cell'+this.row+'_'+this.col)
		.html(
			$(this.content.image).css({'z-index':100,'position':'absolute','left':border_width+'px'})
		)
		.css('background-color', '#FAEBD7');
	}

	//set make cell to call initMakeCell on first call
	this.makeCell = function(piece) {this.initMakeCell(piece)};

	this.initMakeCell = function(piece)
	{
		this.content = piece;
		curr_piece = 0;
		getNextPiece();

		//makeCell function to handle cell swapping
		this.makeCell = function(piece)
		{
			var temp = this.content;
			this.content = curr_piece;
			curr_piece = temp;
			this.$cell.html('');
		}
	}

	this.getPiece = function()
	{
		return curr_piece;
	}

	//user can always click inside of the swap cell
	this.check = function()
	{
		return true;
	}

	//piece can never move into swap cell
	this.canMoveInto = function() {
		return false;
	}

	this.reset =function()
	{
		this.$cell.css({top:board[row][col].y,left:board[row][col].x });
	}
}