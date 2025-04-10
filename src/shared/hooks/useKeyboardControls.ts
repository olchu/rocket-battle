import { useState, useEffect } from 'react';

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Преобразуем клавишу в нижний регистр для единообразия
      const key = e.key.toLowerCase();
      
      
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'w', 'a', 's', 'd', 'shift'].includes(key)) {
        e.preventDefault();
        setKeys((prev) => {
          const newKeys = { ...prev, [key]: true };
          return newKeys;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Преобразуем клавишу в нижний регистр для единообразия
      const key = e.key.toLowerCase();
      
      
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'w', 'a', 's', 'd', 'shift'].includes(key)) {
        e.preventDefault();
        setKeys((prev) => {
          const newKeys = { ...prev, [key]: false };
          return newKeys;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}; 