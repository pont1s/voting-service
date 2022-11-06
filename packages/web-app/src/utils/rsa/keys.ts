import { arrBufToBase64, base64ToArrBuf, publicExponent } from '@/utils/rsa/utils';
import { checkValidKeyUse } from '@/utils/rsa/errors';
import {
  HashAlg, KeyUse, PublicKey, RsaSize,
} from '@/utils/rsa/types';
import { RSA_EXCHANGE_ALG, RSA_WRITE_ALG } from '@/utils/rsa/constants';

export async function makeKeypair(
  size: RsaSize,
  hashAlg: HashAlg,
  use: KeyUse,
): Promise<CryptoKeyPair> {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Exchange ? RSA_EXCHANGE_ALG : RSA_WRITE_ALG;
  const uses: KeyUsage[] = use === KeyUse.Exchange ? ['encrypt', 'decrypt'] : ['sign', 'verify'];
  const keys = await window.crypto.subtle.generateKey(
    {
      name: alg,
      modulusLength: size,
      publicExponent: publicExponent(),
      hash: { name: hashAlg },
    },
    true,
    uses,
  );

  return keys;
}

function convertBinaryToPem(binaryData: ArrayBuffer, label: string) {
  const base64Cert = arrBufToBase64(binaryData);
  const pemCert = `-----BEGIN ${label}-----\n${base64Cert}\n-----END ${label}-----`;
  return pemCert;
}

export async function exportPublicKey(key: CryptoKey) {
  const keyPem = await window.crypto.subtle.exportKey('spki', key);
  return convertBinaryToPem(keyPem, 'PUBLIC KEY');
}

export async function exportPrivateKey(key: CryptoKey) {
  const keyPem = await window.crypto.subtle.exportKey('pkcs8', key);
  return convertBinaryToPem(keyPem, 'PRIVATE KEY');
}

function stripPublicKeyHeader(base64Key: string): string {
  return base64Key
    .replace('-----BEGIN PUBLIC KEY-----\n', '')
    .replace('\n-----END PUBLIC KEY-----', '');
}

function stripPrivateKeyHeader(base64Key: string): string {
  return base64Key
    .replace('-----BEGIN PRIVATE KEY-----\n', '')
    .replace('\n-----END PRIVATE KEY-----', '');
}

export async function importPublicKey(base64Key: string, hashAlg: HashAlg, use: KeyUse): Promise<PublicKey> {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Exchange ? RSA_EXCHANGE_ALG : RSA_WRITE_ALG;
  const uses: KeyUsage[] = use === KeyUse.Exchange ? ['encrypt'] : ['verify'];
  const buf = base64ToArrBuf(stripPublicKeyHeader(base64Key));
  const key = await window.crypto.subtle.importKey(
    'spki',
    buf,
    { name: alg, hash: { name: hashAlg } },
    true,
    uses,
  );
  return key;
}

export async function importPrivateKey(base64Key: string, hashAlg: HashAlg, use: KeyUse): Promise<PublicKey> {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Exchange ? RSA_EXCHANGE_ALG : RSA_WRITE_ALG;
  const uses: KeyUsage[] = use === KeyUse.Exchange ? ['decrypt'] : ['verify'];
  const buf = base64ToArrBuf(stripPrivateKeyHeader(base64Key));
  const key = await window.crypto.subtle.importKey(
    'pkcs8',
    buf,
    { name: alg, hash: { name: hashAlg } },
    true,
    uses,
  );
  return key;
}
