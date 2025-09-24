import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import { useVideoGuide } from "@hooks/common/use-video-guide";
import { isValidVideoGuideType } from "@utils/video-guide.utils";

import EarnMyPositionContainer from "./containers/earn-my-position-container/EarnMyPositionContainer";
import IncentivizedPoolCardListContainer from "./containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import IncentivizedPoolsContainer from "./containers/incentivized-pools-container/IncentivizedPoolsContainer";
import PoolListContainer from "./containers/pool-list-container/PoolListContainer";
import EarnLayout from "./EarnLayout";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";

const Earn: React.FC = () => {
  const { account } = useWallet();
  const router = useCustomRouter();

  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.POSITION);

  const addr = router.getAddress();
  const isOtherPosition = !!(addr && addr !== account?.address);

  return (
    <>
      <EarnLayout
        header={<HeaderContainer />}
        positions={
          <EarnMyPositionContainer
            isOtherPosition={isOtherPosition}
            address={(addr || "") as string}
            onOpenVideoGuide={openVideoGuide}
          />
        }
        incentivizedPools={
          <IncentivizedPoolsContainer
            isOtherPosition={isOtherPosition}
            cardList={<IncentivizedPoolCardListContainer />}
          />
        }
        poolList={<PoolListContainer />}
        footer={<Footer />}
      />
      {isOpenVideoGuide && isValidVideoGuideType(currentGuide) && (
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} />
      )}
    </>
  );
};

export default Earn;
