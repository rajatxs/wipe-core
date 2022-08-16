import { SHA256 } from './common.js';

/**
 * Returns SHA256 hash of given `archive`
 * @param {Buffer} archive 
 */
export function generateArchiveSHA256(archive) {
   return SHA256(archive).toString('hex');
}
