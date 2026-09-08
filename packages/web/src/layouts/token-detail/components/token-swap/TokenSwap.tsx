import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "@emotion/css";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconSettings from "@components/common/icons/IconSettings";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import SwapCardContentDetail from "@components/swap/swap-card-content-detail/SwapCardContentDetail";
import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";

import { CopyTooltip, wrapper } from "./TokenSwap.styles";
import IconWallet from "@components/common/icons/IconWallet";
import { useTokenBalancesDisplay } from "@hooks/token/ui/use-token-balance-display";
import PriceWarning from "@components/common/price-warning/PriceWarning";

export interface TokenSwapProps {
  isSwitchNetwork: boolean;
  connectedWallet: boolean;
  copied: boolean;
  themeKey: "dark" | "light";
  isLoading: boolean;
  isLoadingGasInfo: boolean;
  swapButtonText: string;
  isAvailSwap: boolean;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  swapTokenInfo: SwapTokenInfo;
  isRefetching: boolean;

  swapNow: () => void;
  handleSetting: () => void;
  handleCopied: () => void;
  connectWallet: () => void;
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  switchSwapDirection: () => void;
  switchNetwork: () => void;
  setSwapRateAction: (type: SwapRateAction) => void;
  priceImpactStatus: PriceImpactStatus;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  connectedWallet,
  connectWallet,
  swapNow,
  copied,
  handleCopied,
  themeKey,
  handleSetting,
  switchNetwork,
  isSwitchNetwork,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  switchSwapDirection,
  isLoading,
  isLoadingGasInfo,
  swapButtonText,
  isAvailSwap,
  swapSummaryInfo,
  swapRouteInfos,
  setSwapRateAction,
  priceImpactStatus,
  swapTokenInfo,
  isRefetching,
}) => {
  const { t } = useTranslation();
  const tokenA = swapTokenInfo.tokenA?.token ?? null;
  const tokenB = swapTokenInfo.tokenB?.token ?? null;
  const direction = swapSummaryInfo?.swapDirection;

  const { tokenA: balanceADisplay, tokenB: balanceBDisplay } = useTokenBalancesDisplay(
    swapTokenInfo.tokenA?.balance ?? "-",
    swapTokenInfo.tokenB?.balance ?? "-",
    connectedWallet,
  );

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
    if (connectedWallet && swapTokenInfo.tokenA) {
      const formatValue = parseFloat(swapTokenInfo.tokenA.balance.replace(/,/g, "")).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connectedWallet, swapTokenInfo]);

  const hasTokenABalance = useMemo(() => {
    const side = swapTokenInfo.tokenA;
    return !!side && side.balance !== "-" && side.balance !== "0";
  }, [swapTokenInfo.tokenA]);

  const isShowInfoSection = useMemo(() => {
    return (!!Number(swapTokenInfo.tokenA?.amount) && !!Number(swapTokenInfo.tokenB?.amount)) || isLoading;
  }, [swapTokenInfo, isLoading]);

  const isLoadingTokenA = useMemo((): boolean => {
    return (isLoading && direction !== "EXACT_IN") || (isRefetching && direction === "EXACT_OUT");
  }, [isLoading, direction, isRefetching]);

  const isLoadingTokenB = useMemo((): boolean => {
    return (isLoading || isRefetching) && direction === "EXACT_IN";
  }, [isLoading, direction, isRefetching]);

  const { priceStyle: tokenAPriceStyle, shouldShowPriceWarning: tokenAShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: swapTokenInfo.tokenA?.priceGrade ?? TOKEN_PRICE_GRADE_TYPE.NONE,
  });

  const { priceStyle: tokenBPriceStyle, shouldShowPriceWarning: tokenBShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: swapTokenInfo.tokenB?.priceGrade ?? TOKEN_PRICE_GRADE_TYPE.NONE,
  });

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">{t("common:action.swap")}</span>
        <div className="header-button">
          <button className="setting-button link-button" onClick={handleCopied}>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className={`box ${themeKey}-shadow`}>
                  <span>{t("common:swapUrlCopied")}</span>
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
              className={cx("amount-text", {
                "text-opacity": isLoadingTokenA,
              })}
              aria-busy={isLoadingTokenA}
              value={swapTokenInfo.tokenA?.amount ?? ""}
              onChange={onChangeTokenAAmount}
              placeholder="0"
              autoComplete={"off"}
              spellCheck={"false"}
              inputMode={"decimal"}
            />
            <div className="token">
              <SelectPairButton token={tokenA} changeToken={changeTokenA} />
            </div>
          </div>
          <div className="info">
            <span
              className={cx("price-text", tokenAPriceStyle.className, { "text-opacity": isLoadingTokenA })}
              aria-busy={isLoadingTokenA}
            >
              {swapTokenInfo.tokenA?.usdStr ?? "-"}
              {tokenAShouldShowPriceWarning && swapTokenInfo.tokenA?.amount && <PriceWarning type="PRICE" />}
            </span>
            <div className="balance-wrapper">
              {connectedWallet && <IconWallet />}
              <span className={`balance-text ${tokenA && connectedWallet && "balance-text-disabled"}`}>
                {balanceADisplay}
              </span>
              {hasTokenABalance && (
                <button className="balance-max-button" onClick={handleAutoFillTokenA}>
                  {t("common:max")}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className={cx("amount-text", { "text-opacity": isLoadingTokenB })}
              aria-busy={isLoadingTokenB}
              value={swapTokenInfo.tokenB?.amount ?? ""}
              onChange={onChangeTokenBAmount}
              placeholder="0"
              autoComplete={"off"}
              spellCheck={"false"}
              inputMode={"decimal"}
            />
            <div className="token">
              <SelectPairButton token={tokenB} changeToken={changeTokenB} />
            </div>
          </div>
          <div className="info">
            <span
              className={cx("price-text", tokenBPriceStyle.className, { "text-opacity": isLoadingTokenB })}
              aria-busy={isLoadingTokenB}
            >
              {swapTokenInfo.tokenB?.usdStr ?? "-"}
              {tokenBShouldShowPriceWarning && swapTokenInfo.tokenB?.amount && <PriceWarning type="PRICE" />}
            </span>
            <div className="balance-wrapper">
              {connectedWallet && <IconWallet />}
              <span className={`balance-text ${tokenB && connectedWallet && "balance-text-disabled"}`}>
                {balanceBDisplay}
              </span>
            </div>
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
          isLoadingGasInfo={isLoadingGasInfo}
          setSwapRateAction={setSwapRateAction}
          priceImpactStatus={priceImpactStatus}
          swapTokenInfo={swapTokenInfo}
          connectedWallet={connectedWallet}
        />
      )}
      <div className="footer">
        <SwapButton
          isSwitchNetwork={isSwitchNetwork}
          connectedWallet={connectedWallet}
          isAvailSwap={isAvailSwap}
          openConfirmModal={swapNow}
          openConnectWallet={connectWallet}
          text={swapButtonText}
          isLoading={isLoading || isRefetching}
          switchNetwork={switchNetwork}
        />
      </div>
    </div>
  );
};

