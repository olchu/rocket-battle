import { useCallback, useRef, useEffect } from 'react';
import { useRocketPosition } from './useRocketPosition';
import { useBullets } from './useBullets';
import { useKeyboardControls } from './useKeyboardControls';

interface RocketControlsProps {
  width: number;
  height: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
}

export const useRocketControls = ({
  width,
  height,
  speed,
  canvasWidth,
  canvasHeight,
}: RocketControlsProps) => {
  // Получаем состояние клавиш
  const keys = useKeyboardControls();
  
  // Получаем позицию ракеты
  const { position, updatePosition } = useRocketPosition({
    width,
    height,
    speed,
    canvasWidth,
    canvasHeight,
    keys,
  });
  
  // Получаем пули
  const { bullets, updateBullets } = useBullets({
    width,
    height,
    canvasWidth,
    canvasHeight,
    position,
    isSpacePressed: keys[' '] || false,
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
