import React, { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import IconRouter from "@components/common/icons/IconRouter";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PriceImpactStatus } from "@hooks/swap/data/use-swap-handler";
import { swapDirectionToGuaranteedType, SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { toNumberFormat } from "@utils/number-utils";

import {
  FeeWrapper,
  PriceImpactStatusWrapper,
  PriceImpactStrWrapper,
  SwapDivider,
  ToolTipContentWrapper,
} from "./SwapCardFeeInfo.styles";

interface ContentProps {
  swapSummaryInfo: SwapSummaryInfo;
  isLoading: boolean;
  priceImpactStatus: PriceImpactStatus;
  swapTokenInfo: SwapTokenInfo;
}

const SkeletonLoader = () => <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />;

const SwapCardFeeInfo: React.FC<ContentProps> = ({ swapSummaryInfo, isLoading, priceImpactStatus, swapTokenInfo }) => {
  const { t } = useTranslation();

  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;

    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const { guaranteedTypeStr, guaranteedStr } = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;

    return {
      guaranteedTypeStr: t(swapDirectionToGuaranteedType(swapDirection)),
      guaranteedStr: `${toNumberFormat(amount || 0, 6)} ${currency}`,
    };
  }, [swapSummaryInfo.swapDirection, swapSummaryInfo.guaranteedAmount, t]);

  const { gasFeeStr, gasFeeUSDStr } = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.gasFee;
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;

    return {
      gasFeeStr: `${toNumberFormat(amount)} ${currency}`,
      gasFeeUSDStr: Number(gasFeeUSD) < 0.01 ? "<$0.01" : `$${toNumberFormat(gasFeeUSD)}`,
    };
  }, [swapSummaryInfo.gasFee, swapSummaryInfo.gasFeeUSD]);

  const slippageStr = useMemo(() => {
    return `${swapTokenInfo.slippage}%`;
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

  const routerFeeStr = useMemo(() => {
    if (swapSummaryInfo.routerFee == null) {
      return swapSummaryInfo.protocolFee;
    }

    const tokenAmount = swapTokenInfo.tokenBAmount;
    const tokenUSD = swapTokenInfo.tokenBUSD;
    const tokenSymbol = swapTokenInfo.tokenB?.symbol;
    const tokenDecimals = swapTokenInfo.tokenBDecimals;

    if (!tokenAmount) {
      return swapSummaryInfo.protocolFee;
    }

    const feeRate = swapSummaryInfo.routerFee / 100;

    if (tokenUSD != null) {
      const feeAmountUSD = BigNumber(tokenUSD).multipliedBy(feeRate).toNumber();
      return feeAmountUSD < 0.01 ? "<$0.01" : `$${toNumberFormat(feeAmountUSD, 2)}`;
    }

    const feeAmount = BigNumber(tokenAmount).multipliedBy(feeRate).toNumber();
    const decimals = tokenDecimals || 6;
    return `${toNumberFormat(feeAmount, decimals)} ${tokenSymbol || ""}`;
  }, [
    swapSummaryInfo.routerFee,
    swapSummaryInfo.protocolFee,
    swapTokenInfo.direction,
    swapTokenInfo.tokenAAmount,
    swapTokenInfo.tokenBAmount,
    swapTokenInfo.tokenAUSD,
    swapTokenInfo.tokenBUSD,
    swapTokenInfo.tokenA?.symbol,
    swapTokenInfo.tokenB?.symbol,
    swapTokenInfo.tokenADecimals,
    swapTokenInfo.tokenBDecimals,
  ]);

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
          <SkeletonLoader />
        )}
      </div>
      <div className="swap-fee-row ">
        <span className=" gray-text">{t("Swap:swapInfo.slippageSet")}</span>
        {!isLoading ? <span className="white-text">{slippageStr}</span> : <SkeletonLoader />}
      </div>
      <div className="swap-fee-row received">
        <span className="gray-text">{guaranteedTypeStr}</span>
        {isLoading ? <SkeletonLoader /> : <span className="white-text">{guaranteedStr}</span>}
      </div>
      <div className="swap-fee-row received">
        <div className="protocol">
          <span className="">{t("business:protocolFee.txt")}</span>
          <Tooltip
            placement="top"
            FloatingContent={<ToolTipContentWrapper>{t("Swap:swapInfo.tooltip.swapFee")}</ToolTipContentWrapper>}
          >
            <IconInfo />
          </Tooltip>
        </div>
        {isLoading ? <SkeletonLoader /> : <span className="white-text">{routerFeeStr}</span>}
      </div>
      <div className="swap-fee-row  gas-fee">
        <span className="gray-text">{t("Swap:swapInfo.gasFee")}</span>

        {isLoading ? (
          <SkeletonLoader />
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
