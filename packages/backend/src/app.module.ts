import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { UsersModule } from '@/users/users.module';
import { VotesModule } from '@/votes/votes.module';

import { User } from '@/users/entities/user.entity';
import { Vote } from '@/votes/entities/vote.entity';
import { Candidate } from '@/users/entities/candidate.enity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/configs/.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'It7YLOsq9b0g2b5t6E9fn',
      database: 'votes',
      entities: [User, Candidate, Vote],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    VotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
