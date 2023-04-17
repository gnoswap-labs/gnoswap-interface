import React from "react";
import Staking from "@components/pool/staking/Staking";

export const stakingInit = [
  {
    active: true,
    title: "7 days unstaking",
    total: "$241,210",
    staking: "$200,000 (4 LPs)",
    beingUnstaked: "$41,210 (3 LPs)",
    apr: "44%",
    tokenLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    ],
  },
  {
    active: false,
    title: "14 days unstaking",
    total: "$0",
    staking: "-",
    beingUnstaked: "-",
    apr: "44%",
    tokenLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    ],
  },
  {
    active: true,
    title: "21 days unstaking",
    total: "$300,810",
    staking: "$300,000 (4 LPs)",
    beingUnstaked: "$810  (1 LPs)",
    apr: "244%",
    tokenLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    ],
  },
];

const StakingContainer: React.FC = () => {
  return <Staking info={stakingInit} />;
};

export default StakingContainer;
