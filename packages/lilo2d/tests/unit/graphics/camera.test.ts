import { Transform } from 'love.math';
import { Camera, Color } from '../../../src/graphics';
import { Canvas } from 'love.graphics';
import { View } from '../../../src/view';

insulate('Camera tests:', () => {
  // Mock love functions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (_G as any).love = {
    graphics: {
      newCanvas: (): Canvas => {
        return {} as Canvas;
      },
      getWidth: (): number => {
        return 800;
      },
      getHeight: (): number => {
        return 600;
      },
    },
    math: {
      newTransform: (): Transform => {
        return {} as Transform;
      },
    },
  };

  describe('Test graphics/camera', () => {
    setup(() => {
      View.init(800, 600);
    });

    it('Should create a new camera.', () => {
      const ignoredLayers: number[] = [2, 3];
      const camera = new Camera({
        x: 24,
        y: 43,
        angle: 90,
        zoom: 1.2,
        viewX: 0.2,
        viewY: 0.3,
        viewWidth: 0.5,
        viewHeight: 0.7,
        bgColor: Color.PURPLE,
        ignoredLayers,
      });

      assert.is_equal(24, camera.position.x);
      assert.is_equal(43, camera.position.y);
      assert.is_equal(90, camera.angle);
      assert.is_equal(1.2, camera.zoom);
      assert.is_equal(Color.PURPLE, camera.bgColor);
      assert.is_equal(ignoredLayers, camera.ignoredLayers);

      assert.is_equal(0.2 * 800, camera.screenBounds.x);
      assert.is_equal(0.3 * 600, camera.screenBounds.y);
      assert.is_equal(0.5 * 800, camera.screenBounds.width);
      assert.is_equal(0.7 * 600, camera.screenBounds.height);

      assert.is_equal(24 - (400 * 0.5) / 1.2, camera.bounds.x);
      assert.is_equal(43 - (300 * 0.7) / 1.2, camera.bounds.y);
      assert.is_equal((800 * 0.5) / 1.2, camera.bounds.width);
      assert.is_equal((600 * 0.7) / 1.2, camera.bounds.height);
    });

    it('It should create a new camera with default values.', () => {
      const camera = new Camera();

      assert.is_equal(400, camera.position.x);
      assert.is_equal(300, camera.position.y);
      assert.is_equal(0, camera.angle);
      assert.is_equal(1, camera.zoom);
      assert.is_equal(Color.BLACK, camera.bgColor);
      assert.is_equal(0, camera.ignoredLayers.length);

      assert.is_equal(0, camera.screenBounds.x);
      assert.is_equal(0, camera.screenBounds.y);
      assert.is_equal(800, camera.screenBounds.width);
      assert.is_equal(600, camera.screenBounds.height);

      assert.is_equal(0, camera.bounds.x);
      assert.is_equal(0, camera.bounds.y);
      assert.is_equal(800, camera.bounds.width);
      assert.is_equal(600, camera.bounds.height);
    });

    it('Should convert a screen to world position.', () => {
      const camera = new Camera();
      let [x, y] = camera.screenToWorld(0, 0);
      assert.is_equal(0, x);
      assert.is_equal(0, y);

      [x, y] = camera.screenToWorld(800, 600);
      assert.is_equal(800, x);
      assert.is_equal(600, y);

      camera.position.x += 200;
      camera.position.y += 200;

      [x, y] = camera.screenToWorld(0, 0);
      assert.is_equal(200, x);
      assert.is_equal(200, y);

      [x, y] = camera.screenToWorld(800, 600);
      assert.is_equal(1000, x);
      assert.is_equal(800, y);

      camera.zoom = 2;
      [x, y] = camera.screenToWorld(0, 0);
      assert.is_equal(400, x);
      assert.is_equal(350, y);

      [x, y] = camera.screenToWorld(800, 600);
      assert.is_equal(800, x);
      assert.is_equal(650, y);

      camera.zoom = 0.5;
      [x, y] = camera.screenToWorld(0, 0);
      assert.is_equal(-200, x);
      assert.is_equal(-100, y);

      [x, y] = camera.screenToWorld(800, 600);
      assert.is_equal(1400, x);
      assert.is_equal(1100, y);

      camera.zoom = 1;
      camera.position.set(400, 300);
      camera.angle = 90;
      [x, y] = camera.screenToWorld(0, 0);
      assert.is_equal(700, x);
      assert.is_equal(-100, y);

      [x, y] = camera.screenToWorld(800, 600);
      assert.is_equal(100, x);
      assert.is_equal(700, y);
    });

    it('Should convert a screen to a view position', () => {
      const camera = new Camera();
      let [x, y] = camera.screenToView(0, 0);
      assert.is_equal(0, x);
      assert.is_equal(0, y);

      [x, y] = camera.screenToView(400, 300);
      assert.is_equal(400, x);
      assert.is_equal(300, y);

      [x, y] = camera.screenToView(800, 600);
      assert.is_equal(800, x);
      assert.is_equal(600, y);

      View.init(400, 300);

      [x, y] = camera.screenToView(0, 0);
      assert.is_equal(0, x);
      assert.is_equal(0, y);

      [x, y] = camera.screenToView(400, 300);
      assert.is_equal(200, x);
      assert.is_equal(150, y);

      [x, y] = camera.screenToView(800, 600);
      assert.is_equal(400, x);
      assert.is_equal(300, y);
    });
  });
});
