import { Point, Rectangle } from '../math';
import { PhysCollide, PhysCollisionFilter, PhysTouching } from './physInteractionTypes';
import { PhysWorld } from './physWorld';

export type PhysBodyType = 'dynamic' | 'kinematic' | 'static';

type Vec2 = {
  x: number;
  y: number;
};

/**
 * Initial physics body values.
 */
export interface PhysBodyOptions {
  /**
   * The body type.
   */
  bodyType?: PhysBodyType;

  /**
   * Should this body be active.
   */
  active?: boolean;

  /**
   * Is this body a trigger. Not solid.
   */
  isTrigger?: boolean;

  /**
   * The x position in pixels.
   */
  x?: number;

  /**
   * The y position in pixels.
   */
  y?: number;

  /**
   * The width in pixels.
   */
  width?: number;

  /**
   * The height in pixels.
   */
  height?: number;

  /**
   * The air drag.
   */
  drag?: Vec2;

  /**
   * Start velocity.
   */
  velocity?: Vec2;

  /**
   * Maximum velocity.
   */
  maxVelocity?: Vec2;

  /**
   * Start acceleration.
   */
  acceleration?: Vec2;

  /**
   * Body body offset in pixels.
   */
  offset?: Vec2;

  /**
   * Collision group.
   */
  group?: PhysCollisionFilter;

  /**
   * Collision mask.
   */
  mask?: PhysCollisionFilter;

  /**
   * The sides the body can collide with.
   */
  canCollide?: PhysCollide;

  /**
   * Bounce value. (0 - 1).
   */
  bounce?: number;

  /**
   * Is this body affected by gravity.
   */
  useGravity?: boolean;

  /**
   * Collision listener tags.
   */
  tags?: string[];

  /**
   * Any data the user wants to add to the body.
   */
  userData?: unknown;
}

/**
 * A physics body.
 */
export class PhysBody {
  /**
   * The body type.
   */
  bodyType: PhysBodyType;

  /**
   * Is this body active.
   */
  active: boolean;

  /**
   * Trigger bodies are not solid.
   */
  isTrigger: boolean;

  /**
   * The amount of bounce (0-1).
   */
  bounce: number;

  /**
   * Is this body affected by gravity.
   */
  useGravity: boolean;

  /**
   * The x position on the previous update.
   */
  lastX: number;

  /**
   * The y position on the previous update.
   */
  lastY: number;

  /**
   * Bodies this body is colliding with on this update.
   */
  collidingWith: PhysBody[] = [];

  /**
   * Bodies this body was colliding with on the previous update.
   */
  wasCollidingWith: PhysBody[] = [];

  /**
   * Bodies this body is triggered by on this update.
   */
  triggeredBy: PhysBody[] = [];

  /**
   * Bodies this body was triggered by on the previous update.
   */
  wasTriggeredBy: PhysBody[] = [];

  /**
   * Collision group.
   */
  group: PhysCollisionFilter;

  /**
   * Collision mask.
   */
  mask: PhysCollisionFilter;

  /**
   * The sides that are touching another body this update.
   */
  touching: PhysTouching;

  /**
   * The side that were toughing another body the previous update.
   */
  wasTouching: PhysTouching;

  /**
   * The side this body can collide with. Defaults to all.
   */
  canCollide: PhysCollide;

  /**
   * The body bounds.
   */
  bounds: Rectangle;

  /**
   * The air drag.
   */
  drag: Point;

  /**
   * The body velocity.
   */
  velocity: Point;

  /**
   * The maximum velocity.
   */
  maxVelocity: Point;

  /**
   * The current acceleration.
   */
  acceleration: Point;

  /**
   * The body offset from the position.
   */
  offset: Point;

  /**
   * Collision listener tags.
   */
  tags: string[];

  /**
   * Any data the user wants to add to the body.
   */
  userData?: unknown;

  /**
   * Reference to the physics world.
   */
  world?: PhysWorld;

  constructor(options?: PhysBodyOptions) {
    if (!options) {
      options = {
        bodyType: 'dynamic',
        active: true,
        isTrigger: false,
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        bounce: 0,
        drag: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        maxVelocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        group: new PhysCollisionFilter(PhysCollisionFilter.GROUP_01),
        mask: new PhysCollisionFilter(PhysCollisionFilter.GROUP_01),
        canCollide: new PhysCollide(PhysCollide.ALL),
        useGravity: true,
        tags: [],
      };
    }

    const drag = new Point();
    if (options.drag) {
      drag.set(options.drag.x, options.drag.y);
    }

    const velocity = new Point();
    if (options.velocity) {
      velocity.set(options.velocity.x, options.velocity.y);
    }

    const maxVelocity = new Point();
    if (options.maxVelocity) {
      maxVelocity.set(options.maxVelocity.x, options.maxVelocity.y);
    }

    const acceleration = new Point();
    if (options.acceleration) {
      acceleration.set(options.acceleration.x, options.acceleration.y);
    }

    const offset = new Point();
    if (options.offset) {
      offset.set(options.offset.x, options.offset.y);
    }

    this.bodyType = options.bodyType ?? 'dynamic';
    this.isTrigger = options.isTrigger ?? false;
    this.active = options.active ?? true;
    this.bounce = options.bounce ?? 0;
    this.useGravity = options.useGravity ?? true;
    this.lastX = 0;
    this.lastY = 0;
    this.group = options.group ?? new PhysCollisionFilter(PhysCollisionFilter.GROUP_01);
    this.mask = options.mask ?? new PhysCollisionFilter(PhysCollisionFilter.GROUP_01);
    this.touching = new PhysTouching(PhysTouching.NONE);
    this.wasTouching = new PhysTouching(PhysTouching.NONE);
    this.canCollide = options.canCollide ?? new PhysCollide(PhysCollide.ALL);
    this.bounds = new Rectangle(options.x ?? 0, options.y ?? 0, options.width ?? 10, options.height ?? 10);
    this.drag = drag;
    this.velocity = velocity;
    this.maxVelocity = velocity;
    this.acceleration = acceleration;
    this.offset = offset;
    this.tags = options.tags ?? [];
    this.userData = options.userData;
  }
}
