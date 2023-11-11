import { Tween } from './tween';

/**
 * A collection a tweens that will play in order.
 */
export class TweenSequence {
  /**
   * The list of tweens.
   */
  list: Tween[];

  /**
   * The current index.
   */
  index = 0;

  /**
   * Track repeat times.
   */
  timesCompleted = 0;

  /**
   * How many times should the sequence repeat. -1 repeats forever.
   */
  repeat = 0;

  /**
   *
   * @param tweens The tweens in the sequence.
   * @param repeat How many times to repeat. -1 repeats forever.
   */
  constructor(tweens: Tween[], repeat = 0) {
    this.list = tweens;
    this.repeat = repeat;
  }

  /**
   * Get the current tween in the sequence.
   * @returns The tween.
   */
  current(): Tween {
    return this.list[this.index];
  }

  /**
   * Reset the sequence to start over.
   */
  reset(): void {
    this.index = 0;
    this.timesCompleted = 0;

    for (const tween of this.list) {
      tween.reset();
    }
  }

  /**
   * Restart the sequence, but don't reset the repeat.
   */
  restart(): void {
    this.index = 0;
    for (const tween of this.list) {
      tween.restart();
    }
  }
}
