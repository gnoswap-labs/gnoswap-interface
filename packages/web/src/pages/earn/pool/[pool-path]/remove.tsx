import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import RemoveLiquidityContainer from "@containers/remove-liquidity-container/RemoveLiquidityContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import PoolRemoveLayout from "@layouts/pool-remove-layout/PoolRemoveLayout";
import React, { useMemo } from "react";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";
import { DeviceSize } from "@styles/media";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import SEOHeader from "@components/common/seo-header/seo-header";

export default function Earn() {
  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"];
  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });

  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol
            } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: `/earn/pool/${poolPath}`,
      },
      { title: "Remove Position", path: "" },
    ];
  }, [data, width]);

  const feeStr = useMemo(() => {
    const feeTier = data?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [data?.fee]);

  const title = useMemo(() => {
    return `Remove Position From ${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol} ${feeStr ?? "0"}`;

  }, [data?.tokenA, data?.tokenB, feeStr, getGnotPath]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders."
      />
      <PoolRemoveLayout
        header={<HeaderContainer />}
        breadcrumbs={
          <BreadcrumbsContainer
            listBreadcrumb={listBreadcrumb}
            isLoading={isLoadingCommon || isLoading}
          />
        }
        removeLiquidity={<RemoveLiquidityContainer />}
        footer={<Footer />}
      />
    </>
  );
}
