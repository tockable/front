
"use client";
import "@rainbow-me/rainbowkit/styles.css";
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
  arbitrum,
  arbitrumGoerli,
  base,
  zora,
  polygonMumbai,
  baseGoerli,
  optimismGoerli,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useState, useEffect } from "react";
import Components from "./components/components";

const { chains, publicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    polygonMumbai,
    arbitrumGoerli,
    baseGoerli,
    optimismGoerli,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function Page() {
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
        {mounted && <Components/>}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

