import { Event, EventType, Events, EventHandler } from '../../../src/events';

describe('Test events/events:', () => {
  before_each(() => {
    Events.clearGlobalHandlers();
    Events.setSceneHandlers(new LuaTable<string, EventHandler[]>());
  });

  it('Should add a global handler.', () => {
    const callback = (_event: TestEvent): void => {};
    Events.on(TestEvent.TESTED, callback, true, true);

    assert.is_true(Events.has(TestEvent.TESTED, true));
    assert.is_false(Events.has(TestEvent.TESTED));
  });

  it('Should add a scene handler.', () => {
    const callback = (_event: TestEvent): void => {};
    Events.on(TestEvent.TESTED, callback);

    assert.is_true(Events.has(TestEvent.TESTED));
    assert.is_false(Events.has(TestEvent.TESTED, true));
  });

  it('Should call a global handler.', () => {
    let result = -1;
    const callback = (event: TestEvent): void => {
      result = event.testField;
    };

    Events.on(TestEvent.TESTED, callback, true, true);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(result, 2);
  });

  it('Should call a scene handler.', () => {
    let result = -1;
    const callback = (event: TestEvent): void => {
      result = event.testField;
    };

    Events.on(TestEvent.TESTED, callback);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(result, 2);
  });

  it('Should call a global handler before a scene handler.', () => {
    const order: string[] = [];
    const callback = (_event: TestEvent): void => {
      order.push('global');
    };

    const callback2 = (_event: TestEvent): void => {
      order.push('scene');
    };

    Events.on(TestEvent.TESTED, callback2);
    Events.on(TestEvent.TESTED, callback, true, true);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(order[0], 'global');
    assert.is_equal(order[1], 'scene');
  });

  it('Should cancel an event.', () => {
    const results: number[] = [];
    const callback = (event: TestEvent): void => {
      results.push(3);
      event.canceled = true;
    };

    const callback2 = (_event: TestEvent): void => {
      results.push(5);
    };

    Events.on(TestEvent.TESTED, callback);
    Events.on(TestEvent.TESTED, callback2);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(results.length, 1);
    assert.is_equal(results[0], 3);
  });

  it('Should ignore a canceled event for handler that cannot cancel.', () => {
    const results: number[] = [];
    const callback = (event: TestEvent): void => {
      results.push(3);
      event.canceled = true;
    };

    const callback2 = (_event: TestEvent): void => {
      results.push(5);
    };

    Events.on(TestEvent.TESTED, callback, false);
    Events.on(TestEvent.TESTED, callback2);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(results.length, 2);
    assert.is_equal(results[0], 3);
    assert.is_equal(results[1], 5);
  });

  it('Should remove a global handler.', () => {
    let result = -1;
    const callback = (event: TestEvent): void => {
      result = event.testField;
    };

    Events.on(TestEvent.TESTED, callback, true, true);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(result, 2);

    Events.off(TestEvent.TESTED, callback, true);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 10));

    assert.is_equal(result, 2);
  });

  it('Should remove a scene handler.', () => {
    let result = -1;
    const callback = (event: TestEvent): void => {
      result = event.testField;
    };

    Events.on(TestEvent.TESTED, callback);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 2));

    assert.is_equal(result, 2);

    Events.off(TestEvent.TESTED, callback);
    Events.emit(new TestEvent(TestEvent.TESTED.typeName, 10));

    assert.is_equal(result, 2);
  });
});

class TestEvent extends Event {
  static readonly TESTED = new EventType(TestEvent, 'lilo_test_event');

  testField: number;

  constructor(typeName: string, test: number) {
    super();
    this.typeName = typeName;
    this.testField = test;
  }
}
