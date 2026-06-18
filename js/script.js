const Player = (name, marker) => {
  return { name, marker };
};

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

const GameController = (() => {
  const player1 = Player("Ivan", "X");
  const player2 = Player("John", "O");

  let currentPlayer = player1;
  let gameStatus;

  const switchPlayers = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
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

  return { playRound, getCurrentPlayer, getGameStatus, resetGame };
})();

const ScreenController = (() => {
  const boardElem = document.querySelector(".board");
  const resultElem = document.querySelector(".result");
  const currPlayerElem = document.querySelector(".currPlayer");
  const resetBtn = document.querySelector(".resetBtn");

  const updateScreen = () => {
    let board = Gameboard.getBoard();

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = board[cell.dataset.row][cell.dataset.col];
    });

    currPlayerElem.textContent = `Your turn, ${GameController.getCurrentPlayer().name} (${GameController.getCurrentPlayer().marker})`;
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("cell")) {
      if (GameController.getGameStatus()) {
        return;
      } else {
        GameController.playRound(e.target.dataset.row, e.target.dataset.col);
        updateScreen();
      }
    }

    if (GameController.getGameStatus()) {
      resultElem.textContent = GameController.getGameStatus();
      currPlayerElem.classList.add('hide');
      resetBtn.classList.add("show");
    }
  };

  resetBtn.addEventListener("click", () => {
    resetBtn.classList.remove("show");
    currPlayerElem.classList.remove('hide');
    GameController.resetGame();
    resultElem.textContent = "";
    updateScreen();
  });

  boardElem.addEventListener("click", handleClick);

  return { updateScreen };
})();

ScreenController.updateScreen();
