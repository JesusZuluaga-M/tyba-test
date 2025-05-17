import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { Session } from 'src/types/session';

const privateKey = fs.readFileSync('./certs/private_key.pem', 'utf8');
const publicKey = fs.readFileSync('./certs/public_key.pem', 'utf8');
const PEPPER = process.env.PEPPER_SECRET ?? '';

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  const passwordWithPepper = plainPassword + PEPPER;
  return await bcrypt.hash(passwordWithPepper, saltRounds);
}

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

export function verifySignature(token: string): Session | null {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return decoded as Session;
  } catch {
    return null;
  }
}
