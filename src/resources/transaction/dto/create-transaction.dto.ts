import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  @MinLength(1)
  description: string;
}
