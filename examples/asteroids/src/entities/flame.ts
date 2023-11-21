import { Assets, CSprite, CTransform, Entity, Events, KeyboardEvent } from '@lumi2d/lumi';

export class Flame implements Entity {
  layer = 1;
  active = true;

  transform: CTransform;

  sprite: CSprite;

  accelerateDown = false;

  constructor(parent: CTransform) {
    this.transform = new CTransform({ x: -10, parent });

    const atlas = Assets.getAtlas('sprites');
    this.sprite = new CSprite({ atlas, frameName: 'flame', anchorY: 0 });

    Events.on(KeyboardEvent.PRESSED, (event) => {
      if (event.key === 'up') {
        this.accelerateDown = true;
      }
    });

    Events.on(KeyboardEvent.RELEASED, (event) => {
      if (event.key === 'up') {
        this.accelerateDown = false;
      }
    });
  }

  update(_dt: number): void {
    const scale = this.accelerateDown ? math.random(5, 10) / 8 : 0.01;
    this.transform.setScale(scale, scale);
  }

  draw(): void {
    const [worldX, worldY] = this.transform.getWorldPosition();
    const worldAngle = this.transform.getWorldAngle() + 90;
    const [scaleX, scaleY] = this.transform.getWorldScale();
    this.sprite.draw(worldX, worldY, math.rad(worldAngle), scaleX, scaleY);
  }
}
