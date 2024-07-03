import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import useRouter from "@hooks/common/use-custom-router";
import React, { useCallback } from "react";

const HighestAprsCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { higestAPRs } = usePoolData();
  const { isLoadingHighestAPRPools } = useLoading();

  const onClickItem = useCallback((path: string) => {
    router.push("/earn/pool/" + path);
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
