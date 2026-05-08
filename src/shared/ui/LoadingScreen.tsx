'use client';

import { useState, useEffect, useRef } from 'react';

const IMAGES = [
  '/bg.png',
  '/rocket-red.png',
  '/rocket-blue.png',
  '/vs.png',
  '/planet-blue.png',
  '/planet-purple.png',
  '/planet-orange.png',
  '/astronaut.png',
  '/rocket.png',
  '/rocket-fire-1.png',
  '/rocket-fire-2.png',
  '/rocket-fire-3.png',
  '/rocket-fire-4.png',
  '/debris-1.png',
  '/debris-2.png',
  '/debris-3.png',
  '/debris-4.png',
  '/space.png',
];

const SOUNDS = [
  '/sounds/main_muz.mp3',
  '/sounds/game_muz.mp3',
  '/sounds/thrust.mp3',
  '/sounds/shoot.mp3',
  '/sounds/hit.mp3',
  '/sounds/boom.mp3',
  '/sounds/hover.mp3',
  '/sounds/click.mp3',
];

const TOTAL = IMAGES.length + SOUNDS.length;

interface Props {
  onReady: () => void;
}

export function LoadingScreen({ onReady }: Props) {
  const [loaded, setLoaded] = useState(0);
  const [complete, setComplete] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      countRef.current += 1;
      setLoaded(countRef.current);
      if (countRef.current >= TOTAL) setComplete(true);
    };

    IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });

    SOUNDS.forEach((src) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        tick();
      };
      const timeout = setTimeout(finish, 8000);
      fetch(src)
        .then(() => { clearTimeout(timeout); finish(); })
        .catch(() => { clearTimeout(timeout); finish(); });
    });
  }, []);

  const progress = Math.min(100, Math.round((loaded / TOTAL) * 100));

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: '#000',
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1
          className="text-7xl font-black tracking-widest uppercase leading-none text-center select-none"
          style={{ textShadow: '2px 2px 0 #000, 0 0 60px rgba(255,255,255,0.15)' }}
        >
          <span style={{ color: '#ff4444', textShadow: '2px 2px 0 #000, 0 0 40px rgba(255,68,68,0.7)' }}>ROCKET </span>
          <span className="text-white">BATTLE</span>
        </h1>

        <div style={{ fontSize: 56, lineHeight: 1 }} className="astronaut-float select-none">
          🚀
        </div>

        <div className="flex flex-col items-center gap-3" style={{ width: 360 }}>
          <div className="flex justify-between w-full text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span>Загрузка ресурсов...</span>
            <span style={{ color: complete ? '#4ade80' : 'rgba(255,255,255,0.6)' }}>{progress}%</span>
          </div>

          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: complete
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : 'linear-gradient(90deg, #ff4444, #ff8800)',
                boxShadow: complete
                  ? '0 0 12px rgba(34,197,94,0.7)'
                  : '0 0 12px rgba(255,68,68,0.6)',
                transition: 'width 0.25s ease, background 0.4s ease, box-shadow 0.4s ease',
              }}
            />
          </div>

          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {loaded} / {TOTAL}
          </div>
        </div>

        <div style={{ height: 64, display: 'flex', alignItems: 'center' }}>
          {complete && (
            <button
              onClick={onReady}
              className="font-black text-2xl tracking-[0.2em] uppercase py-4 px-20 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #2ecc5a 0%, #1a9e3f 100%)',
                border: '2px solid rgba(100,255,140,0.4)',
                boxShadow: '0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                color: '#fff',
                animation: 'readyPop 0.4s ease-out both',
              }}
            >
              ★ READY ★
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
