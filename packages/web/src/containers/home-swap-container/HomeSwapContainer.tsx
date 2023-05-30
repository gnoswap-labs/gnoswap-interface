import HomeSwap from "@components/home/home-swap/HomeSwap";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();

  const swapNow = useCallback(() => {
    router.push("/swap?from=GNOT&to=GNOS");
  }, [router]);

  return (
    <HomeSwap
      from={{
        token: "USDCoin",
        symbol: "USDC",
        amount: "121",
        price: "$0.00",
        balence: "0",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      }}
      to={{
        token: "HEX",
        symbol: "HEX",
        amount: "5000",
        price: "$0.00",
        balence: "0",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      }}
      swapNow={swapNow}
    />
  );
};

export default HomeSwapContainer;
