import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/shared/constants"

export class Bullet {
  x: number
  y: number
  speed: number
  angle: number
  radius: number
  isAlive: boolean

  constructor(x: number, y: number, angle: number) {
    this.x = x
    this.y = y
    this.angle = angle
    this.speed = 8
    this.radius = 3
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

  checkCollision(target: { x: number; y: number; width: number; height: number; angle: number }): boolean {
    // Получаем центры объектов
    const targetCenterX = target.x;
    const targetCenterY = target.y;
    
    // Вычисляем расстояние между центрами
    const dx = this.x - targetCenterX;
    const dy = this.y - targetCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Используем фиксированный радиус для коллизии
    const collisionRadius = Math.max(target.width, target.height) * 0.3;

    // Проверяем столкновение по сумме радиусов
    return distance < (collisionRadius + this.radius);
  }
}