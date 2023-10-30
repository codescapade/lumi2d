/* eslint-disable @typescript-eslint/unbound-method */

import { Transform } from 'love.math';
import { Events } from '../../src/events';
import { Scene, Scenes } from '../../src/scenes';
import { Canvas, Drawable, DrawableTypes } from 'love.graphics';
import { Entity } from '../../src/entity';

insulate('Scenes tests:', () => {
  // Mock love functions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (_G as any).love = {
    graphics: {
      getWidth: (): number => {
        return 800;
      },
      getHeight: (): number => {
        return 600;
      },
      newCanvas: (): Canvas => {
        return {} as Canvas;
      },
      getCanvas: (): Canvas => {
        return {} as Canvas;
      },
      setCanvas: (_canvas: Canvas): void => {},
      clear: (_r: number, _g: number, _b: number, _a: number): void => {},
      push: (): void => {},
      pop: (): void => {},
      origin: (): void => {},
      applyTransform: (_transform: Transform): void => {},
      setColor: (_r: number, _g: number, _b: number, _a: number): void => {},
      draw: (_drawable: Drawable<DrawableTypes>): void => {},
    },
    math: {
      newTransform: (): Transform => {
        return {
          reset: (): void => {},
          translate: (_x: number, _y: number): Transform => {
            return {
              rotate: (_angle: number): Transform => {
                return {
                  scale: (_x: number, _y: number): Transform => {
                    return {
                      translate: (_x: number, _y: number): Transform => {
                        return {} as Transform;
                      },
                    } as Transform;
                  },
                } as Transform;
              },
            } as Transform;
          },
        } as Transform;
      },
    },
  };

  describe('Test scenes:', () => {
    before_each(() => {
      while (Scenes.sceneStack.length > 0) {
        Scenes.sceneStack.pop();
      }
    });

    it('Should push a new scene.', () => {
      Scenes.push(TestScene);
      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_true(Scenes.current() instanceof TestScene);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());
    });

    it('Should pop a scene.', () => {
      Scenes.push(TestScene);
      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());

      // Can't pop only scene.
      Scenes.pop();
      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());

      Scenes.push(TestScene2);
      assert.is_equal(2, Scenes.sceneStack.length);
      const current = Scenes.current();
      spy.on(current, 'destroy');

      Scenes.pop();
      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());

      assert.spy(current.destroy).was.called();
    });

    it('Should replace a scene.', () => {
      Scenes.push(TestScene);

      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_true(Scenes.current() instanceof TestScene);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());
      const current = Scenes.current();
      spy.on(current, 'destroy');

      Scenes.replace(TestScene2);
      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_true(Scenes.current() instanceof TestScene2);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());

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
      assert.is_equal(1, Scenes.sceneStack.length);
      assert.is_true(Scenes.current() instanceof TestScene2);
      assert.is_equal(Scenes.current().getEventHandlers(), Events.getSceneHandlers());

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
      assert.is_equal(2, Scenes.sceneStack.length);
      assert.is_true(Scenes.sceneStack[0] instanceof TestScene2);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      assert.spy(first.destroy).was.called();
    });
  });

  describe('Test scene.', () => {
    let scene: TestScene;

    before_each(() => {
      scene = new TestScene();
    });

    it('Should create a scene with 32 layers.', () => {
      assert.is_equal(32, scene.layers.length);
    });

    it('Should create a scene with a default camera.', () => {
      assert.is_equal(1, scene.cameras.length);
    });

    it('Should add an entity.', () => {
      const e = new TestEntity();
      scene.addEntity(e);

      assert.is_equal(1, scene.entities.length);
      assert.is_equal(e, scene.entities[0]);

      assert.is_equal(1, scene.layers[e.layer].length);
      assert.is_equal(e, scene.layers[e.layer][0]);
    });

    it('Should remove an entity', () => {
      const e = new TestEntity();

      spy.on(e, 'destroy');

      scene.addEntity(e);

      assert.is_equal(1, scene.entities.length);
      assert.is_equal(1, scene.layers[e.layer].length);

      scene.removeEntity(e);

      // Should not remove the entity until the next update.
      assert.is_equal(1, scene.entities.length);
      assert.is_equal(1, scene.layers[e.layer].length);

      scene.update(1);

      assert.is_equal(0, scene.entities.length);
      assert.is_equal(0, scene.layers[e.layer].length);

      assert.spy(e.destroy).was.called();
    });

    it('Should update an entity.', () => {
      const e = new TestEntity();

      spy.on(e, 'update');

      scene.addEntity(e);
      scene.update(1);

      assert.spy(e.update).was.called();
    });

    it('Should not update an inactive entity.', () => {
      const e = new TestEntity();
      e.active = false;

      spy.on(e, 'update');

      scene.addEntity(e);
      scene.update(1);

      assert.spy(e.update).was_not.called();
    });

    it('Should late update an entity.', () => {
      const e = new TestEntity();

      spy.on(e, 'lateUpdate');

      scene.addEntity(e);
      scene.lateUpdate(1);

      assert.spy(e.lateUpdate).was.called();
    });

    it('Should not late update an inactive entity.', () => {
      const e = new TestEntity();
      e.active = false;

      spy.on(e, 'lateUpdate');

      scene.addEntity(e);
      scene.lateUpdate(1);

      assert.spy(e.lateUpdate).was_not.called();
    });

    it('Should draw an entity.', () => {
      const e = new TestEntity();

      spy.on(e, 'draw');

      scene.addEntity(e);
      scene.draw();

      assert.spy(e.draw).was.called();
    });

    it('Should not draw an inactive entity.', () => {
      const e = new TestEntity();
      e.active = false;

      spy.on(e, 'draw');

      scene.addEntity(e);
      scene.draw();

      assert.spy(e.draw).was_not.called();
    });

    it('Should update entity layers.', () => {
      const e = new TestEntity();
      e.layer = 1;
      scene.addEntity(e);

      assert.is_equal(1, scene.layers[1].length);
      assert.is_equal(e, scene.layers[1][0]);
      assert.is_equal(0, scene.layers[4].length);

      e.layer = 4;
      scene.update(1);

      assert.is_equal(1, scene.layers[4].length);
      assert.is_equal(e, scene.layers[4][0]);
      assert.is_equal(0, scene.layers[1].length);
    });
  });
});

class TestScene extends Scene {
  override load(): void {}
}

class TestScene2 extends Scene {
  override load(): void {}
}

class TestEntity implements Entity {
  layer = 1;

  active = true;

  constructor() {}

  update(_dt: number): void {}

  lateUpdate(_dt: number): void {}

  draw(): void {}

  destroy(): void {}
}
