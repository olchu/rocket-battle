'use client'
import { Sprite, Graphics, Container } from '@pixi/react'
import { Rocket } from '../model/Rocket'
import { useCallback, useState, useEffect } from 'react'
import { COLLISION_RADIUS_MULTIPLIER, COLLISION_OFFSET_X } from '@/shared/constants'
import { ExplosionParticle } from './ExplosionParticle'

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

// Спрайты для частиц взрыва
const EXPLOSION_SPRITES = [
  '/debris-1.png', // Кусок корпуса
  '/debris-2.png', // Часть крыла
  '/debris-3.png', // Часть двигателя
  '/debris-4.png', // Мелкий обломок
];

const ANIMATION_SPEED = 100; // миллисекунды между кадрами

// Количество частиц при взрыве
const EXPLOSION_PARTICLES = 20;

export function RocketView({ rocket, image }: Props) {
  const [fireFrame, setFireFrame] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number;
    angle: number;
    speed: number;
    rotationSpeed: number;
    sprite: string;
  }>>([]);
  const [isExploded, setIsExploded] = useState(false);

  // Сброс состояния взрыва при восстановлении здоровья (перезапуск)
  useEffect(() => {
    if (rocket.health === 100) {
      setIsExploded(false);
      setParticles([]);
    }
  }, [rocket.health]);

  // Проверяем здоровье для создания эффекта взрыва
  useEffect(() => {
    if (rocket.health <= 0 && !isExploded) {
      // Создаем частицы только при полном уничтожении
      const newParticles = Array.from({ length: EXPLOSION_PARTICLES }, (_, i) => ({
        id: Date.now() + i,
        angle: (360 / EXPLOSION_PARTICLES) * i + Math.random() * 30 - 15,
        speed: 3 + Math.random() * 4,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        // Выбираем случайный спрайт из доступных
        sprite: EXPLOSION_SPRITES[Math.floor(Math.random() * EXPLOSION_SPRITES.length)],
      }));
      setParticles(newParticles);
      setIsExploded(true);
    }
  }, [rocket.health, isExploded]);

  // Анимация огня
  useEffect(() => {
    // Сбрасываем на первый кадр при остановке или старте движения
    if (!rocket.isMovingForward) {
      setFireFrame(0);
      return;
    }

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

  const removeParticle = useCallback((id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <>
      {/* Частицы взрыва */}
      {particles.map(particle => (
        <ExplosionParticle
          key={particle.id}
          x={rocket.x}
          y={rocket.y}
          angle={particle.angle}
          speed={particle.speed}
          rotationSpeed={particle.rotationSpeed}
          image={particle.sprite}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
      
      {/* Ракета (показываем только если не взорвана) */}
      {!isExploded && (
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
      )}
    </>
  )
}