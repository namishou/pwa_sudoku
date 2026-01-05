import { useState, useEffect, useCallback } from 'react';
import {
  generatePuzzle,
  checkConflicts,
  isBoardComplete,
  createEmptyNotes,
  Difficulty,
  GameState
} from './utils/sudoku';
import { saveGameState, loadGameState, clearGameState } from './utils/storage';
import { vibrateError, vibrateSuccess, vibrateMedium } from './utils/vibration';
import { useDarkMode } from './hooks/useDarkMode';
import { SudokuBoard } from './components/SudokuBoard';
import { NumberPad } from './components/NumberPad';
import { GameHeader } from './components/GameHeader';
import { DifficultyMenu } from './components/DifficultyMenu';
import { CompletionModal } from './components/CompletionModal';
import { InstallPrompt } from './components/InstallPrompt';

type GameScreen = 'menu' | 'game';

function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setGameState(saved);
    }
  }, []);

  useEffect(() => {
    if (gameState && screen === 'game') {
      saveGameState(gameState);

      const newConflicts = new Set<string>();
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (gameState.board[row][col] !== null) {
            const { hasConflict, conflicts: cellConflicts } = checkConflicts(
              gameState.board,
              row,
              col
            );
            if (hasConflict) {
              newConflicts.add(`${row},${col}`);
              cellConflicts.forEach(c => newConflicts.add(`${c.row},${c.col}`));
            }
          }
        }
      }
      setConflicts(newConflicts);

      if (isBoardComplete(gameState.board, gameState.solution)) {
        vibrateSuccess();
        setIsComplete(true);
      }
    }
  }, [gameState, screen]);

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty);

    const newGameState: GameState = {
      board: puzzle.map(row => [...row]),
      solution: solution.map(row => [...row]),
      initialBoard: puzzle.map(row => [...row]),
      notes: createEmptyNotes(),
      selectedCell: null,
      isNoteMode: false,
      difficulty,
      startTime: Date.now(),
      mistakes: 0
    };

    setGameState(newGameState);
    setIsComplete(false);
    setScreen('game');
  }, []);

  const continueGame = useCallback(() => {
    if (gameState) {
      setScreen('game');
    }
  }, [gameState]);

  const backToMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleCellSelect = useCallback((row: number, col: number) => {
    if (!gameState) return;

    if (gameState.initialBoard[row][col] !== null) {
      vibrateMedium();
      return;
    }

    setGameState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        selectedCell: { row, col }
      };
    });
  }, [gameState]);

  const handleNumberClick = useCallback((num: number) => {
    if (!gameState || !gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;

    if (gameState.initialBoard[row][col] !== null) {
      vibrateMedium();
      return;
    }

    setGameState(prev => {
      if (!prev) return prev;

      const newBoard = prev.board.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => new Set(c)));

      if (prev.isNoteMode) {
        if (newNotes[row][col].has(num)) {
          newNotes[row][col].delete(num);
        } else {
          newNotes[row][col].add(num);
        }
      } else {
        newBoard[row][col] = num;
        newNotes[row][col].clear();

        const { hasConflict } = checkConflicts(newBoard, row, col);
        if (hasConflict) {
          vibrateError();
        }
      }

      return {
        ...prev,
        board: newBoard,
        notes: newNotes
      };
    });
  }, [gameState]);

  const handleDelete = useCallback(() => {
    if (!gameState || !gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;

    if (gameState.initialBoard[row][col] !== null) {
      vibrateMedium();
      return;
    }

    setGameState(prev => {
      if (!prev) return prev;

      const newBoard = prev.board.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => new Set(c)));

      newBoard[row][col] = null;
      newNotes[row][col].clear();

      return {
        ...prev,
        board: newBoard,
        notes: newNotes
      };
    });
  }, [gameState]);

  const handleToggleNoteMode = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isNoteMode: !prev.isNoteMode
      };
    });
  }, []);

  const handleNewGame = useCallback(() => {
    if (gameState) {
      setIsComplete(false);
      startNewGame(gameState.difficulty);
    }
  }, [gameState, startNewGame]);

  const handleBackToMenuFromGame = useCallback(() => {
    clearGameState();
    setGameState(null);
    setIsComplete(false);
    backToMenu();
  }, [backToMenu]);

  if (screen === 'menu') {
    return (
      <>
        <DifficultyMenu
          onSelectDifficulty={startNewGame}
          onContinueGame={gameState ? continueGame : null}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
        />
        <InstallPrompt />
      </>
    );
  }

  if (!gameState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <GameHeader
        difficulty={gameState.difficulty}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onNewGame={handleNewGame}
        onBackToMenu={handleBackToMenuFromGame}
      />

      <div className="flex-1 flex flex-col justify-center p-4 overflow-hidden">
        <SudokuBoard
          board={gameState.board}
          initialBoard={gameState.initialBoard}
          notes={gameState.notes}
          selectedCell={gameState.selectedCell}
          onCellSelect={handleCellSelect}
          conflicts={conflicts}
        />
      </div>

      <NumberPad
        onNumberClick={handleNumberClick}
        onDelete={handleDelete}
        isNoteMode={gameState.isNoteMode}
        onToggleNoteMode={handleToggleNoteMode}
        onClose={() => setGameState(prev => prev ? { ...prev, selectedCell: null } : null)}
        isVisible={!!gameState.selectedCell && gameState.initialBoard[gameState.selectedCell.row][gameState.selectedCell.col] === null}
      />

      {isComplete && (
        <CompletionModal
          difficulty={gameState.difficulty}
          onNewGame={handleNewGame}
          onBackToMenu={handleBackToMenuFromGame}
        />
      )}

      <InstallPrompt />
    </div>
  );
}

export default App;
