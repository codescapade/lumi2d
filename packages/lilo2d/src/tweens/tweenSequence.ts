import { Tween } from './tween';

export class TweenSequence {
  list: Tween[];

  index = 0;

  timesCompleted = 0;

  repeat = 0;

  constructor(tweens: Tween[], repeat = 0) {
    this.list = tweens;
    this.repeat = repeat;
  }

  current(): Tween {
    return this.list[this.index];
  }

  reset(): void {
    this.index = 0;
    this.timesCompleted = 0;

    for (const tween of this.list) {
      tween.reset();
    }
  }

  restart(): void {
    this.index = 0;
    for (const tween of this.list) {
      tween.restart();
    }
  }
}
