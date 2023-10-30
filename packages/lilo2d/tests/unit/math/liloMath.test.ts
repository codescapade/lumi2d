import { Point } from '../../../src/math/point';
import { LiloMath } from '../../../src/math/liloMath';

describe('Test math/liloMath:', () => {
  it('Should lerp a value.', () => {
    let value = LiloMath.lerp(5, 15, 0);
    assert.is_equal(5, value);

    value = LiloMath.lerp(5, 15, 0.5);
    assert.is_equal(10, value);

    value = LiloMath.lerp(5, 15, 1);
    assert.is_equal(15, value);
  });

  it('Should clamp a value.', () => {
    let value = LiloMath.clamp(10, 5, 10);
    assert.is_equal(10, value);

    value = LiloMath.clamp(10, 12, 15);
    assert.is_equal(12, value);

    value = LiloMath.clamp(10, 2, 7);
    assert.is_equal(7, value);
  });

  it('Should calculate the distance between two points', () => {
    let distance = LiloMath.distance(2, 0, 5, 0);
    assert.is_equal(3, distance);

    distance = LiloMath.distance(-10, -10, 10, 10);
    assert.is_near(28.284, distance, 0.001);

    distance = LiloMath.distance(5, 5, -10, -10);
    assert.is_near(21.213, distance, 0.001);
  });

  it('Should compare two values that are almost equal', () => {
    let equal = LiloMath.fuzzyEqual(20.23487, 20.234921);
    assert.is_true(equal);

    equal = LiloMath.fuzzyEqual(20.23387, 20.234921);
    assert.is_false(equal);

    equal = LiloMath.fuzzyEqual(20.23387, 20.234921, 0.01);
    assert.is_true(equal);
  });

  it('Should check if two lines intersect.', () => {
    const p = new Point();
    let intersects = LiloMath.linesIntersect(0, 0, 10, 0, 5, -5, 5, 5, p);

    assert.is_true(intersects);
    assert.is_equal(5, p.x);
    assert.is_equal(0, p.y);

    intersects = LiloMath.linesIntersect(10, 10, 20, 20, 12, 10, 22, 20);

    assert.is_false(intersects);
  });

  it('Should rotate around a point.', () => {
    let [x, y] = LiloMath.rotateAround(0, 10, 10, 10, 0);
    assert.is_equal(0, x);
    assert.is_equal(10, y);

    [x, y] = LiloMath.rotateAround(0, 10, 10, 10, 90);
    assert.is_equal(10, x);
    assert.is_equal(0, y);

    [x, y] = LiloMath.rotateAround(0, 10, 10, 10, 180);
    assert.is_near(20, x, 0.001);
    assert.is_near(10, y, 0.001);

    [x, y] = LiloMath.rotateAround(0, 10, 10, 10, 270);
    assert.is_near(10, x, 0.001);
    assert.is_near(20, y, 0.001);
  });
});
