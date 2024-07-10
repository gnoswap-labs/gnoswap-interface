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
  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;

    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const guaranteedTypeStr = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    return swapDirectionToGuaranteedType(swapDirection);
  }, [swapSummaryInfo.swapDirection]);

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
        return "Low";
      case "MEDIUM":
        return "Medium";
      case "HIGH":
        return "High";
      case "POSITIVE":
        return "Positive";
      case "NONE":
      default:
        return "";
    }
  }, [priceImpactStatus]);

  return (
    <FeeWrapper>
      <div className="swap-fee-row price-impact">
        <span className="gray-text">Price Impact</span>
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
        <span className=" gray-text">Slippage Set</span>
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
          <span className="">Protocol Fee</span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                The amount of fees charged on each trade that goes to the
                protocol.
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
        <span className="gray-text">Network Gas Fee</span>

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
          <h1 className="gradient">Auto Router</h1>
        </div>
      </div>
    </FeeWrapper>
  );
};

export default SwapCardFeeInfo;
