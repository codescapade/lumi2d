import { Camera, Color } from '../graphics';
import { LiloMath, Point, Rectangle } from '../math';
import { PhysBody } from './physBody';
import { PhysInteraction } from './physInteraction';
import { PhysCollide, PhysInteractionType, PhysTouching } from './physInteractionTypes';
import { QuadTree } from './quadTree';
import { RayHitList } from './rayHits';

/** @noSelf */
export type InteractionCallback = (body1: PhysBody, body2: PhysBody) => void;

export class PhysWorld {
  active = true;
  drawRays = false;
  showQuadTree = false;
  iterations = 8;
  gravity = new Point();
  bodies: PhysBody[] = [];
  treeList: PhysBody[] = [];

  triggerStartListeners = new LuaTable<string, LuaTable<string, InteractionCallback[]>>();
  triggerStayListeners = new LuaTable<string, LuaTable<string, InteractionCallback[]>>();
  triggerEndListeners = new LuaTable<string, LuaTable<string, InteractionCallback[]>>();

  collisionStartListeners = new LuaTable<string, LuaTable<string, InteractionCallback[]>>();
  collisionStayListeners = new LuaTable<string, LuaTable<string, InteractionCallback[]>>();
  collisionEndListeners = new LuaTable<string, LuaTable<string, InteractionCallback[]>>();

  interactions: PhysInteraction[] = [];

  bounds = new Rectangle();

  tree: QuadTree;

  debugRays: RayDraw[] = [];

  private boundsColor = new Color(0.4, 0.4, 0.4);
  private bodyColor = new Color(0, 0.45, 0.8);
  private staticBodyColor = new Color(0, 0.8, 0);
  private rayColor = new Color(1, 0.5, 0);
  private rayHitColor = new Color(1, 1, 0);

  constructor(options: PhysWorldOptions) {
    if (options.gravity) {
      this.gravity.set(options.gravity.x, options.gravity.y);
    }

    const x = options.x ?? 0;
    const y = options.y ?? 0;

    if (options.iterations) {
      this.iterations = options.iterations;
    }

    this.bounds.set(x, y, options.width, options.height);
    this.tree = new QuadTree(x, y, options.width, options.height);
  }

  addBody(body: PhysBody): void {
    body.world = this;
    this.bodies.push(body);
  }

  removeBody(body: PhysBody): void {
    body.world = undefined;
    const index = this.bodies.indexOf(body);
    if (index !== -1) {
      this.bodies.splice(index, 1);
    }
  }

  addBodies(bodies: PhysBody[]): void {
    for (const body of bodies) {
      this.addBody(body);
    }
  }

  removeBodies(bodies: PhysBody[]): void {
    for (const body of bodies) {
      this.removeBody(body);
    }
  }

  update(dt: number): void {
    if (!this.active) {
      return;
    }

    if (this.debugRays.length > 1000) {
      this.debugRays = [];
    }

    this.tree.clear();

    for (const body of this.bodies) {
      if (body.active) {
        this.updatePastInteractions(body);
        body.wasTouching.value = body.touching.value;
        body.touching.value = PhysTouching.NONE;
        body.lastX = body.bounds.x;
        body.lastY = body.bounds.y;

        if (this.bounds.intersects(body.bounds)) {
          if (body.bodyType !== 'static') {
            if (body.bodyType === 'dynamic') {
              if (body.useGravity) {
                body.velocity.x += (body.acceleration.x + this.gravity.x) * dt;
                body.velocity.y += (body.acceleration.y + this.gravity.y) * dt;
              }

              if (body.velocity.x > 0) {
                body.velocity.x -= body.drag.x;
              } else if (body.velocity.x < 0) {
                body.velocity.x += body.drag.x;
              }

              if (body.velocity.y > 0) {
                body.velocity.y -= body.drag.y;
              } else if (body.velocity.y < 0) {
                body.velocity.y += body.drag.y;
              }

              if (body.maxVelocity.x !== 0) {
                body.velocity.x = LiloMath.clamp(body.velocity.x, -body.maxVelocity.x, body.maxVelocity.x);
              }

              if (body.maxVelocity.y !== 0) {
                body.velocity.y = LiloMath.clamp(body.velocity.y, -body.maxVelocity.y, body.maxVelocity.y);
              }
            }
            body.bounds.x += body.velocity.x * dt;
            body.bounds.y += body.velocity.y * dt;
          }
          this.tree.insert(body);
        }
      }
    }

    for (let i = 0; i < this.iterations; i++) {
      for (const body of this.bodies) {
        if (body.active) {
          while (this.treeList.length > 0) {
            this.treeList.pop();
          }

          this.tree.getBodyList(body, this.treeList);

          for (const body2 of this.treeList) {
            this.checkCollisions(body, body2);
          }
        }
      }
    }

    for (const body of this.bodies) {
      if (body.active) {
        for (const b of body.wasCollidingWith) {
          if (!body.collidingWith.includes(b)) {
            this.interactions.push(PhysInteraction.get('collisionEnd', body, b));
          }
        }

        for (const b of body.wasTriggeredBy) {
          if (!body.triggeredBy.includes(b)) {
            this.interactions.push(PhysInteraction.get('triggerEnd', body, b));
          }
        }
      }
    }

    while (this.interactions.length > 0) {
      const interaction = this.interactions.pop()!;
      this.dispatchInteraction(interaction);
      interaction.put();
    }
  }

