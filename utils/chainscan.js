import { chainData } from "@/constants/chaindata";
export default function getChainScan(_chainId) {
  return chainData.find((chain) => chain.chainId == _chainId);
}
