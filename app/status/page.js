"use client";

import "@rainbow-me/rainbowkit/styles.css";
import Status from "@/components/waitlist/waitlist-status";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import React from "react";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "tockablexyz",
  projectId: "0b375fc7db971acd1c7e3016c2c5f308",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function page() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
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
        {mounted && <Status />}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
