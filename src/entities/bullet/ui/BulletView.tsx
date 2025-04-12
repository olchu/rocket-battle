'use client'
import { Graphics } from '@pixi/react'
import { Bullet } from '../model/Bullet'

interface Props {
  bullet: Bullet
}

export function BulletView({ bullet }: Props) {
  return (
    <Graphics
      draw={(g) => {
        g.clear()
        g.beginFill(0xffff00)
        g.drawCircle(bullet.x, bullet.y, 3)
        g.endFill()
      }}
    />
  )
}