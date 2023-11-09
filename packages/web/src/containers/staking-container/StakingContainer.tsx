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
        "/gnos.svg",
    },
    tokenB: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "USDCoin",
      symbol: "USDC",
      logoURI:
        "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    },
  },
};

export const stakingInit = [
  {
    currentIndex: 2,
    active: true,
    title: "Staked less than 5 days",
    total: "$241,210",
    lp: "0",
    staking: "$200",
    beingUnstaked: "$41,210 (3 LPs)",
    apr: "32%",
    multiplier: "30% of Max Rewards",
    logoURI: [
      "/gnos.svg",
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    ],
    tooltipContent: "During this staking period, you will only receive 30% of your maximum staking rewards. Keep your position staked to increase your rewards.",
  },
  {
    currentIndex: 2,
    active: false,
    title: "Staked less than 10 days",
    total: "$1",
    lp: "1",
    staking: "2",
    beingUnstaked: "-",
    apr: "50%",
    multiplier: "50% of Max Rewards",
    logoURI: [
      "/gnos.svg",
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    ],
    tooltipContent: "During this staking period, you will only receive 50% of your maximum staking rewards. Keep your position staked to increase your rewards.",
  },
  {
    currentIndex: 2,
    active: false,
    title: "Staked less than 30 days",
    total: "0",
    lp: "0",
    staking: "0",
    beingUnstaked: "$810  (1 LPs)",
    apr: "67%",
    multiplier: "70% of Max Rewards",
    logoURI: [
      "/gnos.svg",
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    ],
    tooltipContent: "During this staking period, you will only receive 70% of your maximum staking rewards. Keep your position staked to increase your rewards.",
  },
  {
    currentIndex: 2,
    active: false,
    title: "Staked more than 30 days",
    total: "0",
    lp: "0",
    staking: "$82.54",
    beingUnstaked: "$810  (1 LPs)",
    apr: "89%",
    multiplier: "Receiving Max Rewards",
    logoURI: [
      "/gnos.svg",
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    ],
    tooltipContent: "During this staking period, you will receive maximum staking rewards. Keep your position staked to maintain your rewards.",
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
