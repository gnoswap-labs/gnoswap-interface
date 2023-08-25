import React, { useCallback, useState } from "react";
import { ContentWrapper, SelectPairButton } from "./SwapCardContent.styles";
import { TokenInfo } from "../swap-card/SwapCard";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SwapCardContentDetail from "../swap-card-content-detail/SwapCardContentDetail";
import {
  AutoRouterInfo,
  tokenInfo,
  SwapGasInfo,
} from "@containers/swap-container/SwapContainer";
import SelectTokenModal from "../select-token-modal/SelectTokenModal";
import { DEVICE_TYPE } from "@styles/media";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";

interface ContentProps {
  to: TokenInfo;
  from: TokenInfo;
  swapInfo: boolean;
  showSwapInfo: () => void;
  autoRouter: boolean;
  showAutoRouter: () => void;
  swapGasInfo: SwapGasInfo;
  autoRouterInfo: AutoRouterInfo;
  tokenModal: boolean;
  onSelectTokenModal: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  coinList: tokenInfo[];
  changeToken: (token: tokenInfo, type: string) => void;
  selectToken: (e: string) => void;
  breakpoint: DEVICE_TYPE;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const SwapCardContent: React.FC<ContentProps> = ({
  to,
  from,
  swapInfo,
  showSwapInfo,
  autoRouter,
  showAutoRouter,
  swapGasInfo,
  autoRouterInfo,
  tokenModal,
  onSelectTokenModal,
  search,
  keyword,
  coinList,
  changeToken,
  selectToken,
  breakpoint,
}) => {
  const [fromAmount, setFromAmount] = useState(from.amount);
  const [toAmount, setToAmount] = useState(to.amount);

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      setFromAmount(value);
    },
    [],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      setToAmount(value);
    },
    [],
  );

  return (
    <>
      {tokenModal && (
        <SelectTokenModal
          onSelectTokenModal={onSelectTokenModal}
          search={search}
          keyword={keyword}
          coinList={coinList}
          changeToken={changeToken}
        />
      )}
      <ContentWrapper>
        <div className="first-section">
          <div className="amount-container">
            <input
              className="amount-text"
              value={fromAmount}
              onChange={onChangeFromAmount}
              placeholder={fromAmount === "" ? "0" : ""}
            />
            <SelectPairButton
              onClick={() => {
                selectToken("from");
                onSelectTokenModal();
              }}
            >
              <img
                src={from.tokenLogo}
                alt="token logo"
                className="token-logo"
              />
              <span className="token-symbol">{from.symbol}</span>
              <IconStrokeArrowDown className="arrow-icon" />
            </SelectPairButton>
          </div>
          <div className="amount-info">
            <span className="price-text">{from.price}</span>
            <span className="balance-text">Balance : {from.balance}</span>
          </div>
          <div className="arrow">
            <div className="shape">
              <IconSwapArrowDown className="shape-icon" />
            </div>
          </div>
        </div>
        <div className="second-section">
          <div className="amount-container">
            <input
              className="amount-text"
              value={toAmount}
              onChange={onChangeToAmount}
              placeholder={toAmount === "" ? "0" : ""}
            />
            <SelectPairButton
              onClick={() => {
                selectToken("to");
                onSelectTokenModal();
              }}
            >
              <img src={to.tokenLogo} alt="token logo" className="token-logo" />
              <span className="token-symbol">{to.symbol}</span>
              <IconStrokeArrowDown className="arrow-icon" />
            </SelectPairButton>
          </div>
          <div className="amount-info">
            <span className="price-text">{to.price}</span>
            <span className="balance-text">Balance : {to.balance}</span>
          </div>
        </div>
        <SwapCardContentDetail
          to={to}
          from={from}
          swapInfo={swapInfo}
          showSwapInfo={showSwapInfo}
          autoRouter={autoRouter}
          showAutoRouter={showAutoRouter}
          swapGasInfo={swapGasInfo}
          autoRouterInfo={autoRouterInfo}
          breakpoint={breakpoint}
        />
      </ContentWrapper>
    </>
  );
};

export default SwapCardContent;
