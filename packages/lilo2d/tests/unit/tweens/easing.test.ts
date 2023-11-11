import {
  easeInBack,
  easeInBounce,
  easeInCircular,
  easeInCubic,
  easeInElastic,
  easeInExpo,
  easeInOutBack,
  easeInOutBounce,
  easeInOutCircular,
  easeInOutCubic,
  easeInOutElastic,
  easeInOutExpo,
  easeInOutQuad,
  easeInOutQuart,
  easeInOutQuint,
  easeInOutSine,
  easeInQuad,
  easeInQuart,
  easeInQuint,
  easeInSine,
  easeLinear,
  easeOutBack,
  easeOutBounce,
  easeOutCircular,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  easeOutQuad,
  easeOutQuart,
  easeOutQuint,
  easeOutSine,
} from '../../../src/tweens';

describe('Test tweens/easing:', () => {
  it('Should ease linear.', () => {
    let value = easeLinear(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeLinear(0.25, 0, 10, 1);
    assert.is_near(2.5, value, 0.0001);

    value = easeLinear(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeLinear(0.75, 0, 10, 1);
    assert.is_near(7.5, value, 0.0001);

    value = easeLinear(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in sine.', () => {
    let value = easeInSine(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInSine(0.25, 0, 10, 1);
    assert.is_near(0.7612, value, 0.0001);

    value = easeInSine(0.5, 0, 10, 1);
    assert.is_near(2.9289, value, 0.0001);

    value = easeInSine(0.75, 0, 10, 1);
    assert.is_near(6.1731, value, 0.0001);

    value = easeInSine(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out sine.', () => {
    let value = easeOutSine(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutSine(0.25, 0, 10, 1);
    assert.is_near(3.8268, value, 0.0001);

    value = easeOutSine(0.5, 0, 10, 1);
    assert.is_near(7.071, value, 0.0001);

    value = easeOutSine(0.75, 0, 10, 1);
    assert.is_near(9.2387, value, 0.0001);

    value = easeOutSine(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out sine.', () => {
    let value = easeInOutSine(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutSine(0.25, 0, 10, 1);
    assert.is_near(1.4644, value, 0.0001);

    value = easeInOutSine(0.5, 0, 10, 1);
    assert.is_near(4.9999, value, 0.0001);

    value = easeInOutSine(0.75, 0, 10, 1);
    assert.is_near(8.5355, value, 0.0001);

    value = easeInOutSine(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in quint.', () => {
    let value = easeInQuint(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInQuint(0.25, 0, 10, 1);
    assert.is_near(0.0097, value, 0.0001);

    value = easeInQuint(0.5, 0, 10, 1);
    assert.is_near(0.3125, value, 0.0001);

    value = easeInQuint(0.75, 0, 10, 1);
    assert.is_near(2.373, value, 0.0001);

    value = easeInQuint(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out quint.', () => {
    let value = easeOutQuint(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutQuint(0.25, 0, 10, 1);
    assert.is_near(7.6269, value, 0.0001);

    value = easeOutQuint(0.5, 0, 10, 1);
    assert.is_near(9.6875, value, 0.0001);

    value = easeOutQuint(0.75, 0, 10, 1);
    assert.is_near(9.9902, value, 0.0001);

    value = easeOutQuint(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out quint.', () => {
    let value = easeInOutQuint(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutQuint(0.25, 0, 10, 1);
    assert.is_near(0.1562, value, 0.0001);

    value = easeInOutQuint(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutQuint(0.75, 0, 10, 1);
    assert.is_near(9.8437, value, 0.0001);

    value = easeInOutQuint(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in quart.', () => {
    let value = easeInQuart(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInQuart(0.25, 0, 10, 1);
    assert.is_near(0.039, value, 0.0001);

    value = easeInQuart(0.5, 0, 10, 1);
    assert.is_near(0.625, value, 0.0001);

    value = easeInQuart(0.75, 0, 10, 1);
    assert.is_near(3.164, value, 0.0001);

    value = easeInQuart(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out quart.', () => {
    let value = easeOutQuart(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutQuart(0.25, 0, 10, 1);
    assert.is_near(6.8359, value, 0.0001);

    value = easeOutQuart(0.5, 0, 10, 1);
    assert.is_near(9.375, value, 0.0001);

    value = easeOutQuart(0.75, 0, 10, 1);
    assert.is_near(9.9609, value, 0.0001);

    value = easeOutQuart(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out quart.', () => {
    let value = easeInOutQuart(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutQuart(0.25, 0, 10, 1);
    assert.is_near(0.3125, value, 0.0001);

    value = easeInOutQuart(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutQuart(0.75, 0, 10, 1);
    assert.is_near(9.6875, value, 0.0001);

    value = easeInOutQuart(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in quad.', () => {
    let value = easeInQuad(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInQuad(0.25, 0, 10, 1);
    assert.is_near(0.625, value, 0.0001);

    value = easeInQuad(0.5, 0, 10, 1);
    assert.is_near(2.5, value, 0.0001);

    value = easeInQuad(0.75, 0, 10, 1);
    assert.is_near(5.625, value, 0.0001);

    value = easeInQuad(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out quad.', () => {
    let value = easeOutQuad(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutQuad(0.25, 0, 10, 1);
    assert.is_near(4.375, value, 0.0001);

    value = easeOutQuad(0.5, 0, 10, 1);
    assert.is_near(7.5, value, 0.0001);

    value = easeOutQuad(0.75, 0, 10, 1);
    assert.is_near(9.375, value, 0.0001);

    value = easeOutQuad(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out quad.', () => {
    let value = easeInOutQuad(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutQuad(0.25, 0, 10, 1);
    assert.is_near(1.25, value, 0.0001);

    value = easeInOutQuad(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutQuad(0.75, 0, 10, 1);
    assert.is_near(8.75, value, 0.0001);

    value = easeInOutQuad(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in expo.', () => {
    let value = easeInExpo(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInExpo(0.25, 0, 10, 1);
    assert.is_near(0.0552, value, 0.0001);

    value = easeInExpo(0.5, 0, 10, 1);
    assert.is_near(0.3125, value, 0.0001);

    value = easeInExpo(0.75, 0, 10, 1);
    assert.is_near(1.7677, value, 0.0001);

    value = easeInExpo(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out expo.', () => {
    let value = easeOutExpo(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutExpo(0.25, 0, 10, 1);
    assert.is_near(8.2322, value, 0.0001);

    value = easeOutExpo(0.5, 0, 10, 1);
    assert.is_near(9.6875, value, 0.0001);

    value = easeOutExpo(0.75, 0, 10, 1);
    assert.is_near(9.9447, value, 0.0001);

    value = easeOutExpo(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out expo.', () => {
    let value = easeInOutExpo(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutExpo(0.25, 0, 10, 1);
    assert.is_near(0.1562, value, 0.0001);

    value = easeInOutExpo(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutExpo(0.75, 0, 10, 1);
    assert.is_near(9.8437, value, 0.0001);

    value = easeInOutExpo(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in elastic.', () => {
    let value = easeInElastic(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInElastic(0.25, 0, 10, 1);
    assert.is_near(-0.0552, value, 0.0001);

    value = easeInElastic(0.5, 0, 10, 1);
    assert.is_near(-0.1562, value, 0.0001);

    value = easeInElastic(0.75, 0, 10, 1);
    assert.is_near(0.8838, value, 0.0001);

    value = easeInElastic(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out elastic.', () => {
    let value = easeOutElastic(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutElastic(0.25, 0, 10, 1);
    assert.is_near(9.1161, value, 0.0001);

    value = easeOutElastic(0.5, 0, 10, 1);
    assert.is_near(10.1562, value, 0.0001);

    value = easeOutElastic(0.75, 0, 10, 1);
    assert.is_near(10.0552, value, 0.0001);

    value = easeOutElastic(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out elastic.', () => {
    let value = easeInOutElastic(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutElastic(0.25, 0, 10, 1);
    assert.is_near(0.1196, value, 0.0001);

    value = easeInOutElastic(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutElastic(0.75, 0, 10, 1);
    assert.is_near(9.8803, value, 0.0001);

    value = easeInOutElastic(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in circular.', () => {
    let value = easeInCircular(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInCircular(0.25, 0, 10, 1);
    assert.is_near(0.3175, value, 0.0001);

    value = easeInCircular(0.5, 0, 10, 1);
    assert.is_near(1.3397, value, 0.0001);

    value = easeInCircular(0.75, 0, 10, 1);
    assert.is_near(3.3856, value, 0.0001);

    value = easeInCircular(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out circular.', () => {
    let value = easeOutCircular(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutCircular(0.25, 0, 10, 1);
    assert.is_near(6.6143, value, 0.0001);

    value = easeOutCircular(0.5, 0, 10, 1);
    assert.is_near(8.6602, value, 0.0001);

    value = easeOutCircular(0.75, 0, 10, 1);
    assert.is_near(9.6824, value, 0.0001);

    value = easeOutCircular(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out circular.', () => {
    let value = easeInOutCircular(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutCircular(0.25, 0, 10, 1);
    assert.is_near(0.6698, value, 0.0001);

    value = easeInOutCircular(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutCircular(0.75, 0, 10, 1);
    assert.is_near(9.3301, value, 0.0001);

    value = easeInOutCircular(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in back.', () => {
    let value = easeInBack(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInBack(0.25, 0, 10, 1);
    assert.is_near(-0.6413, value, 0.0001);

    value = easeInBack(0.5, 0, 10, 1);
    assert.is_near(-0.8769, value, 0.0001);

    value = easeInBack(0.75, 0, 10, 1);
    assert.is_near(1.8259, value, 0.0001);

    value = easeInBack(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out back.', () => {
    let value = easeOutBack(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutBack(0.25, 0, 10, 1);
    assert.is_near(8.174, value, 0.0001);

    value = easeOutBack(0.5, 0, 10, 1);
    assert.is_near(10.8769, value, 0.0001);

    value = easeOutBack(0.75, 0, 10, 1);
    assert.is_near(10.6413, value, 0.0001);

    value = easeOutBack(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out back.', () => {
    let value = easeInOutBack(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutBack(0.25, 0, 10, 1);
    assert.is_near(-0.9968, value, 0.0001);

    value = easeInOutBack(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutBack(0.75, 0, 10, 1);
    assert.is_near(10.9968, value, 0.0001);

    value = easeInOutBack(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in bounce.', () => {
    let value = easeInBounce(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInBounce(0.25, 0, 10, 1);
    assert.is_near(0.2734, value, 0.0001);

    value = easeInBounce(0.5, 0, 10, 1);
    assert.is_near(2.3437, value, 0.0001);

    value = easeInBounce(0.75, 0, 10, 1);
    assert.is_near(5.2734, value, 0.0001);

    value = easeInBounce(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out bounce.', () => {
    let value = easeOutBounce(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutBounce(0.25, 0, 10, 1);
    assert.is_near(4.7265, value, 0.0001);

    value = easeOutBounce(0.5, 0, 10, 1);
    assert.is_near(7.6562, value, 0.0001);

    value = easeOutBounce(0.75, 0, 10, 1);
    assert.is_near(9.7265, value, 0.0001);

    value = easeOutBounce(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out bounce.', () => {
    let value = easeInOutBounce(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutBounce(0.25, 0, 10, 1);
    assert.is_near(1.1718, value, 0.0001);

    value = easeInOutBounce(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutBounce(0.75, 0, 10, 1);
    assert.is_near(8.8281, value, 0.0001);

    value = easeInOutBounce(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in cubic.', () => {
    let value = easeInCubic(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInCubic(0.25, 0, 10, 1);
    assert.is_near(0.1562, value, 0.0001);

    value = easeInCubic(0.5, 0, 10, 1);
    assert.is_near(1.25, value, 0.0001);

    value = easeInCubic(0.75, 0, 10, 1);
    assert.is_near(4.2187, value, 0.0001);

    value = easeInCubic(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease out cubic.', () => {
    let value = easeOutCubic(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeOutCubic(0.25, 0, 10, 1);
    assert.is_near(5.7812, value, 0.0001);

    value = easeOutCubic(0.5, 0, 10, 1);
    assert.is_near(8.75, value, 0.0001);

    value = easeOutCubic(0.75, 0, 10, 1);
    assert.is_near(9.8437, value, 0.0001);

    value = easeOutCubic(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });

  it('Should ease in out cubic.', () => {
    let value = easeInOutCubic(0, 0, 10, 1);
    assert.is_near(0, value, 0.0001);

    value = easeInOutCubic(0.25, 0, 10, 1);
    assert.is_near(0.625, value, 0.0001);

    value = easeInOutCubic(0.5, 0, 10, 1);
    assert.is_near(5, value, 0.0001);

    value = easeInOutCubic(0.75, 0, 10, 1);
    assert.is_near(9.375, value, 0.0001);

    value = easeInOutCubic(1, 0, 10, 1);
    assert.is_near(10, value, 0.0001);
  });
});
