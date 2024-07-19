import React, { useCallback } from "react";

import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import useCustomRouter from "@hooks/common/use-custom-router";

const HighestAprsCardListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { breakpoint } = useWindowSize();
  const { higestAPRs } = usePoolData();
  const { isLoadingHighestAPRPools } = useLoading();

  const onClickItem = useCallback((path: string) => {
    router.movePageWithPoolPath("POOL", path);
  }, []);

  return (
    <HighestAprsCardList
      list={higestAPRs}
      device={breakpoint}
      onClickItem={onClickItem}
      loading={isLoadingHighestAPRPools}
    />
  );
};

export default HighestAprsCardListContainer;
