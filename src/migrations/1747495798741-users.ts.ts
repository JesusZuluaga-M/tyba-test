import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users_ts1747495798741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE users (
                                    id SERIAL PRIMARY KEY,
                                    username VARCHAR NOT NULL UNIQUE,
                                    password VARCHAR NOT NULL,
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                    deleted_at TIMESTAMP WITH TIME ZONE);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
