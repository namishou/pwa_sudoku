export function vibrateLight(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

export function vibrateMedium(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
}

export function vibrateError(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 50, 50]);
  }
}

export function vibrateSuccess(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 100, 50, 100, 100]);
  }
}
