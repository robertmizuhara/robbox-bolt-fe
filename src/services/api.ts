import { GameCreateRequest, GameJoinRequest } from '../types/game';

const API_BASE = 'http://localhost:8000/api';

export async function joinGame(request: GameJoinRequest) {
  const response = await fetch(`${API_BASE}/join-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Failed to join game: ${response.statusText}`);
  }

  return response.json();
}

export async function createGame(request: GameCreateRequest) {
  const response = await fetch(`${API_BASE}/create-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Failed to create game: ${response.statusText}`);
  }

  return response.json();
}