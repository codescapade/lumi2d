import { Dict } from '../../../src';
import { Tween } from '../../../src/tweens';

describe('Test tweens/tween: #dev', () => {
  const target = { x: 0, y: 0 };

  before_each(() => {
    target.x = 0;
    target.y = 0;
  });

  it('Should create a new tween.', () => {
    const tween = new Tween(target, 2, { x: 0 }, { x: 20 }, 5);

    assert.is_not_nil(tween);
    assert.is_equal(5, tween.repeat);
  });

  it('Should add an on complete callback.', () => {
    const callback = (): void => {};

    const tween = new Tween(target, 2, { x: 0 }, { x: 20 });
    tween.setOnComplete(callback);

    assert.is_equal(callback, tween.onComplete);
  });

  it('Should add an on update callback.', () => {
    const callback = (_target: Dict): void => {};

    const tween = new Tween(target, 2, { x: 0 }, { x: 20 });
    tween.setOnUpdate(callback);

    assert.is_equal(callback, tween.onUpdate);
  });

  it('Should update the tween.', () => {
    const wrapper = {
      callback: (_target: Dict): void => {},
    };

    const s = spy.on(wrapper, 'callback');

    const tween = new Tween(target, 2, { x: 0 }, { x: 20 });
    tween.setOnUpdate(wrapper.callback);

    tween.update(1);
    assert.is_equal(10, target.x);
    assert.spy(s).was.called();
  });

  it('Should not update inactive, paused or complete tweens', () => {
    const tween = new Tween(target, 2, { x: 0 }, { x: 20 });

    tween.active = false;
    tween.update(1);

    assert.is_equal(0, target.x);

    tween.active = true;
    tween.paused = true;
    tween.update(1);

    assert.is_equal(0, target.x);

    tween.paused = false;
    tween.complete = true;
    tween.update(1);

    assert.is_equal(0, target.x);

    tween.complete = false;
    tween.update(1);

    assert.is_equal(10, target.x);
  });
});
