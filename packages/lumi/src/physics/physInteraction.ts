import { PhysBody } from './physBody';
import { PhysInteractionType } from './physInteractionTypes';

/**
 * A physics interaction between two bodies.
 */
export class PhysInteraction {
  /**
   * The type of interaction.
   */
  type: PhysInteractionType;

  /**
   * The first body.
   */
  body1?: PhysBody;

  /**
   * The second body.
   */
  body2?: PhysBody;

  /**
   * Object pool for interaction reuse.
   */
  private static pool: PhysInteraction[] = [];

  /**
   * Get a interaction from the poo.
   * @param type The interaction type.
   * @param body1 The first body.
   * @param body2 The second body.
   * @returns The interaction.
   * @noSelf
   */
  static get(type: PhysInteractionType, body1: PhysBody, body2: PhysBody): PhysInteraction {
    if (PhysInteraction.pool.length > 0) {
      const interaction = PhysInteraction.pool.pop()!;

      interaction.type = type;
      interaction.body1 = body1;
      interaction.body2 = body2;

      return interaction;
    } else {
      return new PhysInteraction(type, body1, body2);
    }
  }

  /**
   * Create a new interaction.
   * @param type The interaction type.
   * @param body1 The first body.
   * @param body2 The second body.
   */
  constructor(type: PhysInteractionType, body1?: PhysBody, body2?: PhysBody) {
    this.type = type;
    this.body1 = body1;
    this.body2 = body2;
  }

  /**
   * Put this interaction back into the pool.
   */
  put(): void {
    this.body1 = undefined;
    this.body2 = undefined;
    PhysInteraction.pool.push(this);
  }
}
