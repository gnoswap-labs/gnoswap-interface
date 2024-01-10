import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const HighestAprsCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { higestAPRs, loading } = usePoolData();
  const { loading: isLoadingTokenData } = useTokenData();
  const { isLoadingCommon } = useLoading();

  const movePoolDetails = useCallback((path: string) => {
    router.push("/earn/pool/" + path);
  }, [router]);

  const onClickItem = useCallback((path: string) => {
    movePoolDetails(path);
  }, [movePoolDetails]);

  return (
    <HighestAprsCardList
      list={higestAPRs}
      device={breakpoint}
      onClickItem={onClickItem}
      loading={loading || isLoadingTokenData || isLoadingCommon}
    />
  );
};

export default HighestAprsCardListContainer;
