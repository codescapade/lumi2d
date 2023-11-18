import { Point, Rectangle } from '../math';
import { PhysBody } from './physBody';
import { RayHitList } from './rayHits';

let MAX_BODIES = 4;
let MAX_DEPTH = 6;

/**
 * The quad tree for broad phase collision checking.
 */
export class QuadTree {
  bounds: Rectangle;
  root: Node;

  private hits: RayHitList = new RayHitList();

  constructor(x: number, y: number, width: number, height: number, maxBodies?: number, maxDepth?: number) {
    this.bounds = new Rectangle(x, y, width, height);
    if (maxBodies) {
      MAX_BODIES = maxBodies;
    }

    if (maxDepth) {
      MAX_DEPTH = maxDepth;
    }

    this.root = new Node(1, x, y, width, height);
  }

  insert(body: PhysBody): void {
    this.root.insert(body);
  }

  getBodyList(body: PhysBody, out?: PhysBody[]): PhysBody[] {
    if (!out) {
      out = [];
    }

    this.root.getBodyList(body, out);

    return out;
  }

  getLineList(p1X: number, p1Y: number, p2X: number, p2Y: number, out?: RayHitList): RayHitList {
    if (!out) {
      out = this.hits;
    }
    out.clear();

    this.root.getLineHitList(p1X, p1Y, p2X, p2Y, out);

    return out;
  }

  getTreeBounds(out?: Rectangle[]): Rectangle[] {
    if (!out) {
      out = [];
    }

    this.root.getNodeBounds(out);

    return out;
  }

  clear(): void {
    this.root.clear();
    this.root.reset(1, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
  }

  updateBounds(x: number, y: number, width: number, height: number): void {
    this.bounds.set(x, y, width, height);
  }

  updatePosition(x: number, y: number): void {
    this.bounds.x = x;
    this.bounds.y = y;
  }
}

class Node {
  depth: number;
  bodies: PhysBody[] = [];
  nodes: Node[] = [];
  indexList: number[] = [];
  bounds: Rectangle;

  private static pool: Node[] = [];

  /** @noSelf */
  static get(depth: number, x: number, y: number, width: number, height: number): Node {
    if (Node.pool.length > 0) {
      const node = Node.pool.pop()!;
      node.reset(depth, x, y, width, height);

      return node;
    } else {
      return new Node(depth, x, y, width, height);
    }
  }

  constructor(depth: number, x: number, y: number, width: number, height: number) {
    this.depth = depth;
    this.bounds = new Rectangle(x, y, width, height);
  }

  clear(): void {
    while (this.bodies.length > 0) {
      this.bodies.pop();
    }

    while (this.nodes.length > 0) {
      const node = this.nodes.pop()!;
      node.clear();
      node.put();
    }
  }

  reset(depth: number, x: number, y: number, width: number, height: number): void {
    this.depth = depth;
    this.bounds.set(x, y, width, height);
  }

  put(): void {
    Node.pool.push(this);
  }

  getNodeBounds(list: Rectangle[]): void {
    for (const node of this.nodes) {
      node.getNodeBounds(list);
    }
    list.push(this.bounds);
  }

  insert(body: PhysBody): void {
    if (this.nodes.length > 0) {
      const index = this.getIndex(body.bounds);
      if (index === -1) {
        this.getIndexes(body.bounds, this.indexList);
        for (const i of this.indexList) {
          this.nodes[i].insert(body);
        }
      } else {
        this.nodes[index].insert(body);
      }

      return;
    }

    this.bodies.push(body);

    if (this.bodies.length > MAX_BODIES && this.depth < MAX_DEPTH) {
      this.split();

      while (this.bodies.length > 0) {
        const b = this.bodies.pop()!;
        const index = this.getIndex(b.bounds);
        if (index === -1) {
          this.getIndexes(b.bounds, this.indexList);
          for (const i of this.indexList) {
            this.nodes[i].insert(b);
          }
        } else {
          this.nodes[index].insert(b);
        }
      }
    }
  }

  getBodyList(body: PhysBody, list: PhysBody[]): void {
    const index = this.getIndex(body.bounds);
    if (this.nodes.length > 0) {
      if (index === -1) {
        this.getIndexes(body.bounds, this.indexList);
        for (const i of this.indexList) {
          this.nodes[i].getBodyList(body, list);
        }
      } else {
        this.nodes[index].getBodyList(body, list);
      }
    } else {
      for (const b of this.bodies) {
        if (b !== body && !list.includes(b)) {
          list.push(b);
        }
      }
    }
  }

  getLineHitList(p1X: number, p1Y: number, p2X: number, p2Y: number, results: RayHitList): void {
    if (this.nodes.length > 0) {
      this.getLineIndexes(p1X, p1Y, p2X, p2Y, this.indexList);
      for (const index of this.indexList) {
        this.nodes[index].getLineHitList(p1X, p1Y, p2X, p2Y, results);
      }
    } else {
      const hitPos = Point.get();
      for (const b of this.bodies) {
        if (b.bounds.intersectsLine(p1X, p1Y, p2X, p2Y, hitPos)) {
          results.insert(hitPos.x, hitPos.y, p1X, p1Y, b);
        }
      }
      hitPos.put();
    }
  }

  private split(): void {
    const subWidth = this.bounds.width * 0.5;
    const subHeight = this.bounds.height * 0.5;
    const x = this.bounds.x;
    const y = this.bounds.y;
    const nextDepth = this.depth + 1;

    this.nodes.push(Node.get(nextDepth, x, y, subWidth, subHeight));
    this.nodes.push(Node.get(nextDepth, x + subWidth, y, subWidth, subHeight));
    this.nodes.push(Node.get(nextDepth, x, y + subHeight, subWidth, subHeight));
    this.nodes.push(Node.get(nextDepth, x + subWidth, y + subHeight, subWidth, subHeight));
  }

  private getLineIndexes(p1X: number, p1Y: number, p2X: number, p2Y: number, list: number[]): void {
    while (list.length > 0) {
      list.pop();
    }

    for (let i = 0; i < this.nodes.length; i++) {
      const bounds = this.nodes[i].bounds;
      if (bounds.intersectsLine(p1X, p1Y, p2X, p2Y) || bounds.hasPoint(p1X, p1Y) || bounds.hasPoint(p2X, p2Y)) {
        list.push(i);
      }
    }
  }

  private getIndexes(colliderBounds: Rectangle, list: number[]): void {
    while (list.length > 0) {
      list.pop();
    }

    for (let i = 0; i < this.nodes.length; i++) {
      const bounds = this.nodes[i].bounds;

      if (bounds.intersects(colliderBounds)) {
        list.push(i);
      }
    }
  }

  private getIndex(colliderBounds: Rectangle): number {
    let index = -1;
    const middleX = this.bounds.x + this.bounds.width * 0.5;
    const middleY = this.bounds.y + this.bounds.height * 0.5;

    const top = colliderBounds.y + colliderBounds.height < middleY;
    const bottom = colliderBounds.y > middleY;
    const left = colliderBounds.x + colliderBounds.width < middleX;
    const right = colliderBounds.x > middleX;

    if (left) {
      if (top) {
        index = 0;
      } else if (bottom) {
        index = 2;
      }
    } else if (right) {
      if (top) {
        index = 1;
      } else if (bottom) {
        index = 3;
      }
    }

    return index;
  }
}
