import { Rectangle } from '../../../src/math/rectangle';

describe('Test math/rectangle:', () => {
  it('Should create an empty rectangle.', () => {
    const rect = new Rectangle();
    assert.is_equal(0, rect.x);
    assert.is_equal(0, rect.y);
    assert.is_equal(0, rect.width);
    assert.is_equal(0, rect.height);
  });

  it('Should create a rectangle with values.', () => {
    const rect = new Rectangle(4, 6, 10, 20);
    assert.is_equal(4, rect.x);
    assert.is_equal(6, rect.y);
    assert.is_equal(10, rect.width);
    assert.is_equal(20, rect.height);
  });

  it('Should check if a point is inside a rectangle.', () => {
    const rect = new Rectangle(10, 10, 100, 100);

    assert.is_true(rect.hasPoint(11, 50));
    assert.is_true(rect.hasPoint(10, 10));
    assert.is_true(rect.hasPoint(80, 110));

    assert.is_false(rect.hasPoint(9, 100));
    assert.is_false(rect.hasPoint(9, 4));
    assert.is_false(rect.hasPoint(115, 50));
  });

  it('Should check if a line intersects with a rectangle.', () => {
    const rect = new Rectangle(50, 50, 200, 200);

    assert.is_true(rect.intersectsLine(0, 0, 60, 150));
    assert.is_true(rect.intersectsLine(300, 450, 60, 150));

    assert.is_false(rect.intersectsLine(20, 40, 30, 200));

    // Line is inside the rectangle does not intersect.
    assert.is_false(rect.intersectsLine(80, 80, 140, 100));
  });
});
