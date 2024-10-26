import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { GameLobby } from '../components/GameLobby';

interface GameState {
  gameCode: string;
  clientUuid: string;
}

export function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as GameState;

  useEffect(() => {
    if (!state?.gameCode || !state?.clientUuid) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.gameCode || !state?.clientUuid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header />
      <GameLobby gameCode={state.gameCode} clientUuid={state.clientUuid} />
    </div>
  );
}