'use client'
import { Sprite, Graphics, Container } from '@pixi/react'
import { Rocket } from '../model/Rocket'
import { useCallback } from 'react'
import { COLLISION_RADIUS_MULTIPLIER, COLLISION_OFFSET_X } from '@/shared/constants'

interface Props {
  rocket: Rocket
  image: string
}

export function RocketView({ rocket, image }: Props) {
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

  return (
    <Container
      x={rocket.x}
      y={rocket.y}
      rotation={(rocket.angle * Math.PI) / 180}
      anchor={0.5}
    >
      {/* Отладочная рамка */}
      <Graphics draw={drawDebugBorder} />
      
      <Sprite
        image={image}
        width={rocket.width}
        height={rocket.height}
        anchor={0.5}
      />
    </Container>
  )
}