import { Moon, Sun, RotateCcw, Home } from 'lucide-react';
import { Difficulty } from '../utils/sudoku';
import { vibrateLight } from '../utils/vibration';

interface GameHeaderProps {
  difficulty: Difficulty;
  isDark: boolean;
  onToggleDark: () => void;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: '初級',
  medium: '中級',
  hard: '上級'
};

export function GameHeader({
  difficulty,
  isDark,
  onToggleDark,
  onNewGame,
  onBackToMenu
}: GameHeaderProps) {
  const handleToggleDark = () => {
    vibrateLight();
    onToggleDark();
  };

  const handleNewGame = () => {
    vibrateLight();
    onNewGame();
  };

  const handleBackToMenu = () => {
    vibrateLight();
    onBackToMenu();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-md">
      <button
        onClick={handleBackToMenu}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="メニューに戻る"
      >
        <Home size={24} className="text-gray-700 dark:text-gray-300" />
      </button>

      <div className="flex items-center gap-2">
        <div className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium text-sm">
          {difficultyLabels[difficulty]}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleNewGame}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="新しいゲーム"
        >
          <RotateCcw size={24} className="text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleToggleDark}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="ダークモード切り替え"
        >
          {isDark ? (
            <Sun size={24} className="text-gray-300" />
          ) : (
            <Moon size={24} className="text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
