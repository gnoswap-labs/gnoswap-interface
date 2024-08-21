import React from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/decrease/use-decrease-handle";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";

import { DecreaseSelectPositionWrapper } from "./DecreaseSelectPosition.styles";

export interface DecreaseSelectPositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
}

const DecreaseSelectPosition: React.FC<DecreaseSelectPositionProps> = ({
  tokenA,
  tokenB,
  fee,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  return (
    <DecreaseSelectPositionWrapper>
      <h5>{t("DecreaseLiquidity:form.selectedPosition.label")}</h5>
      <div className="select-position common-bg">
        <div className="pool-select-wrapper">
          <DoubleLogo
            left={tokenA?.logoURI}
            right={tokenB?.logoURI}
            size={24}
            leftSymbol={tokenB?.symbol}
            rightSymbol={tokenB?.symbol}
          />
          {isMobile ? "" : `${tokenA?.symbol}/${tokenB?.symbol}`}
          <Badge text={fee} type={BADGE_TYPE.DARK_DEFAULT} />
        </div>
        <RangeBadge status={rangeStatus} />
      </div>
      <div className="min-max-wrapper">
        <div className="min common-bg">
          <p>{t("business:minPrice")}</p>
          <p className="value">{minPriceStr}</p>
          <p className="convert-value">
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `1 ${tokenA?.symbol}`
            )}{" "}
            = {minPriceStr} {tokenB?.symbol}
          </p>
        </div>
        <div className="min common-bg">
          <p>{t("business:maxPrice")}</p>
          <p className="value">{maxPriceStr}</p>
          <p className="convert-value">
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `1 ${tokenA?.symbol}`
            )}{" "}
            = {maxPriceStr} {tokenB?.symbol}
          </p>
        </div>
      </div>
    </DecreaseSelectPositionWrapper>
  );
};

export default DecreaseSelectPosition;
