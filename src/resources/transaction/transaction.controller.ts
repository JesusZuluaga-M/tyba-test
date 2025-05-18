import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Get,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RequestWithSession } from 'src/types/request-with-session';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/getalltransactions')
  async transactions(@Req() req: RequestWithSession) {
    // Verificamos siempre si existe la session
    // y si el usuario tiene una session activa
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedException('Invalid session');
    }

    return await this.transactionService.getAllTransactions(req);
  }

  @Post('/create')
  async createTransaction(
    @Req() req: RequestWithSession,
    @Body() transactionData: CreateTransactionDto,
  ) {
    // Siempre validamos que la session existe
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedException('User not logged in');
    }

    return await this.transactionService.createTransaction(
      req,
      transactionData,
    );
  }
}
