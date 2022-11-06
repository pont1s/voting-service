import useFetch from '@/hooks/useFetch';
import { ContractArtifacts, ContractAddress } from '@/services/@types/ethers';

export const getContractAddress = async () => {
  const response = await useFetch.get<ContractAddress>('/contract-address.json');
  const result = await response.json();

  return result;
};

export const getContractArtifacts = async () => {
  const response = await useFetch.get<ContractArtifacts>('/VotingPlatform.json');
  const result = await response.json();
  return result;
};
