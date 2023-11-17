import { LumiMath } from '../math';
import { PhysBody } from './physBody';

export class RayHit {
  distance: number;
  x: number;
  y: number;
  body?: PhysBody;

  private static pool: RayHit[] = [];

  /** @noSelf */
  static get(x: number, y: number, originX: number, originY: number, body: PhysBody): RayHit {
    if (RayHit.pool.length > 0) {
      const hit = RayHit.pool.pop()!;
      hit.x = x;
      hit.y = y;
      hit.body = body;
      hit.distance = LumiMath.distance(originX, originY, x, y);

      return hit;
    } else {
      return new RayHit(x, y, originX, originY, body);
    }
  }

  constructor(x: number, y: number, originX: number, originY: number, body?: PhysBody) {
    this.x = x;
    this.y = y;
    this.body = body;
    this.distance = LumiMath.distance(originX, originY, x, y);
  }

  put(): void {
    this.body = undefined;
    RayHit.pool.push(this);
  }
}

export class RayHitList {
  hits: RayHit[];

  constructor() {
    this.hits = [];
  }

  insert(x: number, y: number, originX: number, originY: number, body: PhysBody): void {
    const hit = RayHit.get(x, y, originX, originY, body);

    if (this.hits.length > 0) {
      if (this.hits.length === 1) {
        const h = this.hits[0];
        if (hit.distance < h.distance) {
          this.hits.unshift(hit);
        } else {
          this.hits.push(hit);
        }
      } else {
        // Insert sorted by distance.
        for (let i = 0; i < this.hits.length; i++) {
          const h = this.hits[i];
          if (h.distance > hit.distance) {
            if (i === this.hits.length - 1) {
              this.hits.push(hit);
            } else {
              this.hits.splice(i + 1, 0, hit);
            }
          }
        }
      }
    } else {
      this.hits.push(hit);
    }
  }

  count(): number {
    return this.hits.length;
  }

  first(): RayHit {
    return this.hits[0];
  }

  last(): RayHit {
    return this.hits[this.hits.length - 1];
  }

  filterOnTags(tags: string[]): void {
    this.hits = this.hits.filter((hit) => {
      for (const tag of tags) {
        if (hit.body?.tags.includes(tag)) {
          return true;
        }
      }
      hit.put();
      return false;
    });
  }

  remove(hit: RayHit): void {
    const index = this.hits.indexOf(hit);
    if (index !== -1) {
      this.hits.splice(index, 1);
    }
  }

  clear(): void {
    while (this.hits.length > 0) {
      const hit = this.hits.pop();
      if (hit) {
        hit.put();
      }
    }
  }
}
