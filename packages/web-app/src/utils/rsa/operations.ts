import { BigInteger } from 'jsbn';
import secureRandom from 'secure-random';

import {
  arrBufToArrayNumber,
  arrBufToBase64, normalizeBase64ToBuf, normalizeUnicodeToBuf, randomBuf, strToArrBuf,
} from '@/utils/rsa/utils';
import { checkIsKey } from '@/utils/rsa/errors';
import {
  CharSize, HashAlg, KeyUse, Msg, PrivateKey, PublicKey,
} from '@/utils/rsa/types';
import {
  DEFAULT_CHAR_SIZE,
  DEFAULT_HASH_ALG,
  RSA_EXCHANGE_ALG,
  RSA_WRITE_ALG,
  SALT_LENGTH,
} from '@/utils/rsa/constants';
import { importPrivateKey, importPublicKey } from '@/utils/rsa/keys';

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// export async function messageToEMSA_PKCS1_v1_5(message: string) {
//   // https://www.rfc-editor.org/rfc/rfc3447#section-9.2
//   const SHA256_DIGEST_INFO = '30' + '31' + '30' + '0d'
//   + '06' + '09' + '60' + '86' + '48' + '01' + '65' + '03' + '04' + '02' + '01' + '05' + '00' + '04' + '20';
//   const T = SHA256_DIGEST_INFO + (await sha256(message));
//   const tLen = 51; // Just T.length 19 octets from the Digest Info + 32 octets from SHA-256
//
//   const psLen = 256 - tLen - 3;
//   const PS = 'ff'.repeat(psLen);
//
//   const EM = `0001${PS}00${T}`;
//   console.log(`EMSA-PKCS1-v1_5 encoded Message: ${EM}`);
//   return EM;
// }

export async function blind(message: string, modulus: string, exponent: string) {
  const messageHash = new BigInteger(await sha256(message), 16);

  const N = new BigInteger(modulus);
  const E = new BigInteger(exponent);

  const bigOne = new BigInteger('1');
  let gcd;
  let r;

  do {
    r = new BigInteger(secureRandom<'Array'>(64, { type: 'Array' })).mod(N);
    gcd = r.gcd(N);
  } while (
    !gcd.equals(bigOne)
    || r.compareTo(N) >= 0
    || r.compareTo(bigOne) <= 0
  );

  const blinded = messageHash.multiply(r.modPow(E, N)).mod(N);

  return {
    blindedMessage: blinded,
    privateKey: r,
  };
}

export function unBlind(signature: string, privateKey: BigInteger, modulus: string) {
  const r = new BigInteger(privateKey.toString());
  const N = new BigInteger(signature);
  const signValue = new BigInteger(modulus);

  return signValue.multiply(r.modInverse(N))
    .mod(N);
}

export async function sign(
  msg: Msg,
  privateKey: PrivateKey,
  charSize: CharSize = DEFAULT_CHAR_SIZE,
): Promise<ArrayBuffer> {
  const singResult = await window.crypto.subtle.sign(
    { name: RSA_WRITE_ALG, saltLength: SALT_LENGTH },
    privateKey,
    normalizeUnicodeToBuf(msg, charSize),
  );
  return singResult;
}

export async function verify(
  msg: Msg,
  sig: Msg,
  publicKey: string | PublicKey,
  charSize: CharSize = DEFAULT_CHAR_SIZE,
  hashAlg: HashAlg = DEFAULT_HASH_ALG,
): Promise<boolean> {
  const verifyResult = await window.crypto.subtle.verify(
    { name: RSA_WRITE_ALG, saltLength: SALT_LENGTH },
    typeof publicKey === 'string'
      ? await importPublicKey(publicKey, hashAlg, KeyUse.Write)
      : publicKey,
    normalizeBase64ToBuf(sig),
    normalizeUnicodeToBuf(msg, charSize),
  );
  return verifyResult;
}

export async function encrypt(
  msg: Msg,
  publicKey: string | PublicKey,
  charSize: CharSize = DEFAULT_CHAR_SIZE,
  hashAlg: HashAlg = DEFAULT_HASH_ALG,
): Promise<ArrayBuffer> {
  const encryptResult = await window.crypto.subtle.encrypt(
    { name: RSA_EXCHANGE_ALG },
    typeof publicKey === 'string'
      ? await importPublicKey(publicKey, hashAlg, KeyUse.Exchange)
      : publicKey,
    normalizeUnicodeToBuf(msg, charSize),
  );
  return encryptResult;
}

export async function decrypt(
  msg: Msg,
  privateKey: string | PrivateKey,
  hashAlg: HashAlg = DEFAULT_HASH_ALG,
): Promise<ArrayBuffer> {
  const normalized = normalizeBase64ToBuf(msg);
  const decryptResult = await window.crypto.subtle.decrypt(
    { name: RSA_EXCHANGE_ALG },
    typeof privateKey === 'string'
      ? await importPrivateKey(privateKey, hashAlg, KeyUse.Exchange)
      : privateKey,
    normalized,
  );
  return decryptResult;
}

export async function getKeyProperties(publicKey: PublicKey): Promise<JsonWebKey> {
  const jsonWebKey = await window.crypto.subtle.exportKey('jwk', publicKey);
  return jsonWebKey;
}

export async function getPublicKey(keypair: CryptoKeyPair): Promise<string> {
  const key = checkIsKey(keypair.publicKey);
  const spki = await window.crypto.subtle.exportKey('spki', key);
  return arrBufToBase64(spki);
}
