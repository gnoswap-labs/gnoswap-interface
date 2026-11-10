import React, { useEffect, useMemo, useRef } from "react";

import Footer from "@components/common/footer/Footer";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import { useVideoGuide } from "@hooks/common/use-video-guide";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { usePoolDetailRoute } from "@hooks/pool/ui/use-pool-detail-route";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetPoolDetailByPath, useGetPoolStakingListByPoolPath } from "@query/pools";

import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";
import { isValidVideoGuideType } from "@utils/video-guide.utils";
import MyLiquidityContainer from "./containers/my-liquidity-container/MyLiquidityContainer";
import PoolPairInformationContainer from "./containers/pool-pair-information-container/PoolPairInformationContainer";
import StakingContainer from "./containers/staking-container/StakingContainer";
import PoolLayout from "./PoolLayout";
import { PoolLayoutWrapper, PoolLoadingMain } from "./PoolLayout.styles";

export const PoolDetailLoading: React.FC = () => (
  <PoolLayoutWrapper>
    <HeaderContainer />
    <PoolLoadingMain role="status" aria-label="Loading position" aria-busy="true">
      <LoadingSpinner />
    </PoolLoadingMain>
    <Footer />
  </PoolLayoutWrapper>
);

const PoolDetail: React.FC = () => {
  const { poolPath, address: routeAddress, hash, isPositionLink } = usePoolDetailRoute();

  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.STAKING);

  const { account } = useWallet();
  const urlAddress = routeAddress || "";
  const jumpFlagRef = useRef(false);
  const { data } = useGetPoolDetailByPath(poolPath);

  const connectAddress = useMemo(() => {
    return account?.address || "";
  }, [account?.address]);

  const addressContext = useMemo(() => {
    return {
      urlAddress,
      connectAddress,
      isOwner: urlAddress ? urlAddress === connectAddress : true,
    };
  }, [urlAddress, connectAddress]);

  const { isFetchedPosition, loading, positions } = usePositionData({
    address: urlAddress || connectAddress,
    poolPath,
    withClosed: false,
    fetchAll: true,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const { data: poolStakings = [] } = useGetPoolStakingListByPoolPath(poolPath || "", {
    enabled: !!poolPath,
  });

  const hasPoolStaking = useMemo(() => {
    return poolStakings.length > 0;
  }, [poolStakings]);

  const isStakable = useMemo(() => {
    if (data?.incentivized === true) {
      return true;
    }

    const stakedPositions = positions.filter(position => position.staked);
    if (stakedPositions.length > 0) {
      return true;
    }

    return false;
  }, [data?.incentivized, positions]);

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

    // Position-ID links wait for their exhaustive list; legacy hashes keep the section fallback.
    if (isPositionLink) return;

    const positionElement = hash ? document.getElementById(hash) : null;
    const element = positionElement || document.getElementById("liquidity-wrapper");
    if (element && isElementInDOM(element)) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (!loading && isFetchedPosition && hash && !jumpFlagRef.current) {
      jumpFlagRef.current = true;
      setTimeout(handleScroll, 100);
    }
  }, [loading, isFetchedPosition, hash, isStakable, isPositionLink]);

  useEffect(() => {
    jumpFlagRef.current = false;
  }, [hash]);

  return (
    <>
      <PoolLayout
        header={<HeaderContainer />}
        poolPairInformation={<PoolPairInformationContainer />}
        liquidity={<MyLiquidityContainer addressContext={addressContext} isStakable={isStakable} />}
        staking={
          isStakable ? <StakingContainer hasPoolStaking={hasPoolStaking} onOpenVideoGuide={openVideoGuide} /> : null
        }
        footer={<Footer />}
        isStaking={isStakable}
      />
      {isOpenVideoGuide && isValidVideoGuideType(currentGuide) && (
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} poolPath={poolPath} />
      )}
    </>
  );
};

export default PoolDetail;
