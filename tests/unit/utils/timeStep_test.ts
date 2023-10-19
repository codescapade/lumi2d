import { TimeStep } from '../../../src/utils/timeStep';

describe('Test utils/timeStep:', () => {
  before_each(() => {
    TimeStep.timeScale = 1.0;
  });
  it('Should change the delta time based on the time scale.', () => {
    TimeStep.update(0.016);

    assert.is_equal(TimeStep.dt, 0.016);

    TimeStep.timeScale = 1.5;
    TimeStep.update(0.016);
    assert.is_near(TimeStep.dt, 0.024, 0.001);

    TimeStep.timeScale = 0.5;
    TimeStep.update(0.016);
    assert.is_near(TimeStep.dt, 0.008, 0.001);
  });

  it('Should not scale unscaled delta time.', () => {
    TimeStep.update(0.016);

    assert.is_equal(TimeStep.dtUnscaled, 0.016);

    TimeStep.timeScale = 1.5;
    TimeStep.update(0.016);
    assert.is_equal(TimeStep.dtUnscaled, 0.016);
  });
});
