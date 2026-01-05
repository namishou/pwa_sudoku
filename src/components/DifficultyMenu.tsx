import { Moon, Sun, Play } from 'lucide-react';
import { Difficulty } from '../utils/sudoku';
import { vibrateLight } from '../utils/vibration';

interface DifficultyMenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onContinueGame: (() => void) | null;
  isDark: boolean;
  onToggleDark: () => void;
}

const difficulties: { value: Difficulty; label: string; description: string; color: string }[] = [
  { value: 'easy', label: '初級', description: '初心者向け', color: 'bg-green-500 hover:bg-green-600' },
  { value: 'medium', label: '中級', description: '適度な難易度', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { value: 'hard', label: '上級', description: '上級者向け', color: 'bg-red-500 hover:bg-red-600' }
];

export function DifficultyMenu({
  onSelectDifficulty,
  onContinueGame,
  isDark,
  onToggleDark
}: DifficultyMenuProps) {
  const handleSelect = (difficulty: Difficulty) => {
    vibrateLight();
    onSelectDifficulty(difficulty);
  };

  const handleContinue = () => {
    vibrateLight();
    if (onContinueGame) onContinueGame();
  };

  const handleToggleDark = () => {
    vibrateLight();
    onToggleDark();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleToggleDark}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all active:scale-95"
          aria-label="ダークモード切り替え"
        >
          {isDark ? (
            <Sun size={24} className="text-yellow-500" />
          ) : (
            <Moon size={24} className="text-indigo-600" />
          )}
        </button>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            AIナンプレ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">難易度を選択してください</p>
        </div>

        <div className="space-y-3">
          {onContinueGame && (
            <button
              onClick={handleContinue}
              className="w-full py-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Play size={24} />
              続きから
            </button>
          )}

          {difficulties.map(({ value, label, description, color }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`
                w-full py-5 rounded-xl text-white font-bold text-lg
                shadow-lg hover:shadow-xl transition-all active:scale-98
                ${color}
              `}
            >
              <div>{label}</div>
              <div className="text-sm font-normal opacity-90">{description}</div>
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          オフラインでも遊べます
        </div>
      </div>
    </div>
  );
}
