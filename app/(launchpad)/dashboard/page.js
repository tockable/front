"use client";
import { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  baseGoerli,
  mainnet,
  polygon,
  optimism,
  optimismGoerli,
  arbitrum,
  base,
  zora,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import AuthContext from "@/contexts/auth-context";
import CreatorDashboard from "@/components/dashboard/creator-dashboard";

const { chains, publicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    polygonMumbai,
    baseGoerli,
    optimismGoerli,
  ],
  [publicProvider()]
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

export default function page() {
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
        <AuthContext>{mounted && <CreatorDashboard />}</AuthContext>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
