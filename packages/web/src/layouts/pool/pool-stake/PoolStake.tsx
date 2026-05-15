import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";
import { PAGE_PATH } from "@constants/page.constant";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useVideoGuide } from "@hooks/common/use-video-guide";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { DeviceSize } from "@styles/media";
import { isValidVideoGuideType } from "@utils/video-guide.utils";
import { useGetPoolDetailByPathWithEmptyPath } from "src/react-query/pools";

import StakePositionLayout from "./StakePositionLayout";
import AvailableStakingPoolsContainer from "./containers/available-staking-pools-container/AvailableStakingPoolsContainer";
import StakePositionContainer from "./containers/stake-position-container/StakePositionContainer";

const PoolStake: React.FC = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const { data, isLoading } = useGetPoolDetailByPathWithEmptyPath(poolPath);
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();
  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.STAKING);

  const listBreadcrumb = useMemo<{ title: string; path: string }[]>(() => {
    const breadcrumbs: { title: string; path: string }[] = [
      { title: t("business:pageHeader.earn"), path: PAGE_PATH.EARN },
    ];

    if (poolPath) {
      breadcrumbs.push({
        title:
          width >= DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol} (${Number(data?.fee) / 10000}%)`
            : "...",
        path: `/earn/pool?poolPath=${poolPath}`,
      });
    }

    breadcrumbs.push({ title: t("business:pageHeader.stakePosition"), path: "" });
    return breadcrumbs;
  }, [data?.fee, data?.tokenA, data?.tokenB, getGnotPath, poolPath, t, width]);

  return (
    <>
      <StakePositionLayout
        header={<HeaderContainer />}
        breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} isLoading={isLoadingCommon || isLoading} />}
        stakeLiquidity={<StakePositionContainer onOpenVideoGuide={openVideoGuide} />}
        availablePools={<AvailableStakingPoolsContainer />}
        footer={<Footer />}
      />
      {isOpenVideoGuide && isValidVideoGuideType(currentGuide) && (
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} />
      )}
    </>
  );
};

export default PoolStake;
