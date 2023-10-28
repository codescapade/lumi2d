import { Point } from './point';

/**
 * @noSelf
 */
export class LiloMath {
  static lerp(a: number, b: number, position: number): number {
    return a + position * (b - a);
  }

  static clamp(value: number, min: number, max: number): number {
    if (min > max) {
      const temp = max;
      max = min;
      min = temp;
    }

    const lower = value < min ? min : value;

    if (lower > max) {
      return max;
    } else {
      return lower;
    }
  }

  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2));
  }

  static fuzzyEqual(a: number, b: number, epsilon = 0.0001): boolean {
    return math.abs(a - b) < epsilon;
  }

  static linesIntersect(
    p1StartX: number,
    p1StartY: number,
    p1EndX: number,
    p1EndY: number,
    p2StartX: number,
    p2StartY: number,
    p2EndX: number,
    p2EndY: number,
    out?: Point
  ): boolean {
    const b = Point.get(p1EndX - p1StartX, p1EndY - p1StartY);
    const d = Point.get(p2EndX - p2StartX, p2EndY - p2StartY);

    const bDotDPrep = b.x * d.y - b.y * d.x;
    if (bDotDPrep === 0) {
      b.put();
      d.put();

      return false;
    }

    const c = Point.get(p2StartX - p1StartX, p2StartY - p1StartY);
    const t = (c.x * d.y - c.y * d.x) / bDotDPrep;
    if (t < 0 || t > 1) {
      b.put();
      d.put();
      c.put();

      return false;
    }

    const u = (c.x * b.y - c.y * b.x) / bDotDPrep;
    if (u < 0 || u > 1) {
      b.put();
      d.put();
      c.put();

      return false;
    }

    if (out) {
      const point = Point.get(p1StartX, p1StartY);
      b.multiplyVal(t);
      point.add(b);

      if (out.equals(Point.ZERO)) {
        out.copyFrom(point);
      } else {
        const p1Start = Point.get(p1StartX, p1StartY);
        if (Point.distance(p1Start, point) < Point.distance(p1Start, out)) {
          out.copyFrom(point);
        }
        p1Start.put();
      }
      point.put();
    }

    b.put();
    d.put();
    c.put();

    return true;
  }

  static rotateAround(
    x: number,
    y: number,
    originX: number,
    originY: number,
    angle: number
  ): LuaMultiReturn<[number, number]> {
    const rad = math.rad(angle);
    const c = math.cos(rad);
    const s = math.sin(rad);

    const tx = x - originX;
    const ty = y - originY;

    x = tx * c - ty * s + originX;
    y = tx * c + ty * c + originY;

    return $multi(x, y);
  }
}
