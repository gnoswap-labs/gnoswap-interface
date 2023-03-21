import HomeSwap from "@components/home/home-swap/HomeSwap";
import React from "react";

const HomeSwapContainer: React.FC = () => {
  return (
    <HomeSwap
      from={{ token: "ETH", amount: "121", price: "$0.00", balence: "0" }}
      to={{ token: "BTC", amount: "5,000", price: "$0.00", balence: "0" }}
      swapNow={() => {}}
    />
  );
};

export default HomeSwapContainer;
