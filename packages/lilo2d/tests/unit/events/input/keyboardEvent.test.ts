import { KeyboardEvent } from '../../../../src/events';

describe('Test events/input/keyboardEvent:', () => {
  it('Should get an event from the pool.', () => {
    const event = KeyboardEvent.get(KeyboardEvent.PRESSED, 'left', 'right', true);

    assert.is_equal(event.typeName, KeyboardEvent.PRESSED.typeName);
    assert.is_equal(event.key, 'left');
    assert.is_equal(event.scancode, 'right');
    assert.is_true(event.isRepeat);
  });
});
