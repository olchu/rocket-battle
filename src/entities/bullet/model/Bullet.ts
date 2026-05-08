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
    this.speed = 16
    this.radius = 3
    this.isAlive = true
  }

  update(boundsWidth: number, boundsHeight: number, scale = 1) {
    const rad = this.angle * (Math.PI / 180)
    this.x += Math.cos(rad) * this.speed * scale
    this.y += Math.sin(rad) * this.speed * scale

    if (this.x < 0 || this.x > boundsWidth || this.y < 0 || this.y > boundsHeight) {
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