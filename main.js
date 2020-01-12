var origBoard;
const human = 'X';
const ai = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

const restartBtn = document.querySelector('#restart');
restartBtn.addEventListener('click', e => {startGame()});

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
  // if the clicked square is empty (not 'X' or 'O')
  // here we get the id of the square element, which is equivalent to the index of our board array
	if (typeof origBoard[square.target.id] == 'number') {
    // human player allowed to turn the square
		turn(square.target.id, human)
    // make the ai turn the best spot! (if not win or tie already)
		if (!checkWin(origBoard, human) && !checkTie()) {
      turn(bestSpot(), ai);
    }
	}
}

// mark the square with the given mark
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let wonPattern = checkWin(origBoard, player)
	if (wonPattern) gameOver(wonPattern)
}

function checkWin(board, mark) {
  // concat index of squares marked with player's mark into an array
	let marked = board.reduce((arr, el, idx) =>
		((el === mark) ? arr.concat(idx) : arr), []);
  // won pattern of the current mark, default null
	let wonPattern = null;
  // for each entry of winPatterns
	for (let [idx, winPattern] of winCombos.entries()) {
    // if each element of winPattern is found in the marked board
		if (winPattern.every(el => marked.indexOf(el) > -1)) {
      // won, assign the index of the winning entry and current mark
			wonPattern = {idx, mark};
			break;
		}
	}
	return wonPattern;
}

function gameOver(wonPattern) {
	for (let idx of winCombos[wonPattern.idx]) {
		document.getElementById(idx).style.backgroundColor =
			wonPattern.mark == human ? "#ccff33" : "#ff6600";
	}
  cells.forEach(el => el.removeEventListener('click', turnClick))
	declareWinner(wonPattern.mark == human ? "YOU WON!" : "YOU LOST");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(val => typeof val == 'number');
}

function bestSpot() {
	return minimax(origBoard, ai).index;
}

function checkTie() {
  // if all filled up
	if (emptySquares().length === 0) {
    cells.forEach(el => {
      el.style.backgroundColor = '#ffcc00';
			el.removeEventListener('click', turnClick);
    });
		declareWinner("TIE!")
		return true;
	}
	return false;
}

function minimax(newBoard, mark) {
	var currentEmptySquares = emptySquares();

	if (checkWin(newBoard, human)) {
		return {score: -10};
	} else if (checkWin(newBoard, ai)) {
		return {score: 10};
	} else if (currentEmptySquares.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < currentEmptySquares.length; i++) {
		var move = {};
		move.index = newBoard[currentEmptySquares[i]];
    // mark the temp board
		newBoard[currentEmptySquares[i]] = mark;

		if (mark == ai) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, ai);
			move.score = result.score;
		}

		newBoard[currentEmptySquares[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(mark === ai) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}