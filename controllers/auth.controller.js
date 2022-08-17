import {
   send201Response,
   send400Response,
} from '../utils/http.js';
import { generateToken } from '../services/auth.service.js';
import { AUTH_SECRET } from '../config/config.js';

/**
 * Sends new generated auth token by given `secret`
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendNewAuthToken(req, res) {
   const { secret } = req.body;
   let token;

   if (secret !== AUTH_SECRET) {
      return send400Response(res, 'Incorrect secret');
   }

   token = await generateToken(secret);

   try {
      send201Response(res, 'Token generated', { token });
   } catch (error) {
      throw new Error("Couldn't generate new token");
   }
}
