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
});
