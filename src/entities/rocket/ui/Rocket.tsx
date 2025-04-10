'use client';

import React from 'react';
import { Sprite, Container, Graphics } from '@pixi/react';
import { useRocketControls } from '@/shared/hooks/useRocketControls';

interface RocketProps {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export const Rocket: React.FC<RocketProps> = ({ x, y, width, height, speed }) => {
  // Используем размеры, которые лучше подходят для MacBook 13 дюймов
  const canvasWidth = 1280;
  const canvasHeight = 800;

  const { position, bullets } = useRocketControls({
    width,
    height,
    speed,
    canvasWidth,
    canvasHeight,
  });

  // Функция для отрисовки пули
  const drawBullet = React.useCallback((g: any) => {
    g.clear();
    g.beginFill(0xFFFF00); // Желтый цвет для пули
    g.drawCircle(0, 0, 5); // Круг радиусом 5 пикселей
    g.endFill();
  }, []);

  return (
    <Container>
      {/* Ракета */}
      <Sprite
        image="/rocket.png"
        x={position.x}
        y={position.y}
        width={width}
        height={height}
        rotation={position.rotation}
        anchor={0.5}
      />
      
      {/* Снаряды */}
      {bullets.map((bullet) => (
        <Container key={bullet.id} x={bullet.x} y={bullet.y} rotation={bullet.rotation}>
          <Graphics draw={drawBullet} />
        </Container>
      ))}
    </Container>
  );
}; 