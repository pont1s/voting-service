import { defineStore } from 'pinia';
import { onMounted, shallowRef } from 'vue';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import { VotingContract } from '@/types/VotingContract';
import { getContractAddress, getContractArtifacts } from '@/services/ethers';

export const useEthersStore = defineStore('ethersStore', () => {
  const provider = shallowRef<Web3Provider | null>(null);
  const signer = shallowRef<JsonRpcSigner | null>(null);
  const contract = shallowRef<(Contract & VotingContract) | null>(null);

  // const signer: JsonRpcSigner | null = null;
  // const contract: (Contract & VotingContract) | null = null;

  const initEthers = async () => {
    provider.value = new ethers.providers.Web3Provider(window.ethereum);
    await provider.value.send('eth_requestAccounts', []);
    signer.value = provider.value.getSigner(0);

    const address = await getContractAddress();
    const contractArtifacts = await getContractArtifacts();
    contract.value = new ethers.Contract(
      address.VotingPlatform,
      contractArtifacts.abi,
      signer.value,
    ) as Contract & VotingContract;
  };

  // onMounted(async () => {
  //   await initEthers();
  // });

  // We reinitialize it whenever the user changes their account.
  window.ethereum.on('accountsChanged', ([newAddress]) => {
    console.log('account changed');
    console.log(newAddress);
  });

  // We reset the dapp state if the network is changed
  window.ethereum.on('chainChanged', ([networkId]) => {
    console.log('network changed');
    console.log(networkId);
  });

  return {
    provider,
    signer,
    contract,
  };
});
