import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/data/use-wallet";

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

  const [isVideoGuideOpen, setIsVideoGuideOpen] = React.useState(false);
  const [videoGuideType, setVideoGuideType] = React.useState<"POSITION" | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const guide = params.get(QUERY_PARAMETER.GUIDE);
      if (guide === "POSITION") {
        setIsVideoGuideOpen(true);
        setVideoGuideType("POSITION");
      }
    }
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const guide = params.get(QUERY_PARAMETER.GUIDE);
        if (guide === "POSITION") {
          setIsVideoGuideOpen(true);
          setVideoGuideType("POSITION");
        } else {
          setIsVideoGuideOpen(false);
          setVideoGuideType(null);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 비디오 가이드 열기 함수
  const openVideoGuide = (type: "POSITION") => {
    setIsVideoGuideOpen(true);
    setVideoGuideType(type);

    // URL 업데이트
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set(QUERY_PARAMETER.GUIDE, type);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState(null, "", newUrl);
    }
  };

  // 비디오 가이드 닫기 함수
  const closeVideoGuide = (value: boolean) => {
    if (!value) {
      setIsVideoGuideOpen(false);
      setVideoGuideType(null);

      // URL에서 guide 파라미터 제거
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.delete(QUERY_PARAMETER.GUIDE);
        const search = params.toString();
        const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
        window.history.pushState(null, "", newUrl);
      }
    }
  };

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
            onOpenVideoGuide={openVideoGuide} // 콜백 함수 전달
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
      {isVideoGuideOpen && videoGuideType && <VideoGuideModal videoType={videoGuideType} setIsOpen={closeVideoGuide} />}
    </>
  );
};

export default Earn;
