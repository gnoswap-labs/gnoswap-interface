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
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";

export default function EarnAdd() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"] || "";
  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { getGnotPath } = useGnotToGnot();
  const { isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          breakpoint === DEVICE_TYPE.WEB
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol} (${Number(data?.fee) / 10000
            }%)`
            : "...",
        path: `/earn/pool/${router.query["pool-path"]}`,
      },
      { title: "Add Position", path: "" },
    ];
  }, [data]);

  return (
    <PoolAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} isLoading={isLoadingCommon || isLoading}/>}
      addLiquidity={<PoolAddLiquidityContainer />}
      oneStaking={<OneClickStakingContainer />}
      footer={<Footer />}
    />
  );
}
