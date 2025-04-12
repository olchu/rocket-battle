import { CANVAS_HEIGHT, CANVAS_WIDTH, COLLISION_RADIUS_MULTIPLIER, COLLISION_OFFSET_X } from "@/shared/constants"

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

  checkCollision(target: { x: number; y: number; width: number; height: number; angle: number }): boolean {
    // Получаем центры объектов
    const bulletCenterX = this.x + this.width / 2;
    const bulletCenterY = this.y + this.height / 2;
    
    // Вычисляем центр области коллизии с учетом поворота ракеты
    const rad = target.angle * Math.PI / 180;
    const offsetX = Math.cos(rad) * COLLISION_OFFSET_X;
    const offsetY = Math.sin(rad) * COLLISION_OFFSET_X;
    const targetCenterX = target.x + offsetX;
    const targetCenterY = target.y + offsetY;

    // Вычисляем расстояние между центрами
    const dx = bulletCenterX - targetCenterX;
    const dy = bulletCenterY - targetCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Используем фиксированный радиус для коллизии
    const collisionRadius = Math.max(target.width, target.height) * COLLISION_RADIUS_MULTIPLIER;
    const bulletRadius = Math.max(this.width, this.height) / 2;

    // Проверяем столкновение по сумме радиусов
    return distance < (collisionRadius + bulletRadius);
  }
}