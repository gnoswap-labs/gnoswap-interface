import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

import { isAmount } from "@common/utils/data-check-util";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconWallet from "@components/common/icons/IconWallet";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import SelectTab from "@components/common/select-tab/SelectTab";
import { ValueAnnotation } from "@components/order/common/OrderValueAnnotation.styles";
import { OrderInfoRow } from "@components/order/order-info-rows/OrderInfoRows";
import { OrderSelectOption } from "@components/order/order-select-box/OrderSelectBox";
import { MaxNativeAmountParams, useMaxNativeAmount } from "@hooks/gas";
import { OrderButtonState } from "@hooks/order/data/use-order-handler.utils";
import { useOrderClock } from "@hooks/order/ui/use-order-clock";
import { useTokenBalanceDisplay } from "@hooks/token/ui/use-token-balance-display";
import { LimitOrderSide, SwapCardType } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";
import { formatOrderDateTime, formatOrderFullAmount, formatOrderRelativeDuration } from "@utils/order-format-utils";

import OrderCardSkeleton from "../order-form/OrderCardSkeleton";
import OrderFormButton from "../order-form/OrderFormButton";
import OrderSellInput from "../order-form/OrderSellInput";
import { SwapCardWrapper } from "../swap-card/SwapCard.styles";
import { ContentWrapper } from "../swap-card/swap-card-content/SwapCardContent.styles";
import SwapCardHeader from "../swap-card/swap-card-header/SwapCardHeader";
import LimitExpirySelect from "./limit-expiry-select/LimitExpirySelect";
import { LimitOrderInfoRows, LimitOrderSideSelect } from "./LimitOrderCard.styles";
import LimitPriceInput from "./limit-price-input/LimitPriceInput";
import LimitPriceWarning from "./limit-price-input/LimitPriceWarning";

const LEADING_ZERO_REGEX = /^0+(?=\d)|(\.\d*)$/g;

export interface LimitOrderCardProps {
  orderSide: LimitOrderSide;
  changeOrderSide: (side: LimitOrderSide) => void;
  swapType: SwapCardType;
  changeSwapType: (type: SwapCardType) => void;
  copied: boolean;
  copyURL: () => void;
  /** The effective tolerance (percent), already capped to the Limit realm maximum. */
  slippage: number;
  changeSlippage: (value: number) => void;
  /** The Limit realm's maximum tolerance (percent). */
  maxSlippage: number;
  themeKey: "dark" | "light";
  isLoading: boolean;

  connectedWallet: boolean;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenABalance: string;
  /**
   * Builds the order's messages for a candidate raw amount, so Max on GNOT
   * reserves the order's storage and measured cost, not only the flat fee.
   */
  makeMaxAmountMessages?: MaxNativeAmountParams["makeMessages"];
  /** The order terms the Max estimate is priced for (pair, price, expiry, slippage). */
  maxAmountDependsOn?: readonly unknown[];
  tokenBBalance: string;
  sellAmount: string;
  sellAmountUsd: string;
  buyAmount: string;
  buyAmountUsd: string;
  minimumReceived: string;
  executionFee: string;
  executionFeeAmount: string | null;
  executionFeeUsd: string | null;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  /** Funding budget: Sell typing, the funding Max and legacy links. */
  changeSellAmount: (value: string) => void;
  /** The purchased quantity typed in Buy; the funding amount is derived from it. */
  changeBuyAmount: (value: string) => void;
  switchTokens: () => void;

  limitPrice: string;
  marketPrice: string | null;
  selectedPreset: number | null;
  changeLimitPrice: (value: string) => void;
  stepPrice: (direction: 1 | -1) => void;
  applyPreset: (percent: number) => void;
  expiry: number;
  expiryOptions: OrderSelectOption<number>[];
  changeExpiry: (duration: number) => void;

  buttonState: OrderButtonState;
  buttonText: string;
  /** Shown under an `Amount Too Low` button: the realm's minimum order. */
  minTradingText: string;
  onClickButton: () => void;
}

