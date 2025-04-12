'use client';

import { useRef, useState } from 'react';
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

  const rocket1 = useRef(new Rocket(200, 300));
  const rocket2 = useRef(new Rocket(500, 300));

  const controls1 = useKeyboardControls('player1');
  const controls2 = useKeyboardControls('player2');

  const bullets1 = useRef<Bullet[]>([]);
  const bullets2 = useRef<Bullet[]>([]);
  const velocity1 = useRef(0);
  const velocity2 = useRef(0);
  const spacePressed1 = useRef(false);
  const spacePressed2 = useRef(false);

  // Функция для проверки здоровья и определения победителя
  const checkHealth = () => {
    if (rocket1.current.health <= 0) {
      setGameOver(true);
      setWinner('Player 2');
    } else if (rocket2.current.health <= 0) {
      setGameOver(true);
      setWinner('Player 1');
    }
  };

  // Функция для перезапуска игры
  const restartGame = () => {
    rocket1.current = new Rocket(200, 300);
    rocket2.current = new Rocket(500, 300);
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
    <div className="flex flex-col items-center">
      <HealthBar 
        player1Health={rocket1.current.health} 
        player2Health={rocket2.current.health} 
      />
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 p-8 rounded-lg text-center z-10">
          <h2 className="text-4xl font-bold mb-4 text-white">{winner} Wins!</h2>
          <button
            onClick={restartGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
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
  );
}
