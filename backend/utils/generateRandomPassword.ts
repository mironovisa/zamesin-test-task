import crypto from 'crypto';

export default function generateRandomPassword(): string {
  const length = 10; 
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const password = Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((value) => characters[value % characters.length])
    .join('');
  return password;
}


