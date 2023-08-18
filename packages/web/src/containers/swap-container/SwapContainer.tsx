import React, { useCallback, useState } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";

export interface SwapGasInfo {
  priceImpact: string;
  minReceived: string;
  gasFee: string;
  usdExchangeGasFee: string;
}

export const dummySwapGasInfo: SwapGasInfo = {
  priceImpact: "-0.3%",
  minReceived: "1.8445 ETH",
  gasFee: "0.002451 GNOT",
  usdExchangeGasFee: "$0.12",
};

export interface AutoRouterInfo {
  v1fee: string[];
  v2fee: string[];
  v3fee: string[];
}

export const dummyAutoRouterInfo: AutoRouterInfo = {
  v1fee: ["60%", "0.05%", "0.01%"],
  v2fee: ["35%", "0.01%"],
  v3fee: ["5%", "0.3%"],
};

const SwapContainer: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gnosAmount, setGnosAmount] = useState("1500");
  const [breakpoint] = useAtom(CommonState.breakpoint);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(true);
  const [autoRouter, setAutoRouter] = useState(false);
  const [swapInfo, setSwapInfo] = useState(false);
  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);
  const showSwapInfo = () => {
    setSwapInfo(prev => !prev);
  };

  const showAutoRouter = () => {
    setAutoRouter(prev => !prev);
  };
  return (
    <SwapCard
      search={search}
      keyword={keyword}
      isConnected={isConnected}
      deviceType={breakpoint}
      swapInfo={swapInfo}
      showSwapInfo={showSwapInfo}
      gnosAmount={gnosAmount}
      autoRouter={autoRouter}
      showAutoRouter={showAutoRouter}
      swapGasInfo={dummySwapGasInfo}
      autoRouterInfo={dummyAutoRouterInfo}
      from={{
        token: "USDCoin",
        symbol: "USDC",
        amount: "121",
        price: "$0.00",
        gnosExchangePrice: "1250",
        usdExchangePrice: "($1541.55)",
        balance: "0",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      }}
      to={{
        token: "HEX",
        symbol: "HEX",
        amount: "5000",
        price: "$0.00",
        gnosExchangePrice: "1250",
        usdExchangePrice: "($1541.55)",
        balance: "0",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      }}
    />
  );
};

export default SwapContainer;
