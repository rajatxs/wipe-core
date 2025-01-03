import { hostname } from 'os';

/**
 * Returns system tag for identification
 * @returns {string}
 */
export function getTag() {
   const buff = Buffer.from(hostname());
   return buff.toString('hex').slice(0, 8);
}
