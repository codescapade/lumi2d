import { Color, Entity, Point } from 'lilo2d';
import { Image } from 'love.graphics';
import { random } from 'love.math';

/**
 * The bunny entity that moves and draws a bunny.
 */
export class Bunny implements Entity {
  /**
   * The draw layer.
   */
  layer = 1;

  /**
   * The bunny should be active.
   */
  active = true;

  /**
   * The image to draw.
   */
  private image: Image;

  /**
   * The current horizontal speed in pixels per second.
   */
  private speedX: number;

  /**
   * The current vertical speed in pixels per second.
   */
  private speedY: number;

  /**
   * The rotation speed in degrees per second.
   */
  private rotationSpeed: number;

  /**
   * The bunny position in pixels.
   */
  private position = new Point();

  /**
   * The current angle in degrees.
   */
  private angle = 0;

  /**
   * The amount of gravity in pixels per second.
   */
  private gravity: number;

  /**
   * The right bounds in pixels.
   */
  private maxX: number;

  /**
   * The bottom bounds in pixels.
   */
  private maxY: number;

  /**
   * The bunny color.
   */
  private color: Color;

  /**
   * The x and y scale.
   */
  private scale: number;

  /**
   * Create a new bunny instance.
   * @param image
   * @param gravity
   * @param maxX
   * @param maxY
   */
  constructor(image: Image, gravity: number, maxX: number, maxY: number) {
    this.image = image;
    this.gravity = gravity;
    this.maxX = maxX;
    this.maxY = maxY;

    // Random speed, color and scale.
    this.speedX = random(20, 200);
    this.speedY = random(0, 500) - 125;
    this.rotationSpeed = random(-100, 100);
    this.color = new Color(random(), random(), random());
    this.scale = random(7, 12) / 10;
  }

  /**
   * Update the bunny movement.
   * @param dt The time passed since the last update.
   */
  update(dt: number): void {
    this.position.x += this.speedX * dt;
    this.position.y += this.speedY * dt;
    this.angle += this.rotationSpeed * dt;

    this.speedY += this.gravity * dt;

    // Bounce back when it hits the bounds on the side.
    if (this.position.x > this.maxX) {
      this.position.x = this.maxX;
      this.speedX *= -1;
    } else if (this.position.x < 0) {
      this.position.x = 0;
      this.speedX *= -1;
    }

    // Bounce back when the bunny hits bottom.
    if (this.position.y > this.maxY) {
      this.position.y = this.maxY;

      this.speedY *= -0.9;

      // Variation in the bounce back.
      if (random(0, 100) > 50) {
        this.speedY -= 200 - random(10, 50);
      }
    } else if (this.position.y < 0) {
      this.position.y = 0;
      this.speedY = 0;
    }
  }

  /**
   * Draw the bunny.
   */
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
