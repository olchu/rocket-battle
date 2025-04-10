'use client';

import React, { useState, useEffect } from 'react';
import { Sprite } from '@pixi/react';
import { RocketProps, RocketState } from '../model/types';

export const Rocket: React.FC<RocketProps> = ({ x, y, width, height, speed }) => {
  const [state, setState] = useState<RocketState>({
    x,
    y,
    rotation: 0,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setState(prev => {
        const newState = { ...prev };
        
        switch (e.key) {
          case 'ArrowLeft':
            newState.x = Math.max(0, prev.x - speed);
            newState.rotation = -0.1;
            break;
          case 'ArrowRight':
            newState.x = Math.min(window.innerWidth - width, prev.x + speed);
            newState.rotation = 0.1;
            break;
          case 'ArrowUp':
            newState.y = Math.max(0, prev.y - speed);
            break;
          case 'ArrowDown':
            newState.y = Math.min(window.innerHeight - height, prev.y + speed);
            break;
        }
        
        return newState;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setState(prev => ({ ...prev, rotation: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [speed, width, height]);

  return (
    <Sprite
      image="/rocket.png"
      x={state.x}
      y={state.y}
      width={width}
      height={height}
      anchor={0.5}
      rotation={state.rotation}
    />
  );
}; 