import { Color } from '../../../src/graphics/color';

describe('Test graphics/color:', () => {
  it('Should create a new color.', () => {
    let color = new Color(0.2, 0.3, 0.4);
    assert.is_equal(color.red, 0.2);
    assert.is_equal(color.green, 0.3);
    assert.is_equal(color.blue, 0.4);
    assert.is_equal(color.alpha, 1.0);

    color = new Color(0.1, 0.2, 0.3, 0.4);
    assert.is_equal(color.red, 0.1);
    assert.is_equal(color.green, 0.2);
    assert.is_equal(color.blue, 0.3);
    assert.is_equal(color.alpha, 0.4);
  });

  it('Should create a color from bytes.', () => {
    const color = Color.fromBytes(127, 255, 0, 100);
    assert.is_near(color.red, 0.498, 0.001);
    assert.is_near(color.green, 1.0, 0.001);
    assert.is_near(color.blue, 0, 0.001);
    assert.is_near(color.alpha, 0.392, 0.001);
  });

  it('Should set new color values.', () => {
    const color = new Color(0.5, 0.2, 0.3);
    color.set(0.1, 0.6, 0.4, 0.5);

    assert.is_equal(color.red, 0.1);
    assert.is_equal(color.green, 0.6);
    assert.is_equal(color.blue, 0.4);
    assert.is_equal(color.alpha, 0.5);
  });

  it('Should clone a color.', () => {
    const color1 = Color.CYAN;
    let clone = color1.clone();

    assert.is_equal(clone.red, color1.red);
    assert.is_equal(clone.green, color1.green);
    assert.is_equal(clone.blue, color1.blue);
    assert.is_equal(clone.alpha, color1.alpha);

    const out = new Color(0, 0, 0, 0);
    clone = color1.clone(out);
    assert.is_equal(out, clone);

    assert.is_equal(out.red, color1.red);
    assert.is_equal(out.green, color1.green);
    assert.is_equal(out.blue, color1.blue);
    assert.is_equal(out.alpha, color1.alpha);
  });

  it('Should copy from another color.', () => {
    const color = new Color(0, 0, 0, 0);
    color.copyFrom(Color.PURPLE);

    assert.is_equal(color.red, Color.PURPLE.red);
    assert.is_equal(color.green, Color.PURPLE.green);
    assert.is_equal(color.blue, Color.PURPLE.blue);
    assert.is_equal(color.alpha, Color.PURPLE.alpha);
  });

  it('Should return the color parts.', () => {
    const color = new Color(0.2, 0.4, 0.6, 0.8);

    const [r, g, b, a] = color.parts();

    assert.is_equal(color.red, r);
    assert.is_equal(color.green, g);
    assert.is_equal(color.blue, b);
    assert.is_equal(color.alpha, a);
  });

  it('Should interpolate between two colors.', () => {
    const color1 = new Color(0, 0.2, 0.5, 1);
    const color2 = new Color(1, 1, 1, 1);

    let result = Color.interpolate(color1, color2, 0);

    assert.is_equal(result.red, 0);
    assert.is_near(result.green, 0.2, 0.001);
    assert.is_near(result.blue, 0.5, 0.001);
    assert.is_equal(result.alpha, 1);

    result = Color.interpolate(color1, color2, 0.25);

    assert.is_equal(result.red, 0.25);
    assert.is_near(result.green, 0.4, 0.001);
    assert.is_near(result.blue, 0.625, 0.001);
    assert.is_equal(result.alpha, 1);

    result = Color.interpolate(color1, color2, 0.5);

    assert.is_equal(result.red, 0.5);
    assert.is_near(result.green, 0.6, 0.001);
    assert.is_near(result.blue, 0.75, 0.001);
    assert.is_equal(result.alpha, 1);

    result = Color.interpolate(color1, color2, 0.75);

    assert.is_equal(result.red, 0.75);
    assert.is_near(result.green, 0.8, 0.001);
    assert.is_near(result.blue, 0.875, 0.001);
    assert.is_equal(result.alpha, 1);

    result = Color.interpolate(color1, color2, 1.0);

    assert.is_equal(result.red, 1);
    assert.is_equal(result.green, 1);
    assert.is_equal(result.blue, 1);
    assert.is_equal(result.alpha, 1);
  });
});
