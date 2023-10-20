import {
  scaleModeFitHeight,
  scaleModeFitView,
  scaleModeFitWidth,
  scaleModeNoScale,
  scaleModeStretch,
} from '../../../src/view/scaleMode';

insulate('scaleMode tests:', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (_G as any).love = {
    graphics: {
      getWidth: (): number => {
        return 480;
      },
      getHeight: (): number => {
        return 800;
      },
    },
  };

  describe('Test scaleMode:', () => {
    it('Should scale fitView correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeFitView(320, 480, 0, 0);
      assert.is_equal(vw, 320);
      assert.is_equal(vh, 534);
      assert.is_equal(sx, 1.5);
      assert.is_equal(sy, 1.5);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 0);

      [vw, vh, sx, sy, xo, yo] = scaleModeFitView(400, 240, 0.5, 0.5);
      assert.is_equal(vw, 400);
      assert.is_equal(vh, 667);
      assert.is_near(sx, 1.2, 0.01);
      assert.is_near(sy, 1.2, 0.01);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 256);
    });

    it('Should scale fitWidth correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeFitWidth(320, 480, 0, 0);
      assert.is_equal(vw, 320);
      assert.is_equal(vh, 534);
      assert.is_equal(sx, 1.5);
      assert.is_equal(sy, 1.5);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 0);

      [vw, vh, sx, sy, xo, yo] = scaleModeFitWidth(480, 320, 0.5, 0.5);
      assert.is_equal(vw, 480);
      assert.is_equal(vh, 800);
      assert.is_equal(sx, 1);
      assert.is_equal(sy, 1);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 240);
    });

    it('Should scale fitHeight correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeFitHeight(320, 480, 0, 0);
      assert.is_equal(vw, 288);
      assert.is_equal(vh, 480);
      assert.is_near(sx, 1.66, 0.01);
      assert.is_near(sy, 1.66, 0.01);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 0);

      [vw, vh, sx, sy, xo, yo] = scaleModeFitHeight(480, 320, 0.5, 0.5);
      assert.is_equal(vw, 192);
      assert.is_equal(vh, 320);
      assert.is_equal(sx, 2.5);
      assert.is_equal(sy, 2.5);
      assert.is_equal(xo, -360);
      assert.is_equal(yo, 0);
    });

    it('Should scale noScale correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeNoScale(320, 480, 0, 0);
      assert.is_equal(vw, 320);
      assert.is_equal(vh, 480);
      assert.is_equal(sx, 1);
      assert.is_equal(sy, 1);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 0);

      [vw, vh, sx, sy, xo, yo] = scaleModeNoScale(320, 320, 0.5, 0.5);
      assert.is_equal(vw, 320);
      assert.is_equal(vh, 320);
      assert.is_equal(sx, 1);
      assert.is_equal(sy, 1);
      assert.is_equal(xo, 80);
      assert.is_equal(yo, 240);
    });

    it('Should scale stretch correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeStretch(320, 480, 0, 0);
      assert.is_equal(vw, 320);
      assert.is_equal(vh, 480);
      assert.is_near(sx, 1.5, 0.01);
      assert.is_near(sy, 1.66, 0.01);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 0);

      [vw, vh, sx, sy, xo, yo] = scaleModeStretch(320, 320, 0.5, 0.5);
      assert.is_equal(vw, 320);
      assert.is_equal(vh, 320);
      assert.is_equal(sx, 1.5);
      assert.is_equal(sy, 2.5);
      assert.is_equal(xo, 0);
      assert.is_equal(yo, 0);
    });
  });
});
