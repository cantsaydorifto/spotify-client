import cryptojs from 'crypto-js';
const { enc, SHA256 } = cryptojs;
import secureRandom from 'secure-random';
const { randomBuffer } = secureRandom;

const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';

export function random(size: number): string {
  let value = '';

  const bytes = randomBuffer(size);
  const scale = 256 / mask.length;

  for (let i = 0; i < size; i++) {
    value += mask.charAt(Math.floor(bytes[i] / scale));
  }

  return value;
}

function hash(str: string): string {
  return enc.Base64.stringify(SHA256(str));
}

function base64url(str: string): string {
  return str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function createVerifier(length: number = 128): string {
  if (length < 43 || length > 128) {
    throw new Error(`expected length ${length} between 43 and 128`);
  }

  return random(length);
}

function createChallenge(verifier: string): string {
  return base64url(hash(verifier));
}

export function createChallengeAndVerifier(length: number = 128) {
  const verifier = createVerifier(length);
  const challenge = createChallenge(verifier);

  return {
    codeVerifier: verifier,
    codeChallenge: challenge
  };
}
