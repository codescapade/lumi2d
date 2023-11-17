import { Joystick } from 'love.joystick';
import { GamepadEvent } from '../../../../src/events';

describe('Test events/input/gamepadEvent:', () => {
  it('Should get an event from the pool', () => {
    const gamepad = {
      getID: (): number => 3,
    };
    const event = GamepadEvent.get(GamepadEvent.AXIS_CHANGED, gamepad as unknown as Joystick, 'leftx', 0.3, 'dpdown');

    assert.is_equal(GamepadEvent.AXIS_CHANGED.typeName, event.typeName);
    assert.is_equal(3, event.id);
    assert.is_equal('leftx', event.axis);
    assert.is_equal(0.3, event.value);
    assert.is_equal('dpdown', event.button);
  });
});
