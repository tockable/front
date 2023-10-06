import "./globals.css";
import { Comfortaa, Exo_2 } from "next/font/google";

const comfortaa = Comfortaa({ subsets: ["latin"], weight: ["300", "700"] });

export const metadata = {
  title: "Tockable.xyz",
  description:
    "Unlocking new possibilites of web3 and NFT eco system; a new generation launchpad for creators, builders and minters. ",
  applicationNAme: "tockable.xyz",
  keywords: ["nft", "launchpad", "optimism"],
  authors: [{ name: "tockable.xyz" }],
  colorSchemte: "dark",
  creator: "tockableteam",
  themeColor: "#231f20",
  twitter: {
    card: "summary_large_image",
    title: "Tockable.xyz",
    description:
      "Unlocking new possibilites of web3 and NFT eco system; a new generation launchpad for creators, builders and minters. ",

    creator: "@tockablexyz",
    images: [
      "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
    ],
  },
  openGraph: {
    title: "Tockable.xyz",
    description:
      "Unlocking new possibilites of web3 and NFT eco system; a new generation launchpad for creators, builders and minters. ",
    url: "https://tockable.xyz",
    siteName: "Tockable.xyz",
    images: [
      {
        url: "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
        width: 1500,
        height: 500,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={comfortaa.className}>{children}</body>
    </html>
  );
}
