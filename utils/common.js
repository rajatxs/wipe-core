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
 * Returns SHA256 hash of given `payload`
 * @param {object|string} payload 
 * @returns {string}
 */
export function generatePushPayloadSHA256(payload) {
   /** @type {string} */
   let raw;

   if (typeof payload === 'object') {
      raw = JSON.stringify(payload);
   } else {
      raw = payload;
   }

   return SHA256(Buffer.from(raw)).toString('hex');
}

/**
 * Returns system tag for identification
 * @returns {string}
 */
export function getTag() {
   const buff = Buffer.from(hostname());
   return buff.toString('hex').slice(0, 8);
}
