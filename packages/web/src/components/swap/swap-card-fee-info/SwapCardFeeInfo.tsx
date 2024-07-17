import React, { useMemo } from "react";
import {
  FeeWrapper,
  PriceImpactStatusWrapper,
  PriceImpactStrWrapper,
  SwapDivider,
  ToolTipContentWrapper,
} from "./SwapCardFeeInfo.styles";
import IconRouter from "@components/common/icons/IconRouter";
import {
  SwapSummaryInfo,
  swapDirectionToGuaranteedType,
} from "@models/swap/swap-summary-info";
import { toNumberFormat } from "@utils/number-utils";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { useTranslation } from "react-i18next";

interface ContentProps {
  swapSummaryInfo: SwapSummaryInfo;
  isLoading: boolean;
  priceImpactStatus: PriceImpactStatus;
  swapTokenInfo: SwapTokenInfo;
}

const SwapCardFeeInfo: React.FC<ContentProps> = ({
  swapSummaryInfo,
  isLoading,
  priceImpactStatus,
  swapTokenInfo,
}) => {
  const { t } = useTranslation();

  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;

    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const guaranteedTypeStr = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    return t(swapDirectionToGuaranteedType(swapDirection));
  }, [swapSummaryInfo.swapDirection, t]);

  const guaranteedStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    return `${toNumberFormat(amount || 0, 6)} ${currency}`;
  }, [swapSummaryInfo.guaranteedAmount]);

  const gasFeeStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.gasFee;
    return `${toNumberFormat(amount)} ${currency}`;
  }, [swapSummaryInfo.gasFee]);

  const gasFeeUSDStr = useMemo(() => {
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;

    if (Number(gasFeeUSD) < 0.01) return "<$0.01";

    return `$${toNumberFormat(gasFeeUSD)}`;
  }, [swapSummaryInfo.gasFeeUSD]);

  const slippageStr = useMemo(() => {
    const slippage = swapTokenInfo.slippage;
    return `${slippage}%`;
  }, [swapTokenInfo.slippage]);

  const priceImpactStatusDisplay = useMemo(() => {
    switch (priceImpactStatus) {
      case "LOW":
        return t("Swap:priceImpactStatus.low");
      case "MEDIUM":
        return t("Swap:priceImpactStatus.medium");
      case "HIGH":
        return t("Swap:priceImpactStatus.high");
      case "POSITIVE":
        return t("Swap:priceImpactStatus.positive");
      case "NONE":
      default:
        return "";
    }
  }, [priceImpactStatus, t]);

  return (
    <FeeWrapper>
      <div className="swap-fee-row price-impact">
        <span className="gray-text">{t("Swap:swapInfo.priceImpact")}</span>
        {!isLoading ? (
          <span className="white-text">
            <PriceImpactStatusWrapper priceImpact={priceImpactStatus}>
              {priceImpactStatusDisplay}
            </PriceImpactStatusWrapper>{" "}
            <PriceImpactStrWrapper priceImpact={priceImpactStatus}>
              {"("}
              {(swapSummaryInfo?.priceImpact || 0) > 0 ? "+" : ""}
              {priceImpactStr}
              {")"}
            </PriceImpactStrWrapper>
          </span>
        ) : (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        )}
      </div>
      <div className="swap-fee-row ">
        <span className=" gray-text">{t("Swap:swapInfo.slippageSet")}</span>
        {!isLoading ? (
          <span className="white-text">{slippageStr}</span>
        ) : (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        )}
      </div>
      <div className="swap-fee-row received">
        <span className="gray-text">{guaranteedTypeStr}</span>
        {isLoading ? (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        ) : (
          <span className="white-text">{guaranteedStr}</span>
        )}
      </div>
      <div className="swap-fee-row received">
        <div className="protocol">
          <span className="">{t("business:protocolFee.txt")}</span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("business:protocolFee.desc")}
              </ToolTipContentWrapper>
            }
          >
            <IconInfo />
          </Tooltip>
        </div>
        {isLoading ? (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        ) : (
          <span className="white-text">{swapSummaryInfo.protocolFee}</span>
        )}
      </div>
      <div className="swap-fee-row  gas-fee">
        <span className="gray-text">{t("Swap:swapInfo.gasFee")}</span>

        {isLoading ? (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        ) : (
          <span className="white-text">
            {gasFeeStr}
            <span className="gray-text">{`(${gasFeeUSDStr})`}</span>
          </span>
        )}
      </div>
      <SwapDivider />
      <div className="auto-router">
        <div className="auto-wrapper">
          <IconRouter />
          <h1 className="gradient">{t("Swap:autoRouter")}</h1>
        </div>
      </div>
    </FeeWrapper>
  );
};

export default SwapCardFeeInfo;
