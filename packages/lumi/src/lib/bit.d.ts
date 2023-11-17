export function tobit(x: number): number;

export function tohex(x: number, n: number): number;

export function band(x: number, y: number): number;

export function bor(x: number, y: number): number;

export function bxor(x: number, y: number): number;

export function bnot(x: number, y: number): number;

export function lshift(x: number, disp: number): number;

export function rshift(x: number, disp: number): number;

export namespace bit32 {
  export function tohex(x: number, n: number): number;

  export function band(x: number, y: number): number;

  export function bor(x: number, y: number): number;

  export function bxor(x: number, y: number): number;

  export function bnot(x: number): number;

  export function lshift(x: number, disp: number): number;

  export function rshift(x: number, disp: number): number;
}

export namespace bit {
  export function tohex(x: number, n: number): number;

  export function band(x: number, y: number): number;

  export function bor(x: number, y: number): number;

  export function bxor(x: number, y: number): number;

  export function bnot(x: number, y: number): number;

  export function lshift(x: number, disp: number): number;

  export function rshift(x: number, disp: number): number;
}
