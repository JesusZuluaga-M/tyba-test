import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithSession } from 'src/types/request-with-session';
import { verifySignature } from 'src/utils/secure';

/**
 * Este middleware se encarga de verificar la firma de la sesión de usuario y de almacenar
 * la sesión en el request para que esté disponible en el resto de la aplicación.
 * Si la firma no es válida, se ignora la sesión y se continúa con la ejecución del middleware.
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async use(req: RequestWithSession, res: Response, next: NextFunction) {
    // Si no hay firma, se ignora la sesión y se continúa con la ejecución del middleware
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      next();
      return;
    }

    // Verificamos si la forma esta en la lista negra de redis para poder implementar el logout
    if (await this.isBlacklisted(token)) {
      next();
      return;
    }

    // Verificamos la firma de la sesión y la almacenamos en el request
    const session = verifySignature(token);
    if (session) {
      req.session = session;
    }

    next();
  }

  // Funcion que verifica si el token está en la lista negra
  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const value = await this.cache.get(key);
    return value === true;
  }
}
