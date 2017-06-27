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
	
	this.colorOf = function(position) {
		return this.board[position[0]][position[1]]
	}
	
	this.move = function(sel, dir) {
		var color = this.colorOf(sel[0])
		console.log(color)
		for (var n = 0; n < sel.length; n++) {
			this.board[sel[n][0]][sel[n][1]] = ' '
		}
		for (var n = 0; n < sel.length; n++) {
			this.board[sel[n][0] + dir[0]][sel[n][1] + dir[1]] = color
		}
	}
}

var initiateBoard = function(board) {
	for (var i = 0; i < board.length; i++) {
		var row = document.createElement('div')
		row.className = 'row'
		for (var j = 0; j < board[i].length; j++) {
			var tile = document.createElement('div')
			tile.className = 'tile'
			tile.id = `${i}${j}`
			tile.addEventListener('click', function(event) {
				console.log(this.id)
			})
		
			var img = document.createElement('img')
			var color = board[i][j]
			if (color == 'W') {
				img.src = 'images/plainwhiteball.png'
			} else if (color == 'B') {
				img.src = 'images/plainblackball.png'
			} else {
				img.src = 'images/plaintile.png'
			}
			tile.appendChild(img)
			row.appendChild(tile)
		
		}
		var game = document.querySelector('#game')
		game.appendChild(row)
	}
}

initiateBoard(standard_board)