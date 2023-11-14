import { KeyboardEvent } from '../../../../src/events';

describe('Test events/input/keyboardEvent:', () => {
  it('Should get an event from the pool.', () => {
    const event = KeyboardEvent.get(KeyboardEvent.PRESSED, 'left', 'right', true);

    assert.is_equal(KeyboardEvent.PRESSED.typeName, event.typeName);
    assert.is_equal('left', event.key);
    assert.is_equal('right', event.scancode);
    assert.is_true(event.isRepeat);
  });
});
