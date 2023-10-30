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

      assert.is_equal(TouchEvent.PRESSED.typeName, event.typeName);
      assert.is_equal(5, event.x);
      assert.is_equal(9, event.y);
      assert.is_equal(2, event.dx);
      assert.is_equal(5, event.dy);
      assert.is_equal(0.1, event.pressure);
    });
  });
});
