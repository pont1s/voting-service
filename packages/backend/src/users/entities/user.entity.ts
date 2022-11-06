import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { Vote } from '@/votes/entities/vote.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    fullName: string;

  @Column()
    email: string;

  @Column()
    password: string;

  @OneToMany(() => Vote, (vote) => vote.owner)
    votes: Vote[];
}
