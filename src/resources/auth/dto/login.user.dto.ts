import { IsString, MinLength } from 'class-validator';

/**
 * DTO para login de usuario
 */
export class LoginUserDto {
  @IsString()
  @MinLength(1, { message: 'Username should not be empty' })
  username: string;

  @IsString()
  @MinLength(1, { message: 'Password should not be empty' })
  password: string;
}
