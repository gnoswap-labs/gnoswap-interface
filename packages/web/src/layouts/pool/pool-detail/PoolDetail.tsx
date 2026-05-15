import React, { useEffect, useMemo, useRef } from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetPoolDetailByPath, useGetPoolStakingListByPoolPath } from "@query/pools";
import { isValidAddress } from "@utils/validation-utils";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import { useVideoGuide } from "@hooks/common/use-video-guide";

import MyLiquidityContainer from "./containers/my-liquidity-container/MyLiquidityContainer";
import PoolPairInformationContainer from "./containers/pool-pair-information-container/PoolPairInformationContainer";
import StakingContainer from "./containers/staking-container/StakingContainer";
import PoolLayout from "./PoolLayout";
import { isValidVideoGuideType } from "@utils/video-guide.utils";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";

const PoolDetail: React.FC = () => {
  const router = useCustomRouter();

  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.STAKING);

  const { account } = useWallet();
  const poolPath = router.getPoolPath();
  const jumpFlagRef = useRef(false);
  const { data } = useGetPoolDetailByPath(poolPath);

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({ addr: undefined });

  const urlAddress = useMemo(() => {
    if (!initializedData?.addr) return "";

    return isValidAddress(initializedData.addr) ? initializedData.addr : "";
  }, [initializedData?.addr]);

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
    address: urlAddress ?? connectAddress,
    poolPath,
    withClosed: false,
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

  useEffect(() => {
    if (positions.length === 0) {
      window.scrollTo({ top: 0 });
      return;
    }

    if (!loading && isFetchedPosition && hash && !jumpFlagRef.current) {
      jumpFlagRef.current = true;
      setTimeout(handleScroll, 100);
    }
  }, [loading, isFetchedPosition, hash, positions.length]);

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
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} />
      )}
    </>
  );
};

export default PoolDetail;
