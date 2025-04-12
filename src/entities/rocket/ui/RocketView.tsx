'use client'
import { Sprite, Graphics, Container } from '@pixi/react'
import { Rocket } from '../model/Rocket'
import { useCallback, useState, useEffect } from 'react'
import { COLLISION_RADIUS_MULTIPLIER, COLLISION_OFFSET_X } from '@/shared/constants'

interface Props {
  rocket: Rocket
  image: string
}

const FIRE_ANIMATION_FRAMES = [
  '/rocket-fire-1.png',
  '/rocket-fire-2.png',
  '/rocket-fire-3.png',
  '/rocket-fire-4.png',
];

const ANIMATION_SPEED = 100; // миллисекунды между кадрами

export function RocketView({ rocket, image }: Props) {
  const [fireFrame, setFireFrame] = useState(0);

  // Анимация огня
  useEffect(() => {
    if (!rocket.isMovingForward) return;

    const interval = setInterval(() => {
      setFireFrame((prev) => (prev + 1) % FIRE_ANIMATION_FRAMES.length);
    }, ANIMATION_SPEED);

    return () => clearInterval(interval);
  }, [rocket.isMovingForward]);

  // Функция для отрисовки отладочной рамки
  const drawDebugBorder = useCallback((g: any) => {
    g.clear();
    
    // Рисуем основную рамку ракеты
    g.lineStyle(2, 0xFF0000, 1);
    g.drawRect(-rocket.width / 2, -rocket.height / 2, rocket.width, rocket.height);
    
    // Рисуем центр ракеты
    g.lineStyle(0);
    g.beginFill(0xFF0000);
    g.drawCircle(0, 0, 3);
    g.endFill();
    
    // Рисуем фиксированную круглую область столкновения
    g.lineStyle(1, 0x00FF00, 0.5);
    const collisionRadius = Math.max(rocket.width, rocket.height) * COLLISION_RADIUS_MULTIPLIER;
    g.drawCircle(COLLISION_OFFSET_X, 0, collisionRadius);
  }, [rocket.width, rocket.height]);

  // Определяем какой спрайт использовать
  const rocketImage = rocket.isMovingForward 
    ? FIRE_ANIMATION_FRAMES[fireFrame]
    : image;

  return (
    <Container
      x={rocket.x}
      y={rocket.y}
      rotation={(rocket.angle * Math.PI) / 180}
      anchor={0.5}
    >
      {/* Отладочная рамка */}
      {/* <Graphics draw={drawDebugBorder} /> */}
      
      <Sprite
        image={rocketImage}
        width={rocket.width}
        height={rocket.height}
        anchor={0.5}
      />
    </Container>
  )
}