import { Color, Entity } from 'lilo2d';
import { Image } from 'love.graphics';
import { random } from 'love.math';

export class Bunny implements Entity {
  layer = 0;
  active = true;

  private image: Image;

  private speedX: number;

  private speedY: number;

  private rotationSpeed: number;

  private x = 0;

  private y = 0;

  private angle = 0;

  private gravity: number;

  private maxX: number;

  private maxY: number;

  private color: Color;

  constructor(image: Image, gravity: number, maxX: number, maxY: number) {
    this.image = image;
    this.gravity = gravity;
    this.maxX = maxX;
    this.maxY = maxY;

    this.speedX = random(20, 200);
    this.speedY = random(0, 500) - 125;
    this.rotationSpeed = random(-100, 100);
    this.color = new Color(random(), random(), random());
  }

  update(dt: number): void {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
    this.angle += this.rotationSpeed * dt;

    this.speedY += this.gravity * dt;

    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.speedX *= -1;
    } else if (this.x < 0) {
      this.x = 0;
      this.speedX *= -1;
    }

    if (this.y > this.maxY) {
      this.y = this.maxY;

      this.speedY *= -0.9;

      if (random(0, 100) > 50) {
        this.speedY -= 200 - random(10, 50);
      }
    } else if (this.y < 0) {
      this.y = 0;
      this.speedY = 0;
    }
  }

  draw(): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);

    love.graphics.draw(
      this.image,
      this.x,
      this.y,
      math.rad(this.angle),
      1,
      1,
      this.image.getWidth() * 0.5,
      this.image.getHeight() * 0.5
    );
  }
}
