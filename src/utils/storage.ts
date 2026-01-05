import { GameState, Board, NoteBoard } from './sudoku';

const STORAGE_KEY = 'sudoku-game-state';

interface SerializedGameState {
  board: Board;
  solution: Board;
  initialBoard: Board;
  notes: number[][][];
  selectedCell: { row: number; col: number } | null;
  isNoteMode: boolean;
  difficulty: string;
  startTime: number;
  mistakes: number;
}

function serializeNotes(notes: NoteBoard): number[][][] {
  return notes.map(row => row.map(cell => Array.from(cell)));
}

function deserializeNotes(notes: number[][][]): NoteBoard {
  return notes.map(row => row.map(cell => new Set(cell)));
}

export function saveGameState(state: GameState): void {
  try {
    const serialized: SerializedGameState = {
      ...state,
      notes: serializeNotes(state.notes)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed: SerializedGameState = JSON.parse(saved);
    return {
      ...parsed,
      notes: deserializeNotes(parsed.notes),
      difficulty: parsed.difficulty as 'easy' | 'medium' | 'hard'
    };
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}
