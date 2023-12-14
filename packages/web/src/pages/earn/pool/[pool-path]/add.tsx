import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import PoolAddLayout from "@layouts/pool-add-layout/PoolAddLayout";
import PoolAddLiquidityContainer from "@containers/pool-add-liquidity-container/PoolAddLiquidityContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import OneClickStakingContainer from "@containers/one-click-staking-container/OneClickStakingContainer";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
export default function EarnAdd() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const { path } = router.query;
  const { data } = useGetPoolDetailByPath(path as string, { enabled: !!path });

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          breakpoint === DEVICE_TYPE.WEB
            ? `${data?.tokenA.symbol}/${data?.tokenB.symbol} (${
                Number(data?.fee) / 10000
              }%)`
            : "...",
        path: `/earn/pool/${router.query["pool-number"]}?path=${router.query.path}`,
      },
      { title: "Add Position", path: "" },
    ];
  }, [data]);
 if (!data) {
  return null;
 }
  return (
    <PoolAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      addLiquidity={<PoolAddLiquidityContainer />}
      oneStaking={<OneClickStakingContainer />}
      footer={<Footer />}
    />
  );
}
