const Player = (name, marker) => {
  return { name, marker };
};

const Gameboard = (() => {
  const gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const showGameBoard = () => {
    console.log(JSON.stringify(gameBoard));
  };

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

  return { showGameBoard, getBoard, putMarker, clearBoard };
})();

const GameController = (() => {
  const player1 = Player("Ivan", "X");
  const player2 = Player("John", "O");

  let currentPlayer = player1;

  const switchPlayers = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const defineResult = () => {
    const gameBoard = Gameboard.getBoard();
    let isTie = false;
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
        console.log(`The Winner is ${currentPlayer.name}!`);
        Gameboard.clearBoard();
        return true;
      }
    }

    //tie
    if (lines.every((line) => !line.includes(""))) {
      console.log(`Tie!`);
      Gameboard.clearBoard();
      return true;
    }

    return false;
  };

  const playRound = (row, col) => {
    if (Gameboard.putMarker(row, col, currentPlayer.marker) !== null) {
      Gameboard.showGameBoard();

      if (!defineResult()) {
        switchPlayers();
      }
    }
  };

  return { playRound };
})();

