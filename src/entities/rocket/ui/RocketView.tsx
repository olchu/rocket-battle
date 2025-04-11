'use client'
import { Sprite } from '@pixi/react'
import { Rocket } from '../model/Rocket'

interface Props {
  rocket: Rocket
  image: string
}

export function RocketView({ rocket, image }: Props) {
  return (
    <Sprite
      image={image}
      x={rocket.x}
      y={rocket.y}
      width={rocket.width}
      height={rocket.height}
      anchor={0.5}
      rotation={(rocket.angle * Math.PI) / 180}
    />
  )
}