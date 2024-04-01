import { generateToken } from '../services/auth.js';
import { AUTH_SECRET } from '../config/config.js';

(async function () {
    try {
        const token = await generateToken(AUTH_SECRET);
        console.info(`Token: ${token}`);
    } catch (error) {
        console.error(error.message);
    }
})();
