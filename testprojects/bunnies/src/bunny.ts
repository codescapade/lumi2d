import { Color, Entity, Point } from 'lilo2d';
import { Image } from 'love.graphics';
import { random } from 'love.math';

export class Bunny implements Entity {
  layer = 1;
  active = true;

  private image: Image;

  private speedX: number;

  private speedY: number;

  private rotationSpeed: number;

  private position = new Point();

  private angle = 0;

  private gravity: number;

  private maxX: number;

  private maxY: number;

  private color: Color;

  private scale: number;

  constructor(image: Image, gravity: number, maxX: number, maxY: number) {
    this.image = image;
    this.gravity = gravity;
    this.maxX = maxX;
    this.maxY = maxY;

    this.speedX = random(20, 200);
    this.speedY = random(0, 500) - 125;
    this.rotationSpeed = random(-100, 100);
    this.color = new Color(random(), random(), random());
    this.scale = random(7, 12) / 10;
  }

  update(dt: number): void {
    this.position.x += this.speedX * dt;
    this.position.y += this.speedY * dt;
    this.angle += this.rotationSpeed * dt;

    this.speedY += this.gravity * dt;

    if (this.position.x > this.maxX) {
      this.position.x = this.maxX;
      this.speedX *= -1;
    } else if (this.position.x < 0) {
      this.position.x = 0;
      this.speedX *= -1;
    }

    if (this.position.y > this.maxY) {
      this.position.y = this.maxY;

      this.speedY *= -0.9;

      if (random(0, 100) > 50) {
        this.speedY -= 200 - random(10, 50);
      }
    } else if (this.position.y < 0) {
      this.position.y = 0;
      this.speedY = 0;
    }
  }

  draw(): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);

    love.graphics.draw(
      this.image,
      this.position.x,
      this.position.y,
      math.rad(this.angle),
      this.scale,
      this.scale,
      this.image.getWidth() * 0.5,
      this.image.getHeight() * 0.5
    );
  }
}
