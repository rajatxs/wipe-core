import { createHash } from 'crypto';
import { hostname } from 'os';

/**
 * Returns SHA256 hash of `data`
 * @param {Buffer} data 
 */
export function SHA256(data) {
   const hasher = createHash('sha256');
   return hasher.update(data).digest();
}

/**
 * Returns system tag for identification
 * @returns {string}
 */
export function getTag() {
   const buff = Buffer.from(hostname());
   return buff.toString('hex').slice(0, 8);
}
