import TokenSwap from "@components/token/token-swap/TokenSwap";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const TokenSwapContainer: React.FC = () => {
  const router = useRouter();

  const swapNow = useCallback(() => {
    router.push("/swap?from=GNOT&to=GNOS");
  }, [router]);

  const connectWallet = useCallback(() => {
    console.log("Request Adena");
  }, []);

  return (
    <TokenSwap
      from={{
        token: {
          chainId: "dev",
          createdAt: "2023-10-10T08:48:46+09:00",
          name: "Gnoswap",
          address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
          path: "gno.land/r/gnos",
          decimals: 4,
          symbol: "GNOS",
          logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
          priceId: "gno.land/r/gnos"
        },
        amount: "121",
        price: "$0.00",
        balance: "0",
      }}
      to={{
        token: {
          chainId: "dev",
          createdAt: "2023-10-10T08:48:46+09:00",
          name: "Gnoswap",
          address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
          path: "gno.land/r/gnos",
          decimals: 4,
          symbol: "GNOS",
          logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
          priceId: "gno.land/r/gnos"
        },
        amount: "5000",
        price: "$0.00",
        balance: "0",
      }}
      connected={true}
      connectWallet={connectWallet}
      swapNow={swapNow}
    />
  );
};

export default TokenSwapContainer;
