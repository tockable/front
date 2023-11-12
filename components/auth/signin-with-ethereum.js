"use client";
import { useState, useEffect } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { getCsrfToken, signIn } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "../design/button/button";
import Loading from "../loading/loading";
import { useNetwork } from "wagmi";

export default function Auth() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [hasSigned, setHasSigned] = useState(false);
  const { chains, chain } = useNetwork();

  useEffect(() => setMounted(true), []);

  async function handleSign() {
    const connectedChainId = chains.find((c) => (c.id = chain?.id));
    if (!isConnected) return;
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: address,
        statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
        nonce: await getCsrfToken(),
        chainId: connectedChainId.id,
      });

      const signedMessage = await signMessageAsync({
        message: message.prepareMessage(),
      });

      setHasSigned(true);

      const _callBackurl = (() => {
        const _url = localStorage.getItem("tock") || "dashboard";
        localStorage.removeItem("tock");
        return `/${_url}`;
      })();

      const response = await signIn("web3", {
        message: JSON.stringify(message),
        signedMessage,
        redirect: true,
        callbackUrl: _callBackurl,
      });
      if (response?.error) {
        console.log("Error occured:", response.error);
      }
    } catch (error) {
      console.log("Error Occured", error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      {!isConnected && (
        <div className="bg-tock-semiblack rounded-xl p-4 flex flex-col items-center justify-center basis-11/12 lg:basis-1/2 ">
          <h1 className="text-xl font-bold text-tock-green mb-4">
            Sign in to Tockable
          </h1>
          <p className="text-sm font-normal text-gray-400 mb-4">
            please connect your wallet
          </p>
          <div className="my-4">
            <ConnectButton />
          </div>
        </div>
      )}
      {isConnected && !hasSigned && (
        <div className="bg-tock-semiblack rounded-xl p-4 flex flex-col items-center justify-center basis-11/12 lg:basis-1/2 ">
          <p className="text-2xl font-bold text-tock-green">welcome!</p>
          <p className="text-lg text-tock-blue font-bold rounded-xl p-2 mb-4">
            {address.slice(0, -30)}...
          </p>
          <p className="text-sm font-normal text-zinc-400 my-4">
            you can securely sign in with Ethereum
          </p>

          <Button onClick={handleSign} variant="secondary">
            Sign in wtih Ethereum
          </Button>
        </div>
      )}
      {isConnected && hasSigned && (
        <Loading
          isLoading={isConnected && hasSigned}
          variant="page"
          size={20}
        />
      )}
    </main>
  );
}
