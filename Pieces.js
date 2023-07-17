function makePiece(piece)
{
	switch(piece)
	{
		case 0: return new Grass();
		case 1: return new Bush();
		case 2: return new Tree();
		case 3: return new Hut();
		case 4: return new House();
		case 5: return new Mansion();
		case 6: return new Castle();
		case 7: return new Floating_Castle();
		case 8: return new Ultimate_Castle();

		case 10: return new Soldier();
		case 11: return new Helicopter();
		case 12: return new Tombstone();
		case 13: return new Church();
		case 14: return new Cathedral();

		case 20: return new SmallChest;
		case 21: return new BigChest;
	}
}

function drawPiece(image)
{
	//return '<img src="image.php?letter='+image+'" style=position:absolute;top:'+border_width+'px;left:'+border_width+'px;width:'+innerWidth+'px;height:'+innerHeight+'px;>'
	//return '<img src="letters/'+image+'.png" style=position:absolute;top:'+border_width+'px;left:'+border_width+'px;width:'+innerWidth+'px;height:'+innerHeight+'px;>'
	 return `<s class="sprite ${image}" style=position:absolute;top:${border_width}px;left:${border_width}px;transform:scale(${innerWidth/16})></s>`;
}

function Grass()
{
	this.label = 0;
	this.canCombine = true;
	this.image = drawPiece('G');
	this.combine_count = 3;
	this.getCombined = function()
	{
		return 1;
	}
}

function Bush()
{
	this.label = 1;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('B');
	this.getCombined = function()
	{
		return 2;
	}
}

function Tree()
{
	this.label = 2;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('T');
	this.getCombined = function()
	{
		return 3;
	}
}

function Hut()
{
	this.label = 3;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('hh');
	this.getCombined = function()
	{
		return 4;
	}
}

function House()
{
	this.label = 4;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('H');
	this.getCombined = function()
	{
		return 5;
	}
}

function Mansion()
{
	this.label = 5;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('M');
	this.getCombined = function()
	{
		return 6;
	}
}

function Castle()
{
	this.label = 6;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('C');
	this.getCombined = function()
	{
		return 7;
	}
}

function Floating_Castle()
{
	this.label = 7;
	this.canCombine = true;
	this.combine_count = 4;
	this.image = drawPiece('F');
	this.getCombined = function()
	{
		return 8;
	}
}

function Ultimate_Castle()
{
	this.label = 8;
	this.canCombine = false;
	this.image = drawPiece('U');
}

function Soldier()
{
	this.label = 10;
	this.canCombine = false;
	this.image = drawPiece('soldier');
	this.move = function(cell, openSpots)
	{
		var dirX = Math.random() > 0.5 ? 1 : Math.random() > 0.5 ? -1 : 0;
		var dirY = dirX == 0 ? (Math.random() > 0.5 ? 1 : -1) : 0;
		if(board[cell.row+dirX] && board[cell.row+dirX][cell.col+dirY] && board[cell.row+dirX][cell.col+dirY].canMoveInto()) {
			cell.moveCell(board[cell.row+dirX][cell.col+dirY]);
			return;
		}
		dirX *= -1;
		if(board[cell.row+dirX] && board[cell.row+dirX][cell.col+dirY] && board[cell.row+dirX][cell.col+dirY].canMoveInto()) {
			cell.moveCell(board[cell.row+dirX][cell.col+dirY]);
			return;
		}
		dirY = 1;dirX=0;
		if(board[cell.row+dirX] && board[cell.row+dirX][cell.col+dirY] && board[cell.row+dirX][cell.col+dirY].canMoveInto()) {
			cell.moveCell(board[cell.row+dirX][cell.col+dirY]);
			return;
		}
		dirY = -1;
		if(board[cell.row+dirX] && board[cell.row+dirX][cell.col+dirY] && board[cell.row+dirX][cell.col+dirY].canMoveInto()) {
			cell.moveCell(board[cell.row+dirX][cell.col+dirY]);
			return;
		}
		this.kill(cell);
	}
	this.kill = function(cell) {
		cell.content = new Tombstone();
		checkBoard(cell, new Tombstone());
		cell.makeCell(cell.content);
		cell.makeInnerCell();
		//hack to allow all events to finish before redrawing board
		setTimeout(function(){drawBoard();}, 100);

	}
	this.getCombined = function() {}
}

function Helicopter()
{
	this.label = 11;
	this.canCombine = false;
	this.image = drawPiece('helicopter');
	this.move = function(cell, openSpots)
	{
		//no open spots, game is over;
		if(openSpots.length == 0)
			return;
		var position = parseInt(Math.random() * openSpots.length);
		cell.moveCell(openSpots[position]);
	}
	this.kill = function(cell) {
		cell.content = new Tombstone();
		matches = new Array();
		checkNeighbors(cell.row, cell.col, cell.content);
		//check the number of matchs and see if it is >= the match necessary count
		//add one to include the cell that we have added
		if(matches.length >= cell.content.combine_count)
		{
			//remove all the matching tile
			collapseMatches();
			//if the matching piece is less then run recursive check the board
			//for matches against the new tile

			//clear out our checks
			clearChecks();
			cell.content = cell.content.getCombined();
		}
	}
	this.getCombined = function()
	{
	}
}

function Tombstone()
{
	this.label = 12;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('TS');
	this.getCombined = function()
	{
		return 13;
	}
}

function Church()
{
	this.label = 13;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('sc');
	this.getCombined = function()
	{
		return (14)
	}
}

function Cathedral()
{
	this.label = 14;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('CC');
	this.getCombined = function()
	{
		return(20)
	}
}

function smallChest()
{
	this.label = 20;
	this.image = drawPiece('small_chest');
	this.canCombine = false;
}

function bigChest()
{
	this.label = 21;
	this.image = drawPiece('large_chest');
	this.canCombine = false;
}

function Rock()
{
	this.label = 15;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('rock');
	this.getCombined = function()
	{
		return (15);
	}
}

function Boulder()
{
	this.label = 16;
	this.canCombine = true;
	this.combine_count = 3;
	this.image = drawPiece('mountain');
	this.getCombined = function()
	{
		return (21);
	}
}

function Crystal()
{
	this.label = 100;
	this.image = drawPiece('∆');
}
