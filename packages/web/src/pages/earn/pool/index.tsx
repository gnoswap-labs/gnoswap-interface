import React, { useEffect, useMemo, useRef } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "@query/pools";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import { addressValidationCheck } from "@utils/validation-utils";
import { usePositionData } from "@hooks/common/use-position-data";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { SEOInfo } from "@constants/common.constant";
import { formatAddress } from "@utils/string-utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "HeaderFooter",
        "common",
        "Earn",
        "business",
      ])),
    },
  };
}

export default function Pool() {
  const router = useCustomRouter();
  const { account } = useWallet();
  const poolPath = router.getPoolPath();
  const { getGnotPath } = useGnotToGnot();
  const jumpFlagRef = useRef(false);
  const { data } = useGetPoolDetailByPath(poolPath);

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const { isFetchedPosition, loading, positions } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const isStaking = useMemo(() => {
    if (data?.incentiveType === "INCENTIVIZED") {
      return true;
    }
    const stakedPositions = positions.filter(position => position.staked);
    if (stakedPositions.length > 0) {
      return true;
    }
    if (data?.incentiveType === "EXTERNAL") {
      return true;
    }
    return false;
  }, [data?.incentiveType, positions]);

  useEffect(() => {
    if (hash === "staking" && !loading && isFetchedPosition && isStaking) {
      const positionContainerElement = document.getElementById("staking");
      const topPosition = positionContainerElement?.offsetTop;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
      });
      return;
    }

    if (
      address &&
      isFetchedPosition &&
      !loading &&
      poolPath &&
      !jumpFlagRef.current
    ) {
      if (hash && hash !== "staking") {
        const position = positions.find(item => item.id === hash);
        const isClosedPosition = !position || position?.closed;

        jumpFlagRef.current = true;
        setTimeout(() => {
          if (isClosedPosition) {
            const positionContainerElement =
              document.getElementById("liquidity-wrapper");
            const topPosition = positionContainerElement?.offsetTop;
            if (!topPosition) {
              return;
            }
            window.scrollTo({
              top: topPosition,
            });
          }

          const positionContainerElement = document.getElementById(`${hash}`);
          const topPosition = positionContainerElement?.offsetTop;
          if (!topPosition) {
            return;
          }
          window.scrollTo({
            top: topPosition,
          });
        });
        return;
      }

      jumpFlagRef.current = true;
      setTimeout(() => {
        const positionContainerElement =
          document.getElementById("liquidity-wrapper");
        const topPosition = positionContainerElement?.offsetTop;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      });
    }

    if (
      hash &&
      hash !== "staking" &&
      isFetchedPosition &&
      !loading &&
      poolPath &&
      !jumpFlagRef.current
    ) {
      const position = positions.find(item => item.id === hash);
      const isClosedPosition = !position || position?.closed;

      jumpFlagRef.current = true;
      setTimeout(() => {
        if (isClosedPosition) {
          const positionContainerElement =
            document.getElementById("liquidity-wrapper");
          const topPosition = positionContainerElement?.offsetTop;
          if (!topPosition) {
            return;
          }
          window.scrollTo({
            top: topPosition,
          });
        }

        const positionContainerElement = document.getElementById(`${hash}`);
        const topPosition = positionContainerElement?.offsetTop;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      });
      return;
    }
  }, [
    isFetchedPosition,
    hash,
    address,
    loading,
    isStaking,
    poolPath,
    positions,
    router,
  ]);

  const feeStr = useMemo(() => {
    if (!data?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(data.fee)]?.rateStr;
  }, [data?.fee]);

  const seoInfo = useMemo(
    () => SEOInfo[address ? "/earn/pool?address" : "/earn/pool"],
    [address],
  );

  const title = useMemo(() => {
    const tokenA = getGnotPath(data?.tokenA);
    const tokenB = getGnotPath(data?.tokenB);

    return seoInfo.title(
      [
        address ? formatAddress(address) : undefined,
        tokenA?.symbol,
        tokenB?.symbol,
        feeStr,
      ].filter(item => item) as string[],
    );
  }, [getGnotPath, data?.tokenA, data?.tokenB, seoInfo, address, feeStr]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolLayout
        header={<HeaderContainer />}
        poolPairInformation={<PoolPairInformationContainer />}
        liquidity={<MyLiquidityContainer address={address} />}
        staking={isStaking ? <StakingContainer /> : null}
        footer={<Footer />}
        isStaking={isStaking}
      />
    </>
  );
}
