import { useState, useCallback, useRef, useEffect } from 'react';

interface RocketControlsProps {
  width: number;
  height: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface RocketPosition {
  x: number;
  y: number;
  rotation: number;
}

export const useRocketControls = ({
  width,
  height,
  speed,
  canvasWidth,
  canvasHeight,
}: RocketControlsProps) => {
  const [position, setPosition] = useState<RocketPosition>({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    rotation: 0,
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const lastUpdateTime = useRef(Date.now());
  const animationFrameId = useRef<number>();

  const limitedSpeed = Math.min(speed, 7);

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
        newPosition.rotation = -0.5;
        moved = true;
      }
      if (keys['ArrowRight']) {
        newPosition.x += limitedSpeed;
        newPosition.rotation = 0.5;
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setKeys((prev) => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setKeys((prev) => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const animate = () => {
      updatePosition();
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updatePosition]);

  return position;
};
