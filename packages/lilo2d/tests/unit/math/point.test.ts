import { Point } from '../../../src/math/point';

describe('Test math/point:', () => {
  it('Should create a new point.', () => {
    const point = new Point(10, 20);

    assert.is_equal(10, point.x);
    assert.is_equal(20, point.y);
  });

  it('Should create a point with default values.', () => {
    const point = new Point();

    assert.is_equal(0, point.x);
    assert.is_equal(0, point.y);
  });

  it('Should have to correct direction constants.', () => {
    assert.is_equal(-1, Point.LEFT.x);
    assert.is_equal(0, Point.LEFT.y);

    assert.is_equal(1, Point.RIGHT.x);
    assert.is_equal(0, Point.RIGHT.y);

    assert.is_equal(0, Point.UP.x);
    assert.is_equal(-1, Point.UP.y);

    assert.is_equal(0, Point.DOWN.x);
    assert.is_equal(1, Point.DOWN.y);

    assert.is_equal(0, Point.ZERO.x);
    assert.is_equal(0, Point.ZERO.y);
  });

  it('Should add two points.', () => {
    const point = Point.addPoints(new Point(10, 5), new Point(4, -2));

    assert.is_equal(14, point.x);
    assert.is_equal(3, point.y);
  });

  it('Should subtract two points.', () => {
    const point = Point.subtractPoints(new Point(10, 5), new Point(3, 2));

    assert.is_equal(7, point.x);
    assert.is_equal(3, point.y);
  });

  it('Should multiple two points.', () => {
    const point = Point.multiplyPoints(new Point(10, 5), new Point(4, 2));

    assert.is_equal(40, point.x);
    assert.is_equal(10, point.y);
  });

  it('Should divide two points.', () => {
    const point = Point.dividePoints(new Point(10, 30), new Point(5, 10));

    assert.is_equal(2, point.x);
    assert.is_equal(3, point.y);
  });

  it('Should calculate the distance between two points.', () => {
    let distance = Point.distance(new Point(2, 0), new Point(5, 0));
    assert.is_equal(3, distance);

    distance = Point.distance(new Point(-10, -10), new Point(10, 10));
    assert.is_near(28.284, distance, 0.001);

    distance = Point.distance(new Point(5, 5), new Point(-10, -10));
    assert.is_near(21.213, distance, 0.001);
  });

  it('Should rotate around a position.', () => {
    const point = new Point(0, 10);
    const result = Point.rotateAround(point, 10, 10, 0);

    assert.is_equal(0, point.x);
    assert.is_equal(10, point.y);
    assert.is_equal(point, result);

    point.set(0, 10);
    Point.rotateAround(point, 10, 10, 90);

    assert.is_near(10, point.x, 0.001);
    assert.is_near(0, point.y, 0.001);

    point.set(0, 10);
    Point.rotateAround(point, 10, 10, 180);

    assert.is_near(20, point.x, 0.001);
    assert.is_near(10, point.y, 0.001);

    point.set(0, 10);
    Point.rotateAround(point, 10, 10, 270);

    assert.is_near(10, point.x, 0.001);
    assert.is_near(20, point.y, 0.001);
  });

  it('Should rotate around a point.', () => {
    const point = new Point(0, 10);
    const center = new Point(10, 10);
    const result = Point.rotateAroundPoint(point, center, 0);

    assert.is_equal(0, point.x);
    assert.is_equal(10, point.y);
    assert.is_equal(point, result);

    point.set(0, 10);
    Point.rotateAroundPoint(point, center, 90);

    assert.is_near(10, point.x, 0.001);
    assert.is_near(0, point.y, 0.001);

    point.set(0, 10);
    Point.rotateAroundPoint(point, center, 180);

    assert.is_near(20, point.x, 0.001);
    assert.is_near(10, point.y, 0.001);

    point.set(0, 10);
    Point.rotateAroundPoint(point, center, 270);

    assert.is_near(10, point.x, 0.001);
    assert.is_near(20, point.y, 0.001);
  });

  it('Should get the length of a point.', () => {
    const length = new Point(3, 5).getLength();

    assert.is_near(5.83, length, 0.001);
  });

  it('Should set the length of a point.', () => {
    const point = new Point(4, 8);
    point.setLength(10);
    const length = point.getLength();

    assert.is_near(10, length, 0.001);
    assert.is_near(4.472, point.x, 0.001);
    assert.is_near(8.944, point.y, 0.001);
  });

  it('Should set new values.', () => {
    const point = new Point(3, 8);

    assert.is_equal(3, point.x);
    assert.is_equal(8, point.y);

    const result = point.set(10, -4);

    assert.is_equal(10, point.x);
    assert.is_equal(-4, point.y);
    assert.is_equal(result, point);
  });

  it('Should clone a point.', () => {
    const point = new Point(4, 3);
    let result = point.clone();

    assert.is_equal(4, result.x);
    assert.is_equal(3, result.y);

    result = new Point(5, 0);
    const other = point.clone(result);

    assert.is_equal(other, result);
    assert.is_equal(4, other.x);
    assert.is_equal(3, other.y);
  });

  it('Should copy from a point.', () => {
    const point1 = new Point(12, 49);
    const point2 = new Point(2, 8);

    const result = point2.copyFrom(point1);

    assert.is_equal(point1.x, point2.x);
    assert.is_equal(point1.y, point2.y);
    assert.is_not_equal(point1, point2);
    assert.is_equal(point2, result);
  });

  it('Should compare two points.', () => {
    const point1 = new Point(4, 3);
    const point2 = new Point(4, 3);

    assert.is_true(point1.equals(point2));
    assert.is_not_equal(point1, point2);

    point2.set(2, 5);

    assert.is_false(point1.equals(point2));
  });

  it('Should add a point.', () => {
    const point1 = new Point(4, 2);
    const point2 = new Point(8, 3);
    const result = point1.add(point2);

    assert.is_equal(12, point1.x);
    assert.is_equal(5, point1.y);
    assert.is_equal(point1, result);
  });

  it('Should add a value.', () => {
    const point = new Point(8, 23);
    const result = point.addVal(4);

    assert.is_equal(12, point.x);
    assert.is_equal(27, point.y);
    assert.is_equal(point, result);
  });

  it('Should subtract a point.', () => {
    const point1 = new Point(4, 2);
    const point2 = new Point(8, 3);
    const result = point1.subtract(point2);

    assert.is_equal(-4, point1.x);
    assert.is_equal(-1, point1.y);
    assert.is_equal(point1, result);
  });

  it('Should subtract a value.', () => {
    const point = new Point(8, 23);
    const result = point.subtractVal(4);

    assert.is_equal(4, point.x);
    assert.is_equal(19, point.y);
    assert.is_equal(point, result);
  });

  it('Should multiply with a point.', () => {
    const point1 = new Point(4, 2);
    const point2 = new Point(8, 3);
    const result = point1.multiply(point2);

    assert.is_equal(32, point1.x);
    assert.is_equal(6, point1.y);
    assert.is_equal(point1, result);
  });

  it('Should multiply with a value.', () => {
    const point = new Point(8, 23);
    const result = point.multiplyVal(4);

    assert.is_equal(32, point.x);
    assert.is_equal(92, point.y);
    assert.is_equal(point, result);
  });

  it('Should divide by a point.', () => {
    const point1 = new Point(28, 42);
    const point2 = new Point(4, 7);
    const result = point1.divide(point2);

    assert.is_equal(7, point1.x);
    assert.is_equal(6, point1.y);
    assert.is_equal(point1, result);
  });

  it('Should divide by a value.', () => {
    const point = new Point(27, 72);
    const result = point.divideVal(9);

    assert.is_equal(3, point.x);
    assert.is_equal(8, point.y);
    assert.is_equal(point, result);
  });

  it('Should calculate the do product of two points.', () => {
    const point1 = new Point(4, 8);
    const point2 = new Point(2, 12);
    const result = point1.dot(point2);

    assert.is_equal(104, result);
  });

  it('Should normalize a point.', () => {
    const point = new Point(10, 5);
    const result = point.normalize();

    assert.is_near(0.8944, point.x, 0.001);
    assert.is_near(0.4472, point.y, 0.001);
    assert.is_equal(point, result);
  });

  it('Should return a normalized point.', () => {
    const point = new Point(10, 5);

    const p2 = new Point();
    const result = point.normalized(p2);

    assert.is_near(0.8944, p2.x, 0.001);
    assert.is_near(0.4472, p2.y, 0.001);
    assert.is_equal(p2, result);
    assert.is_equal(10, point.x);
    assert.is_equal(5, point.y);
  });
});
