import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithSession } from 'src/types/request-with-session';
import { verifySignature } from 'src/utils/secure';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async use(req: RequestWithSession, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      next();
      return;
    }

    if (await this.isBlacklisted(token)) {
      next();
      return;
    }

    const session = verifySignature(token);
    if (session) {
      req.session = session;
    }

    next();
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const value = await this.cache.get(key);
    return value === true;
  }
}
