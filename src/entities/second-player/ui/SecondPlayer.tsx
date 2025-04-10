'use client';

import React from 'react';
import { Sprite, Container, Graphics } from '@pixi/react';
import { useSecondPlayerControls } from '@/shared/hooks/useSecondPlayerControls';

interface SecondPlayerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export const SecondPlayer: React.FC<SecondPlayerProps> = ({ x, y, width, height, speed }) => {
  // Используем размеры, которые лучше подходят для MacBook 13 дюймов
  const canvasWidth = 1280;
  const canvasHeight = 800;

  const { position, bullets } = useSecondPlayerControls({
    width,
    height,
    speed,
    canvasWidth,
    canvasHeight,
  });

  // Функция для отрисовки пули
  const drawBullet = React.useCallback((g: any) => {
    g.clear();
    g.beginFill(0xFF0000); // Красный цвет для пули второго игрока
    g.drawCircle(0, 0, 5); // Круг радиусом 5 пикселей
    g.endFill();
  }, []);

  return (
    <Container>
      {/* Ракета второго игрока */}
      <Sprite
        image="/rocket.png"
        x={position.x}
        y={position.y}
        width={width}
        height={height}
        rotation={position.rotation}
        anchor={0.5}
        tint={0xFF0000} // Красный цвет для ракеты второго игрока
      />
      
      {/* Снаряды второго игрока */}
      {bullets.map((bullet) => (
        <Container key={bullet.id} x={bullet.x} y={bullet.y} rotation={bullet.rotation}>
          <Graphics draw={drawBullet} />
        </Container>
      ))}
    </Container>
  );
}; 