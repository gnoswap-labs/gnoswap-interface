import React, { useCallback, useMemo } from "react";
import { CopyTooltip, wrapper } from "./TokenSwap.styles";
import IconSettings from "@components/common/icons/IconSettings";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import { TokenModel } from "@models/token/token-model";
import { DataTokenInfo } from "@models/token/token-swap-model";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import SwapCardContentDetail from "@components/swap/swap-card-content-detail/SwapCardContentDetail";

export interface TokenSwapProps {
  isSwitchNetwork: boolean;
  connected: boolean;
  copied: boolean;
  themeKey: "dark" | "light";
  dataTokenInfo: DataTokenInfo;
  isLoading: boolean;
  swapButtonText: string;
  isAvailSwap: boolean;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];

  swapNow: () => void;
  handleSetting: () => void;
  handleCopied: () => void;
  connectWallet: () => void;
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string) => void;
  switchSwapDirection: () => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  connected,
  connectWallet,
  swapNow,
  copied,
  handleCopied,
  themeKey,
  handleSetting,
  isSwitchNetwork,
  dataTokenInfo,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  switchSwapDirection,
  isLoading,
  swapButtonText,
  isAvailSwap,
  swapSummaryInfo,
  swapRouteInfos,
}) => {
  const tokenA = dataTokenInfo.tokenA;
  const tokenB = dataTokenInfo.tokenB;

  const onChangeTokenAAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      changeTokenAAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenAAmount],
  );

  const onChangeTokenBAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      changeTokenBAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenBAmount],
  );

  const handleAutoFillTokenA = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(dataTokenInfo.tokenABalance.replace(/,/g, "")).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connected, dataTokenInfo]);

  const handleAutoFillTokenB = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(dataTokenInfo.tokenBBalance.replace(/,/g, "")).toString();
      changeTokenBAmount(formatValue);
    }
  }, [changeTokenBAmount, connected, dataTokenInfo]);

  const onClickConfirm = useCallback(() => {
    if (!connected || isSwitchNetwork) {
      connectWallet();
      return;
    }
    swapNow();
  }, [connected, connectWallet, swapNow, isSwitchNetwork]);
  
  const isShowInfoSection = useMemo(() => {
    return (!!Number(dataTokenInfo.tokenAAmount) && !!Number(dataTokenInfo.tokenBAmount)) || isLoading;
  }, [dataTokenInfo, isLoading]);

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">Swap</span>
        <div className="header-button">
          <button className="setting-button link-button" onClick={handleCopied}>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className={`box ${themeKey}-shadow`}>
                  <span>URL Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </button>
          <button className="setting-button" onClick={handleSetting}>
            <IconSettings className="setting-icon" />
          </button>
        </div>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <input
              className="amount-text"
              value={dataTokenInfo.tokenAAmount}
              onChange={onChangeTokenAAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton token={tokenA} changeToken={changeTokenA}/>
            </div>
          </div>
          <div className="info">
            <span className="price-text">{dataTokenInfo.tokenAUSDStr}</span>
            <span className={`balance-text ${tokenA && connected && "balance-text-disabled"}`} onClick={handleAutoFillTokenA}>
              Balance: {connected ? dataTokenInfo.tokenABalance : "-"}
            </span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className="amount-text"
              value={dataTokenInfo.tokenBAmount}
              onChange={onChangeTokenBAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton token={tokenB} changeToken={changeTokenB}/>
            </div>
          </div>
          <div className="info">
            <span className="price-text">{dataTokenInfo.tokenBUSDStr}</span>
            <span className={`balance-text ${tokenB && connected && "balance-text-disabled"}`} onClick={handleAutoFillTokenB}>
              Balance: {connected ? dataTokenInfo.tokenBBalance : "-"}
            </span>
          </div>
        </div>
        <div className="arrow" onClick={switchSwapDirection}>
          <div className="shape">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>
      {swapSummaryInfo && isShowInfoSection && (
        <SwapCardContentDetail
          swapSummaryInfo={swapSummaryInfo}
          swapRouteInfos={swapRouteInfos}
          isLoading={isLoading}
        />
      )}
      <div className="footer">
        <Button
          text={swapButtonText}
          style={{
            fullWidth: true,
            height: 57,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          disabled={!isAvailSwap}
          onClick={onClickConfirm}
        />
      </div>
    </div>
  );
};

export default TokenSwap;
