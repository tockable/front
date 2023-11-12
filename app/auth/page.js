"use client";
import { useState, useEffect } from "react";
import WagmiProvider from "@/contexts/wagmi-provider";
import AuthContext from "@/contexts/auth-context";
import Auth from "@/components/auth/signin-with-ethereum";
import Loading from "@/components/loading/loading";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiProvider>
      <AuthContext>
        {!mounted && (
          <Loading isLoading={!mounted} variant={"page"} size={20} />
        )}
        {mounted && <Auth />}
      </AuthContext>
    </WagmiProvider>
  );
}
