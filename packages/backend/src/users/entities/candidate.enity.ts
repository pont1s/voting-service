import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { Vote } from '@/votes/entities/vote.entity';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @ManyToOne(() => Vote, (vote) => vote.candidates)
    vote: Vote;
}
