import { EntityInstanceJson } from './ldtkJson';

/**
 * An Ldtk entity representation
 */
export class LdtkEntity {
  /**
   * The entity id.
   */
  id: string;

  /**
   * The x position in the level in pixels.
   */
  x: number;

  /**
   * The y position in the level in pixels.
   */
  y: number;

  /**
   * The x axis pivot point.
   */
  pivotX: number;

  /**
   * The y axis pivot point.
   */
  pivotY: number;

  /**
   * The width in pixels.
   */
  width: number;

  /**
   * The height in pixels.
   */
  height: number;

  /**
   * Custom entity fields.
   */
  fields: LdtkEntityField[];

  /**
   * Create a new entity.
   * @param entity The json entity data.
   */
  constructor(entity?: EntityInstanceJson) {
    if (entity) {
      this.id = entity.__identifier;
      this.x = entity.px[0];
      this.y = entity.px[1];
      this.pivotX = entity.__pivot[0];
      this.pivotY = entity.__pivot[1];
      this.width = entity.width;
      this.height = entity.height;
      this.fields = [];

      for (const field of entity.fieldInstances) {
        const f = new LdtkEntityField(field.__identifier, field.__value, field.__type, field.defUid);
        this.fields.push(f);
      }
    } else {
      this.id = '';
      this.x = 0;
      this.y = 0;
      this.pivotX = 0;
      this.pivotY = 0;
      this.width = 0;
      this.height = 0;
      this.fields = [];
    }
  }

  /**
   * Clone this entity.
   * @returns A new instance of this entity.
   */
  clone(): LdtkEntity {
    const entity = new LdtkEntity();
    entity.id = this.id;
    entity.x = this.x;
    entity.y = this.y;
    entity.pivotX = this.pivotX;
    entity.pivotY = this.pivotY;
    entity.width = this.width;
    entity.height = this.height;

    for (const field of this.fields) {
      const f = new LdtkEntityField(field.id, field.value, field.type, field.defUid);
      entity.fields.push(f);
    }

    return entity;
  }
}

/**
 * Custom entity field.
 */
export class LdtkEntityField {
  constructor(
    public id: string,
    public value: unknown,
    public type: string,
    public defUid: number
  ) {}
}
