import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactions_ts1747510191450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        "userId" INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE transactions`);
  }
}
