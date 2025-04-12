export class Rocket {
  x: number
  y: number
  width: number
  height: number
  angle: number
  speed: number
  health: number

  constructor(x: number, y: number, initialAngle: number = 0) {
    this.x = x
    this.y = y
    this.width = 85
    this.height = 35
    this.angle = initialAngle
    this.speed = 2
    this.health = 100
  }

  rotateLeft() {
    this.angle -= 5
  }

  rotateRight() {
    this.angle += 5
  }

  moveForward() {
    this.x += Math.cos(this.angle * (Math.PI / 180)) * this.speed
    this.y += Math.sin(this.angle * (Math.PI / 180)) * this.speed
  }

  moveBackward() {
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
}