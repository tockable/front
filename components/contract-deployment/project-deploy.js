import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/nabvar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getWalletClient, getPublicClient } from "@wagmi/core";
import { createWalletClient, http, custom, createPublicClient } from "viem";
import { testContract } from "@/contract.test/contract";
import { polygonMumbai } from "viem/chains";

// console.log(walletClient);
export default function Deploy() {
  const { address, isConnected } = useAccount();
  async function getc() {
    //alternative 1
    const client = await getWalletClient({ chainId: polygonMumbai.id });

    //alternative 2
    // const client = createWalletClient({
    //   chain: polygon,
    //   transport: custom(window.ethereum),
    // });

    // const [address] = await client.getAddresses();

    // alternative 3
    // const client = awiat getWalletClient()
    // const [address] = await client.getAddresses();

    const hash = await client.deployContract({
      ...testContract,
      account: address,
    });
    // const publicClient = createPublicClient;
    const publicClient = getPublicClient({ chainId: polygonMumbai.id });
    const reciept = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`${reciept.contractAddress}`);

  }
  return (
    <main className="h-screen bg-tock-dark">
      <ConnectButton />
      <button onClick={() => getc()}>Deploy</button>
    </main>
  );
}
