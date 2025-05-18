import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { comparePassword } from '../../utils/compared';
import { Repository } from 'typeorm';
import { generateSignature, hashPassword } from '../../utils/secure';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async createUser(payload: CreateUserDto) {
    try {
      // Verificamos en la base de datos si existe el usuario
      const existingUser = await this.userRepository.findOne({
        where: { username: payload.username },
      });

      // Si existe, lanzamos una excepcion para que no se pueda crear otro usuario igual
      if (existingUser) {
        throw new BadRequestException('This name is already used');
      }

      // Encriptamos la contraseña antes de guardarla
      const hashedPassword = await hashPassword(payload.password);

      // Creamos el nuevo usuario
      const newUser = this.userRepository.create({
        ...payload,
        password: hashedPassword,
      });

      // Lo guardamos en la base de datos ya que el .create() no lo hace, solo crea una instancia
      await this.userRepository.save(newUser);

      // Mostramos el usuario creado sin la contraseña
      return {
        id: newUser.id,
        username: newUser.username,
        created_at: newUser.created_at,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async loginUser(payload: LoginUserDto) {
    try {
      const userFound = await this.userRepository.findOne({
        where: { username: payload.username },
      });

      if (!userFound) {
        throw new BadRequestException('Incorrect User');
      }

      // Compara la contraseña ingresada con la almacenada en la base de datos
      const validPassword = await comparePassword(
        payload.password,
        userFound.password,
      );

      if (!validPassword) {
        throw new BadRequestException('Invalid password');
      }
      // Genera el token de acceso
      const token = generateSignature(userFound);

      return {
        id: userFound.id,
        username: userFound.username,
        created_at: userFound.created_at,
        token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error en login:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async logoutUser(token: string) {
    try {
      const key = `blacklist:${token}`;
      await this.cache.set(key, true, 3600 * 1000);

      // Verificamos si el token fue guardado en la cache
      // Si no fue guardado, lanzamos una excepcion
      // Esto es para evitar que el token sea utilizado nuevamente
      const tokenData = await this.cache.get(key);
      if (!tokenData) {
        throw new BadRequestException('Token not found in cache');
      }

      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error en logout:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
