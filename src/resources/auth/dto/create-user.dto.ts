import { IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @MinLength(8)
  fullname: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must have at least one number, one capitalize letter and lenght 8.',
  })
  password: string;
}
