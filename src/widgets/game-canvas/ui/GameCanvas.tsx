'use client';

import React from 'react';
import { Stage } from '@pixi/react';
import { Rocket } from '@/entities/rocket/ui/Rocket';

export const GameCanvas: React.FC = () => {
  const width = 1280;
  const height = 800;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stage width={width} height={height} options={{ backgroundColor: 0x000000 }}>
        <Rocket x={width / 2} y={height / 2} width={50} height={80} speed={5} />
      </Stage>
    </div>
  );
}; 