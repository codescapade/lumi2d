import { Color } from '../graphics';
import { Dict, TimeStep } from '../utils';
import { Ease, easeLinear } from './easing';

/**
 * A tween. Update object properties from one number to another.
 */
export class Tween {
  /**
   * Only active tweens are updated.
   */
  active = true;

  /**
   * The length of the tween in seconds.
   */
  duration = 0;

  /**
   * Track if the tween is complete.
   */
  complete = false;

  /**
   * Track if this tween is paused.
   */
  paused = false;

  /**
   * If true this tween is not affected by speeding up or slowing down time.
   */
  ignoreTimescale = false;

  /**
   * How many times should the tween repeat.
   */
  repeat = 0;

  /**
   * How many times has the tween completed.
   */
  timesCompleted = 0;

  /**
   * The function to call when the tween is finished. Will be called at the end of the last repeat.
   */
  onComplete?: () => void;

  /**
   * The function to call every time the tween updates.
   */
  onUpdate?: (target: Dict) => void;

  /**
   * The properties and values that are being tweened.
   */
  private dataList: PropertyData[] = [];

  /**
   * The delay before the tween starts in seconds.
   */
  private delay = 0;

  /**
   * The time position of the delay in seconds.
   */
  private delayTime = 0;

  /**
   * The object to tween the properties on.
   */
  private target: Dict;

  /**
   * The current time position on the tween in seconds.
   */
  private time = 0;

  /**
   * The ease function this tween is using.
   */
  private ease = easeLinear;

  /**
   * Create a new tween.
   * @param target The object to tween.
   * @param duration The tween length in seconds.
   * @param from The start values.
   * @param to The end values.
   * @param repeat How many times should the tween repeat. -1 Repeats forever.
   * @param ignoreTimescale Should the time scale be ignored.
   */
  constructor(target: Dict, duration: number, from: Dict, to: Dict, repeat = 0, ignoreTimescale = false) {
    this.target = target;
    this.duration = duration;
    this.repeat = repeat;
    this.ignoreTimescale = ignoreTimescale;

    this.createDataList(target, from, to);
  }

  /**
   * Called by the tween manager when the tween is complete.
   */
  runComplete(): void {
    if (this.onComplete) {
      this.onComplete();
    }
    this.time = 0;
  }

  /**
   * Set the easing function.
   * @param ease
   * @returns This tween.
   */
  setEase(ease: Ease): Tween {
    this.ease = ease;

    return this;
  }

  /**
   * Set the function to call when the tween is finished.
   * @param onComplete
   * @returns This tween.
   */
  setOnComplete(onComplete: () => void): Tween {
    this.onComplete = onComplete;

    return this;
  }

  /**
   * Set the function to call on every tween update.
   * @param onUpdate
   * @returns This tween.
   */
  setOnUpdate(onUpdate: (target: Dict) => void): Tween {
    this.onUpdate = onUpdate;

    return this;
  }

  /**
   * Set the delay before the tween starts in seconds.
   * @param delay
   * @returns
   */
  setDelay(delay: number): Tween {
    this.delay = delay;

    return this;
  }

  /**
   * Reset the tween back to the start.
   */
  reset(): void {
    this.time = 0;
    this.delayTime = 0;
    this.timesCompleted = 0;
    this.paused = false;
    this.complete = false;
  }

  /**
   * Restart this tween from the beginning.
   */
  restart(): void {
    this.time = 0;
    this.complete = false;
  }

  /**
   * Reset the tween time back to 0.
   */
  resetTime(): void {
    this.time = 0;
  }

  /**
   * Check if this tween uses this target.
   * @param target The target to compare with.
   * @returns True is the targets match.
   */
  hasTarget(target: Dict): boolean {
    return this.target === target;
  }

  /**
   * Update the target an properties on an existing tween.
   * @param target
   * @param from The start values.
   * @param to The end values.
   */
  updateTarget(target: Dict, from: Dict, to: Dict): void {
    this.target = target;
    this.createDataList(target, from, to);
  }

  /**
   * Update the tween value.
   * @param dt The time passed since the last update.
   */
  update(dt: number): void {
    if (!this.active || this.complete || this.paused) {
      return;
    }

    // dt is scaled by the time scale. Use unscaled if we don't want scaled time.
    if (this.ignoreTimescale) {
      dt = TimeStep.dtUnscaled;
    }

    if (this.delayTime < this.delay) {
      this.delayTime == dt;
    } else {
      this.time += dt;
      if (this.time >= this.duration) {
        this.complete = true;
      }

      for (const property of this.dataList) {
        this.updateProperty(property);
      }

      if (this.onUpdate) {
        this.onUpdate(this.target);
      }
    }
  }

  /**
   * Create an array of all properties with start and end values.
   * @param target The object to tween.
   * @param from The start values.
   * @param to The end values.
   */
  private createDataList(target: Dict, from: Dict, to: Dict): void {
    this.dataList = [];
    for (const key in from) {
      if (target[key]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const fromValue = from[key];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const toValue = to[key];
        const change = target[key] instanceof Color ? undefined : (toValue as number) - (fromValue as number);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: PropertyData = { start: fromValue, end: toValue, change, propertyName: key };
        this.dataList.push(data);
      }
    }
  }

  /**
   * Update a property value.
   * @param property The property to update.
   */
  private updateProperty(property: PropertyData): void {
    if (this.target[property.propertyName] instanceof Color) {
      const factor = this.ease(this.time, 0, 1, this.duration);
      const start = property.start as Color;
      const end = property.end as Color;
      let color = Color.interpolate(start, end, factor);
      if (this.complete) {
        color = end;
      }
      this.target[property.propertyName] = color;
    } else {
      let value = this.ease(this.time, property.start as number, property.change as number, this.duration);
      if (this.complete) {
        value = property.end as number;
      }
      this.target[property.propertyName] = value;
    }
  }
}

type PropertyData = {
  start: number | Color;
  end: number | Color;
  change?: number;
  propertyName: string;
};
