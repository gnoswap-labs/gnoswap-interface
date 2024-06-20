import React, { useEffect, useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "@query/pools";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import { addressValidationCheck } from "@utils/validation-utils";
import { usePositionData } from "@hooks/common/use-position-data";
import { encryptId } from "@utils/common";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { formatAddress } from "@utils/string-utils";

export default function Pool() {
  const router = useRouter();
  const { account } = useWallet();
  const poolPath = (router.query["pool-path"] || "") as string;
  const { getGnotPath } = useGnotToGnot();
  const { data } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
    onError: (err: any) => {
      if (err["response"]["status"] === 404) {
        router.push("/404");
      }
    }
  });

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

  const {
    isFetchedPosition,
    loading,
    positions,
  } = usePositionData({
    address,
    poolPath: encryptId(poolPath),
    queryOption: {
      enabled: !!poolPath,
    }
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
    if (
      hash === "staking"
      && !loading
      && isFetchedPosition
      && isStaking
    ) {
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
      poolPath
    ) {
      if (hash && hash !== "staking") {
        const position = positions.find(item => item.id === hash);
        const isClosedPosition = !position || position?.closed;

        if (isClosedPosition) {
          setTimeout(() => {
            const positionContainerElement =
              document.getElementById("liquidity-wrapper");
            const topPosition =
              positionContainerElement?.offsetTop;
            if (!topPosition) {
              return;
            }
            window.scrollTo({
              top: topPosition,
            });
          });
        }

        setTimeout(() => {
          if (isClosedPosition) {
            const positionContainerElement =
              document.getElementById("liquidity-wrapper");
            const topPosition =
              positionContainerElement?.offsetTop;
            if (!topPosition) {
              return;
            }
            window.scrollTo({
              top: topPosition,
            });
          }

          const positionContainerElement = document.getElementById(`${hash}`);
          const topPosition =
            positionContainerElement?.offsetTop;
          if (!topPosition) {
            return;
          }
          window.scrollTo({
            top: topPosition,
          });
        });
        return;
      }

      setTimeout(() => {
        const positionContainerElement =
          document.getElementById("liquidity-wrapper");
        const topPosition =
          positionContainerElement?.offsetTop;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      });
    }
  }, [
    isFetchedPosition,
    hash,
    address,
    loading,
    isStaking,
    poolPath,
    positions,
    router
  ]);

  const feeStr = useMemo(() => {
    if (!data?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(data.fee)]?.rateStr;
  }, [data?.fee]);


  const title = useMemo(() => {
    const poolInfoText = `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol} ${feeStr || "0"}`;

    if (address) {
      return `${formatAddress(address)} | ${poolInfoText} | Earn on Gnoswap`;
    }

    return `${poolInfoText} | Earn on Gnoswap`;
  }, [
    address,
    getGnotPath,
    data?.tokenA,
    data?.tokenB,
    feeStr,
  ]);

  const ogDescription = useMemo(() => {
    if (address) return "Create your own positions and provide liquidity to earn trading fees.";

    return "Provide liquidity to earn trading fees and staking rewards. GnoSwap's concentrated liquidity maximizes your earnings by amplifying your capital efficiency.";
  }, [address]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription="Provide liquidity to earn trading fees and staking rewards. GnoSwap's concentrated liquidity maximizes your earnings by amplifying your capital efficiency."
        ogDescription={ogDescription}
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
