export class Point {
  static readonly LEFT = new Point(-1, 0);
  static readonly RIGHT = new Point(1, 0);
  static readonly UP = new Point(0, -1);
  static readonly DOWN = new Point(0, 1);
  static readonly ZERO = new Point(0, 0);

  x: number;
  y: number;

  private static pool: Point[] = [];

  /** @noSelf */
  static get(x = 0, y = 0): Point {
    if (Point.pool.length > 0) {
      const point = Point.pool.pop()!;
      point.x = x;
      point.y = y;

      return point;
    } else {
      return new Point(x, y);
    }
  }

  /** @noSelf */
  static addPoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x + b.x, a.y + b.y);

    return out;
  }

  /** @noSelf */
  static subtractPoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x - b.x, a.y - b.y);

    return out;
  }

  /** @noSelf */
  static multiplyPoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x * b.x, a.y * b.y);

    return out;
  }

  /** @noSelf */
  static dividePoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x / b.x, a.y / b.y);

    return out;
  }

  /** @noSelf */
  static distance(a: Point, b: Point): number {
    return math.sqrt(math.pow(b.x - a.x, 2) + math.pow(b.y - a.y, 2));
  }

  /** @noSelf */
  static rotateAround(pos: Point, x: number, y: number, angle: number): Point {
    const rad = math.rad(angle);
    const c = math.cos(rad);
    const s = math.sin(rad);

    const tx = pos.x - x;
    const ty = pos.y - y;

    pos.x = tx * c - ty * s + x;
    pos.y = tx * c + ty * c + y;

    return pos;
  }

  /** @noSelf */
  static rotateAroundPoint(pos: Point, point: Point, angle: number): Point {
    return Point.rotateAround(pos, point.x, point.y, angle);
  }

  getLength(): number {
    return math.sqrt(this.x * this.x + this.y * this.y);
  }

  setLength(value: number): void {
    const l = this.getLength();

    if (l > 0) {
      this.x /= l;
      this.y /= l;
    }

    this.x *= value;
    this.y *= value;
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): Point {
    this.x = x;
    this.y = y;

    return this;
  }

  clone(out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(this.x, this.y);

    return out;
  }

  copyFrom(other: Point): Point {
    this.x = other.x;
    this.y = other.y;

    return this;
  }

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  add(other: Point): Point {
    this.x += other.x;
    this.y += other.y;

    return this;
  }

  addVal(value: number): Point {
    this.x += value;
    this.y += value;

    return this;
  }

  subtract(other: Point): Point {
    this.x -= other.x;
    this.y -= other.y;

    return this;
  }

  subtractVal(value: number): Point {
    this.x -= value;
    this.y -= value;

    return this;
  }

  multiply(other: Point): Point {
    this.x *= other.x;
    this.y *= other.y;

    return this;
  }

  multiplyVal(value: number): Point {
    this.x *= value;
    this.y *= value;

    return this;
  }

  divide(other: Point): Point {
    this.x /= other.x;
    this.y /= other.y;

    return this;
  }

  divideVal(value: number): Point {
    this.x /= value;
    this.y /= value;

    return this;
  }

  dot(other: Point): number {
    return this.x * other.x + this.y * other.y;
  }

  normalize(): Point {
    const l = this.getLength();
    if (l > 0) {
      this.x /= l;
      this.y /= l;
    }

    return this;
  }

  normalized(out?: Point): Point {
    if (out) {
      return out.copyFrom(this).normalize();
    } else {
      return this.clone().normalize();
    }
  }

  put(): void {
    Point.pool.push(this);
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}`;
  }
}