  debugDraw(camera?: Camera): void {
    if (camera) {
      love.graphics.push();
      love.graphics.applyTransform(camera.transform);
    }

    if (this.showQuadTree) {
      love.graphics.setColor(
        this.boundsColor.red,
        this.boundsColor.green,
        this.boundsColor.blue,
        this.boundsColor.alpha
      );

      const quads = this.tree.getTreeBounds();
      for (const quad of quads) {
        love.graphics.rectangle('line', quad.x, quad.y, quad.width, quad.height);
      }
    }

    for (const body of this.bodies) {
      if (body.active) {
        const bounds = body.bounds;
        let color: Color;
        if (body.bodyType === 'static') {
          color = this.staticBodyColor;
        } else {
          color = this.bodyColor;
        }
        love.graphics.setColor(color.red, color.green, color.blue, color.alpha);
        love.graphics.rectangle('line', bounds.x, bounds.y, bounds.width, bounds.height);
      }
    }

    if (this.drawRays) {
      for (const ray of this.debugRays) {
        let color: Color;
        if (ray.hit) {
          color = this.rayHitColor;
        } else {
          color = this.rayColor;
        }
        love.graphics.setColor(color.red, color.green, color.blue, color.alpha);
        love.graphics.line(ray.x1, ray.y1, ray.x2, ray.y2);
      }
      this.debugRays = [];
    }

    if (camera) {
      love.graphics.pop();
    }
  }

  raycast(p1X: number, p1Y: number, p2X: number, p2Y: number, tags?: string[], out?: RayHitList): RayHitList {
    out = this.tree.getLineList(p1X, p1Y, p2X, p2Y, out);

    if (out.count() > 0 && tags) {
      out.filterOnTags(tags);
    }

    if (this.drawRays) {
      const ray: RayDraw = { x1: p1X, y1: p1Y, x2: p2X, y2: p2Y, hit: out.count() > 0 };
      this.debugRays.push(ray);
    }

    return out;
  }

  addListener(type: PhysInteractionType, tag1: string, tag2: string, callback: InteractionCallback): void {
    let list: LuaTable<string, LuaTable<string, InteractionCallback[]>> | undefined;

    if (type === 'triggerStart') {
      list = this.triggerStartListeners;
    } else if (type === 'triggerStay') {
      list = this.triggerStayListeners;
    } else if (type === 'triggerEnd') {
      list = this.triggerEndListeners;
    } else if (type === 'collisionStart') {
      list = this.collisionStartListeners;
    } else if (type === 'collisionStay') {
      list = this.collisionStayListeners;
    } else if (type === 'collisionEnd') {
      list = this.collisionEndListeners;
    }

    if (list) {
      if (!list.has(tag1)) {
        list.set(tag1, new LuaTable<string, InteractionCallback[]>());
        list.get(tag1).set(tag2, [callback]);
      } else if (!list.get(tag1).has(tag2)) {
        list.get(tag1).set(tag2, [callback]);
      } else {
        list.get(tag1).get(tag2).push(callback);
      }
    }
  }

