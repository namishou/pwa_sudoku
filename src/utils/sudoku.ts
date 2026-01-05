export type Difficulty = 'easy' | 'medium' | 'hard';
export type CellValue = number | null;
export type Board = CellValue[][];
export type NoteBoard = Set<number>[][];

export interface GameState {
  board: Board;
  solution: Board;
  initialBoard: Board;
  notes: NoteBoard;
  selectedCell: { row: number; col: number } | null;
  isNoteMode: boolean;
  difficulty: Difficulty;
  startTime: number;
  mistakes: number;
}

const EMPTY = null;
const SIZE = 9;
const BOX_SIZE = 3;

export function createEmptyBoard(): Board {
  return Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY));
}

export function createEmptyNotes(): NoteBoard {
  return Array(SIZE).fill(null).map(() =>
    Array(SIZE).fill(null).map(() => new Set<number>())
  );
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num) return false;
  }

  for (let i = 0; i < SIZE; i++) {
    if (board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: Board): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === EMPTY) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = EMPTY;
          }
        }

        return false;
      }
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateFullBoard(): Board {
  const board = createEmptyBoard();
  solveSudoku(board);
  return board;
}

function removeNumbers(board: Board, difficulty: Difficulty): Board {
  const puzzle = board.map(row => [...row]);

  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55
  }[difficulty];

  let removed = 0;
  const attempts = cellsToRemove * 3;

  for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);

    if (puzzle[row][col] !== EMPTY) {
      puzzle[row][col] = EMPTY;
      removed++;
    }
  }

  return puzzle;
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution = generateFullBoard();
  const puzzle = removeNumbers(solution, difficulty);

  return {
    puzzle: puzzle.map(row => [...row]),
    solution: solution.map(row => [...row])
  };
}

export function checkConflicts(board: Board, row: number, col: number): {
  hasConflict: boolean;
  conflicts: { row: number; col: number }[];
} {
  const conflicts: { row: number; col: number }[] = [];
  const value = board[row][col];

  if (value === EMPTY) {
    return { hasConflict: false, conflicts };
  }

  for (let i = 0; i < SIZE; i++) {
    if (i !== col && board[row][i] === value) {
      conflicts.push({ row, col: i });
    }
  }

  for (let i = 0; i < SIZE; i++) {
    if (i !== row && board[i][col] === value) {
      conflicts.push({ row: i, col });
    }
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if ((r !== row || c !== col) && board[r][c] === value) {
        if (!conflicts.some(conf => conf.row === r && conf.col === c)) {
          conflicts.push({ row: r, col: c });
        }
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}

export function isBoardComplete(board: Board, solution: Board): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}
