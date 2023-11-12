import { chainData } from "@/constants/chaindata";
export default function getChainData(_chainId) {
  return chainData.find((chain) => chain.chainId == _chainId);
}
