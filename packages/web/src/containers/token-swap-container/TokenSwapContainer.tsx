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
          tokenId: "USDCoin",
          name: "USDC",
          symbol: "USDC",
          tokenLogo:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        },
        amount: "121",
        price: "$0.00",
        balance: "0",
      }}
      to={{
        token: {
          tokenId: "HEX",
          name: "HEX",
          symbol: "HEX",
          tokenLogo:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
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
