export class LdtkTile {
  constructor(
    public id: number,
    public flipX: boolean,
    public flipY: boolean,
    public size: number
  ) {}

  clone(): LdtkTile {
    return new LdtkTile(this.id, this.flipX, this.flipY, this.size);
  }

  isEmpty(): boolean {
    return this.id === -1;
  }

  set(id: number, flipX: boolean, flipY: boolean): void {
    this.id = id;
    this.flipX = flipX;
    this.flipY = flipY;
  }

  getRenderWidth(): number {
    if (this.flipX) {
      return -this.size;
    } else {
      return this.size;
    }
  }

  getRenderHeight(): number {
    if (this.flipY) {
      return -this.size;
    } else {
      return this.size;
    }
  }

  getXOffset(): number {
    if (this.flipX) {
      return this.size;
    } else {
      return 0;
    }
  }

  getYOffset(): number {
    if (this.flipY) {
      return this.size;
    } else {
      return 0;
    }
  }
}
