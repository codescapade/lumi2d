import { Bit } from '../lib';

export class Bitset {
  value: number;

  static fromValue(value: number): Bitset {
    return new Bitset(Bit.bit32.lshift(1, value));
  }

  static equals(b1: Bitset, b2: Bitset): boolean {
    return b1.value === b2.value;
  }

  constructor(value: number) {
    this.value = value;
  }

  copy(other: Bitset): void {
    this.value = other.value;
  }

  add(value: number): void {
    this.value = Bit.bit32.bor(this.value, value);
  }

  remove(value: number): void {
    this.value = Bit.bit32.band(this.value, Bit.bit32.bnot(value));
  }

  contains(value: number): boolean {
    return Bit.bit32.band(this.value, value) !== 0;
  }
}
