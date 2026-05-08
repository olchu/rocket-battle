'use client'
import { useEffect, useRef, useState } from 'react'
import { MuteButton } from './MuteButton'

export function MainMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = new Audio('/sounds/main_muz.mp3')
    audio.loop = true
    audio.volume = 0.17
    audioRef.current = audio

    const tryPlay = () => audio.play().catch(() => {})

    tryPlay()
    window.addEventListener('pointerdown', tryPlay, { once: true })
    window.addEventListener('keydown', tryPlay, { once: true })

    return () => {
      audio.pause()
      audio.src = ''
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.volume = 0.17
      setMuted(false)
    } else {
      audio.volume = 0
      setMuted(true)
    }
  }

  return <MuteButton muted={muted} onToggle={toggle} />
}
