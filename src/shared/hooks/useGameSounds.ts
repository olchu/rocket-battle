import { useEffect, useRef } from 'react'

function makeLoopAudio(src: string, volume: number) {
  const a = new Audio(src)
  a.loop = true
  a.volume = volume
  return a
}

function playOnce(src: string, volume: number) {
  const a = new Audio(src)
  a.volume = volume
  a.play().catch(() => {})
}

function makeThrustController(audio: React.MutableRefObject<HTMLAudioElement | null>) {
  const playing = { current: false }
  return (active: boolean) => {
    const a = audio.current
    if (!a) return
    if (active && !playing.current) {
      playing.current = true
      a.play().catch(() => {})
    } else if (!active && playing.current) {
      playing.current = false
      a.pause()
      a.currentTime = 0
    }
  }
}

export function useGameSounds() {
  const thrust1Audio = useRef<HTMLAudioElement | null>(null)
  const thrust2Audio = useRef<HTMLAudioElement | null>(null)
  const musicAudio = useRef<HTMLAudioElement | null>(null)
  const musicPlaying = useRef(false)

  useEffect(() => {
    thrust1Audio.current = makeLoopAudio('/sounds/thrust.mp3', 0.4)
    thrust2Audio.current = makeLoopAudio('/sounds/thrust.mp3', 0.4)
    musicAudio.current = makeLoopAudio('/sounds/game_muz.mp3', 0.3)
    return () => {
      thrust1Audio.current?.pause()
      thrust2Audio.current?.pause()
      musicAudio.current?.pause()
    }
  }, [])

  const setThrust1 = makeThrustController(thrust1Audio)
  const setThrust2 = makeThrustController(thrust2Audio)

  const playShoot = () => playOnce('/sounds/shoot.mp3', 0.6)
  const playHit = () => playOnce('/sounds/hit.mp3', 0.8)

  const playMusic = () => {
    const a = musicAudio.current
    if (!a || musicPlaying.current) return
    musicPlaying.current = true
    a.currentTime = 0
    a.play().catch(() => {})
  }

  const stopMusic = () => {
    const a = musicAudio.current
    if (!a) return
    a.pause()
    a.currentTime = 0
    musicPlaying.current = false
  }

  const stopAll = () => {
    if (thrust1Audio.current) {
      thrust1Audio.current.pause()
      thrust1Audio.current.currentTime = 0
    }
    if (thrust2Audio.current) {
      thrust2Audio.current.pause()
      thrust2Audio.current.currentTime = 0
    }
    if (musicAudio.current) {
      musicAudio.current.pause()
      musicAudio.current.currentTime = 0
    }
    musicPlaying.current = false
  }

  return { setThrust1, setThrust2, playShoot, playHit, playMusic, stopMusic, stopAll }
}
