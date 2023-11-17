import { Point, Rectangle } from '../math';
import { PhysCollide, PhysCollisionFilter, PhysTouching } from './physInteractionTypes';
import { PhysWorld } from './physWorld';

export type PhysBodyType = 'dynamic' | 'kinematic' | 'static';

type Vec2 = {
  x: number;
  y: number;
};

export interface PhysBodyOptions {
  bodyType?: PhysBodyType;
  active?: boolean;
  isTrigger?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  drag?: Vec2;
  velocity?: Vec2;
  maxVelocity?: Vec2;
  acceleration?: Vec2;
  offset?: Vec2;
  group?: PhysCollisionFilter;
  mask?: PhysCollisionFilter;
  canCollide?: PhysCollide;
  bounce?: number;
  useGravity?: boolean;
  tags?: string[];
  userData?: unknown;
}

export class PhysBody {
  bodyType: PhysBodyType;
  active: boolean;
  isTrigger: boolean;
  bounce: number;
  useGravity: boolean;
  lastX: number;
  lastY: number;
  collidingWith: PhysBody[] = [];
  wasCollidingWith: PhysBody[] = [];
  triggeredBy: PhysBody[] = [];
  wasTriggeredBy: PhysBody[] = [];
  group: PhysCollisionFilter;
  mask: PhysCollisionFilter;
  touching: PhysTouching;
  wasTouching: PhysTouching;
  canCollide: PhysCollide;
  bounds: Rectangle;
  drag: Point;
  velocity: Point;
  maxVelocity: Point;
  acceleration: Point;
  offset: Point;
  tags: string[];
  userData?: unknown;
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
