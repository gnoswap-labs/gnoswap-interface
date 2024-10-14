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

export interface PoolAddConfirmPriceRangeInfoProps
  extends EarnAddConfirmAmountInfoProps {
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

const PoolAddConfirmPriceRangeInfo: React.FC<
  PoolAddConfirmPriceRangeInfoProps
> = ({
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
  const { t } = useTranslation();

  const [swap, setSwap] = useState(false);

  const currentPriceStr = useMemo(() => {
    if (!swap) {
      return `1 ${tokenA.info.symbol} = ${formatTokenExchangeRate(
        currentPrice,
        {
          maxSignificantDigits: 6,
          minLimit: 0.000001,
        },
      )} ${tokenB.info.symbol}`;
    }
    return `1 ${tokenB.info.symbol} = ${formatTokenExchangeRate(
      1 / Number(currentPrice),
      {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      },
    )} ${tokenA.info.symbol}`;
  }, [currentPrice, tokenA.info.symbol, tokenB.info.symbol, swap]);

  const rangeStatus = useMemo(() => {
    return inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT;
  }, [inRange]);
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
          <span className="label">{priceLabelMin}</span>
        </PoolAddConfirmPriceRangeInfoSection>
        <PoolAddConfirmPriceRangeInfoSection className="range-section">
          <span>{t("AddPosition:form.priceRange.maxPrice")}</span>
          <span className="amount">{maxPrice}</span>
          <span className="label">{priceLabelMax}</span>
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
            <span className="key">
              {t("AddPosition:confirmAddModal.info.label.capEff")}
            </span>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  {t("AddPosition:confirmAddModal.info.tooltip.capEff")}
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>

          <span className="value">{feeBoost}</span>
        </div>
        <div className="row">
          <div className="title-wrapper">
            <span className="key">
              {t("AddPosition:confirmAddModal.info.label.feeApr")}
            </span>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  {t("AddPosition:confirmAddModal.info.tooltip.feeApr")}
                </ToolTipContentWrapper>
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
              <span className="key">
                {t("AddPosition:confirmAddModal.info.label.stakingApr")}
              </span>
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
