import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithSession } from 'src/types/request-with-session';
import { Transaction } from 'src/entities/transaction.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async createTransaction(
    req: RequestWithSession,
    transactionData: CreateTransactionDto,
  ) {
    try {
      if (!req.session || !req.session.userId) {
        throw new UnauthorizedException('Invalid session');
      }

      const userId = req.session.userId;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const transaction = this.transactionRepository.create({
        ...transactionData,
        userId,
      });

      await this.transactionRepository.save(transaction);

      return {
        id: transaction.id,
        userId: transaction.userId,
        created_at: transaction.createdAt,
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllTransactions(req: RequestWithSession) {
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedException('Invalid session');
    }

    try {
      return await this.transactionRepository.find({
        where: { userId: req.session.userId },
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new InternalServerErrorException(
        'There are no transactions for this user',
      );
    }
  }
}
