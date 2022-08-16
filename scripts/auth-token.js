import { generateToken } from '../services/auth.service.js';
import { AUTH_SECRET } from '../config/config.js';
import logger from '../utils/logger.js';

generateToken(AUTH_SECRET)
   .then(function (token) {
      logger.info('auth:token', 'generated:', token);
   })
   .catch(function () {
      logger.error('auth:token', "couldn't generate token");
   });
