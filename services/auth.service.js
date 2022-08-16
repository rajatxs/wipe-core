import bcrypt from 'bcryptjs';

/**
 * Returns new authentication token
 * @param {string} secret 
 */
export async function generateToken(secret) {
   const salt = await bcrypt.genSalt(5);
   return bcrypt.hash(secret, salt);
}

/**
 * Verifies given `token` with `secret`
 * @param {string} token 
 * @param {string} secret 
 */
export async function verifyToken(secret, token) {
   return bcrypt.compare(secret, token);
}
