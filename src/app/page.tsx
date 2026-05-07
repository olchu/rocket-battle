import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-white overflow-hidden relative"
      style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ transform: 'translate(-25%, -20%)' }}>
        <Image src="/planet-blue.png" alt="" width={260} height={260} className="planet-float-1" />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none" style={{ transform: 'translate(-8%, 30%)' }}>
        <Image src="/astronaut.png" alt="" width={240} height={240} className="astronaut-float" />
      </div>
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ transform: 'translate(-15%, 20%)' }}>
        <Image src="/planet-purple.png" alt="" width={420} height={420} className="planet-float-2" />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ transform: 'translate(0%, 0%)' }}>
        <Image src="/planet-orange.png" alt="" width={200} height={200} className="planet-float-3" />
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-6 relative z-10">

        {/* Title */}
        <div className="text-center">
          <h1
            className="text-7xl font-black tracking-widest uppercase leading-none"
            style={{ textShadow: '2px 2px 0 #000, 0 0 60px rgba(255,255,255,0.15)' }}
          >
            <span style={{ color: '#ff4444', textShadow: '2px 2px 0 #000, 0 0 40px rgba(255,68,68,0.7)' }}>ROCKET </span>
            <span>BATTLE</span>
          </h1>
          <p className="mt-2 font-bold tracking-[0.3em] uppercase text-sm" style={{ color: '#f0c040' }}>
            Two Players &bull; One Screen &bull; No Mercy
          </p>
        </div>

        {/* Rockets VS */}
        <div className="flex items-center justify-center w-full" style={{ gap: '0' }}>
          <div className="flex-1 flex justify-end pr-4">
            <Image
              src="/rocket-red.png"
              alt="Player 1"
              width={220}
              height={140}
              style={{ transform: 'rotate(-8deg)', filter: 'drop-shadow(0 0 20px rgba(255,80,0,0.7))' }}
            />
          </div>
          <div className="flex-shrink-0">
            <Image src="/vs.png" alt="VS" width={300} height={206} style={{ filter: 'drop-shadow(0 0 20px rgba(255,100,100,0.5))' }} />
          </div>
          <div className="flex-1 flex justify-start pl-4">
            <Image
              src="/rocket-blue.png"
              alt="Player 2"
              width={220}
              height={140}
              style={{ transform: 'rotate(8deg)', filter: 'drop-shadow(0 0 20px rgba(0,150,255,0.7))' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="rounded-xl p-5 flex flex-col gap-3" style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,68,68,0.6)',
            boxShadow: '0 0 24px rgba(255,68,68,0.25), inset 0 0 20px rgba(255,68,68,0.05)',
          }}>
            <h2 className="font-black uppercase tracking-widest text-sm flex items-center gap-2" style={{ color: '#ff5555' }}>
              Player 1 <span style={{ color: '#ff5555' }}>★</span>
            </h2>
            <ControlRow label="MOVE" keys={['W', 'A', 'S', 'D']} />
            <ControlRow label="FIRE" keys={['F']} />
          </div>

          <div className="rounded-xl p-5 flex flex-col gap-3" style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(68,136,255,0.6)',
            boxShadow: '0 0 24px rgba(68,136,255,0.25), inset 0 0 20px rgba(68,136,255,0.05)',
          }}>
            <h2 className="font-black uppercase tracking-widest text-sm flex items-center gap-2" style={{ color: '#55aaff' }}>
              Player 2 <span style={{ color: '#55aaff' }}>★</span>
            </h2>
            <ControlRow label="MOVE" keys={['↑', '←', '↓', '→']} />
            <ControlRow label="FIRE" keys={['Space']} />
          </div>
        </div>

        {/* Press Start */}
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/offlinegame"
            className="font-black text-2xl tracking-[0.2em] uppercase py-4 px-20 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #2ecc5a 0%, #1a9e3f 100%)',
              border: '2px solid rgba(100,255,140,0.4)',
              boxShadow: '0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            ★ Press Start ★
          </Link>
        </div>
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
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 2px 0 rgba(0,0,0,0.7)',
            }}
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}
