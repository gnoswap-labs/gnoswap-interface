import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import UnstakeLiquidityContainer from "@containers/unstake-position-container/UnstakePositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import UnstakeLiquidityLayout from "@layouts/unstake-liquidity-layout/UnstakeLiquidityLayout";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";

export default function Earn() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"];
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
        path: `/earn/pool/${poolPath}/unstake`,
      },
      { title: "Unstake Position", path: "" },
    ];
  }, [data]);

  return (
    <UnstakeLiquidityLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} isLoading={isLoadingCommon || isLoading} />}
      unstakeLiquidity={<UnstakeLiquidityContainer />}
      footer={<Footer />}
    />
  );
}
