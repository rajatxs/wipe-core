import { uploadSession } from '../services/session.service.js';
import { disconnect } from '../utils/mysql.js';
import logger from '../utils/logger.js';

uploadSession()
   .catch(function (error) {
      logger.error('session:upload', error.message);
   })
   .finally(disconnect);
