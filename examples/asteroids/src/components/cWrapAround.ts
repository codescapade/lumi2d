import { CTransform, View } from '@lumi2d/lumi';

export class CWrapAround {
  private wrapOffset: number;

  private maxWidth: number;

  private maxHeight: number;

  private transform: CTransform;

  constructor(transform: CTransform, wrapOffset: number) {
    this.transform = transform;
    this.wrapOffset = wrapOffset;
    [this.maxWidth, this.maxHeight] = View.getViewSize();
  }

  update(): void {
    let x = this.transform.position.x;
    let y = this.transform.position.y;

    if (x < 0 - this.wrapOffset) {
      x = this.maxWidth + this.wrapOffset;
    } else if (x > this.maxWidth + this.wrapOffset) {
      x = 0 - this.wrapOffset;
    }

    if (y < 0 - this.wrapOffset) {
      y = this.maxHeight + this.wrapOffset;
    } else if (y > this.maxHeight + this.wrapOffset) {
      y = 0 - this.wrapOffset;
    }

    this.transform.setPosition(x, y);
  }
}
