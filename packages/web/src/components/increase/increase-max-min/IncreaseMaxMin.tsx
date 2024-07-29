import RangeBadge from "@components/common/range-badge/RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import React from "react";
import {
  IncreaseMaxMinSection,
  IncreaseMaxMinWrapper,
} from "./IncreaseMaxMin.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { TokenModel } from "@models/token/token-model";
import { useTranslation } from "react-i18next";

export interface IncreaseMaxMinProps {
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  feeRate: string;
  tokenA: {
    info: TokenModel;
    amount: string;
    usdPrice: string;
  };
  tokenB: {
    info: TokenModel;
    amount: string;
    usdPrice: string;
  };
  title: string;
}

const IncreaseMaxMin: React.FC<IncreaseMaxMinProps> = ({
  minPriceStr,
  maxPriceStr,
  tokenA,
  tokenB,
  rangeStatus,
  feeRate,
  title,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  return (
    <IncreaseMaxMinWrapper>
      <div className="range-title">
        <p>{title}</p>
      </div>
      <div className="select-position common-bg">
        <div className="pool-select-wrapper">
          <DoubleLogo
            left={tokenA?.info?.logoURI || ""}
            right={tokenB?.info?.logoURI || ""}
            size={24}
            leftSymbol={tokenA?.info?.symbol || ""}
            rightSymbol={tokenB?.info?.symbol || ""}
          />
          {breakpoint === DEVICE_TYPE.MOBILE
            ? ""
            : `${tokenA?.info.symbol}/${tokenB?.info.symbol}`}
          <Badge text={feeRate} type={BADGE_TYPE.DARK_DEFAULT} />
        </div>
        <RangeBadge status={rangeStatus} />
      </div>
      <div className="price-range-wrapper">
        <IncreaseMaxMinSection className="range-section">
          <span>{t("business:minPrice")}</span>
          <span className="amount">{minPriceStr}</span>
          <span className="label">
            {tokenA?.info.symbol} {t("common:per")} {tokenB?.info?.symbol}
          </span>
        </IncreaseMaxMinSection>
        <IncreaseMaxMinSection className="range-section">
          <span>{t("business:maxPrice")}</span>
          <span className="amount">{maxPriceStr}</span>
          <span className="label">
            {tokenA?.info.symbol} {t("common:per")} {tokenB?.info?.symbol}
          </span>
        </IncreaseMaxMinSection>
      </div>
    </IncreaseMaxMinWrapper>
  );
};

export default IncreaseMaxMin;
