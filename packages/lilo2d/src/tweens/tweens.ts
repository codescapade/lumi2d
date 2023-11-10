import { Tween } from './tween';
import { TweenSequence } from './tweenSequence';

/**
 * Tween manager.
 * @noSelf
 */
export class Tweens {
  /**
   * Current tween list.
   */
  private static list: TweenList = { current: [], completed: [], sequences: [] };

  /**
   * Update the tween list. This is called when the scene switches.
   * @param list the new tween list.
   */
  static setTweenList(list: TweenList): void {
    Tweens.list = list;
  }

  /**
   * Add a new tween.
   * @param tween The tween to add.
   */
  static addTween(tween: Tween): void {
    Tweens.list.current.push(tween);
  }

  /**
   * Add a new sequence.
   * @param sequence The sequence to add.
   */
  static addSequence(sequence: TweenSequence): void {
    Tweens.list.sequences.push(sequence);
  }

  /**
   * Update all active tweens. this is called by the game class.
   * @param dt The time passed since the last update in seconds.
   */
  static update(dt: number): void {
    const current = Tweens.list.current;
    const completed = Tweens.list.completed;
    const sequences = Tweens.list.sequences;

    for (const tween of current) {
      tween.update(dt);
      if (tween.complete) {
        // Repeat from the start.
        if (tween.repeat > tween.timesCompleted || tween.repeat === -1) {
          tween.restart();
          tween.timesCompleted++;
          tween.time = 0;
        } else {
          completed.push(tween);
        }
      }
    }

    // Handle completed tweens.
    while (completed.length > 0) {
      const tween = completed.pop()!;
      const index = current.indexOf(tween);
      current.splice(index, 1);
      tween.runComplete();
    }

    // Update all sequences.
    for (const sequence of sequences) {
      if (sequence.index > sequence.list.length - 1) {
        sequence.index = 0;
      }
      const tween = sequence.current();
      tween.update(dt);
      if (tween.complete) {
        // Repeat tween.
        if (tween.repeat > tween.timesCompleted || tween.repeat === -1) {
          tween.timesCompleted++;
          tween.time = 0;
          tween.complete = false;
          tween.paused = false;
        } else {
          tween.runComplete();

          // Go to next tween in the sequence.
          sequence.index++;

          // Repeat the sequence.
          if (sequence.repeat > sequence.timesCompleted || sequence.repeat === -1) {
            sequence.timesCompleted++;
          } else {
            const index = sequences.indexOf(sequence);
            sequences.splice(index, 1);
          }
        }
      }
    }
  }

  /**
   * Pause all active tweens and sequences.
   */
  static pauseAll(): void {
    for (const tween of Tweens.list.current) {
      tween.paused = true;
    }

    for (const sequence of Tweens.list.sequences) {
      sequence.current().paused = true;
    }
  }

  /**
   * Resume all tweens and sequences.
   */
  static resumeAll(): void {
    for (const tween of Tweens.list.current) {
      tween.paused = false;
    }

    for (const sequence of Tweens.list.sequences) {
      sequence.current().paused = false;
    }
  }

  /**
   * Remove a tween.
   * @param tween The tween to remove.
   */
  static remove(tween: Tween): void {
    const index = Tweens.list.current.indexOf(tween);
    if (index !== -1) {
      Tweens.list.current.splice(index, 1);
    }
  }

  /**
   * Remove a sequence.
   * @param sequence The sequence to remove.
   */
  static removeSequence(sequence: TweenSequence): void {
    const index = Tweens.list.sequences.indexOf(sequence);
    if (index !== -1) {
      Tweens.list.sequences.splice(index, 1);
    }
  }

  /**
   * Remove all tweens from an object.
   * @param target The target to remove the tweens from.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static removeAllFrom(target: any): void {
    const indexes: number[] = [];

    for (const tween of Tweens.list.current) {
      if (tween.target === target) {
        const index = Tweens.list.current.indexOf(tween);
        indexes.push(index);
      }
    }

    // Sort hight to low so we don't shift indexes when splicing below.
    indexes.sort((a, b) => {
      return b - a;
    });

    for (const index of indexes) {
      Tweens.list.current.splice(index, 1);
    }
  }
}

export type TweenList = {
  sequences: TweenSequence[];
  current: Tween[];
  completed: Tween[];
};
