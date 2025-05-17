import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithSession } from 'src/types/request-with-session';
import { verifySignature } from 'src/utils/secure';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: RequestWithSession, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      next();
      return;
    }

    const session = verifySignature(token);
    if (session) {
      req.session = session;
    }

    next();
  }
}
