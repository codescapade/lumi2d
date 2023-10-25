import { View } from '../../../src/view/view';

insulate('View tests:', () => {
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
    },
  };

  describe('Test view:', () => {
    it('Should initialize the view.', () => {
      View.init(400, 300);
      const [width, height] = View.getDesignSize();
      assert.is_equal(width, 400);
      assert.is_equal(height, 300);
    });

    it('Should return the correct window size and center.', () => {
      View.init(400, 300);
      const [width, height] = View.getWindowSize();
      assert.is_equal(width, 800);
      assert.is_equal(height, 600);

      const [centerX, centerY] = View.getWindowCenter();
      assert.is_equal(centerX, 400);
      assert.is_equal(centerY, 300);
    });
  });
});
