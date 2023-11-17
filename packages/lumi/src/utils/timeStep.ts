/**
 * Class to keep track of delta time, fps and time scaling.
 * @noSelf
 * */
export class TimeStep {
  /**
   * The time scale can be used to speed up or slow down the game by scaling the delta time.
   */
  static timeScale = 1;

  /**
   * The time passed since the last update in seconds.
   */
  static dt = 0;

  /**
   * The time passed since the last update in seconds. This is unaffected by the time scale.
   */
  static dtUnscaled = 0;

  /**
   * The current frames per second.
   */
  static fps = 0;

  /**
   * Stored delta times got get the average fps.
   */
  private static deltaTimes: number[] = [];

  /**
   * Update the time step.
   * @param dt The time passed since the last update.
   */
  static update(dt: number): void {
    TimeStep.dtUnscaled = dt;
    TimeStep.dt = dt * TimeStep.timeScale;

    // Store the last 200 delta times for the average fps.
    if (TimeStep.deltaTimes.length > 200) {
      TimeStep.deltaTimes.shift();
    }
    TimeStep.deltaTimes.push(dt);

    let average = 0;
    for (const time of TimeStep.deltaTimes) {
      average += time;
    }

    TimeStep.fps = math.floor(1.0 / (average / TimeStep.deltaTimes.length));
  }
}
