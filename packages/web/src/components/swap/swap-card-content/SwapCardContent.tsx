import React, { useCallback } from "react";
import { ContentWrapper } from "./SwapCardContent.styles";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SwapCardContentDetail from "../swap-card-content-detail/SwapCardContentDetail";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";
import { isAmount } from "@common/utils/data-check-util";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";

interface ContentProps {
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string) => void;
  switchSwapDirection: () => void;
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
}) => {

  const tokenA = swapTokenInfo.tokenA;
  const tokenB = swapTokenInfo.tokenB;

  const onChangeTokenAAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      changeTokenAAmount(value);
    },
    [changeTokenAAmount],
  );

  const onChangeTokenBAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      changeTokenBAmount(value);
    },
    [changeTokenBAmount],
  );

  return (
    <ContentWrapper>
      <div className="first-section">
        <div className="amount-container">
          <input
            className="amount-text"
            value={swapTokenInfo.tokenAAmount}
            onChange={onChangeTokenAAmount}
            placeholder={swapTokenInfo.tokenAAmount === "" ? "0" : ""}
          />
          <div className="token-selector">
            <SelectPairButton token={tokenA} changeToken={changeTokenA} />
          </div>
        </div>
        <div className="amount-info">
          <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
          <span className="balance-text">Balance : {swapTokenInfo.tokenABalance}</span>
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
            placeholder={swapTokenInfo.tokenBAmount === "" ? "0" : ""}
          />
          <div className="token-selector">
            <SelectPairButton token={tokenB} changeToken={changeTokenB} />
          </div>
        </div>
        <div className="amount-info">
          <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
          <span className="balance-text">Balance : {swapTokenInfo.tokenBBalance}</span>
        </div>
      </div>

      {swapSummaryInfo && (
        <SwapCardContentDetail
          swapSummaryInfo={swapSummaryInfo}
          swapRouteInfos={swapRouteInfos}
        />
      )}
    </ContentWrapper>
  );
};

export default SwapCardContent;
