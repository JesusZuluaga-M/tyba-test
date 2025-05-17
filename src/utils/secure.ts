import * as bcrypt from 'bcrypt';

const PEPPER = process.env.PEPPER_SECRET || '';

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  const passwordWithPepper = plainPassword + PEPPER;
  return await bcrypt.hash(passwordWithPepper, saltRounds);
}