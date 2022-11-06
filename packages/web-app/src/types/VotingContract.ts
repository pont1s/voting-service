import { BigNumber } from 'ethers';

type CreateVote = (
  multipleChoice: boolean,
  dateOfStart: number,
  dateOfEnd: number,
  dateOfEndAddPrivateKeys: number,
  candidates: unknown[], votersCount: number, modulus: number, exponent: number) => Promise<void>;

export interface VotingContract {
  createVote: CreateVote;
  getVotesCount: () => Promise<BigNumber>;
}
