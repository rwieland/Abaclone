var standard_board = [
	['W', 'W', 'W', 'W', 'W'],
	['W', 'W', 'W', 'W', 'W', 'W'],
	[' ', ' ', 'W', 'W', 'W', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', 'B', 'B', 'B', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B']];
	
var german_daisy_board = [
	[' ', ' ', ' ', ' ', ' '],
	['W', 'W', ' ', ' ', 'B', 'B'],
	['W', 'W', 'W', ' ', 'B', 'B', 'B'],
	[' ', 'W', 'W', ' ', ' ', 'B', 'B', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', 'B', 'B', ' ', ' ', 'W', 'W', ' '],
	['B', 'B', 'B', ' ', 'W', 'W', 'W'],
	['B', 'B', ' ', ' ', 'W', 'W'],
	[' ', ' ', ' ', ' ', ' ']];
	
var belgian_daisy_board = [
	['W', 'W', ' ', 'B', 'B'],
	['W', 'W', 'W', 'B', 'B', 'B'],
	[' ', 'W', 'W', ' ', 'B', 'B', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', 'B', 'B', ' ', 'W', 'W', ' '],
	['B', 'B', 'B', 'W', 'W', 'W'],
	['B', 'B', ' ', 'W', 'W']];
	
function copyBoard(board) {
	var copy = []
	for (var row = 0; row < board.length; row++) {
		var row_copy = []
		for (var col = 0; col < board[row].length; col++) {
			row_copy.push(board[row][col])
		}
		copy.push(row_copy)
	}
	return copy
}
	
function Abalone(board = standard_board) {
	this.board = copyBoard(board)
	this.legend = {'B': 'blackball', 'W': 'whiteball', ' ': 'tile'}
	this.current_player = 'B'
	
	this.drawBoard = function() {
		this.clearBoard()
		for (var i = 0; i < this.board.length; i++) {
			var row = document.createElement('div')
			row.className = 'row'
			for (var j = 0; j < this.board[i].length; j++) {
				var tile = document.createElement('div')
				tile.className = 'tile'
				tile.id = `t${i}${j}`
				
				var img = document.createElement('img')
				var type = this.legend[this.board[i][j]]
				img.src = `images/plain${type}.png`	
				
				tile.appendChild(img)
				row.appendChild(tile)
		
			}
			var game = document.querySelector('#game')
			game.appendChild(row)
		}
	}
	
	this.clearBoard = function() {
		var previous_board = document.querySelectorAll('.row')
		for (var n = 0; n < previous_board.length; n++) {
			previous_board[n].remove()
		}
	}
	
	this.startTurn = function() {
		this.drawBoard()
		this.addFirstClick()
	}
	
	this.addFirstClick = function() {
		var tiles = document.querySelectorAll('.tile')
		for (var n = 0; n < tiles.length; n++) {
			var i = this.toIndex(tiles[n].id)
			var that = this
			if (this.board[i[0]][i[1]] == this.current_player) {
				tiles[n].addEventListener('click', function(event) {that.firstClick(event)})
				this.addColoredMouseover(tiles[n], 'green')
			} else {
				this.addColoredMouseover(tiles[n], 'red')
			}
		}
	}
	
	this.addColoredMouseover = function(tile_div, color) {
		var old_color = this.colorOfTile(tile_div)
		var that = this
		tile_div.addEventListener('mouseover', function(event) {
			tile = that.toIndex(event.target.id)
			that.colorTile(tile, color)
		}, false)
		tile_div.addEventListener('mouseout', function(event) {
			tile = that.toIndex(event.target.id)
			that.colorTile(tile, old_color)
		}, false)
	}

	this.firstClick = function(event) {
		var tile = this.toIndex(event.target.id)
		this.drawBoard()
		this.colorTile(tile, 'blue')
		this.addSecondClick(tile)
	}
	
	this.addSecondClick = function(tile) {
		this.addCancelSelection(this.toTileDiv(tile))
		
		var adjacent = this.surroundingTiles(tile)		
		for (var i = 0; i < adjacent.length; i++) {
			var color = this.colorOf(adjacent[i])
			
			if (color == ' ') {
				this.colorTile(adjacent[i], 'yellow')
				this.addColoredMouseover(this.toTileDiv(adjacent[i]), 'green')
			} else if (color == this.current_player) {
				this.colorTile(adjacent[i], 'yellow')
				this.addColoredMouseover(this.toTileDiv(adjacent[i]), 'green')
				var next_in_row = this.nextInRow(tile, adjacent[i])				
				if (next_in_row && this.colorOf(next_in_row) == this.current_player) {
					this.colorTile(next_in_row, 'yellow')
					this.addColoredMouseover(this.toTileDiv(next_in_row), 'green')
				}
			}
		}

		var all_tiles = document.querySelectorAll('.tile')
		for (var n = 0; n < all_tiles.length; n++) {
			if (this.colorOfTile(all_tiles[n]) == 'plain') {
				this.addCancelSelection(all_tiles[n])
			}
		}
	}
	
	this.addCancelSelection = function(tile_div) {
		var that = this
		tile_div.addEventListener('click', function() {
			that.startTurn()
		})
		this.addColoredMouseover(tile_div, 'red')
	}
	
	this.colorTile = function(tile, tile_color) {
		var type = this.legend[this.colorOf(tile)]
		var img = document.querySelector(this.toID(tile)).querySelector('img')
		img.src = `images/${tile_color}${type}.png`		
	}
	
	this.colorOfTile = function(tile_div) {
		var img = tile_div.querySelector('img')
		var re = /plain|red|green|blue|yellow/
		return img.src.match(re)[0]
	}
	
	this.toIndex = function(div_id) {
		return div_id.split('').slice(1).map(function(x) {return parseInt(x)})
	}
	
	this.toID = function(tile) {
		return '#t' + tile.join('')
	}
	
	this.toTileDiv = function(tile) {
		return document.querySelector(this.toID(tile))
	}
	
	this.colorOf = function(tile) {
		return this.board[tile[0]][tile[1]]
	}
	
	this.nextInRow = function(first_tile, second_tile) {
		var i1 = first_tile[0]
		var j1 = first_tile[1]
		var i2 = second_tile[0]
		var j2 = second_tile[1]
		var t3 = []
		
		if (i2 == 4) {
			t3 = [2 * i2 - i1, 2 * j2 - j1 - 1]
		} else {
			t3 = [2 * i2 - i1, 2 * j2 - j1]
		}
		
		if (this.board[t3[0]] && this.board[t3[0]][t3[1]]) {
			return t3
		}
	}
	
	this.ballCount = function(color) {
		var count = 0
		for (var row = 0; row < this.board.length; row++) {
			for (var column = 0; column < this.board[row].length; column++) {
				if (this.board[row][column] == color) {
					count += 1
				}
			}
		}
		return count
	}
	
	this.winner = function() {
		if (this.ballCount('W') < 9) {
			return 'Black Wins'
		} else if (this.ballCount('B') < 9) {
			return 'White Wins'
		} else {
			return false
		}	
	}
	
	this.move = function(tiles, dir) {
		var color = this.colorOf(tiles[0])
		for (var n = 0; n < tiles.length; n++) {
			this.board[tiles[n][0]][tiles[n][1]] = ' '
		}
		for (var n = 0; n < tiles.length; n++) {
			this.board[tiles[n][0] + dir[0]][tiles[n][1] + dir[1]] = color
		}
	}
	
	this.surroundingTiles = function(tile) {
		var directions = [[0,-1],[0,1],[-1,0],[1,0]]
		result = []
		
		if (tile[0] == 4) {
			directions.push([-1,-1],[1,-1])
		} else if (tile[0] < 4) {
			directions.push([-1,-1],[1,1])
		} else {
			directions.push([-1,1],[1,-1])
		}
		
		for (var i = 0; i < directions.length; i++) {
			var n_tile = [tile[0] + directions[i][0],tile[1] + directions[i][1]]
			if (this.board[n_tile[0]] !== undefined && this.board[n_tile[0]][n_tile[1]] !== undefined) {
				result.push(n_tile)
			}
		}
		
		return result
	}
}

window.onload = function() {
	var new_game = new Abalone
	new_game.startTurn()
}
