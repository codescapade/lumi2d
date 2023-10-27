import { MouseEvent } from '../../../../src/events';

describe('Test events/input/mouseEvent:', () => {
  it('Should get an event from the pool', () => {
    const event = MouseEvent.get(MouseEvent.BUTTON_PRESSED, 10, 20, 1, true, 5, 8, -1, 3);

    assert.is_equal(event.typeName, MouseEvent.BUTTON_PRESSED.typeName);
    assert.is_equal(event.x, 10);
    assert.is_equal(event.y, 20);
    assert.is_equal(event.button, 1);
    assert.is_true(event.isTouch);
    assert.is_equal(event.dx, 5);
    assert.is_equal(event.dy, 8);
    assert.is_equal(event.wheelX, -1);
    assert.is_equal(event.wheelY, 3);
  });
});
