import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsAlpha,
  IsDate,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

/*
  Esta entidad representa un usuario en la base de datos.
  Contiene información sobre el nombre de usuario, el nombre completo,
  la contraseña y las fechas de creación, actualización y eliminación.
*/
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @IsAlpha()
  fullname: string;

  @Column()
  @IsString()
  password: string;

  @IsDate()
  @CreateDateColumn()
  created_at: Date;

  @IsDate()
  @UpdateDateColumn()
  updated_at: Date;

  @IsDate()
  @DeleteDateColumn()
  deleted_at?: Date;
}
