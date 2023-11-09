import { Color } from '../graphics';
import { TimeStep } from '../utils';
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
   * The object to tween the properties on.
   */
  target: TableStrAny;

  /**
   * The current time position on the tween in seconds.
   */
  time = 0;

  /**
   * The length of the tween in seconds.
   */
  duration = 0;

  /**
   * Track if the tween is complete.
   */
  complete = false;

  /**
   * The time position of the delay in seconds.
   */
  delayTime = 0;

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
  onUpdate?: (target: TableStrAny) => void;

  /**
   * The properties and values that are being tweened.
   */
  private dataList: PropertyData[] = [];

  /**
   * The delay before the tween starts in seconds.
   */
  private delay = 0;

  /**
   * The ease function this tween is using.
   */
  private ease = easeLinear;

  /**
   * Create a new tween.
   * @param target The object to tween.
   * @param duration The tween length in seconds.
   * @param properties The properties to tween.
   * @param isColor Are the properties colors.
   * @param repeat How many times should the tween repeat. -1 Repeats forever.
   * @param ignoreTimescale Should the time scale be ignored.
   */
  constructor(target: TableStrAny, duration: number, properties: TableStrAny, repeat = 0, ignoreTimescale = false) {
    this.target = target;
    this.duration = duration;
    this.repeat = repeat;
    this.ignoreTimescale = ignoreTimescale;

    this.createDataList(target, properties);
  }

  /**
   * Called by the tween manager when the tween is complete.
   */
  runComplete(): void {
    if (this.onComplete) {
      this.onComplete();
    }
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
  setOnUpdate(onUpdate: (target: TableStrAny) => void): Tween {
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
  }

  /**
   * Update the target an properties on an existing tween.
   * @param target
   * @param properties
   */
  updateTarget(target: TableStrAny, properties: TableStrAny): void {
    this.target = target;
    this.createDataList(target, properties);
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
   * @param properties The properties to tween.
   */
  private createDataList(target: TableStrAny, properties: TableStrAny): void {
    this.dataList = [];
    for (const [key, value] of properties) {
      if (target.has(key)) {
        const change = target.get(key) instanceof Color ? undefined : (value as number) - (target.get(key) as number);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: PropertyData = { start: target.get(key), end: value, change, propertyName: key };
        this.dataList.push(data);
      }
    }
  }

  /**
   * Update a property value.
   * @param property The property to update.
   */
  private updateProperty(property: PropertyData): void {
    if (this.target.get(property.propertyName) instanceof Color) {
      const factor = this.ease(this.time, 0, 1, this.duration);
      const start = property.start as Color;
      const end = property.end as Color;
      let color = Color.interpolate(start, end, factor);
      if (this.complete) {
        color = end;
      }
      this.target.set(property.propertyName, color);
    } else {
      let value = this.ease(this.time, property.start as number, property.change as number, this.duration);
      if (this.complete) {
        value = property.end as number;
      }
      this.target.set(property.propertyName, value);
    }
  }
}

type PropertyData = {
  start: number | Color;
  end: number | Color;
  change?: number;
  propertyName: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableStrAny = LuaTable<string, any>;
