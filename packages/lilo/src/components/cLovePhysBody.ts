import { Body } from 'love.physics';
import { CTransform } from './cTransform';

/**
 * Component for love physics bodies.
 */
export class CLovePhysBody {
  /**
   * Transform component reference.
   */
  transform: CTransform;

  /**
   * The love physics body.
   */
  body: Body;

  /**
   * Create a new love physics body.
   * @param transform The transform component.
   * @param body The love physics body.
   */
  constructor(transform: CTransform, body: Body) {
    this.transform = transform;
    this.body = body;
  }

  /**
   * Update syncs the physics body to the transform.
   */
  update(): void {
    const [worldX, worldY] = this.transform.getWorldPosition();
    this.body.setPosition(worldX, worldY);

    const angle = this.transform.getWorldAngle();
    this.body.setAngle(math.rad(angle));
  }

  /**
   * Late update syncs the transform back to the new physics body position and rotation..
   */
  lateUpdate(): void {
    const [x, y] = this.body.getPosition();
    this.transform.setWorldPosition(x, y);

    const angle = this.body.getAngle();
    this.transform.setWorldAngle(math.deg(angle));
  }

  /**
   * Destroys the physics body.
   */
  destroy(): void {
    this.body.destroy();
  }
}
