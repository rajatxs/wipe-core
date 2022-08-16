import { restoreLatestSession } from '../services/session.service.js';
import { disconnect } from '../utils/mysql.js';
import logger from '../utils/logger.js';

restoreLatestSession()
   .catch(function (error) {
      logger.error('session:restore', error.message);
   })
   .finally(disconnect);
