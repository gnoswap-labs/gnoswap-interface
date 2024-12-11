import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import useUrlParam from "@hooks/common/use-url-param";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetPoolDetailByPath } from "@query/pools";
import { formatAddress } from "@utils/string-utils";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { isValidAddress } from "@utils/validation-utils";
import { usePositionData } from "@hooks/common/use-position-data";

import SEOHeader from "@components/common/seo-header/seo-header";
import PoolLayout from "@layouts/pool/pool-detail/PoolLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolPairInformationContainer from "@layouts/pool/pool-detail/containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@layouts/pool/pool-detail/containers/my-liquidity-container/MyLiquidityContainer";
import StakingContainer from "@layouts/pool/pool-detail/containers/staking-container/StakingContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn", "Pool"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const { account } = useWallet();
  const poolPath = router.getPoolPath();
  const jumpFlagRef = React.useRef(false);
  const { data } = useGetPoolDetailByPath(poolPath);

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({ addr: undefined });

  const address = React.useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !isValidAddress(address)) {
      return undefined;
    }
    return address;
  }, [initializedData, account]);

  const { isFetchedPosition, loading, positions } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const isStakable = React.useMemo(() => {
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

  const isElementInDOM = (element: HTMLElement | null): boolean => {
    return !!(element && document.body.contains(element));
  };

  const handleScroll = () => {
    if (hash === "staking" && isStakable) {
      const element = document.getElementById("staking");
      if (element && isElementInDOM(element)) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const position = positions.find(item => item.id.toString() === hash);
    if (position) {
      const element = document.getElementById(hash as string);
      if (element && isElementInDOM(element)) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      const element = document.getElementById("liquidity-wrapper");
      if (element && isElementInDOM(element)) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  React.useEffect(() => {
    if (positions.length === 0) {
      window.scrollTo({ top: 0 });
      return;
    }

    if (!loading && isFetchedPosition && hash && !jumpFlagRef.current) {
      jumpFlagRef.current = true;
      setTimeout(handleScroll, 100);
    }
  }, [loading, isFetchedPosition, hash, positions.length]);

  React.useEffect(() => {
    jumpFlagRef.current = false;
  }, [hash]);

  const { getGnotPath } = useGnotToGnot();

  const feeStr = React.useMemo(() => {
    if (!data?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(data.fee)]?.rateStr;
  }, [data?.fee]);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = React.useMemo(() => SEOInfo[address ? "/earn/pool?address" : "/earn/pool"], [address]);

  const title = React.useMemo(() => {
    const tokenA = getGnotPath(data?.tokenA);
    const tokenB = getGnotPath(data?.tokenB);

    return seoInfo.title(
      [address ? formatAddress(address) : undefined, tokenA?.symbol, tokenB?.symbol, feeStr].filter(
        item => item,
      ) as string[],
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
        liquidity={<MyLiquidityContainer address={address} isStakable={isStakable} />}
        staking={isStakable ? <StakingContainer /> : null}
        footer={<Footer />}
        isStaking={isStakable}
      />
    </>
  );
}
