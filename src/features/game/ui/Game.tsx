'use client';

import { useState } from 'react';
import { GameCanvas } from '@/widgets/game-canvas/ui/GameCanvas';
import { GameState } from '@/entities/game/model/types';

export const Game = () => {
 

  return (
    <div className="game-container">
      <GameCanvas />
    </div>
  );
};
