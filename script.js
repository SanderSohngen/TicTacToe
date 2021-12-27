const game = (() => {
	const gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const firstMessage = "Pizza Player turn";
	const secondMessage = "Burger Player turn";
	const firstWon = "Pizza Player won";
	const secondWon = "Burger Player won";
	const drawMessage = "It's a draw";
	const message = document.querySelector("#message");
	const squares = document.querySelectorAll(".square");
	const pizza = "img/pizza.svg";
	const burger = "img/burger.svg";

	const restart = document.querySelector("#restart");
	restart.addEventListener("click", resetBoard);

	function resetBoard() {
		clearGameboard(gameboard);
		resetMessage();
		addListeners(squares);
	}

	function clearGameboard(gameboard) {
		for (let i = 0; i < gameboard.length; i++) gameboard[i] = 0;
		clearSquares(squares);
	}

	function clearSquares(squares) {
		squares.forEach((square) => {
			removeImages(square);
			square.classList.remove("taken-spot");
			square.classList.add("free-spot");
		});
	}

	function removeImages(square) {
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
		checkIfGameEnded(gameboard, playerTurn);
	}

	function identifyTurn(gameboard) {
		const playerTurn = gameboard.reduce((sum, current) => sum + current);
		return playerTurn === 0 ? 1 : -1;
	}

	function placePlay(id, playerTurn, gameboard) {
		const idNumber = id[1]; // because HTML id can't be number, they are formated as _number
		gameboard[idNumber] = playerTurn;
		const square = document.querySelector(`#${id}`);
		adjustDivPlayed(square, playerTurn);
	}

	function adjustDivPlayed(square, playerTurn) {
		toggleClasses(square);
		square.removeEventListener("click", playRound);
		appendImageToSquare(square, playerTurn);
	}

	function toggleClasses(square) {
		square.classList.add("taken-spot");
		square.classList.remove("free-spot");
	}

	function appendImageToSquare(square, playerTurn) {
		const img = document.createElement("img");
		img.src = playerTurn === 1 ? pizza : burger;
		square.appendChild(img);
	}

	function changeDisplayMessage(playerTurn) {
		message.textContent = playerTurn === 1 ? secondMessage : firstMessage;
	}

	function checkIfGameEnded(gameboard, playerTurn) {
		const aPlayerWon =
			checkRows(gameboard) ||
			checkColumns(gameboard) ||
			checkDiagonals(gameboard);
		const reachedDraw = checkDraw(gameboard);
		const gameEnded = aPlayerWon || reachedDraw;
		if (gameEnded) endGame(playerTurn, aPlayerWon);
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

	function checkDraw(gameboard) {
		return gameboard.every((position) => position !== 0);
	}

	function endGame(playerTurn, aPlayerWon) {
		removeAllListeners(squares);
		displayWinnerMessage(playerTurn, aPlayerWon);
	}

	function removeAllListeners(squares) {
		squares.forEach((square) => {
			square.removeEventListener("click", playRound);
		});
	}

	function displayWinnerMessage(playerTurn, aPlayerWon) {
		message.textContent = aPlayerWon
			? playerTurn === 1
				? firstWon
				: secondWon
			: drawMessage;
	}

	return {
		resetBoard,
	};
})();

game.resetBoard();

const playerFactory = (() => {
	const Player = (icon, winMessage, turnMessage, marker) => {
		const getIcon = () => icon;
		const displayWinnerMessage = () => winMessage;
		const displayTurnMessage = () => turnMessage;
		const getMarker = () => marker;
		return { getIcon, displayWinnerMessage, displayTurnMessage, getMarker};
	};

	const pizzaPlayer = () => {
		const pizza = "img/pizza.svg";
		const winMessage = "Pizza Player won";
		const turnMessage = "Pizza Player turn";
		const marker = 1;
		const prototype = Player(pizza, winMessage, turnMessage, marker);
		return prototype;
	};

	const burgerPlayer = () => {
		const burger = "img/burger.svg";
		const winMessage = "Burger Player won";
		const turnMessage = "Burger Player turn";
		const marker = -1;
		const prototype = Player(burger, winMessage, turnMessage, marker);
		return prototype;
	};

	const compBurguerPlayer = () => {
		const prototype = burgerPlayer();
		const playRound = (gameboard) => {
			const openSlots = countOpenSlots(gameboard);
			const slotPlayed = findSlotToPlay(gameboard, openSlots);
			return slotPlayed;
		};
		function countOpenSlots(gameboard) {
			const openSlots = 0;
			for (let i = 0; i < gameboard.length; i++)
				if (gameboard[i] === 0) openSlots++;
			return openSlots;
		}
		function findSlotToPlay(gameboard, openSlots) {
			const index = Math.floor(Math.random() * openSlots);
			let openSlots = [];
			for (let i = 0; i < gameboard.length; i++)
				if(gameboard[i] === 0) openSlots.push(i);
			return openSlots[index];
		}
		return Object.assign({}, prototype, {playRound});
	};

	createPizzaPlayer = () => pizzaPlayer;
	createBurgerPlayer = () => burgerPlayer;
	createBurgerCompPlayer = () => compBurguerPlayer;

	return {
		createPizzaPlayer,
		createBurgerPlayer,
		createBurgerCompPlayer,
	}
})();
