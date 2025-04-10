import { useState, useCallback, useRef } from 'react';

interface PlayerPositionProps {
  width: number;
  height: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
  leftKey: boolean;
  rightKey: boolean;
  upKey: boolean;
  downKey: boolean;
}

interface PlayerPosition {
  x: number;
  y: number;
  rotation: number;
}

export const usePlayerPosition = ({
  width,
  height,
  speed,
  canvasWidth,
  canvasHeight,
  leftKey,
  rightKey,
  upKey,
  downKey,
}: PlayerPositionProps) => {
  const [position, setPosition] = useState<PlayerPosition>({
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

      if (leftKey) {
        newPosition.x -= limitedSpeed;
        newPosition.rotation = -0.4; // Увеличиваем угол поворота
        moved = true;
      }
      if (rightKey) {
        newPosition.x += limitedSpeed;
        newPosition.rotation = 0.4; // Увеличиваем угол поворота
        moved = true;
      }
      if (upKey) {
        newPosition.y -= limitedSpeed;
        moved = true;
      }
      if (downKey) {
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
  }, [leftKey, rightKey, upKey, downKey, limitedSpeed, width, height, canvasWidth, canvasHeight]);

  return { position, updatePosition };
}; 