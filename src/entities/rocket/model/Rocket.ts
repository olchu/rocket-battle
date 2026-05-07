export class Rocket {
  x: number
  y: number
  width: number
  height: number
  angle: number
  speed: number
  health: number
  isMovingForward: boolean

  constructor(x: number, y: number, initialAngle: number = 0) {
    this.x = x
    this.y = y
    this.width = 85
    this.height = 35
    this.angle = initialAngle
    this.speed = 2
    this.health = 100
    this.isMovingForward = false
  }

  rotateLeft() {
    this.angle -= 1.5
  }

  rotateRight() {
    this.angle += 1.5
  }

  moveForward() {
    this.isMovingForward = true
    this.x += Math.cos(this.angle * (Math.PI / 180)) * this.speed
    this.y += Math.sin(this.angle * (Math.PI / 180)) * this.speed
  }

  moveBackward() {
    this.isMovingForward = false
    this.x -= Math.cos(this.angle * (Math.PI / 180)) * this.speed
    this.y -= Math.sin(this.angle * (Math.PI / 180)) * this.speed
  }

  checkCollision(other: Rocket): boolean {
    return !(
      this.x + this.width < other.x ||
      this.x > other.x + other.width ||
      this.y + this.height < other.y ||
      this.y > other.y + other.height
    )
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount)
  }

  stopMoving() {
    this.isMovingForward = false
  }
}