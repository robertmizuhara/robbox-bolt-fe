export const GAME_TYPES = {
  drawguess: 'Draw & Guess',
  trivia: 'Trivia Master',
  wordplay: 'Word Play',
  partypack: 'Party Pack',
} as const;

export type GameType = keyof typeof GAME_TYPES;

export function getGameDisplayName(gameType: string): string {
  return GAME_TYPES[gameType as GameType] || gameType;
}