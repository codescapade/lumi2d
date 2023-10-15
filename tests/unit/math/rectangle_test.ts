import { Rectangle } from '../../../src/math/rectangle';

describe('Test math/rectangle', () => {
  it('Should create an empty rectangle', () => {
    const rect = new Rectangle();
    assert.is_equal(rect.x, 0);
    assert.is_equal(rect.y, 0);
    assert.is_equal(rect.width, 0);
    assert.is_equal(rect.height, 0);
  });

  it('Should create a rectangle with values', () => {
    const rect = new Rectangle(4, 6, 10, 20);
    assert.is_equal(rect.x, 4);
    assert.is_equal(rect.y, 6);
    assert.is_equal(rect.width, 10);
    assert.is_equal(rect.height, 20);
  });
});