interface SwapButtonProps {
  connectedWallet: boolean;
  isAvailSwap: boolean;
  text: string;
  isSwitchNetwork: boolean;
  isLoading: boolean;

  openConfirmModal: () => void;
  openConnectWallet: () => void;
  switchNetwork: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  connectedWallet,
  isAvailSwap,
  text,
  openConfirmModal,
  openConnectWallet,
  isSwitchNetwork,
  switchNetwork,
  isLoading,
}) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  if (!connectedWallet) {
    return (
      <Button
        text={text}
        style={defaultStyle}
        onClick={openConnectWallet}
        className={`confirm-button button-swap ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      />
    );
  }

  if (isSwitchNetwork) {
    return (
      <Button
        text={text}
        style={defaultStyle}
        onClick={switchNetwork}
        className={`confirm-button button-swap ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      />
    );
  }

  if (!isAvailSwap) {
    return (
      <Button
        text={text}
        disabled={isLoading}
        className={"confirm-button"}
        style={{
          ...defaultStyle,
          hierarchy: ButtonHierarchy.Gray,
        }}
      />
    );
  }

  return (
    <Button
      text={text}
      style={defaultStyle}
      onClick={openConfirmModal}
      className={`confirm-button button-swap ${isLoading ? "loading" : ""}`}
      disabled={isLoading}
    />
  );
};

export default TokenSwap;
