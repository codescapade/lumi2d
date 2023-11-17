import { PhysBody } from './physBody';
import { PhysInteractionType } from './physInteractionTypes';

export class PhysInteraction {
  type: PhysInteractionType;
  body1?: PhysBody;
  body2?: PhysBody;

  private static pool: PhysInteraction[] = [];

  /** @noSelf */
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

  constructor(type: PhysInteractionType, body1?: PhysBody, body2?: PhysBody) {
    this.type = type;
    this.body1 = body1;
    this.body2 = body2;
  }

  put(): void {
    this.body1 = undefined;
    this.body2 = undefined;
    PhysInteraction.pool.push(this);
  }
}
