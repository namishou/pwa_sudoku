import { Trophy, Home, RotateCcw } from 'lucide-react';
import { Difficulty } from '../utils/sudoku';
import { vibrateLight } from '../utils/vibration';

interface CompletionModalProps {
  difficulty: Difficulty;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: '初級',
  medium: '中級',
  hard: '上級'
};

export function CompletionModal({
  difficulty,
  onNewGame,
  onBackToMenu
}: CompletionModalProps) {
  const handleNewGame = () => {
    vibrateLight();
    onNewGame();
  };

  const handleBackToMenu = () => {
    vibrateLight();
    onBackToMenu();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-6 animate-scaleIn">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full animate-bounce">
            <Trophy size={64} className="text-yellow-500" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            完成です!
          </h2>

          <p className="text-gray-600 dark:text-gray-400">
            {difficultyLabels[difficulty]}をクリアしました
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleNewGame}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            もう一度
          </button>

          <button
            onClick={handleBackToMenu}
            className="w-full py-4 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-bold text-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            メニューに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
