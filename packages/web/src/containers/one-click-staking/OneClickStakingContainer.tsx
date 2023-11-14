import OneClickStaking from "@components/stake/one-click-staking/OneClickStaking";
import React, { useCallback } from "react";
import { useRouter } from "next/router";

const OneClickStakingContainer: React.FC = () => {
  const router = useRouter();

  const handleClickGotoStaking = useCallback(() => {
    router.push("/earn/pool/bar_foo_3000/stake");
  }, []);


  return <OneClickStaking handleClickGotoStaking={handleClickGotoStaking} />;
};

export default OneClickStakingContainer;
