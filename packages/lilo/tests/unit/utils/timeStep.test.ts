import { TimeStep } from '../../../src/utils/timeStep';

describe('Test utils/timeStep:', () => {
  before_each(() => {
    TimeStep.timeScale = 1.0;
  });
  it('Should change the delta time based on the time scale.', () => {
    TimeStep.update(0.016);

    assert.is_equal(0.016, TimeStep.dt);

    TimeStep.timeScale = 1.5;
    TimeStep.update(0.016);
    assert.is_near(0.024, TimeStep.dt, 0.001);

    TimeStep.timeScale = 0.5;
    TimeStep.update(0.016);
    assert.is_near(0.008, TimeStep.dt, 0.001);
  });

  it('Should not scale unscaled delta time.', () => {
    TimeStep.update(0.016);

    assert.is_equal(0.016, TimeStep.dtUnscaled);

    TimeStep.timeScale = 1.5;
    TimeStep.update(0.016);
    assert.is_equal(0.016, TimeStep.dtUnscaled);
  });
});
