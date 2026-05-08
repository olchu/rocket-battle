'use client'
import Link from 'next/link'

function playOnce(src: string, volume: number) {
  const a = new Audio(src)
  a.volume = volume
  a.play().catch(() => {})
}

export function StartButton() {
  return (
    <Link
      href="/offlinegame"
      className="font-black text-2xl tracking-[0.2em] uppercase py-4 px-20 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        background: 'linear-gradient(180deg, #2ecc5a 0%, #1a9e3f 100%)',
        border: '2px solid rgba(100,255,140,0.4)',
        boxShadow: '0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}
      onMouseEnter={() => playOnce('/sounds/hover.mp3', 0.25)}
      onClick={() => playOnce('/sounds/click.mp3', 0.5)}
    >
      ★ Press Start ★
    </Link>
  )
}
