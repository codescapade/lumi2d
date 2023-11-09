import { Tween } from './tween';

export class TweenSequence {
  list: Tween[];

  index = 0;

  timesCompleted = 0;

  repeat = 0;

  constructor(repeat = 0, ...tweens: Tween[]) {
    this.repeat = repeat;
    this.list = tweens;
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
}
