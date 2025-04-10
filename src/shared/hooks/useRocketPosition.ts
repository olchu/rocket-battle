import { useState, useCallback, useRef } from 'react';

interface RocketPositionProps {
  width: number;
  height: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
  keys: Record<string, boolean>;
}

interface RocketPosition {
  x: number;
  y: number;
  rotation: number;
}

export const useRocketPosition = ({
  width,
  height,
  speed,
  canvasWidth,
  canvasHeight,
  keys,
}: RocketPositionProps) => {
  const [position, setPosition] = useState<RocketPosition>({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    rotation: 0,
  });

  const lastUpdateTime = useRef(Date.now());
  const limitedSpeed = Math.min(speed, 5);

  const updatePosition = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastUpdateTime.current;
    lastUpdateTime.current = now;

    // Обновляем позицию только если прошло достаточно времени
    if (deltaTime < 16) return; // Примерно 60 FPS

    setPosition((prev) => {
      const newPosition = { ...prev };
      let moved = false;

      if (keys['ArrowLeft']) {
        newPosition.x -= limitedSpeed;
        newPosition.rotation = -0.4; // Увеличиваем угол поворота
        moved = true;
      }
      if (keys['ArrowRight']) {
        newPosition.x += limitedSpeed;
        newPosition.rotation = 0.4; // Увеличиваем угол поворота
        moved = true;
      }
      if (keys['ArrowUp']) {
        newPosition.y -= limitedSpeed;
        moved = true;
      }
      if (keys['ArrowDown']) {
        newPosition.y += limitedSpeed;
        moved = true;
      }

      // Обработка выхода за границы по X
      if (newPosition.x < -width) {
        newPosition.x = canvasWidth;
      } else if (newPosition.x > canvasWidth) {
        newPosition.x = 0;
      }

      // Обработка выхода за границы по Y
      if (newPosition.y < -height) {
        newPosition.y = canvasHeight;
      } else if (newPosition.y > canvasHeight) {
        newPosition.y = 0;
      }

      if (!moved) {
        newPosition.rotation = 0;
      }

      return newPosition;
    });
  }, [keys, limitedSpeed, width, height, canvasWidth, canvasHeight]);

  return { position, updatePosition };
}; 