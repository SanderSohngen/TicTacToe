const game = (() => {
	const gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const firstMessage = "Pizza Player turn";
	const gameDiv = document.querySelector("#game");

	function startGame() {
		resetBoard(gameDiv);
		while (!gameEnded(gameboard)) playRound(gameboard);
	}

	function resetBoard(gameDiv) {
		gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		const squares = gameDiv.childNodes;
		clearSquares(squares);
		resetMessage();
	}

	function clearSquares(squares) {
		squares.forEach((square) => {
			square.classList.remove("taken-spot");
			square.classList.add("free-spot");
			square.remove(square.firstChild);
		});
	}

	function resetMessage() {
		const message = document.querySelector("#message");
		message.textContent = firstMessage;
	}

	function gameEnded(gameboard) {
		const winRow = checkRows(gameboard);
		const winColumn = checkColumns(gameboard);
		const winDiagonal = checkDiagonals(gameboard);
		return winRow || winColumn || winDiagonal;
	}

	function checkRows(gameboard) {
		for (i = 0; i < gameboard.length; i += 3) {
			if (gameboard[i] === 0) continue;
			const firstColumnPair = gameboard[i] === gameboard[i + 1];
			const secondColumnPair = gameboard[i] === gameboard[i + 2];
			if (firstColumnPair && secondColumnPair) return true;
		}
		return false;
	}

	function checkColumns(gameboard) {
		for (i = 0; i < 3; i++) {
			if (gameboard[i] === 0) continue;
			const firstRowPair = gameboard[i] === gameboard[i + 3];
			const secondRowPair = gameboard[i] === gameboard[i + 6];
			if (firstRowPair && secondRowPair) return true;
		}
		return false;
	}

	function checkDiagonals(gameboard) {
		const centerPiece = gameboard[4];
		if (centerPiece === 0) return false;
		const mainDiagonal =
			centerPiece === gameboard[0] && centerPiece === gameboard[8];
		const minorDiagonal =
			centerPiece === gameboard[2] && centerPiece === gameboard[6];
		return mainDiagonal || minorDiagonal;
	}

	return {
		startGame,
		clearBoard,
	};
})();
