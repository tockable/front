"use server";

const VERIFY_CHAIN_DATA = [
  {
    chainId: 1,
    endpoint: "https://api.etherscan.io/api",
    apikey: process.env.ETHERSCAN_API,
  },
  {
    chainId: 10,
    endpoint: "https://api-optimistic.etherscan.io/api",
    apikey: process.env.OPTIMISTICSCAN_API,
  },
  {
    chainId: 420,
    endpoint: "https://api-optimistic.etherscan.io/api",
    apikey: process.env.OPTIMISTIC_GOERLI_SCAN_API,
  },
  {
    chainId: 137,
    endpoint: "https://api.polygonscan.com/api",
    apikey: process.env.POLYGONSCAN_API,
  },
  {
    chainId: 80001,
    endpoint: "https://api-testnet.polygonscan.com/api",
    apikey: process.env.POLYGON_MUMBAISCAN_API,
  },
  {
    chainId: 8453,
    endpoint: "https://api.basescan.org/api",
    apikey: process.env.BASESCAN_API,
  },
  {
    chainId: 84531,
    endpoint: "https://api-goerli.basescan.org",
    apikey: process.env.BASE_GOERLISCAN_API,
  },
];

export default async function getVerifyChainData(_chainId) {
  const chaindata = VERIFY_CHAIN_DATA.find(
    (chain) => (chain.id = Number(_chainId))
  );
  return chaindata;
}
