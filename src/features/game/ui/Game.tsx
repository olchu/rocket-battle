'use client';

import { useState } from 'react';
import { GameCanvas } from '@/widgets/game-canvas/ui/GameCanvas';
import { GameState } from '@/entities/game/model/types';

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    score: 0,
  });

  return (
    <div className="game-container">
      <GameCanvas width={800} height={600} />
      <div className="game-controls">
        <button onClick={() => setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }))}>
          {gameState.isRunning ? 'Pause' : 'Start'}
        </button>
        <div>Score: {gameState.score}</div>
      </div>
    </div>
  );
}; 