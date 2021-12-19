const game = (() => {
	let gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const firstMessage = "Pizza Player turn";
    const secondMessage = "Burguer Player turn";
    const message = document.querySelector("#message");
    const squares = document.querySelectorAll(".square");
    const pizza = "img/pizza.svg";
    const burguer = "img/burger.svg";

	function resetBoard() {
		gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		clearSquares(squares);
		resetMessage();
        addListeners(squares);
	}

	function clearSquares(squares) {
		squares.forEach((square) => {
			square.classList.remove("taken-spot");
			square.classList.add("free-spot");
			if(square.firstChild) square.remove(square.firstChild);
		});
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
        if (gameEnded(gameboard)) endGame();
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
        return img
    }

    function changeDisplayMessage(playerTurn) {
        message.textContent = playerTurn === 1 ? secondMessage : firstMessage;
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

    function endGame() {

    }

    function displayWinnerMessage() {

    }

	return {
		resetBoard,
	};
})();

game.resetBoard();
