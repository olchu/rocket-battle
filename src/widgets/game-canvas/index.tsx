'use client';

import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Container, Sprite, Stage, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Rocket } from '@/entities/rocket/model/Rocket';
import { RocketView } from '@/entities/rocket/ui/RocketView';
import { Bullet } from '@/entities/bullet/model/Bullet';
import { useKeyboardControls } from '@/features/keyboard-controls/useKeyboardControls';
import { useGameLoop } from '@/features/game-loop/useGameLoop';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/shared/constants';
import { HealthBar } from '@/shared/ui/HealthBar';
import { useGameSounds } from '@/shared/hooks/useGameSounds';

const START_GAP = 75;

type Planet = { x: number; y: number; vx: number; vy: number; speed: number; scale: number; image: string; alpha: number };

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

const angleToVel = (angle: number, speed: number) => ({
  vx: Math.cos(angle) * speed,
  vy: Math.sin(angle) * speed,
});

const spawnOffScreen = (p: Planet, w: number, h: number) => {
  const half = p.scale * 700;
  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) {
    p.x = -half; p.y = rnd(0, h);
    Object.assign(p, angleToVel(rnd(-Math.PI / 3, Math.PI / 3), p.speed));
  } else if (edge === 1) {
    p.x = w + half; p.y = rnd(0, h);
    Object.assign(p, angleToVel(rnd(Math.PI * 2 / 3, Math.PI * 4 / 3), p.speed));
  } else if (edge === 2) {
    p.x = rnd(0, w); p.y = -half;
    Object.assign(p, angleToVel(rnd(Math.PI / 6, Math.PI * 5 / 6), p.speed));
  } else {
    p.x = rnd(0, w); p.y = h + half;
    Object.assign(p, angleToVel(rnd(-Math.PI * 5 / 6, -Math.PI / 6), p.speed));
  }
};

const createPlanets = (w: number, h: number): Planet[] =>
  [
    { scale: 0.09, image: '/planet-blue.png',   sectorBase: 0,                    speed: 0.05  },
    { scale: 0.13, image: '/planet-purple.png', sectorBase: (Math.PI * 2) / 3,   speed: 0.025 },
    { scale: 0.06, image: '/planet-orange.png', sectorBase: (Math.PI * 4) / 3,   speed: 0.09  },
  ].map(({ scale, image, sectorBase, speed }) => {
    const angle = sectorBase + rnd(-Math.PI / 3, Math.PI / 3);
    const { vx, vy } = angleToVel(angle, speed);
    return { x: rnd(0, w), y: rnd(0, h), vx, vy, speed, scale, image, alpha: 1 };
  });

const createStartingRockets = (width: number, height: number) => ({
  rocket1: new Rocket(width / 2 - START_GAP, height / 2, 180),
  rocket2: new Rocket(width / 2 + START_GAP, height / 2, 0),
});

// Планеты — полностью внутри PixiJS, без React re-render
function PlanetsLayer() {
  const containerRef = useRef<PIXI.Container>(null);
  const planetsRef = useRef<Planet[]>([]);
  const spritesRef = useRef<PIXI.Sprite[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const planets = createPlanets(window.innerWidth, window.innerHeight);
    planetsRef.current = planets;
    planets.forEach((p) => {
      const sprite = PIXI.Sprite.from(p.image);
      sprite.anchor.set(0.5);
      sprite.scale.set(p.scale);
      sprite.x = p.x;
      sprite.y = p.y;
      container.addChild(sprite);
      spritesRef.current.push(sprite);
    });
    return () => {
      spritesRef.current.forEach((s) => { try { s.destroy() } catch (_) {} });
      spritesRef.current = [];
    };
  }, []);

  useTick((delta) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    planetsRef.current.forEach((p, i) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      const half = p.scale * 700;
      if (p.x > w + half || p.x < -half || p.y > h + half || p.y < -half) {
        spawnOffScreen(p, w, h);
      }
      const sprite = spritesRef.current[i];
      if (sprite) {
        sprite.x = p.x;
        sprite.y = p.y;
      }
    });
  });

  return <Container ref={containerRef} />;
}

// Пули — полностью внутри PixiJS, без React re-render
function BulletsLayer({ bulletsRef }: { bulletsRef: MutableRefObject<Bullet[]> }) {
  const containerRef = useRef<PIXI.Container>(null);

  useTick(() => {
    const container = containerRef.current;
    if (!container) return;
    const bullets = bulletsRef.current;

    while (container.children.length < bullets.length) {
      const g = new PIXI.Graphics();
      g.beginFill(0xffff00);
      g.drawCircle(0, 0, 3);
      g.endFill();
      container.addChild(g);
    }
    while (container.children.length > bullets.length) {
      const child = container.removeChildAt(container.children.length - 1);
      (child as PIXI.Graphics).destroy();
    }
    bullets.forEach((b, i) => {
      const child = container.children[i] as PIXI.Container;
      child.x = b.x;
      child.y = b.y;
    });
  });

  return <Container ref={containerRef} />;
}

