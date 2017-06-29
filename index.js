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

var all_black_board = [
	new Array(5).fill('B'),
	new Array(6).fill('B'),
	new Array(7).fill('B'),
	new Array(8).fill('B'),
	new Array(9).fill('B'),
	new Array(8).fill('B'),
	new Array(7).fill('B'),
	new Array(6).fill('B'),
	new Array(5).fill('B')]
	
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
	this.selection = []
	
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
		if (this.winner()) {
			alert(this.winner())
		}
		this.addFirstClick()
	}
	
	this.addFirstClick = function() {
		var tiles = document.querySelectorAll('.tile')
		for (var n = 0; n < tiles.length; n++) {
			var i = this.toIndex(tiles[n].id)
			var that = this
			if (this.board[i[0]][i[1]] === this.current_player) {
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
		this.selection.push(tile)
		this.colorTile(tile, 'blue')
		this.addSecondClick(tile)
	}
	
	this.addSecondClick = function(tile) {
		this.addCancelSelection(this.toTileDiv(tile))
		
		var adjacent = this.surroundingTiles(tile)		
		for (var i = 0; i < adjacent.length; i++) {
			var color = this.colorOf(adjacent[i])			
			if (color === ' ') {
				this.colorTile(adjacent[i], 'yellow')
				this.addColoredMouseover(this.toTileDiv(adjacent[i]), 'green')
				var that = this
				this.toTileDiv(adjacent[i]).addEventListener('click', function(event) {
					var move_tile = that.toIndex(event.target.id)
					that.move([move_tile])
				})
			} else if (color === this.current_player) {
				this.colorTile(adjacent[i], 'yellow')
				this.addSelectSecondTile(this.toTileDiv(adjacent[i]))
				var next_in_row = this.nextInLine(tile, adjacent[i])				
				if (next_in_row && this.colorOf(next_in_row) === this.current_player) {
					this.colorTile(next_in_row, 'yellow')
					this.addSelectSecondTile(this.toTileDiv(next_in_row))
				}
			}
		}
		this.fillCancelSelection()
	}
	
	this.fillCancelSelection = function() {
		var all_tiles = document.querySelectorAll('.tile')
		for (var n = 0; n < all_tiles.length; n++) {
			if (this.colorOfTile(all_tiles[n]) === 'plain') {
				this.addCancelSelection(all_tiles[n])
			}
		}
	}
	
	this.addCancelSelection = function(tile_div) {
		this.addColoredMouseover(tile_div, 'red')
		var that = this
		tile_div.addEventListener('click', function() {
			that.selection = []
			that.startTurn()
		})
	}
	
	this.addSelectSecondTile = function(tile_div) {
		this.addColoredMouseover(tile_div, 'green')
		var that = this
		tile_div.addEventListener('click', function(event) {
			var tile = that.toIndex(event.target.id)
			that.selection.push(tile)
			if (Math.abs(tile[0] - that.selection[0][0]) >= 2) {
				if (tile[0] === 3 && that.selection[0][0] === 5 || tile[0] === 5 && that.selection[0][0] === 3) {
					that.selection.splice(1, 0, [4, (tile[1] + that.selection[0][1] + 1)/2])
				} else {
					that.selection.splice(1, 0,[(tile[0] + that.selection[0][0])/2, (tile[1] + that.selection[0][1])/2])
				}				
			} else if (Math.abs(tile[1] - that.selection[0][1]) >= 2) {
				that.selection.splice(1, 0, [tile[0], (tile[1] + that.selection[0][1])/2])
			}
			that.drawBoard()
			for (var i = 0; i < that.selection.length; i++) {
				that.colorTile(that.selection[i], 'blue')
				that.addCancelSelection(that.toTileDiv(that.selection[i]))
			}
			that.addPossibleMoves()
		})
	}
	
	this.addPossibleMoves = function() {
		this.forwardMove(this.selection[1], this.selection[0])
		this.forwardMove(this.selection[this.selection.length - 2], this.selection[this.selection.length - 1])
		this.sideMoves()
		this.fillCancelSelection()
	}
	
	this.forwardMove = function(first_tile, second_tile) {
		var third_tile = this.nextInLine(first_tile, second_tile)
		if (third_tile) {
			if (this.colorOf(third_tile) === ' ') {
				this.addForwardMove(third_tile, [])
			} else if (this.colorOf(third_tile) === this.current_player) {
				this.addCancelSelection(this.toTileDiv(third_tile))
			} else {
				var fourth_tile = this.nextInLine(second_tile, third_tile)
				if (fourth_tile === undefined || this.colorOf(fourth_tile) === ' ') {
					this.addForwardMove(third_tile, [third_tile])					
				} else if (third_tile === this.current_player) {
					this.addCancelSelection(this.toTileDiv(third_tile))
				} else {
					var fifth_tile = this.nextInLine(third_tile, fourth_tile)
					if (fifth_tile === undefined || this.colorOf(fifth_tile) === ' ') {
						this.addForwardMove(third_tile, [third_tile, fourth_tile])
					} else {
						this.addCancelSelection(this.toTileDiv(third_tile))
					}
				}
			}
		}
	}
	
	this.sideMoves = function() {
		
	}
	
	this.addForwardMove = function(tile, push_tiles) {
		this.colorTile(tile, 'yellow')
		this.addColoredMouseover(this.toTileDiv(tile), 'green')
		var that = this
		this.toTileDiv(tile).addEventListener('click', function() {
			var end_of_selection = that.selection[that.selection.length - 1]
			var second_to_end = that.selection[that.selection.length - 2]
			var next_in_line = that.nextInLine(second_to_end, end_of_selection)
			if (next_in_line[0] === tile[0] && next_in_line[1] === tile[1]) {
				for (var i = 0; i < push_tiles.length; i++) {
					that.selection.push(push_tiles[i])
				}
			} else {
				for (var i = 0; i < push_tiles.lenght; i++) {
					that.selection.unshift(push_tiles[i])
				}
				that.selection.reverse()
			}
			var moves = copyBoard(that.selection).slice(1)
			var end_of_moves = that.selection[that.selection.length - 1]
			var second_to_moves_end = that.selection[that.selection.length - 2]
			moves.push(that.nextInLine(second_to_moves_end, end_of_moves))
			that.move(moves)
		})
	}
	
	this.move = function(moves) {
		console.log(this.selection.join())
		console.log(moves.join())
		var colors = this.colorsOf()
		for (i = 0; i < colors.length; i++) {
			this.board[this.selection[i][0]][this.selection[i][1]] = ' '
		}
		for (i = 0; i < colors.length; i++) {
			if (moves[i]) {
				this.board[moves[i][0]][moves[i][1]] = colors[i]
			}
		}	
		this.selection = []
		this.nextPlayer()
		this.startTurn()
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
	
	this.colorsOf = function(arr = this.selection) {
		var colors = []
		for (var n = 0; n < arr.length; n++) {
			colors.push(this.colorOf(arr[n]))
		}
		return colors
	}
	
	this.nextInLine = function(first_tile, second_tile) {
		var i1 = first_tile[0]
		var j1 = first_tile[1]
		var i2 = second_tile[0]
		var j2 = second_tile[1]
		var t3 = []
		
		if (i2 === 4 && i1 != 4) {
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
				if (this.board[row][column] === color) {
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
	
	this.directions = function(tile) {
		var result = [[0,-1],[0,1],[-1,0],[1,0]]		
		if (tile[0] === 4) {
			result.push([-1,-1],[1,-1])
		} else if (tile[0] < 4) {
			result.push([-1,-1],[1,1])
		} else {
			result.push([-1,1],[1,-1])
		}
		return result
	}
	
	this.surroundingTiles = function(tile) {
		var dire = this.directions(tile)		
		result = []
		for (var i = 0; i < dire.length; i++) {
			var n_tile = [tile[0] + dire[i][0],tile[1] + dire[i][1]]
			if (this.board[n_tile[0]] !== undefined && this.board[n_tile[0]][n_tile[1]] !== undefined) {
				result.push(n_tile)
			}
		}
		
		return result
	}
	
	this.nextPlayer = function() {
		if (this.current_player === 'B') {
			this.current_player = 'W'
		} else {
			this.current_player = 'B'
		}
	}
}

window.onload = function() {
	var new_game = new Abalone
	new_game.startTurn()
}