  removeListener(type: PhysInteractionType, tag1: string, tag2: string, callback: InteractionCallback): void {
    let list: LuaTable<string, LuaTable<string, InteractionCallback[]>> | undefined;

    if (type === 'triggerStart') {
      list = this.triggerStartListeners;
    } else if (type === 'triggerStay') {
      list = this.triggerStayListeners;
    } else if (type === 'triggerEnd') {
      list = this.triggerEndListeners;
    } else if (type === 'collisionStart') {
      list = this.collisionStartListeners;
    } else if (type === 'collisionStay') {
      list = this.collisionStayListeners;
    } else if (type === 'collisionEnd') {
      list = this.collisionEndListeners;
    }

    if (list) {
      if (list.has(tag1) && list.get(tag1).has(tag2)) {
        const callbacks = list.get(tag1).get(tag2);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  getPosition(): LuaMultiReturn<[number, number]> {
    return $multi(this.bounds.x, this.bounds.y);
  }

  setPosition(x: number, y: number): void {
    this.bounds.x = x;
    this.bounds.y = y;
    this.tree.updatePosition(x, y);
  }

  getSize(): LuaMultiReturn<[number, number]> {
    return $multi(this.bounds.width, this.bounds.height);
  }

  setSize(width: number, height: number): void {
    this.bounds.width = width;
    this.bounds.height = height;
    this.tree.updateBounds(this.bounds.x, this.bounds.y, width, height);
  }

  private updatePastInteractions(body: PhysBody): void {
    while (body.wasCollidingWith.length > 0) {
      body.wasCollidingWith.pop();
    }

    while (body.wasTriggeredBy.length > 0) {
      body.wasTriggeredBy.pop();
    }

    while (body.collidingWith.length > 0) {
      const b = body.collidingWith.pop()!;
      body.wasCollidingWith.push(b);
    }

    while (body.triggeredBy.length > 0) {
      const b = body.triggeredBy.pop()!;
      body.wasTriggeredBy.push(b);
    }
  }

  private hasInteraction(type: PhysInteractionType, body1: PhysBody, body2: PhysBody): boolean {
    for (const interaction of this.interactions) {
      if (interaction.type === type && interaction.body1 === body1 && interaction.body2 === body2) {
        return true;
      }
    }

    return false;
  }

  private dispatchInteraction(interaction: PhysInteraction): void {
    if (!interaction.body1 || !interaction.body2) {
      return;
    }

    for (const tag1 of interaction.body1.tags) {
      for (const tag2 of interaction.body2.tags) {
        let list: LuaTable<string, LuaTable<string, InteractionCallback[]>> | undefined;

        if (interaction.type === 'triggerStart') {
          list = this.triggerStartListeners;
        } else if (interaction.type === 'triggerStay') {
          list = this.triggerStayListeners;
        } else if (interaction.type === 'triggerEnd') {
          list = this.triggerEndListeners;
        } else if (interaction.type === 'collisionStart') {
          list = this.collisionStartListeners;
        } else if (interaction.type === 'collisionStay') {
          list = this.collisionStayListeners;
        } else if (interaction.type === 'collisionEnd') {
          list = this.collisionEndListeners;
        }

        if (list && list.get(tag1) && list.get(tag1).get(tag2)) {
          const callbacks = list.get(tag1).get(tag2);
          for (const callback of callbacks) {
            callback(interaction.body1, interaction.body2);
          }
        }
      }
    }
  }

  private checkCollisions(body1: PhysBody, body2: PhysBody): void {
    if (body1.mask.contains(body2.group.value) && body2.mask.contains(body1.group.value) && intersects(body1, body2)) {
      if (body1.bodyType === 'dynamic' && !body1.isTrigger && !body2.isTrigger) {
        separate(body1, body2);
        if (!body1.wasCollidingWith.includes(body2)) {
          if (!this.hasInteraction('collisionStart', body1, body2)) {
            this.interactions.push(PhysInteraction.get('collisionStart', body1, body2));
          }
        } else {
          if (!this.hasInteraction('collisionStay', body1, body2)) {
            this.interactions.push(PhysInteraction.get('collisionStay', body1, body2));
          }
        }

        if (!body1.collidingWith.includes(body2)) {
          body1.collidingWith.push(body2);
        }
      } else if (body1.isTrigger && !body2.isTrigger) {
        if (!body1.wasTriggeredBy.includes(body2)) {
          if (!this.hasInteraction('triggerStart', body1, body2)) {
            this.interactions.push(PhysInteraction.get('triggerStart', body1, body2));
          }
        } else {
          if (!this.hasInteraction('triggerStay', body1, body2)) {
            this.interactions.push(PhysInteraction.get('triggerStay', body1, body2));
          }
        }

        if (!body1.triggeredBy.includes(body2)) {
          body1.triggeredBy.push(body2);
        }
      } else if (body2.isTrigger && !body1.isTrigger) {
        if (!body2.wasTriggeredBy.includes(body1)) {
          if (!this.hasInteraction('triggerStart', body1, body2)) {
            this.interactions.push(PhysInteraction.get('triggerStart', body1, body2));
          }
        } else {
          if (!this.hasInteraction('triggerStay', body1, body2)) {
            this.interactions.push(PhysInteraction.get('triggerStay', body1, body2));
          }
        }

        if (!body2.triggeredBy.includes(body1)) {
          body2.triggeredBy.push(body1);
        }
      }
    }
  }
}

export interface PhysWorldOptions {
  x?: number;
  y?: number;
  width: number;
  height: number;
  iterations?: number;
  gravity?: { x: number; y: number };
}

interface RayDraw {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hit: boolean;
}

const OVERLAP_PADDING = 4;

function separate(body1: PhysBody, body2: PhysBody): boolean {
  if (math.abs(body1.velocity.x) > math.abs(body1.velocity.y)) {
    return separateX(body1, body2) || separateY(body1, body2);
  } else {
    return separateY(body1, body2) || separateX(body1, body2);
  }
}

function separateX(body1: PhysBody, body2: PhysBody): boolean {
  const bounds1 = body1.bounds;
  const bounds2 = body2.bounds;

  let overlap = math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width) - math.max(bounds1.x, bounds2.x);
  const ov = bounds1.x > bounds2.x ? overlap : -overlap;

  if (
    (ov < 0 && bounds1.x + bounds1.width * 0.5 > bounds2.x + bounds2.width * 0.5) ||
    (ov > 0 && bounds1.x + bounds1.width * 0.5 < bounds2.x + bounds2.width * 0.5)
  ) {
    return false;
  }

  const delta = math.abs(bounds1.x - body1.lastX);
  // Ignore the overlap if it is way bigger than the amount moved.
  if (overlap > delta + OVERLAP_PADDING && delta !== 0) {
    overlap = 0;
  }

  overlap = bounds1.x > bounds2.x ? overlap : -overlap;
  if (overlap === 0) {
    return false;
  }

  if (overlap > 0) {
    if (
      body1.velocity.x > 0 ||
      !body1.canCollide.contains(PhysCollide.LEFT) ||
      !body2.canCollide.contains(PhysCollide.RIGHT)
    ) {
      return false;
    }

    body1.touching.add(PhysTouching.LEFT);
    body2.touching.add(PhysTouching.RIGHT);
  } else if (overlap < 0) {
    if (
      body1.velocity.x < 0 ||
      !body1.canCollide.contains(PhysCollide.RIGHT) ||
      !body2.canCollide.contains(PhysCollide.LEFT)
    ) {
      return false;
    }

    body1.touching.add(PhysTouching.RIGHT);
    body2.touching.add(PhysTouching.LEFT);
  }

  if (body2.bodyType !== 'dynamic') {
    bounds1.x += overlap;
    body1.velocity.x = -body1.velocity.x * body1.bounce;
  } else {
    overlap *= 0.5;
    bounds1.x += overlap;
    bounds2.x -= overlap;

    let vel1 = body2.velocity.x;
    let vel2 = body1.velocity.x;
    const average = (vel1 + vel2) * 0.5;

    vel1 -= average;
    vel2 -= average;
    body1.velocity.x = average + vel1 * body1.bounce;
    body2.velocity.x = average + vel2 * body1.bounce;
  }

  return true;
}

function separateY(body1: PhysBody, body2: PhysBody): boolean {
  const bounds1 = body1.bounds;
  const bounds2 = body2.bounds;

  let overlap = math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height) - math.max(bounds1.y, bounds2.y);
  const ov = bounds1.y > bounds2.y ? overlap : -overlap;

  if (
    (ov < 0 && bounds1.y + bounds1.height * 0.5 > bounds2.y + bounds2.height * 0.5) ||
    (ov > 0 && bounds1.y + bounds1.height * 0.5 < bounds2.y + bounds2.height * 0.5)
  ) {
    return false;
  }

  const delta = bounds1.y - body1.lastY;

  if (overlap > math.abs(delta) + OVERLAP_PADDING && delta !== 0) {
    overlap = 0;
  }
  overlap = bounds1.y > bounds2.y ? overlap : -overlap;

  if (overlap === 0) {
    return false;
  }

  if (overlap > 0) {
    if (
      body1.velocity.y > 0 ||
      !body1.canCollide.contains(PhysCollide.TOP) ||
      !body2.canCollide.contains(PhysCollide.BOTTOM)
    ) {
      return false;
    }

    body1.touching.add(PhysTouching.TOP);
    body2.touching.add(PhysTouching.BOTTOM);
  } else {
    if (
      body1.velocity.y < 0 ||
      !body1.canCollide.contains(PhysCollide.BOTTOM) ||
      !body2.canCollide.contains(PhysCollide.TOP)
    ) {
      return false;
    }

    body1.touching.add(PhysTouching.BOTTOM);
    body2.touching.add(PhysTouching.TOP);
  }

  if (body2.bodyType !== 'dynamic') {
    bounds1.y += overlap;
    body1.velocity.y = -body1.velocity.y * body1.bounce;
  } else {
    overlap *= 0.5;
    bounds1.y += overlap;
    bounds2.y -= overlap;

    let vel1 = body2.velocity.y;
    let vel2 = body1.velocity.y;
    const average = (vel1 + vel2) * 0.5;

    vel1 -= average;
    vel2 -= average;
    body1.velocity.y = average + vel1 * body1.bounce;
    body2.velocity.y = average + vel2 * body2.bounce;
  }

  return true;
}

function intersects(body1: PhysBody, body2: PhysBody): boolean {
  return body1.bounds.intersects(body2.bounds);
}
