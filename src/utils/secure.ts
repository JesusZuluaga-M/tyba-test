import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { Session } from 'src/types/session';

// Definimos las claves publicas y privadas para la firma del token
// Aicionalmente para evitar descencriptamiento por parte de otras personas a la contraseña
// se le agrega un "pepper" a la contraseña antes de encriptarla

const privateKey = fs.readFileSync('./certs/private_key.pem', 'utf8');
const publicKey = fs.readFileSync('./certs/public_key.pem', 'utf8');
const PEPPER = process.env.PEPPER_SECRET ?? '';

// Esta funcion se encarga de encriptar la contraseña
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  const passwordWithPepper = plainPassword + PEPPER;
  return await bcrypt.hash(passwordWithPepper, saltRounds);
}

// Esta funcion se encarga de generar la firma del token
export function generateSignature(user: User): string {
  const payload: Session = {
    userId: user.id,
    username: user.username,
    created_at: user.created_at,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h',
  });
}

// Esta funcion se encarga de verificar la firma del token

export function verifySignature(token: string): Session | null {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return decoded as Session;
  } catch {
    return null;
  }
}
