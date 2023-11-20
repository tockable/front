"use client";
import { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import LaunchpadLanding from "@/components/contract-deployment/launchpad-landing";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  base,
  zora,
  polygonMumbai,
  baseGoerli,
  optimismGoerli,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import AuthContext from "@/contexts/auth-context";

const { chains, publicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    base,
    zora,
    polygonMumbai,
    baseGoerli,
    optimismGoerli,
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_CONNECT_WALLET_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_CONNECT_WALLET_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function Page({ params }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#41f79a",
          accentColorForeground: "black",
          borderRadius: "large",
          fontStack: "system",
          overlayBlur: "small",
        })}
        appInfo={{
          appName: "Tockable",
          learnMoreUrl: "https://tockable.xyz",
        }}
        chains={chains}
      >
        <AuthContext>
          {mounted && <LaunchpadLanding params={params} />}
        </AuthContext>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
