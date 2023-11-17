import { PhysBody } from '../physics';
import { CTransform } from './cTransform';

/**
 * AABB physics body component.
 */
export class CPhysBody {
  /**
   * Transform component reference.
   */
  transform: CTransform;

  /**
   * Physics body reference.
   */
  body: PhysBody;

  /**
   * Create a new body component.
   * @param transform The transform reference.
   * @param body The body reference.
   */
  constructor(transform: CTransform, body: PhysBody) {
    this.transform = transform;
    this.body = body;
  }

  /**
   * Update syncs the physics body to the transform.
   */
  update(): void {
    const [worldX, worldY] = this.transform.getWorldPosition();
    this.body.bounds.x = worldX - this.body.bounds.width * 0.5 + this.body.offset.x;
    this.body.bounds.y = worldY - this.body.bounds.height * 0.5 + this.body.offset.y;
  }

  /**
   * Late update syncs the transform back to the new physics body position and rotation..
   */
  lateUpdate(): void {
    if (this.body.bodyType != 'static') {
      const worldX = this.body.bounds.x + this.body.bounds.width * 0.5 - this.body.offset.x;
      const worldY = this.body.bounds.y + this.body.bounds.height * 0.5 - this.body.offset.y;

      this.transform.setWorldPosition(worldX, worldY);
    }
  }

  /**
   * Destroys the physics body.
   */
  destroy(): void {
    this.body.world?.removeBody(this.body);
  }
}
