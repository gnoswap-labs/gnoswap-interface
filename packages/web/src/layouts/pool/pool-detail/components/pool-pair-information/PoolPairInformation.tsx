import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

import PoolPairInfoContent from "./pool-pair-info-content/PoolPairInfoContent";
import PoolPairInfoHeader from "./pool-pair-info-header/PoolPairInfoHeader";

import { BreadcrumbsWrapper, PoolPairInformationWrapper } from "./PoolPairInformation.styles";

interface PoolPairInformationProps {
  pool: PoolDetailModel;
  menu: {
    title: string;
    path: string;
  };
  feeStr: string | null;
  isMobile: boolean;
  onClickPath: (path: string) => void;
  loading: boolean;
  loadingBins: boolean;
  poolBins: PoolBinModel[];
  shiftIndex: number;
  displayBinCount: number;
  zoomLevel: number;
  availInfo: {
    availMoveLeft: boolean;
    availMoveRight: boolean;
    availZoomIn: boolean;
    availZoomOut: boolean;
  };
  onZoomIn: () => void;
  onZoomOut: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

const PoolPairInformation: React.FC<PoolPairInformationProps> = ({
  pool,
  menu,
  feeStr,
  isMobile,
  onClickPath,
  loading,
  loadingBins,
  poolBins,
  shiftIndex,
  displayBinCount,
  zoomLevel,
  availInfo,
  onZoomIn,
  onZoomOut,
  onMoveLeft,
  onMoveRight,
}) => {
  const { t } = useTranslation();

  const tokenInfo = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol} (${feeStr || "0"})`;
  }, [feeStr, pool.tokenA.symbol, pool.tokenB.symbol]);

  return (
    <PoolPairInformationWrapper>
      <BreadcrumbsWrapper>
        <div className="page-name">{t("business:pageHeader.earn")}</div>
        {!loading && (
          <div className="location">
            <span onClick={() => onClickPath(menu.path)}>{t(menu.title)}</span>
            <IconStrokeArrowRight className="step-icon" />
            <span className="token">{tokenInfo}</span>
          </div>
        )}
        {loading && <div css={pulseSkeletonStyle({ w: "150px", h: 26 })} className="pulse-skeleton" />}
      </BreadcrumbsWrapper>
      <div className="token-status">
        {loading && (
          <PulseSkeletonWrapper height={36} mobileHeight={24}>
            <span css={pulseSkeletonStyle({ w: "200px", h: 20 })} />
          </PulseSkeletonWrapper>
        )}
        {!loading && (
          <PoolPairInfoHeader
            tokenA={pool.tokenA}
            tokenB={pool.tokenB}
            incentivzed={pool.incentivized}
            rewardTokens={pool.rewardTokens}
            isMobile={isMobile}
            feeStr={feeStr || ""}
          />
        )}
        <PoolPairInfoContent
          poolBins={poolBins}
          pool={pool}
          loading={loading}
          loadingBins={loadingBins}
          shiftIndex={shiftIndex}
          displayBinCount={displayBinCount}
          zoomLevel={zoomLevel}
          availInfo={availInfo}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
        />
      </div>
    </PoolPairInformationWrapper>
  );
};

export default PoolPairInformation;