// Игровая логика через PixiJS тикер — без React re-render
function GameTick({ tick1, tick2, gameActiveRef }: {
  tick1: (delta: number) => void;
  tick2: (delta: number) => void;
  gameActiveRef: MutableRefObject<boolean>;
}) {
  useTick((delta) => {
    if (gameActiveRef.current) {
      tick1(delta);
      tick2(delta);
    }
  });
  return null;
}

export default function GameCanvas() {
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'Player 1' | 'Player 2' | null>(null);
  const [windowSize, setWindowSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const [countdown, setCountdown] = useState<number | 'GO!' | null>(null);
  const [health1, setHealth1] = useState(100);
  const [health2, setHealth2] = useState(100);
  const countdownTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const rocket1 = useRef(new Rocket(CANVAS_WIDTH / 2 - START_GAP, CANVAS_HEIGHT / 2, 180));
  const rocket2 = useRef(new Rocket(CANVAS_WIDTH / 2 + START_GAP, CANVAS_HEIGHT / 2, 0));

  const controls1 = useKeyboardControls('player1');
  const controls2 = useKeyboardControls('player2');

  const bullets1 = useRef<Bullet[]>([]);
  const bullets2 = useRef<Bullet[]>([]);
  const velocity1 = useRef(0);
  const velocity2 = useRef(0);
  const spacePressed1 = useRef(false);
  const spacePressed2 = useRef(false);

  const startCountdown = useCallback(() => {
    countdownTimers.current.forEach(clearTimeout);
    setCountdown(3);
    countdownTimers.current = [
      setTimeout(() => setCountdown(2), 1000),
      setTimeout(() => setCountdown(1), 2000),
      setTimeout(() => setCountdown('GO!'), 3000),
      setTimeout(() => setCountdown(null), 3800),
    ];
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const { rocket1: r1, rocket2: r2 } = createStartingRockets(w, h);
      rocket1.current = r1;
      rocket2.current = r2;
      setWindowSize({ width: w, height: h });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => countdownTimers.current.forEach(clearTimeout);
  }, [startCountdown]);

  const checkHealth = useCallback(() => {
    const h1 = rocket1.current.health;
    const h2 = rocket2.current.health;
    setHealth1(h1);
    setHealth2(h2);
    if (h1 <= 0) {
      setGameOver(true);
      setWinner('Player 2');
    } else if (h2 <= 0) {
      setGameOver(true);
      setWinner('Player 1');
    }
  }, []);

  const restartGame = () => {
    const { rocket1: r1, rocket2: r2 } = createStartingRockets(windowSize.width, windowSize.height);
    rocket1.current = r1;
    rocket2.current = r2;
    bullets1.current = [];
    bullets2.current = [];
    velocity1.current = 0;
    velocity2.current = 0;
    setGameOver(false);
    setWinner(null);
    setHealth1(100);
    setHealth2(100);
    startCountdown();
  };

  const sounds = useGameSounds();

  useEffect(() => {
    if (countdown === null && !gameOver) {
      sounds.playMusic();
    } else {
      sounds.stopMusic();
    }
  }, [countdown, gameOver]);

  const gameActiveRef = useRef(false);
  gameActiveRef.current = !gameOver && countdown === null;

  const tick1 = useGameLoop({
    rocket: rocket1,
    opponent: rocket2,
    bullets: bullets1,
    velocity: velocity1,
    controls: controls1,
    spacePressed: spacePressed1,
    onHit: checkHealth,
    onThrust: sounds.setThrust1,
    onShoot: sounds.playShoot,
    onHitSound: sounds.playHit,
  });

  const tick2 = useGameLoop({
    rocket: rocket2,
    opponent: rocket1,
    bullets: bullets2,
    velocity: velocity2,
    controls: controls2,
    spacePressed: spacePressed2,
    onHit: checkHealth,
    onThrust: sounds.setThrust2,
    onShoot: sounds.playShoot,
    onHitSound: sounds.playHit,
  });

  return (
    <div className="fixed inset-0">
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        options={{ backgroundColor: 0x111111 }}
        style={{ display: 'block' }}
      >
        <Sprite
          image="/bg.png"
          x={0}
          y={0}
          width={windowSize.width}
          height={windowSize.height}
        />
        <PlanetsLayer />
        <GameTick tick1={tick1} tick2={tick2} gameActiveRef={gameActiveRef} />
        <RocketView rocketRef={rocket1} health={health1} image="/rocket.png" />
        <RocketView rocketRef={rocket2} health={health2} image="/rocket.png" />
        <BulletsLayer bulletsRef={bullets1} />
        <BulletsLayer bulletsRef={bullets2} />
      </Stage>

      <div className="absolute top-4 left-4 right-4 z-10">
        <HealthBar player1Health={health1} player2Health={health2} />
      </div>

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <span
            key={String(countdown)}
            className={countdown === 'GO!' ? 'countdown-go' : 'countdown-number'}
            style={{
              fontSize: countdown === 'GO!' ? '7rem' : '14rem',
              fontWeight: '900',
              color: 'white',
              textShadow: '0 0 60px rgba(255,255,255,0.5), 0 4px 30px rgba(0,0,0,0.9)',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {countdown}
          </span>
        </div>
      )}

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
