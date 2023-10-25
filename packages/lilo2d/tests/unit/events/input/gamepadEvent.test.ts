import { Joystick } from 'love.joystick';
import { GamepadEvent } from '../../../../src/events';

describe('Test events/input/gamepadEvent:', () => {
  it('Should get an event from the pool', () => {
    const gamepad = {
      getID: (): number => 3,
    };
    const event = GamepadEvent.get(GamepadEvent.AXIS_CHANGED, gamepad as unknown as Joystick, 'leftx', 0.3, 'dpdown');

    assert.is_equal(event.typeName, GamepadEvent.AXIS_CHANGED.typeName);
    assert.is_equal(event.id, 3);
    assert.is_equal(event.axis, 'leftx');
    assert.is_equal(event.value, 0.3);
    assert.is_equal(event.button, 'dpdown');
  });
});
