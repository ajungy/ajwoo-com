import type { netflixWork, netflixPublicExamples } from '@/content/netflix';

export type NetflixPayload = {
  work: typeof netflixWork;
  examples: typeof netflixPublicExamples;
};
export type EncryptedNetflixProject = {
  salt: string;
  iv: string;
  ciphertext: string;
  iterations: number;
};
