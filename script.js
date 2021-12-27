const playerFactory = (() => {
	const Player = (icon, winMessage, turnMessage, marker) => {
		const getIcon = () => icon;
		const getWinnerMessage = () => winMessage;
		const getTurnMessage = () => turnMessage;
		const getMarker = () => marker;
		const isComputer = () => false;
		return {
			getIcon,
			getWinnerMessage,
			getTurnMessage,
			getMarker,
			isComputer,
		};
	};

	const pizzaPlayer = () => {
		const pizza = "img/pizza.svg";
		const winMessage = "Pizza Player won";
		const turnMessage = "Burger Player turn";
		const marker = 1;
		const prototype = Player(pizza, winMessage, turnMessage, marker);
		return prototype;
	};

	const burgerPlayer = () => {
		const burger = "img/burger.svg";
		const winMessage = "Burger Player won";
		const turnMessage = "Pizza Player turn";
		const marker = -1;
		const prototype = Player(burger, winMessage, turnMessage, marker);
		return prototype;
	};

	const compBurguerPlayer = () => {
		const prototype = burgerPlayer();
		const isComputer = () => true;
		const playRound = (gameboard) => {
			const openSlotsCounter = countOpenSlots(gameboard);
			const slotPlayed = findSlotToPlay(gameboard, openSlotsCounter);
			return slotPlayed;
		};
		function countOpenSlots(gameboard) {
			let openSlotsCounter = 0;
			for (let i = 0; i < gameboard.length; i++)
				if (gameboard[i] === 0) openSlotsCounter++;
			return openSlotsCounter;
		}
		function findSlotToPlay(gameboard, openSlotsCounter) {
			const index = Math.floor(Math.random() * openSlotsCounter);
			let openSlots = [];
			for (let i = 0; i < gameboard.length; i++)
				if (gameboard[i] === 0) openSlots.push(i);
			return openSlots[index];
		}
		return Object.assign({}, prototype, { playRound, isComputer });
	};

	return {
		createPizzaPlayer: pizzaPlayer,
		createBurgerPlayer: burgerPlayer,
		createBurgerCompPlayer: compBurguerPlayer,
	};
})();

const game = (() => {
	const gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const waitingMessage = "Select a vs mode";
	const drawMessage = "It's a draw";
	const message = document.querySelector("#message");
	const squares = document.querySelectorAll(".square");

	const pizzaPlayer = playerFactory.createPizzaPlayer();
	let burgerPlayer = playerFactory.createBurgerPlayer();

	const options = {
		humanPlayer: changeToHumanPlayer,
		restart: resetBoard,
		computerPlayer: changeToComputerPlayer,
	};

	const buttons = document.querySelector("#options");
	buttons.addEventListener("click", (event) => {
		const id = event.target.id;
		if (options[id]) options[id]();
	});

	function changeToHumanPlayer() {
		const selectedsID = "humanPlayer";
		const deselectedsID = "computerPlayer";
		highlightVsMode(selectedsID, deselectedsID);
		burgerPlayer = playerFactory.createBurgerPlayer();
		resetBoard();
	}

	function changeToComputerPlayer() {
		const selectedsID = "computerPlayer";
		const deselectedsID = "humanPlayer";
		highlightVsMode(selectedsID, deselectedsID);
		burgerPlayer = playerFactory.createBurgerCompPlayer();
		resetBoard();
	}

	function highlightVsMode(selectedsID, deselectedsID) {
		const selected = document.querySelector(`#${selectedsID}`);
		const deselected = document.querySelector(`#${deselectedsID}`);
		selected.classList.add("selected");
		deselected.classList.remove("selected");
	}

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
		message.textContent = waitingMessage;
	}

	function addListeners(squares) {
		squares.forEach((square) => {
			square.addEventListener("click", playRound);
		});
	}

	function playRound(event) {
		const id = event.target.id;
		const playerTurn = identifyTurn(gameboard);
		console.table(playerTurn);
		placePlay(id, playerTurn, gameboard);
		changeDisplayMessage(playerTurn);
		const gameEnded = checkIfGameEnded(gameboard, playerTurn);
		if (!gameEnded && burgerPlayer.isComputer()) playComputerRound(gameboard);
	}

	function playComputerRound(gameboard) {
		const id = "_" + burgerPlayer.playRound(gameboard);
		const playerTurn = burgerPlayer;
		placePlay(id, playerTurn, gameboard);
		changeDisplayMessage(playerTurn);
		checkIfGameEnded(gameboard, playerTurn);
	}

	function identifyTurn(gameboard) {
		const playerTurn = gameboard.reduce((sum, current) => sum + current);
		return playerTurn === 0 ? pizzaPlayer : burgerPlayer;
	}

	function placePlay(id, playerTurn, gameboard) {
		const idNumber = id[1]; // because HTML id can't be number, they are formated as _number
		gameboard[idNumber] = playerTurn.getMarker();
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
		img.src = playerTurn.getIcon();
		square.appendChild(img);
	}

	function changeDisplayMessage(playerTurn) {
		message.textContent = playerTurn.getTurnMessage();
	}

	function checkIfGameEnded(gameboard, playerTurn) {
		const aPlayerWon =
			checkRows(gameboard) ||
			checkColumns(gameboard) ||
			checkDiagonals(gameboard);
		const reachedDraw = checkDraw(gameboard);
		const gameEnded = aPlayerWon || reachedDraw;
		if (gameEnded) endGame(playerTurn, aPlayerWon);
		return gameEnded;
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
			? playerTurn.getWinnerMessage()
			: drawMessage;
	}

	return {
		resetBoard,
	};
})();

game.resetBoard();
