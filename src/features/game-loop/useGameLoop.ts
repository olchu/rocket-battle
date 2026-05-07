import { useEffect } from 'react'
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
  forceUpdate: React.Dispatch<React.SetStateAction<number>>
  enabled?: boolean
  onHit?: () => void
}

export function useGameLoop({
  rocket,
  opponent,
  bullets,
  velocity,
  controls,
  spacePressed,
  forceUpdate,
  enabled = true,
  onHit,
}: UseGameLoopParams) {
  useEffect(() => {
    let frame: number

    const loop = () => {
      if (!enabled) return;

      const r = rocket.current
      const keys = controls.current
      const w = window.innerWidth
      const h = window.innerHeight
      const maxSpeed = 5

      if (keys.left) r.rotateLeft()
      if (keys.right) r.rotateRight()

      if (keys.up) {
        velocity.current = Math.min(maxSpeed, velocity.current + 0.1)
        r.isMovingForward = true
      } else if (keys.down) {
        velocity.current = Math.max(0, velocity.current - 0.2)
        r.isMovingForward = false
      } else {
        velocity.current = Math.max(0, velocity.current - 0.05)
        r.isMovingForward = false
      }

      const rad = r.angle * (Math.PI / 180)
      r.x += Math.cos(rad) * velocity.current
      r.y += Math.sin(rad) * velocity.current

      // wrap
      if (r.x < 0) r.x = w
      if (r.x > w) r.x = 0
      if (r.y < 0) r.y = h
      if (r.y > h) r.y = 0

      if (keys.fire && !spacePressed.current) {
        spacePressed.current = true
        const bx = r.x + Math.cos(rad) * (r.width / 2)
        const by = r.y + Math.sin(rad) * (r.width / 2)
        bullets.current.push(new Bullet(bx, by, r.angle))
      }

      if (!keys.fire) spacePressed.current = false

      bullets.current.forEach((b) => b.update())
      bullets.current = bullets.current.filter((b) => b.isAlive)

      bullets.current.forEach((b) => {
        if (b.checkCollision(opponent.current)) {
          b.isAlive = false
          opponent.current.takeDamage(1)
          onHit?.()
        }
      })

      forceUpdate((n) => n + 1)

      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [rocket, opponent, bullets, velocity, controls, spacePressed, forceUpdate, enabled, onHit])
}
