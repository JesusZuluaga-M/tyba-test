import { Request } from 'express';
import { Session } from './session';

/**
 * Es el tipo que se le asigna a la request al momento de que que se le asigna la session
 * un usuario
 */

export type RequestWithSession = Request & {
  session?: Session;
};
