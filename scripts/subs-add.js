import { createSubscription } from '../services/subs.service.js';
import { disconnect } from '../utils/mysql.js';
import logger from '../utils/logger.js';

const [ alias, phone, event = 'presence.update' ] = process.argv.slice(2);

createSubscription({
   alias,
   phone,
   // @ts-ignore 
   event,
   tag: 'CLI',
})
.catch(function (error) {
   logger.error('subs:add', "couldn't add new subscription", error);
})
.finally(disconnect);
