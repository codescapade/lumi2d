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
      assert.is_equal(320, vw);
      assert.is_equal(534, vh);
      assert.is_equal(1.5, sx);
      assert.is_equal(1.5, sy);
      assert.is_equal(0, xo);
      assert.is_equal(0, yo);

      [vw, vh, sx, sy, xo, yo] = scaleModeFitView(400, 240, 0.5, 0.5);
      assert.is_equal(400, vw);
      assert.is_equal(667, vh);
      assert.is_near(1.2, sx, 0.01);
      assert.is_near(1.2, sy, 0.01);
      assert.is_equal(0, xo);
      assert.is_equal(256, yo);
    });

    it('Should scale fitWidth correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeFitWidth(320, 480, 0, 0);
      assert.is_equal(320, vw);
      assert.is_equal(534, vh);
      assert.is_equal(1.5, sx);
      assert.is_equal(1.5, sy);
      assert.is_equal(0, xo);
      assert.is_equal(0, yo);

      [vw, vh, sx, sy, xo, yo] = scaleModeFitWidth(480, 320, 0.5, 0.5);
      assert.is_equal(480, vw);
      assert.is_equal(800, vh);
      assert.is_equal(1, sx);
      assert.is_equal(1, sy);
      assert.is_equal(0, xo);
      assert.is_equal(240, yo);
    });

    it('Should scale fitHeight correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeFitHeight(320, 480, 0, 0);
      assert.is_equal(288, vw);
      assert.is_equal(480, vh);
      assert.is_near(1.66, sx, 0.01);
      assert.is_near(1.66, sy, 0.01);
      assert.is_equal(0, xo);
      assert.is_equal(0, yo);

      [vw, vh, sx, sy, xo, yo] = scaleModeFitHeight(480, 320, 0.5, 0.5);
      assert.is_equal(192, vw);
      assert.is_equal(320, vh);
      assert.is_equal(2.5, sx);
      assert.is_equal(2.5, sy);
      assert.is_equal(-360, xo);
      assert.is_equal(0, yo);
    });

    it('Should scale noScale correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeNoScale(320, 480, 0, 0);
      assert.is_equal(320, vw);
      assert.is_equal(480, vh);
      assert.is_equal(1, sx);
      assert.is_equal(1, sy);
      assert.is_equal(0, xo);
      assert.is_equal(0, yo);

      [vw, vh, sx, sy, xo, yo] = scaleModeNoScale(320, 320, 0.5, 0.5);
      assert.is_equal(320, vw);
      assert.is_equal(320, vh);
      assert.is_equal(1, sx);
      assert.is_equal(1, sy);
      assert.is_equal(80, xo);
      assert.is_equal(240, yo);
    });

    it('Should scale stretch correctly', () => {
      let [vw, vh, sx, sy, xo, yo] = scaleModeStretch(320, 480, 0, 0);
      assert.is_equal(320, vw);
      assert.is_equal(480, vh);
      assert.is_near(1.5, sx, 0.01);
      assert.is_near(1.66, sy, 0.01);
      assert.is_equal(0, xo);
      assert.is_equal(0, yo);

      [vw, vh, sx, sy, xo, yo] = scaleModeStretch(320, 320, 0.5, 0.5);
      assert.is_equal(320, vw);
      assert.is_equal(320, vh);
      assert.is_equal(1.5, sx);
      assert.is_equal(2.5, sy);
      assert.is_equal(0, xo);
      assert.is_equal(0, yo);
    });
  });
});
