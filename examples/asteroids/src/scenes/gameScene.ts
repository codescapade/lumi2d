import { Scene, lovePhysDraw } from '@lumi2d/lumi';
import { World } from 'love.physics';
import { Player } from '../entities/player';
import { Flame } from '../entities/flame';

export class GameScene extends Scene {
  world!: World;

  debugDraw = false;

  override load(): void {
    love.physics.setMeter(32);
    this.world = love.physics.newWorld();

    const player = new Player(400, 300, this.world);
    const flame = new Flame(player.transform);
    this.addEntity(player);
    this.addEntity(flame);
  }

  override update(dt: number): void {
    super.update(dt);
    this.world.update(dt);
  }

  override draw(): void {
    super.draw();
    if (this.debugDraw) {
      lovePhysDraw(this.world, this.cameras[0]);
    }
  }
}
