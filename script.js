const game = (() => {
	const gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const firstMessage = "Pizza Player turn";
	const secondMessage = "Burguer Player turn";
	const firstWon = "Pizza Player won";
	const secondWon = "Burguer Player won";
	const drawMessage = "It's a draw";
	const message = document.querySelector("#message");
	const squares = document.querySelectorAll(".square");
	const pizza = "img/pizza.svg";
	const burguer = "img/burger.svg";

	function resetBoard() {
		clearGameboard(gameboard);
		clearSquares(squares);
		resetMessage();
		addListeners(squares);
	}

	function clearGameboard(gameboard) {
		for (let i = 0; i < gameboard.length; i++) gameboard[i] = 0;
	}

	function clearSquares(squares) {
		squares.forEach((square) => {
			removeIMG(square);
			square.classList.remove("taken-spot");
			square.classList.add("free-spot");
		});
	}

	function removeIMG(square) {
		const img = square.childNodes[0];
		if (img) square.removeChild(img);
	}

	function resetMessage() {
		message.textContent = firstMessage;
	}

	function addListeners(squares) {
		squares.forEach((square) => {
			square.addEventListener("click", playRound);
		});
	}

	function playRound(event) {
		const id = event.target.id;
		const playerTurn = identifyTurn(gameboard);
		placePlay(id, playerTurn, gameboard);
		changeDisplayMessage(playerTurn);
		if (gameEnded(gameboard)) endGame(playerTurn);
	}

	function identifyTurn(gameboard) {
		const playerTurn = gameboard.reduce((sum, current) => sum + current);
		return playerTurn === 0 ? 1 : -1;
	}

	function placePlay(id, playerTurn, gameboard) {
		const idNumber = id[1];
		gameboard[idNumber] = playerTurn;
		const square = document.querySelector(`#${id}`);
		adjustDivPlayed(square, playerTurn);
	}

	function adjustDivPlayed(square, playerTurn) {
		adjustClasses(square);
		square.removeEventListener("click", playRound);
		const img = createIMG(playerTurn);
		square.appendChild(img);
	}

	function adjustClasses(square) {
		square.classList.add("taken-spot");
		square.classList.remove("free-spot");
	}

	function createIMG(playerTurn) {
		const img = document.createElement("img");
		img.src = playerTurn === 1 ? pizza : burguer;
		img.style.height = "80px";
		return img;
	}

	function changeDisplayMessage(playerTurn) {
		message.textContent = playerTurn === 1 ? secondMessage : firstMessage;
	}

	function gameEnded(gameboard) {
		const draw = checkDraws(gameboard);
		const winRow = checkRows(gameboard);
		const winColumn = checkColumns(gameboard);
		const winDiagonal = checkDiagonals(gameboard);
		return draw || winRow || winColumn || winDiagonal;
	}

	function checkDraws(gameboard) {
		return gameboard.every((position) => position !== 0);
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

	function endGame(playerTurn) {
		removeAllListeners(squares);
		displayWinnerMessage(playerTurn);
	}

	function removeAllListeners(squares) {
		squares.forEach((square) => {
			square.removeEventListener("click", playRound);
		});
	}

	function displayWinnerMessage(playerTurn) {
		message.textContent = checkDraws(gameboard)
			? drawMessage
			: playerTurn === 1
			? firstWon
			: secondWon;
	}

	return {
		resetBoard,
	};
})();

game.resetBoard();

const restart = document.querySelector("#restart");
restart.addEventListener("click", game.resetBoard);
