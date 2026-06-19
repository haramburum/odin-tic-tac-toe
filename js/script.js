const Player = (name, marker) => {
  return { name, marker };
};

//GAMEBOARD
const Gameboard = (() => {
  const gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const putMarker = (row, column, marker) => {
    if (gameBoard[row][column] !== "") {
      return null;
    } else {
      gameBoard[row][column] = marker;
    }
  };

  const clearBoard = () => {
    gameBoard.forEach((row) => row.fill(""));
  };

  const getBoard = () => gameBoard;

  return { getBoard, putMarker, clearBoard };
})();

//GAME CONTROLLER
const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let gameStatus;

  const switchPlayers = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const setPlayers = (name1, name2) => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    currentPlayer = player1;
  };

  const defineResult = () => {
    const gameBoard = Gameboard.getBoard();

    let line1 = [gameBoard[0][0], gameBoard[0][1], gameBoard[0][2]];
    let line2 = [gameBoard[1][0], gameBoard[1][1], gameBoard[1][2]];
    let line3 = [gameBoard[2][0], gameBoard[2][1], gameBoard[2][2]];
    let line4 = [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]];
    let line5 = [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]];
    let line6 = [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]];
    let line7 = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
    let line8 = [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]];

    let lines = [line1, line2, line3, line4, line5, line6, line7, line8];

    //winner
    for (let line of lines) {
      if (line.every((cell) => cell === line[0]) && line[0] !== "") {
        gameStatus = "win";
        return true;
      }
    }

    //tie
    if (!gameBoard.flat().includes("")) {
      gameStatus = "tie";
      return true;
    }

    return false;
  };

  const getCurrentPlayer = () => currentPlayer;

  const playRound = (row, col) => {
    if (Gameboard.putMarker(row, col, currentPlayer.marker) !== null) {
      if (!defineResult()) {
        switchPlayers();
      }
    }
  };

  const getGameStatus = () => {
    if (gameStatus === "win") {
      return `The winner is ${currentPlayer.name}`;
    } else if (gameStatus === "tie") {
      return `Tie!`;
    } else {
      return false;
    }
  };

  const resetGame = () => {
    Gameboard.clearBoard();
    gameStatus = null;
    currentPlayer = player1;
  };

  return {
    playRound,
    getCurrentPlayer,
    getGameStatus,
    resetGame,
    setPlayers,
  };
})();

//SCREEN CONTROLLER
(function ScreenController() {
  const boardElem = document.querySelector(".board");
  const resultElem = document.querySelector(".result");
  const currPlayerElem = document.querySelector(".currPlayer");
  const resetBtn = document.querySelector(".resetBtn");
  const startBtn = document.querySelector(".welcome__startBrn");
  const welcomeDiv = document.querySelector(".welcome");
  const container = document.querySelector(".container");
  const newGameBtn = document.querySelector(".newGameBtn");
  const player1Inpt = document.querySelector(".welcome__player1");
  const player2Inpt = document.querySelector(".welcome__player2");

  const newGameHandler = () => {
    container.classList.add("hide");
    welcomeDiv.classList.remove("hide");
    wipeScreenData();
  };

  const startBtnHandler = (e) => {
    e.preventDefault();
    const player1Name = player1Inpt.value || "Player 1";
    const player2Name = player2Inpt.value || "Player 2";
    player1Inpt.value = "";
    player2Inpt.value = "";
    GameController.setPlayers(player1Name, player2Name);
    container.classList.remove("hide");
    welcomeDiv.classList.add("hide");
    updateScreen();
  };

  const cellClickHandler = (e) => {
    if (e.target.classList.contains("cell")) {
      if (GameController.getGameStatus()) {
        return;
      } else {
        let cell = e.target;
        GameController.playRound(cell.dataset.row, cell.dataset.col);
        updateScreen();
      }
    }

    if (GameController.getGameStatus()) {
      resultElem.textContent = GameController.getGameStatus();
      currPlayerElem.classList.add("hide");
      newGameBtn.classList.add("show");
      resetBtn.classList.add("show");
    }
  };

  const resetBtnHandler = () => {
    wipeScreenData();
  };

  const updateScreen = () => {
    let board = Gameboard.getBoard();

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = board[cell.dataset.row][cell.dataset.col];
    });

    currPlayerElem.textContent = `Your turn, ${GameController.getCurrentPlayer().name} (${GameController.getCurrentPlayer().marker})`;
  };

  const wipeScreenData = () => {
    GameController.resetGame();
    resetBtn.classList.remove("show");
    newGameBtn.classList.remove("show");
    currPlayerElem.classList.remove("hide");
    resultElem.textContent = "";
    updateScreen();
  };

  resetBtn.addEventListener("click", resetBtnHandler);
  newGameBtn.addEventListener("click", newGameHandler);
  startBtn.addEventListener("click", startBtnHandler);
  boardElem.addEventListener("click", cellClickHandler);

  return { updateScreen };
})();
