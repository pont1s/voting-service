declare type MetaMaskInpageProvider = import('@metamask/providers').MetaMaskInpageProvider;
declare type ExternalProvider = import('@ethersproject/providers').ExternalProvider;
declare type AbstractProvider = import('web3/node_modules/web3-core/types').AbstractProvider;

interface EthereumProvider extends ExternalProvider {
  _state: {
    accounts: string[]
  }
  on(event: 'close' | 'accountsChanged' | 'chainChanged' | 'networkChanged', callback: (payload: any) => void): void
  once(event: 'close' | 'accountsChanged' | 'chainChanged' | 'networkChanged', callback: (payload: any) => void): void
  removeAllListeners(): void
  sendAsync: AbstractProvider['sendAsync']
}

interface Window {
  // pick one
  ethereum: EthereumProvider
  // ethereum: ExternalProvider
  // ethereum: AbstractProvider
}
