import { Color } from '../../../src/graphics/color';

describe('Test graphics/color:', () => {
  it('Should create a new color.', () => {
    let color = new Color(0.2, 0.3, 0.4);
    assert.is_equal(0.2, color.red);
    assert.is_equal(0.3, color.green);
    assert.is_equal(0.4, color.blue);
    assert.is_equal(1.0, color.alpha);

    color = new Color(0.1, 0.2, 0.3, 0.4);
    assert.is_equal(0.1, color.red);
    assert.is_equal(0.2, color.green);
    assert.is_equal(0.3, color.blue);
    assert.is_equal(0.4, color.alpha);
  });

  it('Should create a color from bytes.', () => {
    const color = Color.fromBytes(127, 255, 0, 100);
    assert.is_near(0.498, color.red, 0.001);
    assert.is_near(1.0, color.green, 0.001);
    assert.is_near(0, color.blue, 0.001);
    assert.is_near(0.392, color.alpha, 0.001);
  });

  it('Should set new color values.', () => {
    const color = new Color(0.5, 0.2, 0.3);
    color.set(0.1, 0.6, 0.4, 0.5);

    assert.is_equal(0.1, color.red);
    assert.is_equal(0.6, color.green);
    assert.is_equal(0.4, color.blue);
    assert.is_equal(0.5, color.alpha);
  });

  it('Should clone a color.', () => {
    const color1 = Color.CYAN;
    let clone = color1.clone();

    assert.is_equal(color1.red, clone.red);
    assert.is_equal(color1.green, clone.green);
    assert.is_equal(color1.blue, clone.blue);
    assert.is_equal(color1.alpha, clone.alpha);

    const out = new Color(0, 0, 0, 0);
    clone = color1.clone(out);
    assert.is_equal(out, clone);

    assert.is_equal(color1.red, out.red);
    assert.is_equal(color1.green, out.green);
    assert.is_equal(color1.blue, out.blue);
    assert.is_equal(color1.alpha, out.alpha);
  });

  it('Should copy from another color.', () => {
    const color = new Color(0, 0, 0, 0);
    color.copyFrom(Color.PURPLE);

    assert.is_equal(Color.PURPLE.red, color.red);
    assert.is_equal(Color.PURPLE.green, color.green);
    assert.is_equal(Color.PURPLE.blue, color.blue);
    assert.is_equal(Color.PURPLE.alpha, color.alpha);
  });

  it('Should return the color parts.', () => {
    const color = new Color(0.2, 0.4, 0.6, 0.8);

    const [r, g, b, a] = color.parts();

    assert.is_equal(r, color.red);
    assert.is_equal(g, color.green);
    assert.is_equal(b, color.blue);
    assert.is_equal(a, color.alpha);
  });

  it('Should interpolate between two colors.', () => {
    const color1 = new Color(0, 0.2, 0.5, 1);
    const color2 = new Color(1, 1, 1, 1);

    let result = Color.interpolate(color1, color2, 0);

    assert.is_equal(0, result.red);
    assert.is_near(0.2, result.green, 0.001);
    assert.is_near(0.5, result.blue, 0.001);
    assert.is_equal(1, result.alpha);

    result = Color.interpolate(color1, color2, 0.25);

    assert.is_equal(0.25, result.red);
    assert.is_near(0.4, result.green, 0.001);
    assert.is_near(0.625, result.blue, 0.001);
    assert.is_equal(1, result.alpha);

    result = Color.interpolate(color1, color2, 0.5);

    assert.is_equal(0.5, result.red);
    assert.is_near(0.6, result.green, 0.001);
    assert.is_near(0.75, result.blue, 0.001);
    assert.is_equal(1, result.alpha);

    result = Color.interpolate(color1, color2, 0.75);

    assert.is_equal(0.75, result.red);
    assert.is_near(0.8, result.green, 0.001);
    assert.is_near(0.875, result.blue, 0.001);
    assert.is_equal(1, result.alpha);

    result = Color.interpolate(color1, color2, 1.0);

    assert.is_equal(1, result.red);
    assert.is_equal(1, result.green);
    assert.is_equal(1, result.blue);
    assert.is_equal(1, result.alpha);
  });
});
