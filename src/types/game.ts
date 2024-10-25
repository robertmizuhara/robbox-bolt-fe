import { z } from 'zod';

export const GameJoinSchema = z.object({
  game_code: z.string().length(4),
  name: z.string().min(2),
  uuid: z.string().optional(),
  is_vip: z.boolean().optional()
});

export const GameCreateSchema = z.object({
  game_type: z.string(),
  name: z.string().min(2)
});

export type GameJoinRequest = z.infer<typeof GameJoinSchema>;
export type GameCreateRequest = z.infer<typeof GameCreateSchema>;

export interface Player {
  id: string;
  name: string;
  isVIP: boolean;
  isConnected: boolean;
}

export interface GameState {
  gameCode: string;
  gameType: string;
  players: Player[];
}
