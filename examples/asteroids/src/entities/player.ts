import { Assets, CLovePhysBody, CSprite, Events, KeyboardEvent } from '@lumi2d/lumi';
import { CTransform, Entity } from '@lumi2d/lumi';
import { World } from 'love.physics';
import { CWrapAround } from '../components/cWrapAround';

export class Player implements Entity {
  layer = 2;
  active = true;

  transform: CTransform;

  physBody: CLovePhysBody;

  sprite: CSprite;

  wrap: CWrapAround;

  private leftDown = false;

  private rightDown = false;

  private accelerateDown = false;

  constructor(x: number, y: number, world: World) {
    this.transform = new CTransform({ x, y });
    this.wrap = new CWrapAround(this.transform, 16);

    const body = love.physics.newBody(world, x, y, 'dynamic');
    body.setLinearDamping(0.8);
    body.setAngularDamping(1.2);
    const shapeTop = love.physics.newPolygonShape(18, 0, -12, 0, -18, -12, -12, -18);

    love.physics.newFixture(body, shapeTop);

    const shapeBottom = love.physics.newPolygonShape(-12, 0, 18, 0, -12, 18, -18, 12);
    love.physics.newFixture(body, shapeBottom);

    this.physBody = new CLovePhysBody(this.transform, body);

    const atlas = Assets.getAtlas('sprites');

    this.sprite = new CSprite({ atlas, frameName: 'player' });

    Events.on(KeyboardEvent.PRESSED, (event) => {
      if (event.key === 'left') {
        this.leftDown = true;
      } else if (event.key === 'right') {
        this.rightDown = true;
      } else if (event.key === 'up') {
        this.accelerateDown = true;
      }
    });

    Events.on(KeyboardEvent.RELEASED, (event) => {
      if (event.key === 'left') {
        this.leftDown = false;
      } else if (event.key === 'right') {
        this.rightDown = false;
      } else if (event.key === 'up') {
        this.accelerateDown = false;
      }
    });
  }

  update(_dt: number): void {
    this.wrap.update();

    if (this.leftDown) {
      this.physBody.body.applyTorque(-600);
    }
    if (this.rightDown) {
      this.physBody.body.applyTorque(600);
    }

    if (this.accelerateDown) {
      const angle = math.rad(this.transform.angle);
      const x = math.cos(angle);
      const y = math.sin(angle);
      this.physBody.body.applyForce(x * 250, y * 250);
    }

    this.physBody.update();
  }

  lateUpdate(_dt: number): void {
    this.physBody.lateUpdate();
  }

  draw(): void {
    this.sprite.draw(this.transform.position.x, this.transform.position.y, math.rad(this.transform.angle), 1.0, 1.0);
  }
}
