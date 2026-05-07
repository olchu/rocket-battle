'use client';

import { useEffect, useRef, useState } from 'react';
import { Sprite, Stage } from '@pixi/react';
import { Rocket } from '@/entities/rocket/model/Rocket';
import { RocketView } from '@/entities/rocket/ui/RocketView';
import { Bullet } from '@/entities/bullet/model/Bullet';
import { BulletView } from '@/entities/bullet/ui/BulletView';
import { useKeyboardControls } from '@/features/keyboard-controls/useKeyboardControls';
import { useGameLoop } from '@/features/game-loop/useGameLoop';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/shared/constants';
import { HealthBar } from '@/shared/ui/HealthBar';

export default function GameCanvas() {
  const [tick, forceUpdate] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'Player 1' | 'Player 2' | null>(null);
  const [scale, setScale] = useState(1);

  const rocket1 = useRef(new Rocket(200, CANVAS_HEIGHT / 2, 0));
  const rocket2 = useRef(new Rocket(CANVAS_WIDTH - 200, CANVAS_HEIGHT / 2, 180));

  const controls1 = useKeyboardControls('player1');
  const controls2 = useKeyboardControls('player2');

  const bullets1 = useRef<Bullet[]>([]);
  const bullets2 = useRef<Bullet[]>([]);
  const velocity1 = useRef(0);
  const velocity2 = useRef(0);
  const spacePressed1 = useRef(false);
  const spacePressed2 = useRef(false);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / CANVAS_WIDTH;
      const scaleY = window.innerHeight / CANVAS_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const checkHealth = () => {
    if (rocket1.current.health <= 0) {
      setGameOver(true);
      setWinner('Player 2');
    } else if (rocket2.current.health <= 0) {
      setGameOver(true);
      setWinner('Player 1');
    }
  };

  const restartGame = () => {
    rocket1.current = new Rocket(200, CANVAS_HEIGHT / 2, 0);
    rocket2.current = new Rocket(CANVAS_WIDTH - 200, CANVAS_HEIGHT / 2, 180);
    bullets1.current = [];
    bullets2.current = [];
    velocity1.current = 0;
    velocity2.current = 0;
    setGameOver(false);
    setWinner(null);
  };

  useGameLoop({
    rocket: rocket1,
    opponent: rocket2,
    bullets: bullets1,
    velocity: velocity1,
    controls: controls1,
    spacePressed: spacePressed1,
    forceUpdate,
    enabled: !gameOver,
    onHit: checkHealth,
  });

  useGameLoop({
    rocket: rocket2,
    opponent: rocket1,
    bullets: bullets2,
    velocity: velocity2,
    controls: controls2,
    spacePressed: spacePressed2,
    forceUpdate,
    enabled: !gameOver,
    onHit: checkHealth,
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Stage
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          options={{ backgroundColor: 0x111111 }}
        >
          <Sprite
            image="/space.png"
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          />
          <RocketView rocket={rocket1.current} image="/rocket.png" />
          <RocketView rocket={rocket2.current} image="/rocket.png" />
          {bullets1.current.map((b, i) => (
            <BulletView key={`b1-${i}`} bullet={b} />
          ))}
          {bullets2.current.map((b, i) => (
            <BulletView key={`b2-${i}`} bullet={b} />
          ))}
        </Stage>
      </div>

      <div className="absolute top-4 left-4 right-4 z-10">
        <HealthBar
          player1Health={rocket1.current.health}
          player2Health={rocket2.current.health}
        />
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-black/80 p-8 rounded-lg text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">{winner} Wins!</h2>
            <button
              onClick={restartGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
