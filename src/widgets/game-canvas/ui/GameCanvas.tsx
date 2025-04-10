'use client';

import { Stage, Container } from '@pixi/react';
import { GameProps } from '@/entities/game/model/types';
import { Rocket } from '@/entities/rocket/ui/Rocket';

export const GameCanvas = ({ width, height }: GameProps) => {
  return (
    <Stage width={width} height={height} options={{ backgroundColor: 0x111111 }}>
      <Container>
        <Rocket
          x={width / 2}
          y={height / 2}
          width={60}
          height={30}
          speed={5}
        />
      </Container>
    </Stage>
  );
}; 