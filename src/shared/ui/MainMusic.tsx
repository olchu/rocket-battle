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

    // On trusted domains mousemove is enough to autoplay; on first visit falls back to button
    const tryOnMove = () => {
      window.removeEventListener('mousemove', tryOnMove)
      audio.play().catch(() => {})
    }
    window.addEventListener('mousemove', tryOnMove)

    return () => {
      audio.pause()
      audio.src = ''
      window.removeEventListener('mousemove', tryOnMove)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      // onClick is a real user gesture — browser always allows this
      audio.play().catch(() => {})
      setMuted(false)
    } else {
      audio.pause()
      setMuted(true)
    }
  }

  return <MuteButton muted={muted} onToggle={toggle} />
}
