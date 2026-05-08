'use client'
import { useEffect, useRef } from 'react'

export function MainMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('/sounds/main_muz.mp3')
    audio.loop = true
    audio.volume = 0.17
    audioRef.current = audio

    const EVENTS = ['mouseenter', 'mousemove', 'keydown', 'click'] as const
    const start = () => {
      audio.play().catch(() => {})
      EVENTS.forEach(e => window.removeEventListener(e, start))
    }

    audio.play().catch(() => {
      EVENTS.forEach(e => window.addEventListener(e, start, { once: true }))
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  return null
}
