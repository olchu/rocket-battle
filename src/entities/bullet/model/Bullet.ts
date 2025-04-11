import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/shared/constants"

export class Bullet {
  x: number
  y: number
  speed: number
  angle: number
  width: number
  height: number
  isAlive: boolean

  constructor(x: number, y: number, angle: number) {
    this.x = x
    this.y = y
    this.angle = angle
    this.speed = 8
    this.width = 8
    this.height = 4
    this.isAlive = true
  }

  update() {
    const rad = this.angle * (Math.PI / 180)
    this.x += Math.cos(rad) * this.speed
    this.y += Math.sin(rad) * this.speed

    if (this.x < 0 || this.x > CANVAS_WIDTH || this.y < 0 || this.y > CANVAS_HEIGHT) {
      this.isAlive = false
    }
  }

  checkCollision(target: { x: number; y: number; width: number; height: number }): boolean {
    return !(
      this.x + this.width < target.x ||
      this.x > target.x + target.width ||
      this.y + this.height < target.y ||
      this.y > target.y + target.height
    )
  }
}