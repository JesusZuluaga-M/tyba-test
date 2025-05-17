import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { generateSignature, hashPassword } from '../../utils/secure';
import { comparePassword } from 'src/utils/compared';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: payload.username },
      });

      if (existingUser) {
        throw new BadRequestException('This name is already used');
      }

      const hashedPassword = await hashPassword(payload.password);

      const newUser = this.userRepository.create({
        ...payload,
        password: hashedPassword,
      });

      await this.userRepository.save(newUser);

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

      const validPassword = await comparePassword(
        payload.password,
        userFound.password,
      );

      if (!validPassword) {
        throw new BadRequestException('Invalid password');
      }

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

  session() {
    try {
      return {
        message: 'Session is active',
      };
    } catch (error) {
      console.error('Error en session:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
