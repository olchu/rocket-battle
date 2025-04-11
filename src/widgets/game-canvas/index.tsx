'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage } from '@pixi/react';
import { Rocket } from '@/entities/rocket/model/Rocket';
import { RocketView } from '@/entities/rocket/ui/RocketView';
import { Bullet } from '@/entities/bullet/model/Bullet';
import { BulletView } from '@/entities/bullet/ui/BulletView';
import { canvasSize } from '@/shared/constants';

export default function GameCanvas() {
  const [_, forceUpdate] = useState(0);

  const rocket1 = useRef(new Rocket(200, 300));
  const rocket2 = useRef(new Rocket(500, 300));
  const keys = useRef<Record<string, boolean>>({});
  const spacePressed = useRef(false);
  const velocity = useRef(0);
  const maxSpeed = 5;
  const bullets = useRef<Bullet[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;

      if (e.key === ' ') {
        if (!spacePressed.current) {
          spacePressed.current = true;
          const r = rocket1.current;
          const rad = r.angle * (Math.PI / 180);
          const bx = r.x + (Math.cos(rad) * r.width) / 2;
          const by = r.y + (Math.sin(rad) * r.height) / 2;
          const bullet = new Bullet(bx, by, r.angle);
          bullets.current.push(bullet);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let frame: number;
    const loop = () => {
      const r = rocket1.current;

      if (!keys.current[' ']) {
        spacePressed.current = false;
      }

      if (keys.current['ArrowLeft']) r.rotateLeft();
      if (keys.current['ArrowRight']) r.rotateRight();

      if (keys.current['ArrowUp']) {
        velocity.current = Math.min(maxSpeed, velocity.current + 0.1);
      } else if (keys.current['ArrowDown']) {
        velocity.current = Math.max(0, velocity.current - 0.2);
      } else {
        velocity.current = Math.max(0, velocity.current - 0.05);
      }

      const rad = r.angle * (Math.PI / 180);
      r.x += Math.cos(rad) * velocity.current;
      r.y += Math.sin(rad) * velocity.current;
      // Wrap around
      if (r.x < 0) r.x = canvasSize.width;
      if (r.x > canvasSize.width) r.x = 0;
      if (r.y < 0) r.y = canvasSize.height;
      if (r.y > canvasSize.height) r.y = 0;

      bullets.current.forEach((b) => b.update());
      bullets.current = bullets.current.filter((b) => b.isAlive);

      bullets.current.forEach((b) => {
        if (b.checkCollision(rocket2.current)) {
          b.isAlive = false;
          rocket2.current.takeDamage(10);
        }
      });

      forceUpdate((n) => n + 1);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      options={{ backgroundColor: 0x111111 }}
    >
      <RocketView rocket={rocket1.current} image="/rocket.png" />
      <RocketView rocket={rocket2.current} image="/rocket.png" />
      {bullets.current.map((b, i) => (
        <BulletView key={i} bullet={b} />
      ))}
    </Stage>
  );
}
