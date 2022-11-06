export const config = {
  urlBase: import.meta.env.VITE_API_BASE_DOMAIN,
  urlRest: import.meta.env.MODE === 'development'
    ? `https://${import.meta.env.VITE_API_BASE_DOMAIN}:3000`
    : `https://${import.meta.env.VITE_API_BASE_DOMAIN}`,
  apiVersion: 'v1',
  shikimoriUrl: 'https://shikimori.one',
  mode: import.meta.env.MODE as 'development' | 'production' | 'staging',
  mocks: {
    isGlobalUseMockedData: false,
  },
};

export const HARDHAT_NETWORK_ID = '1337';
export const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
