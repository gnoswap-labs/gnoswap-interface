import React, { useCallback, useMemo } from "react";
import { ContentWrapper } from "./SwapCardContent.styles";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SwapCardContentDetail from "../swap-card-content-detail/SwapCardContentDetail";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";
import { isAmount } from "@common/utils/data-check-util";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import BigNumber from "bignumber.js";

interface ContentProps {
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  switchSwapDirection: () => void;
  connectedWallet: boolean;
  isLoading: boolean;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
}

const SwapCardContent: React.FC<ContentProps> = ({
  swapTokenInfo,
  swapSummaryInfo,
  swapRouteInfos,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  switchSwapDirection,
  connectedWallet,
  isLoading,
  setSwapRateAction,
}) => {
  const tokenA = swapTokenInfo.tokenA;
  const tokenB = swapTokenInfo.tokenB;

  const onChangeTokenAAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenAAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenAAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenAAmount],
  );

  const onChangeTokenBAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenBAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenBAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenBAmount],
  );

  const handleAutoFillTokenA = useCallback(() => {
    if (connectedWallet) {
      const formatValue = parseFloat(
        swapTokenInfo.tokenABalance.replace(/,/g, ""),
      ).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connectedWallet, swapTokenInfo]);

  const handleAutoFillTokenB = useCallback(() => {
    if (connectedWallet) {
      const formatValue = parseFloat(
        swapTokenInfo.tokenBBalance.replace(/,/g, ""),
      ).toString();
      changeTokenBAmount(formatValue);
    }
  }, [changeTokenBAmount, connectedWallet, swapTokenInfo]);

  const isShowInfoSection = useMemo(() => {
    return (
      !!(
        swapSummaryInfo &&
        !!Number(swapTokenInfo.tokenAAmount) &&
        !!Number(swapTokenInfo.tokenBAmount)
      ) || isLoading
    );
  }, [swapSummaryInfo, swapTokenInfo, isLoading]);

  const balanceADisplay = useMemo(() => {
    if (connectedWallet && swapTokenInfo.tokenABalance !== "-") {
      if (swapTokenInfo.tokenABalance === "0") return 0;
      return BigNumber(swapTokenInfo.tokenABalance.replace(/,/g, "")).toFormat(
        2,
      );
    }
    return "-";
  }, [swapTokenInfo.tokenABalance, connectedWallet]);

  const balanceBDisplay = useMemo(() => {
    if (connectedWallet && swapTokenInfo.tokenBBalance !== "-") {
      if (swapTokenInfo.tokenBBalance === "0") return 0;
      return BigNumber(swapTokenInfo.tokenBBalance.replace(/,/g, "")).toFormat(
        2,
      );
    }
    return "-";
  }, [swapTokenInfo.tokenBBalance, connectedWallet]);

  return (
    <ContentWrapper>
      <div className="first-section">
        <div className="amount-container">
          <input
            className="amount-text"
            value={swapTokenInfo.tokenAAmount}
            onChange={onChangeTokenAAmount}
            placeholder="0"
          />
          <div className="token-selector">
            <SelectPairButton token={tokenA} changeToken={changeTokenA} />
          </div>
        </div>
        <div className="amount-info">
          <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
          <span
            className={`balance-text ${
              tokenA && connectedWallet && "balance-text-disabled"
            }`}
            onClick={handleAutoFillTokenA}
          >
            Balance: {balanceADisplay}
          </span>
        </div>
        <div className="arrow">
          <div className="shape" onClick={switchSwapDirection}>
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>
      <div className="second-section">
        <div className="amount-container">
          <input
            className="amount-text"
            value={swapTokenInfo.tokenBAmount}
            onChange={onChangeTokenBAmount}
            placeholder="0"
          />
          <div className="token-selector">
            <SelectPairButton token={tokenB} changeToken={changeTokenB} />
          </div>
        </div>
        <div className="amount-info">
          <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
          <span
            className={`balance-text ${
              tokenB && connectedWallet && "balance-text-disabled"
            }`}
            onClick={handleAutoFillTokenB}
          >
            Balance: {balanceBDisplay}
          </span>
        </div>
      </div>

      {swapSummaryInfo && isShowInfoSection && (
        <SwapCardContentDetail
          swapSummaryInfo={swapSummaryInfo}
          swapRouteInfos={swapRouteInfos}
          isLoading={isLoading}
          setSwapRateAction={setSwapRateAction}
        />
      )}
    </ContentWrapper>
  );
};

export default SwapCardContent;
