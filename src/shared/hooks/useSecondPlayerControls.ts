import { useEffect, useRef, useState } from 'react';

type Params = {
  width: number;
  height: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
};

type BulletState = {
  id: string;
  x: number;
  y: number;
  rotation: number;
};

type Position = {
  x: number;
  y: number;
  rotation: number;
};

type BulletRef = {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  isAlive: boolean;
};

export function useSecondPlayerControls({ width, height, speed, canvasWidth, canvasHeight }: Params) {
  const [position, setPosition] = useState<Position>({
    x: canvasWidth / 2 + 75,
    y: canvasHeight / 2,
    rotation: 0,
  });
  const [bullets, setBullets] = useState<BulletState[]>([]);

  const posRef = useRef({ x: canvasWidth / 2 + 75, y: canvasHeight / 2, angle: 0 });
  const velocityRef = useRef(0);
  const bulletsRef = useRef<BulletRef[]>([]);
  const spacePressed = useRef(false);
  const keysRef = useRef({ up: false, down: false, left: false, right: false, fire: false });
  const bulletCounter = useRef(0);

  useEffect(() => {
    const handle = (e: KeyboardEvent, isDown: boolean) => {
      const map: Record<string, keyof typeof keysRef.current> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        Space: 'fire',
      };
      const key = map[e.code];
      if (key) {
        if (e.code === 'Space') e.preventDefault();
        keysRef.current[key] = isDown;
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
  }, []);

  useEffect(() => {
    let frame: number;
    const maxSpeed = 3;
    const bulletSpeed = 8;

    const loop = () => {
      const keys = keysRef.current;
      const pos = posRef.current;

      if (keys.left) pos.angle -= 1.5;
      if (keys.right) pos.angle += 1.5;

      if (keys.up) {
        velocityRef.current = Math.min(maxSpeed, velocityRef.current + 0.06);
      } else if (keys.down) {
        velocityRef.current = Math.max(0, velocityRef.current - 0.12);
      } else {
        velocityRef.current = Math.max(0, velocityRef.current - 0.03);
      }

      const rad = pos.angle * (Math.PI / 180);
      pos.x += Math.cos(rad) * velocityRef.current;
      pos.y += Math.sin(rad) * velocityRef.current;

      if (pos.x < 0) pos.x = canvasWidth;
      if (pos.x > canvasWidth) pos.x = 0;
      if (pos.y < 0) pos.y = canvasHeight;
      if (pos.y > canvasHeight) pos.y = 0;

      if (keys.fire && !spacePressed.current) {
        spacePressed.current = true;
        bulletCounter.current += 1;
        bulletsRef.current.push({
          id: `b2-${bulletCounter.current}`,
          x: pos.x + Math.cos(rad) * (width / 2),
          y: pos.y + Math.sin(rad) * (width / 2),
          angle: pos.angle,
          speed: bulletSpeed,
          isAlive: true,
        });
      }
      if (!keys.fire) spacePressed.current = false;

      bulletsRef.current.forEach((b) => {
        const brad = b.angle * (Math.PI / 180);
        b.x += Math.cos(brad) * b.speed;
        b.y += Math.sin(brad) * b.speed;
        if (b.x < 0 || b.x > canvasWidth || b.y < 0 || b.y > canvasHeight) {
          b.isAlive = false;
        }
      });
      bulletsRef.current = bulletsRef.current.filter((b) => b.isAlive);

      setPosition({ x: pos.x, y: pos.y, rotation: rad });
      setBullets(
        bulletsRef.current.map((b) => ({
          id: b.id,
          x: b.x,
          y: b.y,
          rotation: b.angle * (Math.PI / 180),
        }))
      );

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [width, height, speed, canvasWidth, canvasHeight]);

  return { position, bullets };
}
