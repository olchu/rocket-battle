import { useCallback, useRef } from 'react'
import { Rocket } from '@/entities/rocket/model/Rocket'
import { Bullet } from '@/entities/bullet/model/Bullet'

type UseGameLoopParams = {
  rocket: React.MutableRefObject<Rocket>
  opponent: React.MutableRefObject<Rocket>
  bullets: React.MutableRefObject<Bullet[]>
  velocity: React.MutableRefObject<number>
  controls: React.MutableRefObject<{
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    fire: boolean
  }>
  spacePressed: React.MutableRefObject<boolean>
  onHit?: () => void
  onThrust?: (active: boolean) => void
  onShoot?: () => void
  onHitSound?: () => void
}

export function useGameLoop({
  rocket,
  opponent,
  bullets,
  velocity,
  controls,
  spacePressed,
  onHit,
  onThrust,
  onShoot,
  onHitSound,
}: UseGameLoopParams) {
  const onHitRef = useRef(onHit)
  onHitRef.current = onHit
  const onThrustRef = useRef(onThrust)
  onThrustRef.current = onThrust
  const onShootRef = useRef(onShoot)
  onShootRef.current = onShoot
  const onHitSoundRef = useRef(onHitSound)
  onHitSoundRef.current = onHitSound

  return useCallback(
    (scale: number) => {
      const r = rocket.current
      const keys = controls.current
      const w = window.innerWidth
      const h = window.innerHeight
      const maxSpeed = 6

      if (keys.left) r.angle -= 3 * scale
      if (keys.right) r.angle += 3 * scale

      if (keys.up) {
        velocity.current = Math.min(maxSpeed, velocity.current + 0.12 * scale)
        r.isMovingForward = true
        onThrustRef.current?.(true)
      } else if (keys.down) {
        velocity.current = Math.max(0, velocity.current - 0.24 * scale)
        r.isMovingForward = false
        onThrustRef.current?.(false)
      } else {
        velocity.current = Math.max(0, velocity.current - 0.06 * scale)
        r.isMovingForward = false
        onThrustRef.current?.(false)
      }

      const rad = r.angle * (Math.PI / 180)
      r.x += Math.cos(rad) * velocity.current * scale
      r.y += Math.sin(rad) * velocity.current * scale

      if (r.x < 0) r.x = w
      if (r.x > w) r.x = 0
      if (r.y < 0) r.y = h
      if (r.y > h) r.y = 0

      if (keys.fire && !spacePressed.current) {
        spacePressed.current = true
        const bx = r.x + Math.cos(rad) * (r.width / 2)
        const by = r.y + Math.sin(rad) * (r.width / 2)
        bullets.current.push(new Bullet(bx, by, r.angle))
        onShootRef.current?.()
      }

      if (!keys.fire) spacePressed.current = false

      bullets.current.forEach((b) => b.update(w, h, scale))
      bullets.current = bullets.current.filter((b) => b.isAlive)

      bullets.current.forEach((b) => {
        if (b.checkCollision(opponent.current)) {
          b.isAlive = false
          opponent.current.takeDamage(1)
          onHitRef.current?.()
          onHitSoundRef.current?.()
        }
      })
    },
    [rocket, opponent, bullets, velocity, controls, spacePressed]
  )
}
