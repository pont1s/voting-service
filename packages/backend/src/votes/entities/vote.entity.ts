import {
  Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { User } from '@/users/entities/user.entity';
// eslint-disable-next-line import/no-cycle
import { Candidate } from '@/users/entities/candidate.enity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @ManyToOne(() => User, (user) => user.votes)
    owner: User;

  @ManyToMany(() => User)
  @JoinTable()
    voters: User[];

  @OneToMany(() => Candidate, (candidate) => candidate.vote)
    candidates: Candidate[];
}
