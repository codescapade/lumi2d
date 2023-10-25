import { TouchEvent } from '../../../../src/events';
import { LightUserData } from 'love';

insulate('Touch tests:', () => {
  // Mock love functions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (_G as any).love = {
    touch: {
      getTouches: (): LightUserData<'Touch'>[] => [],
    },
  };

  describe('Test events/input/touchEvent:', () => {
    it('Should get an event from the pool.', () => {
      const event = TouchEvent.get(TouchEvent.PRESSED, '' as unknown as LightUserData<'Touch'>, 5, 9, 2, 5, 0.1);

      assert.is_equal(event.typeName, TouchEvent.PRESSED.typeName);
      assert.is_equal(event.x, 5);
      assert.is_equal(event.y, 9);
      assert.is_equal(event.dx, 2);
      assert.is_equal(event.dy, 5);
      assert.is_equal(event.pressure, 0.1);
    });
  });
});
