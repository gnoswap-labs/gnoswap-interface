import React, { useCallback } from "react";

import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconWallet from "@components/common/icons/IconWallet";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { OrderSelectOption } from "@components/order/order-select-box/OrderSelectBox";
import { MaxNativeAmountParams, useMaxNativeAmount } from "@hooks/gas";
import { OrderButtonState } from "@hooks/order/data/use-order-handler.utils";
import { useTokenBalanceDisplay } from "@hooks/token/ui/use-token-balance-display";
import { SwapCardType } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";

import OrderCardSkeleton from "../order-form/OrderCardSkeleton";
import OrderFormButton from "../order-form/OrderFormButton";
import OrderSellInput from "../order-form/OrderSellInput";
import { SwapCardWrapper } from "../swap-card/SwapCard.styles";
import { ContentWrapper } from "../swap-card/swap-card-content/SwapCardContent.styles";
import SwapCardHeader from "../swap-card/swap-card-header/SwapCardHeader";
import LimitExpirySelect from "./limit-expiry-select/LimitExpirySelect";
import LimitPriceInput from "./limit-price-input/LimitPriceInput";
import LimitPriceWarning from "./limit-price-input/LimitPriceWarning";

export interface LimitOrderCardProps {
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
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  changeSellAmount: (value: string) => void;
  switchTokens: () => void;

  limitPrice: string;
  limitPriceUsd: string;
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
  changeTokenA,
  changeTokenB,
  changeSellAmount,
  switchTokens,
  limitPrice,
  limitPriceUsd,
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
  const buyBalanceDisplay = useTokenBalanceDisplay(tokenBBalance, connectedWallet);

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
          <OrderSellInput
            token={tokenA}
            amount={sellAmount}
            amountUsd={sellAmountUsd}
            balance={tokenABalance}
            connectedWallet={connectedWallet}
            changeToken={changeTokenA}
            changeAmount={typeSellAmount}
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
          <div className="second-section">
            <div className="amount-container">
              <input
                className="amount-text"
                value={buyAmount}
                readOnly
                placeholder="0"
                autoComplete="off"
                spellCheck="false"
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
              </div>
            </div>
          </div>
          <LimitPriceInput
            inputSymbol={tokenA?.displaySymbol ?? "-"}
            inputLogoURI={tokenA?.logoURI}
            outputSymbol={tokenB?.displaySymbol ?? "-"}
            value={limitPrice}
            valueUsd={limitPriceUsd}
            marketPrice={marketPrice}
            selectedPreset={selectedPreset}
            changeValue={changeLimitPrice}
            stepPrice={stepPrice}
            applyPreset={applyPreset}
          />
          <LimitPriceWarning value={limitPrice} marketPrice={marketPrice} />
          <LimitExpirySelect expiry={expiry} options={expiryOptions} changeExpiry={changeExpiry} />
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
