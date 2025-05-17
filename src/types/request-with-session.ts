import { Request } from 'express';
import { Session } from './session';

export type RequestWithSession = Request & {
  session?: Session;
};