const LimitOrderCard: React.FC<LimitOrderCardProps> = ({
  orderSide,
  changeOrderSide,
  swapType,
  changeSwapType,
  copied,
  copyURL,
  slippage,
  changeSlippage,
  maxSlippage,
  themeKey,
  isLoading,
  connectedWallet,
  tokenA,
  tokenB,
  tokenABalance,
  makeMaxAmountMessages,
  maxAmountDependsOn = [],
  tokenBBalance,
  sellAmount,
  sellAmountUsd,
  buyAmount,
  buyAmountUsd,
  minimumReceived,
  executionFee,
  executionFeeAmount,
  executionFeeUsd,
  changeTokenA,
  changeTokenB,
  changeSellAmount,
  changeBuyAmount,
  switchTokens,
  limitPrice,
  marketPrice,
  selectedPreset,
  changeLimitPrice,
  stepPrice,
  applyPreset,
  expiry,
  expiryOptions,
  changeExpiry,
  buttonState,
  buttonText,
  minTradingText,
  onClickButton,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const nowUnixSeconds = useOrderClock();
  const expiresIn = formatOrderRelativeDuration(expiry, locale);
  const buyBalanceDisplay = useTokenBalanceDisplay(tokenBBalance, connectedWallet);
  const baseToken = orderSide === "buy" ? tokenB : tokenA;
  const quoteToken = orderSide === "buy" ? tokenA : tokenB;
  const sellAmountInputRef = useRef<HTMLInputElement>(null);
  const buyAmountInputRef = useRef<HTMLInputElement>(null);
  const [buyAmountFocused, setBuyAmountFocused] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      (orderSide === "buy" ? buyAmountInputRef : sellAmountInputRef).current?.focus({ preventScroll: true });
    }
  }, [isLoading, orderSide]);
  const infoRows: OrderInfoRow[] = useMemo(
    () => [
      { key: "slippage", label: t("Swap:swapInfo.slippageSet"), value: `${slippage}%` },
      {
        key: "minimumReceived",
        label: t("Swap:swapInfo.minReceived"),
        tooltip: t("Swap:limit.minimumReceivedTooltip"),
        value: minimumReceived && tokenB ? `${minimumReceived} ${tokenB.displaySymbol}` : "-",
      },
      {
        key: "executionFee",
        label: `${t("Swap:dca.executionFee")} (${executionFee})`,
        tooltip: t("Swap:limit.executionFeeTooltip"),
        value:
          executionFeeAmount !== null && tokenB ? (
            <span>
              {formatOrderFullAmount(executionFeeAmount, tokenB.decimals)} {tokenB.displaySymbol}
              {executionFeeUsd && " "}
              {executionFeeUsd && <ValueAnnotation>({executionFeeUsd})</ValueAnnotation>}
            </span>
          ) : (
            "-"
          ),
      },
      {
        key: "expiresAt",
        label: t("Swap:order.expiresAt"),
        value: (
          <span>
            {formatOrderDateTime(nowUnixSeconds + expiry)}{" "}
            {expiresIn && <ValueAnnotation>({expiresIn})</ValueAnnotation>}
          </span>
        ),
      },
    ],
    [
      executionFee,
      executionFeeAmount,
      executionFeeUsd,
      expiresIn,
      expiry,
      minimumReceived,
      nowUnixSeconds,
      slippage,
      t,
      tokenB,
    ],
  );

  // Max is worked out here rather than in the sell field, so the order button
  // waits on, and retries, the same estimate as the field's own Max.
  const {
    getMaxAmount,
    loading: loadingMaxAmount,
    pendingBalance,
    failed: maxAmountFailed,
    resetError: resetMaxAmountError,
  } = useMaxNativeAmount({
    token: tokenA,
    amount: sellAmount,
    // The order terms decide what the transaction costs, and the balance is what
    // the answer was subtracted from; an answer for others is not written back.
    dependsOn: [...maxAmountDependsOn, tokenABalance],
  });

  const fillMaxAmount = useCallback(async () => {
    const spendable = await getMaxAmount({ balance: tokenABalance, makeMessages: makeMaxAmountMessages });
    if (spendable !== null) changeSellAmount(spendable);
  }, [changeSellAmount, getMaxAmount, makeMaxAmountMessages, tokenABalance]);

  // A typed amount replaces whatever Max was doing: a failure it offered to retry, or an answer still out.
  const typeSellAmount = useCallback(
    (value: string) => {
      resetMaxAmountError();
      changeSellAmount(value);
    },
    [changeSellAmount, resetMaxAmountError],
  );

  // Buy: the purchased quantity is typed here, and the funding amount above follows from it.
  const typeBuyAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      if (tokenB && (value.split(".")[1]?.length ?? 0) > tokenB.decimals) return;
      resetMaxAmountError();
      changeBuyAmount(value.replace(LEADING_ZERO_REGEX, "$1"));
    },
    [changeBuyAmount, resetMaxAmountError, tokenB],
  );

  return (
    <SwapCardWrapper>
      <SwapCardHeader
        copied={copied}
        copyURL={copyURL}
        slippage={slippage}
        changeSlippage={changeSlippage}
        maxSlippage={maxSlippage}
        themeKey={themeKey}
        swapType={swapType}
        changeSwapType={changeSwapType}
      />
      {isLoading ? (
        <OrderCardSkeleton />
      ) : (
        <ContentWrapper>
          <LimitOrderSideSelect role="group" aria-label="Order side">
            <SelectTab
              selectType={orderSide}
              list={[
                {
                  key: "sell",
                  display: t("Swap:limit.sellAtTarget", { defaultValue: "Sell at target" }),
                },
                {
                  key: "buy",
                  display: t("Swap:limit.buyTheDip", { defaultValue: "Buy the dip" }),
                },
              ]}
              onClick={side => {
                if (side === "sell" || side === "buy") changeOrderSide(side);
              }}
            />
          </LimitOrderSideSelect>
          <OrderSellInput
            inputRef={sellAmountInputRef}
            token={tokenA}
            amount={sellAmount}
            amountUsd={sellAmountUsd}
            balance={tokenABalance}
            connectedWallet={connectedWallet}
            changeToken={changeTokenA}
            changeAmount={typeSellAmount}
            readOnly={orderSide === "buy"}
            showMaxButton={orderSide !== "buy"}
            onClickMax={fillMaxAmount}
            loadingMaxAmount={loadingMaxAmount}
            pendingBalance={pendingBalance}
          >
            <div className="arrow">
              <div className="shape" onClick={switchTokens} role="button" aria-label="Switch tokens">
                <IconSwapArrowDown className="shape-icon" />
              </div>
            </div>
          </OrderSellInput>
          <div className={`second-section${orderSide === "buy" && buyAmountFocused ? " is-focused" : ""}`}>
            <div className="amount-container">
              <input
                ref={buyAmountInputRef}
                className="amount-text"
                value={buyAmount}
                onChange={orderSide === "buy" ? typeBuyAmount : undefined}
                readOnly={orderSide !== "buy"}
                tabIndex={orderSide === "buy" ? undefined : -1}
                onFocus={() => setBuyAmountFocused(true)}
                onBlur={() => setBuyAmountFocused(false)}
                placeholder="0"
                autoComplete="off"
                spellCheck="false"
                inputMode="decimal"
              />
              <div className="token-selector">
                <SelectPairButton token={tokenB} changeToken={changeTokenB} />
              </div>
            </div>
            <div className="amount-info">
              <span className="price-text">{buyAmountUsd}</span>
              <div className="balance-wrapper">
                {connectedWallet && <IconWallet />}
                <span className="balance-text">{buyBalanceDisplay}</span>
                {orderSide === "buy" &&
                  connectedWallet &&
                  BigNumber(tokenABalance.replace(/,/g, "")).isGreaterThan(0) && (
                    <button className="balance-max-button" onClick={fillMaxAmount} disabled={loadingMaxAmount}>
                      <span className="max-badge">{t("common:max")}</span>
                    </button>
                  )}
              </div>
            </div>
          </div>
          <LimitPriceInput
            orderSide={orderSide}
            inputSymbol={baseToken?.displaySymbol ?? "-"}
            inputLogoURI={baseToken?.logoURI}
            outputSymbol={quoteToken?.displaySymbol ?? "-"}
            value={limitPrice}
            marketPrice={marketPrice}
            selectedPreset={selectedPreset}
            changeValue={changeLimitPrice}
            stepPrice={stepPrice}
            applyPreset={applyPreset}
          />
          <LimitPriceWarning orderSide={orderSide} value={limitPrice} marketPrice={marketPrice} />
          <LimitExpirySelect expiry={expiry} options={expiryOptions} changeExpiry={changeExpiry} />
          <LimitOrderInfoRows rows={infoRows} />
        </ContentWrapper>
      )}
      <OrderFormButton
        state={buttonState}
        text={buttonText}
        minTradingText={minTradingText}
        onClick={onClickButton}
        onClickMax={fillMaxAmount}
        loadingMaxAmount={loadingMaxAmount}
        maxAmountFailed={maxAmountFailed}
      />
    </SwapCardWrapper>
  );
};

export default LimitOrderCard;
