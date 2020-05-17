const createBoard = (rows, columns) => {
  return Array.fill(rows).map((_, row) => {
    return Array(columns)
      .fill(0)
      .map((__, column) => {
        return {
          row,
          column,
          opened: false,
          flagged: false,
          mined: false,
          exploded: false,
          nearMines: 0,
        };
      });
  });
};

const spreaMines = (board, minesAmount) => {
  const rows = board.length;
  const columns = board[0].length;
  let minesPlanted = 0;

  while (minesPlanted < minesAmount) {
    const rowSel = parseInt(Math.random() * rows, 10);
    const colSel = parseInt(Math.random() * columns, 10);

    if (!board[rowSel][colSel].mined) {
      board[rowSel][colSel].mined = true;
      minesPlanted++;
    }
  }
};

const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreaMines(board, minesAmount);

  return board;
};

const cloneBoard = (board) => {
  return board.map((rows) => {
    return rows.map((field) => {
      return { ...field };
    });
  });
};

const getNeighbors = (board, row, column) => {
  const neighbors = [];
  const rows = [row - 1, row, row + 1];
  const columns = [column - 1, column, column + 1];
  rows.forEach((r) => {
    columns.forEach((c) => {
      const diferent = r !== row || c !== column;
      const validRow = r >= 0 && r < board.length;
      const validColumn = c >= 0 && c < board[0].length;

      if (diferent && validRow && validColumn) {
        neighbors.push(board[r][c]);
      }
    });
  });

  return neighbors;
};

const safeNeighborhood = (board, row, column) => {
  const safes = (result, neighbor) => result && !neighbor.mined;

  return getNeighbors(board, row, column).reduce(safes, true);
};

const openField = (board, row, column) => {
  const field = board[row][column];
  const neighbors = getNeighbors(board, row, column);

  if (!field.opened) {
    field.opened = true;
    if (field.mined) {
      field.exploded = true;
    } else if (safeNeighborhood(board, row, column)) {
      neighbors.forEach((neighbor) =>
        openField(board, neighbor.row, neighbor.column),
      );
    } else {
      field.nearMines = neighbors.filter((n) => n.mined).length;
    }
  }
};

const fields = (board) => [].concat(...board);

const hadExplosion = (board) =>
  fields(board).filter((field) => field.exploded).length > 0;

const pendding = (field) =>
  (field.mined && !field.flagged) || (!field.mined && !field.opened);

const wonGame = (board) => fields(board).filter(pendding).length === 0;

const showMines = (board) =>
  fields(board)
    .filter((field) => field.mined)
    .forEach((field) => (field.opened = true));

const invertFlag = (board, row, column) => {
  const field = board[row][column];
  field.flagged = !field.flagged;
}

const flagsUsed = (board) => fields(board).filter((field) => field.flagged).length;

export {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
};