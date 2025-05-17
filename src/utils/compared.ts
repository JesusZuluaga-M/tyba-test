import * as bcrypt from 'bcrypt';

// función para comparar contraseñas (en utils/secure.ts o donde tengas)
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}