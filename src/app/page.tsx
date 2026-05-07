import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-white overflow-hidden relative"
      style={{ backgroundImage: 'url(/space.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="max-w-4xl w-full flex flex-col items-center gap-8 relative z-10">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-7xl font-black tracking-widest uppercase leading-none">
            <span style={{ color: '#ff4444', textShadow: '0 0 40px rgba(255,68,68,0.8)' }}>ROCKET </span>
            <span style={{ textShadow: '0 0 40px rgba(255,255,255,0.4)' }}>BATTLE</span>
          </h1>
          <p className="mt-3 font-bold tracking-[0.3em] uppercase text-sm" style={{ color: '#f0c040' }}>
            Two Players &bull; One Screen &bull; No Mercy
          </p>
        </div>

        {/* VS */}
        <div className="flex items-center justify-center gap-16 w-full">
          <div style={{
            filter: 'hue-rotate(340deg) saturate(3) drop-shadow(0 0 18px #ff4444)',
            transform: 'rotate(-12deg)',
          }}>
            <Image src="/rocket.png" alt="Player 1" width={110} height={110} />
          </div>
          <span
            className="text-8xl font-black"
            style={{ color: '#ff3377', textShadow: '0 0 40px rgba(255,51,119,0.9), 0 0 80px rgba(255,51,119,0.4)' }}
          >
            VS
          </span>
          <div style={{
            filter: 'hue-rotate(200deg) saturate(2) drop-shadow(0 0 18px #4488ff)',
            transform: 'rotate(12deg) scaleX(-1)',
          }}>
            <Image src="/rocket.png" alt="Player 2" width={110} height={110} />
          </div>
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="rounded-xl p-6 flex flex-col gap-3" style={{
            background: 'rgba(255,68,68,0.07)',
            border: '1px solid rgba(255,68,68,0.45)',
            boxShadow: '0 0 28px rgba(255,68,68,0.2)',
          }}>
            <h2 className="font-black uppercase tracking-widest text-sm" style={{ color: '#ff5555' }}>
              Player 1 ★
            </h2>
            <ControlRow label="MOVE" keys={['W', 'A', 'S', 'D']} />
            <ControlRow label="FIRE" keys={['F']} />
          </div>

          <div className="rounded-xl p-6 flex flex-col gap-3" style={{
            background: 'rgba(68,136,255,0.07)',
            border: '1px solid rgba(68,136,255,0.45)',
            boxShadow: '0 0 28px rgba(68,136,255,0.2)',
          }}>
            <h2 className="font-black uppercase tracking-widest text-sm" style={{ color: '#55aaff' }}>
              Player 2 ★
            </h2>
            <ControlRow label="MOVE" keys={['↑', '←', '↓', '→']} />
            <ControlRow label="FIRE" keys={['Space']} />
          </div>
        </div>

        {/* Play button */}
        <Link
          href="/offlinegame"
          className="font-black text-xl tracking-[0.25em] uppercase py-4 px-20 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            boxShadow: '0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.25)',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          ★ Press Start ★
        </Link>
      </div>
    </main>
  );
}

function ControlRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-12 text-gray-400 font-semibold tracking-wider">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {keys.map((k) => (
          <kbd
            key={k}
            className="px-2.5 py-1 rounded font-mono text-white text-xs font-bold"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 2px 0 rgba(0,0,0,0.6)',
            }}
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}
