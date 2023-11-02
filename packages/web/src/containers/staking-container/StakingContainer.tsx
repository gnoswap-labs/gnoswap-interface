import React, { useEffect, useState, useMemo } from "react";
import Staking from "@components/pool/staking/Staking";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";

export const rewardInfoInit = {
  apr: "89",
  tokenPair: {
    tokenA: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "HEX",
      symbol: "HEX",
      logoURI:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    },
    tokenB: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "USDCoin",
      symbol: "USDC",
      logoURI:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  },
};

export const stakingInit = [
  {
    active: true,
    title: "Staked less than 5 days",
    total: "$241,210",
    lp: "0",
    staking: "$200,000 (4 LPs)",
    beingUnstaked: "$41,210 (3 LPs)",
    apr: "32%",
    multiplier: "x0.5 Multiplier",
    logoURI: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
  },
  {
    active: true,
    title: "Staked less than 10 days",
    total: "$0",
    lp: "0",
    staking: "-",
    beingUnstaked: "-",
    apr: "50%",
    multiplier: "x0.7 Multiplier",
    logoURI: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
  },
  {
    active: true,
    title: "Staked less than 30 days",
    total: "$300,810",
    lp: "0",
    staking: "$300,000 (4 LPs)",
    beingUnstaked: "$810  (1 LPs)",
    apr: "67%",
    multiplier: "x1.0 Multiplier",
    logoURI: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
  },
  {
    active: true,
    title: "Staked more than 30 days",
    total: "$4,123.12",
    lp: "2",
    staking: "$82.54",
    beingUnstaked: "$810  (1 LPs)",
    apr: "89%",
    multiplier: "x1.5 Multiplier",
    logoURI: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
  },
];

const StakingContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const [mobile, setMobile] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork } = useWallet();

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 768 && window.innerWidth > 375
        ? setMobile(true)
        : setMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const isDisabledButton = useMemo(() => {
    return isSwitchNetwork || !connectedWallet;
  }, [isSwitchNetwork, connectedWallet]);

  return (
    <Staking
      info={stakingInit}
      rewardInfo={rewardInfoInit}
      breakpoint={breakpoint}
      mobile={mobile}
      isDisabledButton={isDisabledButton}
    />
  );
};

export default StakingContainer;
