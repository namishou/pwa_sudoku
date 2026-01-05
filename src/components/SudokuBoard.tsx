import { Board, NoteBoard, checkConflicts } from '../utils/sudoku';
import { vibrateLight } from '../utils/vibration';

interface SudokuBoardProps {
  board: Board;
  initialBoard: Board;
  notes: NoteBoard;
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  conflicts: Set<string>;
}

export function SudokuBoard({
  board,
  initialBoard,
  notes,
  selectedCell,
  onCellSelect,
  conflicts
}: SudokuBoardProps) {
  const handleCellClick = (row: number, col: number) => {
    vibrateLight();
    onCellSelect(row, col);
  };

  const getCellClassName = (row: number, col: number) => {
    const classes = ['aspect-square flex items-center justify-center relative transition-all'];

    const isInitial = initialBoard[row][col] !== null;
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isHighlighted = selectedCell &&
      (selectedCell.row === row || selectedCell.col === col ||
       (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.col / 3) === Math.floor(col / 3)));
    const hasConflict = conflicts.has(`${row},${col}`);

    if (isInitial) {
      classes.push('font-bold text-gray-900 dark:text-gray-100');
    } else {
      classes.push('text-blue-600 dark:text-blue-400');
    }

    if (hasConflict) {
      classes.push('bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400');
    } else if (isSelected) {
      classes.push('bg-blue-200 dark:bg-blue-800/50 ring-2 ring-blue-500');
    } else if (isHighlighted) {
      classes.push('bg-blue-50 dark:bg-blue-900/20');
    } else {
      classes.push('bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50');
    }

    const borders = [];
    if (row % 3 === 0) borders.push('border-t-2');
    if (col % 3 === 0) borders.push('border-l-2');
    if (row === 8) borders.push('border-b-2');
    if (col === 8) borders.push('border-r-2');

    if (borders.length === 0) {
      borders.push('border');
    }

    classes.push(...borders);
    classes.push('border-gray-400 dark:border-gray-600');

    return classes.join(' ');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 dark:border-gray-300 rounded-lg overflow-hidden shadow-xl">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellNotes = notes[rowIndex][colIndex];
            const hasNotes = cellNotes.size > 0 && cell === null;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={getCellClassName(rowIndex, colIndex)}
                disabled={initialBoard[rowIndex][colIndex] !== null}
              >
                {cell !== null ? (
                  <span className="text-xl md:text-2xl font-medium">{cell}</span>
                ) : hasNotes ? (
                  <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 text-[8px] md:text-[10px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <div
                        key={num}
                        className="flex items-center justify-center text-gray-500 dark:text-gray-400"
                      >
                        {cellNotes.has(num) ? num : ''}
                      </div>
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
