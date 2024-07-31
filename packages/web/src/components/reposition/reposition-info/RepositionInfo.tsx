import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatRate } from "@utils/new-number-utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  RepositionInfoWrapper,
  ToolTipContentWrapper,
} from "./RepositionInfo.styles";

export interface RepositionInfoProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  aprFee: number;
  priceRangeSummary: IPriceRange;
}

const RepositionInfo: React.FC<RepositionInfoProps> = ({
  tokenA,
  tokenB,
  aprFee,
  priceRangeSummary,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  return (
    <RepositionInfoWrapper>
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
          <p className="value">
            {priceRangeSummary.tokenARatioStr}
            {"% "}
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
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
                symbol={tokenB?.symbol}
                url={tokenB?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `${tokenB?.symbol}`
            )}
          </p>
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
          <p className="value">{priceRangeSummary.feeBoost}</p>
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
          <p className="value">{formatRate(aprFee)}</p>
        </div>
      </div>
    </RepositionInfoWrapper>
  );
};

export default RepositionInfo;
