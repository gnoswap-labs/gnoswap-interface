import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import StakePositionContainer from "@containers/stake-position-container/StakePositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import StakePositionLayout from "@layouts/stake-position-layout/StakePositionLayout";
import React, { useMemo } from "react";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";
import { DeviceSize } from "@styles/media";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";

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
          width >= DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol
            } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: `/earn/pool/${poolPath}`,
      },
      { title: "Stake Position", path: "" },
    ];
  }, [data, width]);


  const feeStr = useMemo(() => {
    const feeTier = data?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [data?.fee]);


  const poolInfoText = useMemo(
    () => `Stake Position to ${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB)?.symbol} ${feeStr || "0"}`,
    [
      data?.tokenA,
      data?.tokenB,
      feeStr,
      getGnotPath
    ]
  );

  const title = useMemo(() => {
    if (data) return `${poolInfoText}`;

    return "Stake Position";
  }, [data, poolInfoText]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription="Create your own positions and provide liquidity to earn staking rewards."
      />
      <StakePositionLayout
        header={<HeaderContainer />}
        breadcrumbs={
          <BreadcrumbsContainer
            listBreadcrumb={listBreadcrumb}
            isLoading={isLoadingCommon || isLoading}
          />
        }
        stakeLiquidity={<StakePositionContainer />}
        footer={<Footer />}
      />
    </>
  );
}
