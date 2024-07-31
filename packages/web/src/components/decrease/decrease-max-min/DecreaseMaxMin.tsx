import RangeBadge from "@components/common/range-badge/RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import React from "react";
import {
  DecreaseMaxMinSection,
  DecreaseMaxMinWrapper,
} from "./DecreaseMaxMin.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { TokenModel } from "@models/token/token-model";
import { useTranslation } from "react-i18next";

export interface DecreaseMaxMinProps {
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  feeRate: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
}

const DecreaseMaxMin: React.FC<DecreaseMaxMinProps> = ({
  minPriceStr,
  maxPriceStr,
  tokenA,
  tokenB,
  rangeStatus,
  feeRate,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();

  return (
    <DecreaseMaxMinWrapper>
      <div className="range-title">
        <p>{t("DecreaseLiquidity:confModal.positionDetails")}</p>
      </div>
      <div className="select-position common-bg">
        <div className="pool-select-wrapper">
          <DoubleLogo
            left={tokenA?.logoURI || ""}
            right={tokenB?.logoURI || ""}
            size={24}
            leftSymbol={tokenA?.symbol || ""}
            rightSymbol={tokenB?.symbol || ""}
          />
          {breakpoint === DEVICE_TYPE.MOBILE
            ? ""
            : `${tokenA?.symbol}/${tokenB?.symbol}`}
          <Badge text={feeRate} type={BADGE_TYPE.DARK_DEFAULT} />
        </div>
        <RangeBadge status={rangeStatus} />
      </div>
      <div className="price-range-wrapper">
        <DecreaseMaxMinSection className="range-section">
          <span>{t("business:minPrice")}</span>
          <span className="amount">{minPriceStr}</span>
          <span className="label">
            {tokenA?.symbol} {t("common:per")} {tokenB?.symbol}
          </span>
        </DecreaseMaxMinSection>
        <DecreaseMaxMinSection className="range-section">
          <span>{t("business:maxPrice")}</span>
          <span className="amount">{maxPriceStr}</span>
          <span className="label">
            {tokenA?.symbol} {t("common:per")} {tokenB?.symbol}
          </span>
        </DecreaseMaxMinSection>
      </div>
    </DecreaseMaxMinWrapper>
  );
};

export default DecreaseMaxMin;
