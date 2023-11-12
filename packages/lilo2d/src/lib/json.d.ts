/**
 * Encode an object into a json string.
 * @param value The object to encode.
 * @noSelf
 */
export function encode<T>(value: T): string;
/** @noSelf */
export function decode<T>(value: string): T;
