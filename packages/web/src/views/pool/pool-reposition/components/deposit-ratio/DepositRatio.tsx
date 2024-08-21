import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatRate } from "@utils/new-number-utils";

import { IPriceRange } from "../../hooks/use-reposition-handle";

import {
  DepositRatioWrapper,
  ToolTipContentWrapper
} from "./DepositRatio.styles";

export interface DepositRatioProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  fee: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
  isLoadingPosition: boolean;
  selectPool: SelectPool;
}

const DepositRatio: React.FC<DepositRatioProps> = ({
  tokenA,
  tokenB,
  aprFee,
  rangeStatus,
  priceRangeSummary,
  isLoadingPosition,
  selectPool,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  const isLoading = useMemo(
    () => isLoadingPosition || selectPool.isLoading,
    [isLoadingPosition, selectPool.isLoading],
  );

  const loadingComp = useMemo(
    () => (
      <div
        css={pulseSkeletonStyle({
          w: 100,
        })}
      />
    ),
    [],
  );

  const depositRatioDisplay = useMemo(() => {
    if (isLoading) return loadingComp;

    return (
      <>
        {priceRangeSummary.tokenARatioStr}
        {"% "}
        {isMobile ? (
          <MissingLogo
            symbol={tokenA?.symbol || ""}
            url={tokenA?.logoURI}
            className="token-logo"
            width={18}
          />
        ) : (
          `${tokenA?.symbol}`
        )}{" "}
        / {priceRangeSummary.tokenBRatioStr}
        {"% "}
        {isMobile ? (
          <MissingLogo
            symbol={tokenB?.symbol || ""}
            url={tokenB?.logoURI}
            className="token-logo"
            width={18}
          />
        ) : (
          `${tokenB?.symbol}`
        )}
      </>
    );
  }, [
    isMobile,
    loadingComp,
    priceRangeSummary.tokenARatioStr,
    priceRangeSummary.tokenBRatioStr,
    tokenA?.logoURI,
    tokenA?.symbol,
    tokenB?.logoURI,
    tokenB?.symbol,
    isLoading,
  ]);

  return (
    <DepositRatioWrapper>
      <div className="deposit-ratio common-bg">
        <div>
          <div>
            <p className="label">
              {t("business:positionPriceRangeInfo.depositR.label")}
            </p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  {t("business:positionPriceRangeInfo.depositR.desc")}
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">{depositRatioDisplay}</p>
        </div>
        <div>
          <div>
            <p className="label">
              {t("business:positionPriceRangeInfo.capEff.label")}
            </p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  {t("business:positionPriceRangeInfo.capEff.desc")}
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">
            {isLoading
              ? loadingComp
              : rangeStatus === "OUT"
              ? "-"
              : priceRangeSummary.feeBoost}
          </p>
        </div>
        <div>
          <div>
            <p className="label">
              {t("business:positionPriceRangeInfo.feeApr.label")}
            </p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  {t("business:positionPriceRangeInfo.feeApr.desc")}
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">
            {isLoading
              ? loadingComp
              : rangeStatus === "OUT"
              ? "-"
              : formatRate(aprFee)}
          </p>
        </div>
      </div>
    </DepositRatioWrapper>
  );
};

export default DepositRatio;
