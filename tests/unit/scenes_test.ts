import { Scene, Scenes } from '../../src/scenes';

describe('Test scenes:', () => {
  before_each(() => {
    while (Scenes.sceneStack.length > 0) {
      Scenes.sceneStack.pop();
    }
  });

  it('Should push a new scene.', () => {
    Scenes.push(TestScene);
    assert.is_equal(Scenes.sceneStack.length, 1);
    assert.is_true(Scenes.current() instanceof TestScene);
  });

  it('Should pop a scene.', () => {
    Scenes.push(TestScene);
    assert.is_equal(Scenes.sceneStack.length, 1);

    // Can't pop only scene.
    Scenes.pop();
    assert.is_equal(Scenes.sceneStack.length, 1);

    Scenes.push(TestScene2);
    assert.is_equal(Scenes.sceneStack.length, 2);
    const current = Scenes.current();
    spy.on(current, 'destroy');

    Scenes.pop();
    assert.is_equal(Scenes.sceneStack.length, 1);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.spy(current.destroy).was.called();
  });

  it('Should replace a scene.', () => {
    Scenes.push(TestScene);
    assert.is_equal(Scenes.sceneStack.length, 1);
    assert.is_true(Scenes.current() instanceof TestScene);
    const current = Scenes.current();
    spy.on(current, 'destroy');

    Scenes.replace(TestScene2);
    assert.is_equal(Scenes.sceneStack.length, 1);
    assert.is_true(Scenes.current() instanceof TestScene2);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.spy(current.destroy).was.called();
  });

  it('Should replace all scenes.', () => {
    Scenes.push(TestScene);
    Scenes.push(TestScene);
    Scenes.push(TestScene);

    assert.is_equal(Scenes.sceneStack.length, 3);

    const scene1 = Scenes.sceneStack[0];
    spy.on(scene1, 'destroy');

    const scene2 = Scenes.sceneStack[1];
    spy.on(scene2, 'destroy');

    const scene3 = Scenes.sceneStack[2];
    spy.on(scene3, 'destroy');

    Scenes.replace(TestScene2, true);
    assert.is_equal(Scenes.sceneStack.length, 1);
    assert.is_true(Scenes.current() instanceof TestScene2);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.spy(scene1.destroy).was.called();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.spy(scene2.destroy).was.called();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.spy(scene3.destroy).was.called();
  });

  it('Should replace a scene below.', () => {
    Scenes.push(TestScene);
    Scenes.push(TestScene2);

    assert.is_equal(Scenes.sceneStack.length, 2);

    const first = Scenes.sceneStack[0];
    assert.is_true(first instanceof TestScene);

    spy.on(first, 'destroy');

    Scenes.replace(TestScene2, false, true);
    assert.is_equal(Scenes.sceneStack.length, 2);
    assert.is_true(Scenes.sceneStack[0] instanceof TestScene2);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.spy(first.destroy).was.called();
  });
});

class TestScene extends Scene {
  override load(): void {}
}

class TestScene2 extends Scene {
  override load(): void {}
}
