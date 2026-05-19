import React, { useMemo } from "react";
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
import { formatRouterFeeStr } from "@utils/swap-utils";

interface ContentProps {
  swapSummaryInfo: SwapSummaryInfo;
  isLoading: boolean;
  isLoadingGasInfo: boolean;
  priceImpactStatus: PriceImpactStatus;
  swapTokenInfo: SwapTokenInfo;
  connectedWallet: boolean;
  gasEstimateSuccess: boolean;
}

const SkeletonLoader = () => <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />;

const SwapCardFeeInfo: React.FC<ContentProps> = ({
  swapSummaryInfo,
  isLoading,
  isLoadingGasInfo,
  priceImpactStatus,
  swapTokenInfo,
  connectedWallet,
  gasEstimateSuccess,
}) => {
  const { t } = useTranslation();

  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;

    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const { guaranteedTypeStr, guaranteedStr } = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    const guaranteedToken = swapDirection === "EXACT_IN" ? swapSummaryInfo.tokenB : swapSummaryInfo.tokenA;

    return {
      guaranteedTypeStr: t(swapDirectionToGuaranteedType(swapDirection)),
      guaranteedStr: `${toNumberFormat(amount || 0, guaranteedToken.decimals)} ${currency}`,
    };
  }, [swapSummaryInfo.swapDirection, swapSummaryInfo.guaranteedAmount, swapSummaryInfo.tokenA, swapSummaryInfo.tokenB, t]);

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

  const routerFeePercentageStr = useMemo(() => {
    if (!swapSummaryInfo.protocolFee) return null;
    return `(${swapSummaryInfo.protocolFee})`;
  }, [swapSummaryInfo.protocolFee]);

  const routerFeeStr = useMemo(() => {
    return formatRouterFeeStr(swapSummaryInfo, swapTokenInfo);
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
          <span className="">
            {t("business:protocolFee.txt")} {routerFeePercentageStr}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={<ToolTipContentWrapper>{t("Swap:swapInfo.tooltip.swapFee")}</ToolTipContentWrapper>}
          >
            <IconInfo />
          </Tooltip>
        </div>
        {isLoading ? <SkeletonLoader /> : <span className="white-text">{routerFeeStr}</span>}
      </div>
      {connectedWallet && gasEstimateSuccess && (
        <div className="swap-fee-row  gas-fee">
          <span className="gray-text">{t("Swap:swapInfo.gasFee")}</span>

          {isLoading || isLoadingGasInfo ? (
            <SkeletonLoader />
          ) : (
            <span className="white-text">
              {gasFeeStr}
              <span className="gray-text">{`(${gasFeeUSDStr})`}</span>
            </span>
          )}
        </div>
      )}
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
