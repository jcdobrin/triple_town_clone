//definition for a cell
function Cell(row, col)
{
	this.content = -1; //cell has no content
	this.checked = false; //whether cell has been checked for content
	this.row = row; //row position
	this.col = col; //col position
	this.x = col * cellWidth; //x position
	this.y = row * cellHeight; //y position
	this.clearCheck = function(){ this.checked = false };
	this.$cell = $('<DIV></DIV>');

	this.makeCell = function(piece)
	{
		this.content = piece;
		$cell = $('<DIV></DIV>');
		$cell.attr('id', 'cell'+this.row+'_'+this.col);
		$cell.attr('class', 'cell');
		$cell.css({
		'width': cellWidth,
		'height': cellHeight,
		'position': 'absolute',
		'top': this.y,
		'left': this.x
		});

		$game_board.append($cell);

		this.$cell = $('#cell'+this.row+'_'+this.col);
	}

	this.makeInnerCell = function()
	{
		var tl_c = checkBorder(this, 0);
		var tr_c = checkBorder(this, 1);
		var bl_c = checkBorder(this, 2);
		var br_c = checkBorder(this, 3);

		var ts = checkBorder(this, 4);
		var rs = checkBorder(this, 5);
		var bs = checkBorder(this, 6);
		var ls = checkBorder(this, 7);

		$cell = $('#cell'+this.row+'_'+this.col);
		if(this.content.move == undefined) {
			$cell.append(draw_surface(0,	0, 				border_width,	border_width, tl_c));
			$cell.append(draw_surface(0,	border_width,	innerWidth,		border_width, ts));
			$cell.append(draw_surface(0,	(cellWidth-border_width), 	border_width,	border_width, tr_c));

			$cell.append(draw_surface(border_width, 0, 				border_width,	innerHeight, ls));
			$cell.append(draw_surface(border_width, border_width,	innerWidth, 		innerHeight, '#DFFFA5'));
			$cell.append(draw_surface(border_width, (cellWidth-border_width),		border_width,	innerHeight, rs));

			$cell.append(draw_surface((cellHeight - border_width), 0, 							border_width, 				border_width, bl_c));
			$cell.append(draw_surface((cellHeight - border_width), border_width, 				innerWidth, border_width, bs));
			$cell.append(draw_surface((cellHeight - border_width), (cellWidth - border_width),	border_width, 				border_width, br_c));
		}
		$cell.append(this.content.image);
	}

	this.getPiece = function() {
		var piece = checkBoard(this, curr_piece);
		score += piece_score[piece.label] || 100;
		$('#score').html(score);
		return piece;
	}

	this.check = function()
	{
		return (this.content == -1);
	}

	this.clearCell = function()
	{
		this.$cell.children('DIV').remove();
		this.$cell.animate({
			opacity: 0.5,
			left: '+='+ ((posX * cellWidth) - this.x),
			top: '+=' + ((posY * cellHeight) -  this.y),
		}, 100, function() {
		// Animation complete.
		$(this).remove();
		});

		this.content = -1;
	}

	this.moveCell = function(cell) {
		var self = this;
		this.$cell.children('DIV').remove();
		var content = this.content;
		this.content = -1;
		this.$cell.animate({
			left: '+='+ (cell.x - this.x),
			top: '+=' + (cell.y - this.y),
		}, 1000, function() {
			cell.makeCell(content);
			cell.makeInnerCell();
			// Animation complete.
			self.clearCell();
			drawBoard();
		});
	}

	this.canMoveInto = function() {
		return this.check();
	}

	this.reset =function()
	{
		this.$cell.css({top:board[row][col].y,left:board[row][col].x }).width(cellWidth).height(cellHeight);
	}}
