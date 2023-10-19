import { View } from '../../src/view';

insulate('View tests:', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (_G as any).love = {
    graphics: {
      getWidth: (): number => {
        return 800;
      },
      getHeight: (): number => {
        return 600;
      },
    },
  };

  describe('Test view:', () => {
    it('Should initialize the view.', () => {
      View.init(400, 300);
      const [width, height] = View.getDesignSize();
      assert.is_equal(width, 400);
      assert.is_equal(height, 300);
    });

    it('Should return the correct window size.', () => {
      View.init(400, 300);
      const [width, height] = View.getWindowSize();
      assert.is_equal(width, 800);
      assert.is_equal(height, 600);

      const [centerX, centerY] = View.getWindowCenter();
      assert.is_equal(centerX, 400);
      assert.is_equal(centerY, 300);
    });

    it('Should scale the view size.', () => {
      View.init(400, 300);
      let [width, height] = View.getViewSize();
      assert.is_equal(width, 400);
      assert.is_equal(height, 300);

      let [centerX, centerY] = View.getViewCenter();
      assert.is_equal(centerX, 200);
      assert.is_equal(centerY, 150);

      assert.is_equal(View.getViewScaleFactor(), 2);

      View.init(480, 800);
      [width, height] = View.getViewSize();
      assert.is_equal(width, 1067);
      assert.is_equal(height, 800);

      [centerX, centerY] = View.getViewCenter();
      assert.is_equal(centerX, 533);
      assert.is_equal(centerY, 400);

      assert.is_near(View.getViewScaleFactor(), 0.749, 0.001);
    });
  });
});
