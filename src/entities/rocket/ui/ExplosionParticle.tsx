'use client'
import { Container, Sprite } from '@pixi/react'
import { useEffect, useState } from 'react'

interface ParticleProps {
  x: number
  y: number
  angle: number
  speed: number
  rotationSpeed: number
  image: string
  onComplete: () => void
}

// Базовый размер частиц (меньше чем раньше)
const BASE_PARTICLE_SIZE = 15;

export function ExplosionParticle({ 
  x: initialX, 
  y: initialY, 
  angle, 
  speed, 
  rotationSpeed,
  image,
  onComplete 
}: ParticleProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [rotation, setRotation] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [scale, setScale] = useState(1);
  
  // Случайный размер для каждой частицы
  const [size] = useState(() => BASE_PARTICLE_SIZE + (Math.random() - 0.5) * 10);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500; // Длительность анимации
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Нелинейное движение (быстрее в начале, медленнее в конце)
      const moveProgress = Math.pow(progress, 0.7);
      const distance = speed * 100 * moveProgress;
      const rad = angle * (Math.PI / 180);
      
      setPosition({
        x: initialX + Math.cos(rad) * distance,
        y: initialY + Math.sin(rad) * distance
      });

      // Вращение с замедлением
      setRotation(prev => prev + rotationSpeed * (1 - progress * 0.5));

      // Уменьшаем размер со временем
      setScale(1 - progress * 0.5);

      // Прозрачность уменьшается только в конце
      if (progress > 0.7) {
        setAlpha(1 - ((progress - 0.7) / 0.3));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [initialX, initialY, angle, speed, rotationSpeed, onComplete]);

  return (
    <Container x={position.x} y={position.y}>
      <Sprite
        image={image}
        width={size}
        height={size}
        anchor={0.5}
        rotation={rotation}
        alpha={alpha}
        scale={scale}
      />
    </Container>
  );
} 