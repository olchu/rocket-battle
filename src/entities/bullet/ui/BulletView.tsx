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
        g.drawRect(bullet.x, bullet.y, bullet.width, bullet.height)
        g.endFill()
      }}
    />
  )
}