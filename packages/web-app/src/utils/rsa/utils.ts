import { InvalidMaxValue } from '@/utils/rsa/errors';

import { CharSize, Msg } from './types.js';

export function arrBufToStr(buf: ArrayBuffer, charSize: CharSize): string {
  const arr = charSize === 8 ? new Uint8Array(buf) : new Uint16Array(buf);
  return Array.from(arr)
    .map((b) => String.fromCharCode(b))
    .join('');
}

// export function bufToBigint(buf: ArrayBuffer): bigint {
//   let bits = 8n;
//   if (ArrayBuffer.isView(buf)) {
//     bits = BigInt(buf.BYTES_PER_ELEMENT * 8);
//   } else {
//     // eslint-disable-next-line no-param-reassign
//     buf = new Uint8Array(buf);
//   }
//
//   let ret = 0n;
//   // eslint-disable-next-line no-restricted-syntax
//   for (const i of (buf as Uint8Array).values()) {
//     const bi = BigInt(i);
//     // eslint-disable-next-line no-bitwise
//     ret = (ret << bits) + bi;
//   }
//   return ret;
// }

export function bigintToHex(a: bigint): string {
  if (a < 0) throw RangeError('a should be a non-negative integer. Negative values are not supported');
  return a.toString(16);
}

export function hexToBuf(hexStr: string): ArrayBuffer | Buffer {
  if (hexStr === undefined) {
    throw RangeError('hexStr cannot undefined');
  }
  const hexMatch = hexStr.match(/^(0x)?([\da-fA-F]+)$/);
  if (hexMatch == null) {
    throw RangeError('hexStr must be a hexadecimal string, e.g. \'0x124fe3a\' or \'0214f1b2\'');
  }
  let hex = hexMatch[2];
  hex = (hex.length % 2 === 0) ? hex : `0${hex}`;

  return Uint8Array.from(hex.match(/[\da-fA-F]{2}/g)!.map((h) => { // eslint-disable-line
    return parseInt(h, 16);
  })).buffer;
}

export function bigintToBuf(a: bigint): ArrayBuffer {
  if (a < 0) throw RangeError('a should be a non-negative integer. Negative values are not supported');
  return hexToBuf(bigintToHex(a));
}

export function arrBufToArrayNumber(buf: ArrayBuffer, charSize: CharSize): number[] {
  const arr = charSize === 8 ? new Uint8Array(buf) : new Uint16Array(buf);
  return Array.from(arr);
}

export function arrBufToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function strToArrBuf(str: string, charSize: CharSize): ArrayBuffer {
  const view = charSize === 8 ? new Uint8Array(str.length) : new Uint16Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    view[i] = str.charCodeAt(i);
  }
  return view.buffer;
}

export function base64ToArrBuf(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function base64UrlDecoded(base64: string): ArrayBuffer {
  const str = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    buffer[i] = str.charCodeAt(i);
  }

  return buffer.buffer;
}

export function publicExponent(): Uint8Array {
  return new Uint8Array([0x01, 0x00, 0x01]);
}

export function randomBuf(length: number, { max }: { max: number } = { max: 255 }): ArrayBuffer {
  if (max < 1 || max > 255) {
    throw InvalidMaxValue;
  }

  const arr = new Uint8Array(length);

  if (max === 255) {
    window.crypto.getRandomValues(arr);
    return arr.buffer;
  }

  let index = 0;
  const interval = max + 1;
  const divisibleMax = Math.floor(256 / interval) * interval;
  const tmp = new Uint8Array(1);

  while (index < arr.length) {
    window.crypto.getRandomValues(tmp);
    if (tmp[0] < divisibleMax) {
      arr[index] = tmp[0] % interval;
      index += 1;
    }
  }

  return arr.buffer;
}

export function joinBufs(fst: ArrayBuffer, snd: ArrayBuffer): ArrayBuffer {
  const view1 = new Uint8Array(fst);
  const view2 = new Uint8Array(snd);
  const joined = new Uint8Array(view1.length + view2.length);
  joined.set(view1);
  joined.set(view2, view1.length);
  return joined.buffer;
}

export const normalizeToBuf = (msg: Msg, strConv: (str: string) => ArrayBuffer): ArrayBuffer => {
  if (typeof msg === 'string') {
    return strConv(msg);
  } if (typeof msg === 'object' && msg.byteLength !== undefined) {
    // this is the best runtime check I could find for ArrayBuffer/Uint8Array
    const temp = new Uint8Array(msg);
    return temp.buffer;
  }
  throw new Error('Improper value. Must be a string, ArrayBuffer, Uint8Array');
};

export const normalizeUtf8ToBuf = (
  msg: Msg,
): ArrayBuffer => normalizeToBuf(msg, (str) => strToArrBuf(str, CharSize.B8));

export const normalizeUtf16ToBuf = (
  msg: Msg,
): ArrayBuffer => normalizeToBuf(msg, (str) => strToArrBuf(str, CharSize.B16));

export const normalizeBase64ToBuf = (msg: Msg): ArrayBuffer => normalizeToBuf(msg, base64ToArrBuf);

export const normalizeUnicodeToBuf = (msg: Msg, charSize: CharSize) => {
  switch (charSize) {
    case 8: return normalizeUtf8ToBuf(msg);
    default: return normalizeUtf16ToBuf(msg);
  }
};
