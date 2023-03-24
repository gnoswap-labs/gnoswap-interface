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
      from={{ token: "GNOT", amount: "121", price: "$0.00", balence: "0" }}
      to={{ token: "GNOS", amount: "5000", price: "$0.00", balence: "0" }}
      swapNow={swapNow}
    />
  );
};

export default HomeSwapContainer;
