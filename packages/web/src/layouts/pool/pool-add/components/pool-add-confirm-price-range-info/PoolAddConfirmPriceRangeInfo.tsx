import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import IconSwap from "@components/common/icons/IconSwap";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { formatRate } from "@utils/new-number-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

import { EarnAddConfirmAmountInfoProps } from "../pool-add-confirm-amount-info/PoolAddConfirmAmountInfo";

import {
  PoolAddConfirmPriceRangeInfoSection,
  PoolAddConfirmPriceRangeInfoWrapper,
  ToolTipContentWrapper,
} from "./PoolAddConfirmPriceRangeInfo.styles";
import { DEVICE_TYPE } from "@styles/media";
import { useWindowSize } from "@hooks/common/use-window-size";

export interface PoolAddConfirmPriceRangeInfoProps extends EarnAddConfirmAmountInfoProps {
  currentPrice: string;
  inRange: boolean;
  minPrice: string;
  maxPrice: string;
  priceLabelMax: string;
  priceLabelMin: string;
  feeBoost: string;
  estimatedAPR: string;
  isShowStaking?: boolean;
}

const PoolAddConfirmPriceRangeInfo: React.FC<PoolAddConfirmPriceRangeInfoProps> = ({
  currentPrice,
  inRange,
  minPrice,
  maxPrice,
  priceLabelMax,
  priceLabelMin,
  feeBoost,
  estimatedAPR,
  isShowStaking,
  tokenA,
  tokenB,
}) => {
  const { breakpoint } = useWindowSize();
  const { t } = useTranslation();

  const [swap, setSwap] = useState(false);
  const tokenASymbol = tokenA.info.displaySymbol;
  const tokenBSymbol = tokenB.info.displaySymbol;

  const currentPriceStr = useMemo(() => {
    if (!swap) {
      return `1 ${tokenASymbol} = ${formatTokenExchangeRate(currentPrice, {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      })} ${tokenBSymbol}`;
    }
    return `1 ${tokenBSymbol} = ${formatTokenExchangeRate(1 / Number(currentPrice), {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
    })} ${tokenASymbol}`;
  }, [currentPrice, tokenASymbol, tokenBSymbol, swap]);

  const rangeStatus = useMemo(() => {
    return inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT;
  }, [inRange]);

  const displayPriceLabelMin = useMemo(() => {
    if (breakpoint === DEVICE_TYPE.MOBILE) {
      return `${tokenASymbol} per ${tokenBSymbol}`;
    }
    return priceLabelMin;
  }, [breakpoint, priceLabelMin, tokenASymbol, tokenBSymbol]);

  const displayPriceLabelMax = useMemo(() => {
    if (breakpoint === DEVICE_TYPE.MOBILE) {
      return `${tokenASymbol} per ${tokenBSymbol}`;
    }
    return priceLabelMax;
  }, [breakpoint, priceLabelMax, tokenASymbol, tokenBSymbol]);

  return (
    <PoolAddConfirmPriceRangeInfoWrapper>
      <div className="range-title">
        <p>{t("AddPosition:confirmAddModal.info.section.priceRange")}</p>
        <RangeBadge status={rangeStatus} />
      </div>

      <div className="price-range-wrapper">
        <PoolAddConfirmPriceRangeInfoSection className="range-section">
          <span>{t("AddPosition:form.priceRange.minPrice")}</span>
          <span className="amount">{minPrice}</span>
          <span className="label">{displayPriceLabelMin}</span>
        </PoolAddConfirmPriceRangeInfoSection>
        <PoolAddConfirmPriceRangeInfoSection className="range-section">
          <span>{t("AddPosition:form.priceRange.maxPrice")}</span>
          <span className="amount">{maxPrice}</span>
          <span className="label">{displayPriceLabelMax}</span>
        </PoolAddConfirmPriceRangeInfoSection>
      </div>

      <PoolAddConfirmPriceRangeInfoSection>
        <div className="row">
          <span className="key">{t("business:currentPrice")}:</span>
          <div className="swap-value">
            <span className="value">{currentPriceStr}</span>
            <div onClick={() => setSwap(!swap)}>
              <IconSwap />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="title-wrapper">
            <span className="key">{t("AddPosition:confirmAddModal.info.label.capEff")}</span>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>{t("AddPosition:confirmAddModal.info.tooltip.capEff")}</ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>

          <span className="value">{feeBoost}</span>
        </div>
        <div className="row">
          <div className="title-wrapper">
            <span className="key">{t("AddPosition:confirmAddModal.info.label.feeApr")}</span>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>{t("AddPosition:confirmAddModal.info.tooltip.feeApr")}</ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <span className="value">{formatRate(estimatedAPR)}</span>
        </div>
        {isShowStaking && (
          <div className="row">
            <div className="title-wrapper">
              <span className="key">{t("AddPosition:confirmAddModal.info.label.stakingApr")}</span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    {t("AddPosition:confirmAddModal.info.tooltip.stakingApr")}
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo />
              </Tooltip>
            </div>
            <span className="value">74.24% ~ 124.22%</span>
          </div>
        )}
      </PoolAddConfirmPriceRangeInfoSection>
    </PoolAddConfirmPriceRangeInfoWrapper>
  );
};

export default PoolAddConfirmPriceRangeInfo;
