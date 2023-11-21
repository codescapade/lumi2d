import { Assets, CLovePhysBody, CSprite, CTransform, Entity } from '@lumi2d/lumi';
import { World } from 'love.physics';

export class Bullet implements Entity {
  active = true;
  layer = 1;

  private transform: CTransform;

  private sprite: CSprite;

  private physBody: CLovePhysBody;

  private static pool: Bullet[] = [];

  /**
   *
   * @param x
   * @param y
   * @param world
   * @noSelf
   */
  static get(x: number, y: number, angle: number, velocityX: number, velocityY: number, world: World): Bullet {
    let bullet: Bullet;
    if (Bullet.pool.length > 0) {
      bullet = Bullet.pool.pop()!;
      bullet.transform.setPosition(x, y);
    } else {
      bullet = new Bullet(x, y, world);
    }
    bullet.transform.angle = angle;
    bullet.physBody.body.setActive(true);
    bullet.physBody.body.setLinearVelocity(velocityX, velocityY);

    return bullet;
  }

  constructor(x: number, y: number, world: World) {
    this.transform = new CTransform({ x, y });

    const atlas = Assets.getAtlas('sprites');

    this.sprite = new CSprite({ atlas, frameName: 'bullet' });

    const body = love.physics.newBody(world, x, y, 'dynamic');
    const shape = love.physics.newRectangleShape(8, 4);
    love.physics.newFixture(body, shape);

    this.physBody = new CLovePhysBody(this.transform, body);
  }

  update(dt: number): void {}

  draw(): void {
    this.sprite.draw(this.transform.position.x, this.transform.position.y, this.transform.angle, 1.0, 1.0);
  }

  put(): void {
    this.physBody.body.setLinearVelocity(0, 0);
    this.physBody.body.setActive(false);
    this.active = false;
  }
}
