import { useCallback, useRef, useEffect } from 'react';
import { usePlayerPosition } from './usePlayerPosition';
import { useBullets } from './useBullets';
import { useKeyboardControls } from './useKeyboardControls';

interface SecondPlayerControlsProps {
  width: number;
  height: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
}

export const useSecondPlayerControls = ({
  width,
  height,
  speed,
  canvasWidth,
  canvasHeight,
}: SecondPlayerControlsProps) => {
  // Получаем состояние клавиш
  const keys = useKeyboardControls();

  // Получаем позицию ракеты
  const { position, updatePosition } = usePlayerPosition({
    width,
    height,
    speed,
    canvasWidth,
    canvasHeight,
    leftKey: keys['a'] || false,
    rightKey: keys['d'] || false,
    upKey: keys['w'] || false,
    downKey: keys['s'] || false,
  });

  // Получаем пули
  const { bullets, updateBullets } = useBullets({
    width,
    height,
    canvasWidth,
    canvasHeight,
    position,
    isSpacePressed: keys['shift'] || false,
  });

  // Используем requestAnimationFrame для анимации
  const animationFrameId = useRef<number>();

  // Функция обновления состояния
  const update = useCallback(() => {
    updatePosition();
    updateBullets();
  }, [updatePosition, updateBullets]);

  // Запускаем анимацию
  useEffect(() => {
    const animate = () => {
      update();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [update]);

  return { position, bullets };
};
