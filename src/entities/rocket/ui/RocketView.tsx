'use client'
import { Sprite, Container, useTick } from '@pixi/react'
import * as PIXI from 'pixi.js'
import { MutableRefObject, useCallback, useState, useEffect, useRef } from 'react'
import { Rocket } from '../model/Rocket'
import { ExplosionParticle } from './ExplosionParticle'

interface Props {
  rocketRef: MutableRefObject<Rocket>
  health: number
  image: string
}

const FIRE_ANIMATION_FRAMES = [
  '/rocket-fire-1.png',
  '/rocket-fire-2.png',
  '/rocket-fire-3.png',
  '/rocket-fire-4.png',
]

const EXPLOSION_SPRITES = [
  '/debris-1.png',
  '/debris-2.png',
  '/debris-3.png',
  '/debris-4.png',
]

const ANIMATION_SPEED = 100
const EXPLOSION_PARTICLES = 20

const ALL_PRELOAD_ASSETS = [...FIRE_ANIMATION_FRAMES, ...EXPLOSION_SPRITES]

export function RocketView({ rocketRef, health, image }: Props) {
  const containerRef = useRef<PIXI.Container>(null)
  const [fireFrame, setFireFrame] = useState(0)

  useEffect(() => {
    PIXI.Assets.load(ALL_PRELOAD_ASSETS).catch(() => {})
  }, [])
  const [particles, setParticles] = useState<Array<{
    id: number
    angle: number
    speed: number
    rotationSpeed: number
    sprite: string
  }>>([])
  const [isExploded, setIsExploded] = useState(false)
  const fireTimeRef = useRef(0)

  // Обновляем позицию напрямую через PixiJS — без React re-render
  useTick((delta) => {
    const r = rocketRef.current
    const container = containerRef.current
    if (container) {
      container.x = r.x
      container.y = r.y
      container.rotation = r.angle * (Math.PI / 180)
    }

    // Анимация огня через тикер
    if (r.isMovingForward) {
      fireTimeRef.current += delta * (1000 / 60)
      if (fireTimeRef.current >= ANIMATION_SPEED) {
        fireTimeRef.current = 0
        setFireFrame((prev) => (prev + 1) % FIRE_ANIMATION_FRAMES.length)
      }
    } else if (fireTimeRef.current > 0) {
      fireTimeRef.current = 0
      setFireFrame(0)
    }
  })

  useEffect(() => {
    if (health === 100) {
      setIsExploded(false)
      setParticles([])
    }
  }, [health])

  useEffect(() => {
    if (health <= 0 && !isExploded) {
      const newParticles = Array.from({ length: EXPLOSION_PARTICLES }, (_, i) => ({
        id: Date.now() + i,
        angle: (360 / EXPLOSION_PARTICLES) * i + Math.random() * 30 - 15,
        speed: 3 + Math.random() * 4,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        sprite: EXPLOSION_SPRITES[Math.floor(Math.random() * EXPLOSION_SPRITES.length)],
      }))
      setParticles(newParticles)
      setIsExploded(true)
    }
  }, [health, isExploded])

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const r = rocketRef.current
  const rocketImage = r.isMovingForward ? FIRE_ANIMATION_FRAMES[fireFrame] : image

  return (
    <>
      {particles.map((particle) => (
        <ExplosionParticle
          key={particle.id}
          x={r.x}
          y={r.y}
          angle={particle.angle}
          speed={particle.speed}
          rotationSpeed={particle.rotationSpeed}
          image={particle.sprite}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
      {!isExploded && (
        <Container
          ref={containerRef}
          x={r.x}
          y={r.y}
          rotation={(r.angle * Math.PI) / 180}
        >
          <Sprite image={rocketImage} width={r.width} height={r.height} anchor={0.5} />
        </Container>
      )}
    </>
  )
}
