import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { VIDEO_GUIDE_TYPES, VideoGuideType } from "@constants/video-guide.constant";
import { isValidVideoGuideType } from "@utils/video-guide.utils";

import EarnMyPositionContainer from "./containers/earn-my-position-container/EarnMyPositionContainer";
import IncentivizedPoolCardListContainer from "./containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import IncentivizedPoolsContainer from "./containers/incentivized-pools-container/IncentivizedPoolsContainer";
import PoolListContainer from "./containers/pool-list-container/PoolListContainer";
import EarnLayout from "./EarnLayout";
import { QUERY_PARAMETER } from "@constants/page.constant";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";

const Earn: React.FC = () => {
  const { account } = useWallet();
  const router = useCustomRouter();

  const [currentGuide, setCurrentGuide] = React.useState<string | null>(null);
  const isOpenVideoGuide = currentGuide === VIDEO_GUIDE_TYPES.POSITION;

  const addr = router.getAddress();
  const isOtherPosition = !!(addr && addr !== account?.address);

  const openVideoGuide = (type: VideoGuideType) => {
    setCurrentGuide(type);
  };

  const closeVideoGuide = (value: boolean) => {
    if (!value) {
      setCurrentGuide(null);
    }
  };

  const updateCurrentGuide = (guide: string | null) => {
    if (guide && !isValidVideoGuideType(guide)) {
      console.warn(`Invalid video guide type: ${guide}`);
      setCurrentGuide(null);
    } else {
      setCurrentGuide(guide);
    }
  };

  /**
   * @role
   * When the page first loads,
   * read parameters like `?guide=POSITION`
   * from the URL to automatically open the modal.
   */
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const guide = params.get(QUERY_PARAMETER.GUIDE);
      updateCurrentGuide(guide);
    }
  }, []);

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
