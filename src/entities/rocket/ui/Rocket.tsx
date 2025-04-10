'use client';

import React from 'react';
import { Sprite } from '@pixi/react';
import { RocketProps } from '../model/types';
import { useRocketControls } from '@/shared/hooks/useRocketControls';

export const Rocket: React.FC<RocketProps> = ({ x, y, width, height, speed }) => {
  // Используем размеры, которые лучше подходят для MacBook 13 дюймов
  const canvasWidth = 1280;
  const canvasHeight = 800;

  const position = useRocketControls({ 
    width, 
    height, 
    speed,
    canvasWidth,
    canvasHeight
  });

  return (
    <Sprite
      image="/rocket.png"
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      anchor={0.5}
      rotation={position.rotation}
    />
  );
}; 