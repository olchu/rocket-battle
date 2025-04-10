import { useState, useCallback, useRef, useEffect } from 'react';

interface BulletProps {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
  position: {
    x: number;
    y: number;
    rotation: number;
  };
  isSpacePressed: boolean;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  rotation: number;
  speed: number;
}

export const useBullets = ({
  width,
  height,
  canvasWidth,
  canvasHeight,
  position,
  isSpacePressed,
}: BulletProps) => {
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const bulletIdCounter = useRef(0);
  const lastShotTime = useRef(0);
  const shotCooldown = 250; // Задержка между выстрелами в миллисекундах
  const wasSpacePressed = useRef(false);

  const createBullet = useCallback(() => {
    const now = Date.now();
    if (now - lastShotTime.current < shotCooldown) return;
    
    lastShotTime.current = now;
    const bulletId = bulletIdCounter.current++;
    
    // Вычисляем позицию пули в верхней части ракеты
    // Используем тригонометрию для определения точки вылета
    const bulletOffset = height / 2; // Смещение от центра ракеты
    const bulletX = position.x + Math.sin(position.rotation) * bulletOffset;
    const bulletY = position.y - Math.cos(position.rotation) * bulletOffset;
    
    // Создаем снаряд в позиции ракеты
    const newBullet: Bullet = {
      id: bulletId,
      x: bulletX,
      y: bulletY,
      rotation: position.rotation,
      speed: 10, // Скорость снаряда
    };
    
    setBullets(prev => [...prev, newBullet]);
  }, [position, height]);

  const updateBullets = useCallback(() => {
    setBullets(prev => {
      return prev
        .map(bullet => {
          // Обновляем позицию снаряда в зависимости от его поворота
          const dx = Math.sin(bullet.rotation) * bullet.speed;
          const dy = -Math.cos(bullet.rotation) * bullet.speed;
          
          return {
            ...bullet,
            x: bullet.x + dx,
            y: bullet.y + dy,
          };
        })
        .filter(bullet => {
          // Удаляем снаряды, вышедшие за пределы экрана
          return (
            bullet.x >= -width &&
            bullet.x <= canvasWidth &&
            bullet.y >= -height &&
            bullet.y <= canvasHeight
          );
        });
    });
  }, [width, height, canvasWidth, canvasHeight]);

  // Создаем пулю при отжатии пробела
  useEffect(() => {
    // Если пробел был нажат, а теперь отжат - стреляем
    if (wasSpacePressed.current && !isSpacePressed) {
      createBullet();
    }
    
    // Сохраняем текущее состояние для следующего вызова
    wasSpacePressed.current = isSpacePressed;
  }, [isSpacePressed, createBullet]);

  return { bullets, updateBullets };
}; 