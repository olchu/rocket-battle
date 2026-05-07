import { useEffect, useRef } from 'react';

type ControlState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
};

const keyMappings: Record<
  'player1' | 'player2',
  Record<string, Partial<ControlState>>
> = {
  player1: {
    KeyW: { up: true },
    KeyS: { down: true },
    KeyA: { left: true },
    KeyD: { right: true },
    KeyF: { fire: true },
  },
  player2: {
    ArrowUp: { up: true },
    ArrowDown: { down: true },
    ArrowLeft: { left: true },
    ArrowRight: { right: true },
    Space: { fire: true },
  },
};

export function useKeyboardControls(player: 'player1' | 'player2') {
  const state = useRef<ControlState>({
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
  });

  useEffect(() => {
    const handle = (e: KeyboardEvent, isDown: boolean) => {
      const mapping = keyMappings[player];
      const config = mapping[e.code];
      if (config) {
        Object.keys(config).forEach((key) => {
          state.current[key as keyof ControlState] = isDown;
        });
      }
    };

    const down = (e: KeyboardEvent) => handle(e, true);
    const up = (e: KeyboardEvent) => handle(e, false);

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [player]);

  return state;
}
