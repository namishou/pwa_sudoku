import { Eraser, Edit3, X } from 'lucide-react';
import { vibrateLight } from '../utils/vibration';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  isNoteMode: boolean;
  onToggleNoteMode: () => void;
  onClose: () => void;
  isVisible: boolean;
}

export function NumberPad({
  onNumberClick,
  onDelete,
  isNoteMode,
  onToggleNoteMode,
  onClose,
  isVisible
}: NumberPadProps) {
  const handleClick = (num: number) => {
    vibrateLight();
    onNumberClick(num);
  };

  const handleDelete = () => {
    vibrateLight();
    onDelete();
  };

  const handleToggleNote = () => {
    vibrateLight();
    onToggleNoteMode();
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-fadeIn"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl p-3 max-w-sm mx-auto space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">数字を選択</h3>
            <button
              onClick={onClose}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="閉じる"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => {
                  handleClick(num);
                  onClose();
                }}
                className="aspect-square rounded-lg text-lg font-semibold
                  bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700
                  text-white shadow-md hover:shadow-lg
                  transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleToggleNote}
              className={`
                flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium text-sm
                transition-all active:scale-95
                ${isNoteMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md'
                }
              `}
            >
              <Edit3 size={16} />
              <span>メモ</span>
            </button>

            <button
              onClick={() => {
                handleDelete();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium text-sm
                bg-red-500 hover:bg-red-600 text-white
                transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              <Eraser size={16} />
              <span>消去</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
