import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { netflixWork, netflixPublicExamples } from '@/content/netflix';
import type { EncryptedNetflixProject } from './types';

// Build-time only. No password or unencrypted project copy is sent to the client.
export function encryptNetflixProject(): EncryptedNetflixProject {
  const password = process.env.NETFLIX_PROJECT_PASSWORD;
  if (!password) throw new Error('Set NETFLIX_PROJECT_PASSWORD in the build environment to generate the Netflix page.');
  const iterations = 210000;
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const plaintext = JSON.stringify({ work: netflixWork, examples: netflixPublicExamples });
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return { salt: salt.toString('base64'), iv: iv.toString('base64'), ciphertext: ciphertext.toString('base64'), iterations };
}
