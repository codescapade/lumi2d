import { Tween, TweenList, TweenSequence, Tweens } from '../../../src/tweens';

describe('Test tweens/tweens:', () => {
  let tween: Tween;
  let tween2: Tween;

  let sequence: TweenSequence;
  let list: TweenList;

  const test = { x: 10, y: 20 };
  const test2 = { x: 0 };

  before_each(() => {
    test.x = 10;
    tween = new Tween(test, 2, { x: test.x }, { x: 20 });
    tween2 = new Tween(test2, 2, { x: test2.x }, { x: 40 });

    sequence = new TweenSequence([tween, tween2]);

    list = { completed: [], current: [], sequences: [] };
    Tweens.setTweenList(list);
  });

  it('Should add a tween', () => {
    Tweens.addTween(tween);

    assert.is_equal(1, list.current.length);
    assert.is_equal(tween, list.current[0]);
  });

  it('Should add a sequence', () => {
    Tweens.addSequence(sequence);

    assert.is_equal(1, list.sequences.length);
    assert.is_equal(sequence, list.sequences[0]);
  });

  it('Should update tweens', () => {
    Tweens.addTween(tween);
    Tweens.addTween(tween2);
    Tweens.update(1);

    assert.equal(15, test.x);
    assert.equal(20, test2.x);
  });

  it('Should complete a tween.', () => {
    const callback = {
      complete: (): void => {},
    };

    const s = spy.on(callback, 'complete');

    tween.setOnComplete(callback.complete);
    Tweens.addTween(tween);
    Tweens.update(2.1);

    assert.is_equal(true, tween.complete);
    assert.spy(s).was.called();

    assert.is_equal(0, list.current.length);
  });

  it('Should update a sequence.', () => {
    Tweens.addSequence(sequence);
    Tweens.update(1);

    assert.is_equal(15, test.x);
    assert.is_equal(0, sequence.index);

    Tweens.update(3);

    assert.is_equal(20, test2.x);
    assert.is_equal(1, sequence.index);
  });

  it('Should pause all tweens.', () => {
    Tweens.addTween(tween);
    Tweens.addTween(tween2);

    assert.is_equal(false, tween.paused);
    assert.is_equal(false, tween2.paused);

    Tweens.pauseAll();

    assert.is_equal(true, tween.paused);
    assert.is_equal(true, tween2.paused);
  });

  it('Should resume all tweens.', () => {
    Tweens.addTween(tween);
    Tweens.addTween(tween2);

    Tweens.pauseAll();

    assert.is_equal(true, tween.paused);
    assert.is_equal(true, tween2.paused);

    Tweens.resumeAll();

    assert.is_equal(false, tween.paused);
    assert.is_equal(false, tween2.paused);
  });

  it('Should remove a tween.', () => {
    Tweens.addTween(tween);
    Tweens.addTween(tween2);

    assert.is_equal(2, list.current.length);

    Tweens.removeTween(tween);

    assert.is_equal(1, list.current.length);
    assert.is_equal(tween2, list.current[0]);
  });

  it('Should remove a sequence.', () => {
    Tweens.addSequence(sequence);

    assert.equal(1, list.sequences.length);

    Tweens.removeSequence(sequence);

    assert.is_equal(0, list.sequences.length);
  });

  it('Should remove all tweens from an object', () => {
    const tween3 = new Tween(test, 2, { y: test.y }, { y: 20 });

    Tweens.addTween(tween);
    Tweens.addTween(tween2);
    Tweens.addTween(tween3);

    assert.is_equal(3, list.current.length);

    Tweens.removeAllFrom(test);

    assert.is_equal(1, list.current.length);
    assert.is_equal(tween2, list.current[0]);
  });
});
