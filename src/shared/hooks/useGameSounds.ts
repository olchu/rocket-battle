import { useEffect, useRef } from 'react'

// Точки петли двигателя — доля от общей длины файла (0.0 – 1.0).
// Подбери под свой звук: начало и конец должны быть на "живом" звуке, не на тишине.
const THRUST_LOOP_START = 0.15
const THRUST_LOOP_END   = 0.85

class ThrustAudio {
  private ctx: AudioContext
  private buffer: AudioBuffer | null = null
  private source: AudioBufferSourceNode | null = null
  private gain: GainNode
  private playing = false

  constructor(volume: number) {
    this.ctx = new AudioContext()
    this.gain = this.ctx.createGain()
    this.gain.gain.value = volume
    this.gain.connect(this.ctx.destination)
  }

  async load(src: string) {
    try {
      const res = await fetch(src)
      const raw = await res.arrayBuffer()
      this.buffer = await this.ctx.decodeAudioData(raw)
    } catch (_) {}
  }

  play() {
    if (!this.buffer || this.playing) return
    this.playing = true
    if (this.ctx.state === 'suspended') this.ctx.resume()
    const src = this.ctx.createBufferSource()
    src.buffer = this.buffer
    src.loop = true
    src.loopStart = this.buffer.duration * THRUST_LOOP_START
    src.loopEnd   = this.buffer.duration * THRUST_LOOP_END
    src.connect(this.gain)
    src.start(0, this.buffer.duration * THRUST_LOOP_START)
    this.source = src
  }

  stop() {
    if (!this.playing) return
    this.playing = false
    try { this.source?.stop() } catch (_) {}
    this.source = null
  }
}

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

export function useGameSounds() {
  const thrust1 = useRef<ThrustAudio | null>(null)
  const thrust2 = useRef<ThrustAudio | null>(null)
  const musicAudio = useRef<HTMLAudioElement | null>(null)
  const musicPlaying = useRef(false)

  useEffect(() => {
    const t1 = new ThrustAudio(0.25)
    const t2 = new ThrustAudio(0.25)
    t1.load('/sounds/thrust.mp3')
    t2.load('/sounds/thrust.mp3')
    thrust1.current = t1
    thrust2.current = t2
    musicAudio.current = makeLoopAudio('/sounds/game_muz.mp3', 0.2)
    return () => {
      t1.stop()
      t2.stop()
      musicAudio.current?.pause()
    }
  }, [])

  const setThrust1 = (active: boolean) => {
    if (active) thrust1.current?.play()
    else thrust1.current?.stop()
  }

  const setThrust2 = (active: boolean) => {
    if (active) thrust2.current?.play()
    else thrust2.current?.stop()
  }

  const playShoot = () => playOnce('/sounds/shoot.mp3', 0.35)
  const playHit   = () => playOnce('/sounds/hit.mp3', 0.25)
  const playBoom  = () => playOnce('/sounds/boom.mp3', 0.65)

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
    thrust1.current?.stop()
    thrust2.current?.stop()
    if (musicAudio.current) {
      musicAudio.current.pause()
      musicAudio.current.currentTime = 0
    }
    musicPlaying.current = false
  }

  const setMusicMuted = (muted: boolean) => {
    const a = musicAudio.current
    if (!a) return
    a.volume = muted ? 0 : 0.2
  }

  return { setThrust1, setThrust2, playShoot, playHit, playBoom, playMusic, stopMusic, setMusicMuted, stopAll }
}
