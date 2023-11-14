import { MouseEvent } from '../../../../src/events';

describe('Test events/input/mouseEvent:', () => {
  it('Should get an event from the pool', () => {
    const event = MouseEvent.get(MouseEvent.BUTTON_PRESSED, 10, 20, 1, true, 5, 8, -1, 3);

    assert.is_equal(MouseEvent.BUTTON_PRESSED.typeName, event.typeName);
    assert.is_equal(10, event.x);
    assert.is_equal(20, event.y);
    assert.is_equal(1, event.button);
    assert.is_true(event.isTouch);
    assert.is_equal(5, event.dx);
    assert.is_equal(8, event.dy);
    assert.is_equal(-1, event.wheelX);
    assert.is_equal(3, event.wheelY);
  });
});
