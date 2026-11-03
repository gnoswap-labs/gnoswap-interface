import { cx } from "@emotion/css";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { isAmount } from "@common/utils/data-check-util";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconWallet from "@components/common/icons/IconWallet";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { OrderSelectOption } from "@components/order/order-select-box/OrderSelectBox";
import { OrderButtonState } from "@hooks/order/data/use-order-handler.utils";
import { useTokenBalanceDisplay } from "@hooks/token/ui/use-token-balance-display";
import { SwapCardType } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";

import OrderCardSkeleton from "../order-form/OrderCardSkeleton";
import { OrderFieldRow } from "../order-form/OrderForm.styles";
import OrderFormButton from "../order-form/OrderFormButton";
import OrderSellInput from "../order-form/OrderSellInput";
import { SwapCardWrapper } from "../swap-card/SwapCard.styles";
import { ContentWrapper } from "../swap-card/swap-card-content/SwapCardContent.styles";
import SwapCardHeader from "../swap-card/swap-card-header/SwapCardHeader";
import LimitExpirySelect from "./limit-expiry-select/LimitExpirySelect";
import LimitPriceInput from "./limit-price-input/LimitPriceInput";

export interface LimitOrderCardProps {
  swapType: SwapCardType;
  changeSwapType: (type: SwapCardType) => void;
  copied: boolean;
  copyURL: () => void;
  slippage: number;
  changeSlippage: (value: number) => void;
  themeKey: "dark" | "light";
  isLoading: boolean;

  connectedWallet: boolean;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenABalance: string;
  tokenBBalance: string;
  sellAmount: string;
  sellAmountUsd: string;
  buyAmount: string;
  buyAmountUsd: string;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  changeSellAmount: (value: string) => void;
  changeBuyAmount: (value: string) => void;
  switchTokens: () => void;

  limitPrice: string;
  marketPrice: string | null;
  changeLimitPrice: (value: string) => void;
  stepPrice: (direction: 1 | -1) => void;
  applyPreset: (percent: number) => void;
  expiry: number;
  expiryOptions: OrderSelectOption<number>[];
  changeExpiry: (duration: number) => void;

  buttonState: OrderButtonState;
  buttonText: string;
  onClickButton: () => void;
}

const LEADING_ZERO_REGEX = /^0+(?=\d)|(\.\d*)$/g;

const LimitOrderCard: React.FC<LimitOrderCardProps> = ({
  swapType,
  changeSwapType,
  copied,
  copyURL,
  slippage,
  changeSlippage,
  themeKey,
  isLoading,
  connectedWallet,
  tokenA,
  tokenB,
  tokenABalance,
  tokenBBalance,
  sellAmount,
  sellAmountUsd,
  buyAmount,
  buyAmountUsd,
  changeTokenA,
  changeTokenB,
  changeSellAmount,
  changeBuyAmount,
  switchTokens,
  limitPrice,
  marketPrice,
  changeLimitPrice,
  stepPrice,
  applyPreset,
  expiry,
  expiryOptions,
  changeExpiry,
  buttonState,
  buttonText,
  onClickButton,
}) => {
  const { t } = useTranslation();
  const [buyFocused, setBuyFocused] = useState(false);
  const buyBalanceDisplay = useTokenBalanceDisplay(tokenBBalance, connectedWallet);

  const onChangeBuyAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      if (tokenB && (value.split(".")[1]?.length ?? 0) > tokenB.decimals) return;
      changeBuyAmount(value.replace(LEADING_ZERO_REGEX, "$1"));
    },
    [changeBuyAmount, tokenB],
  );

  return (
    <SwapCardWrapper>
      <SwapCardHeader
        copied={copied}
        copyURL={copyURL}
        slippage={slippage}
        changeSlippage={changeSlippage}
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
            changeAmount={changeSellAmount}
          >
            <div className="arrow">
              <div className="shape" onClick={switchTokens} role="button" aria-label="Switch tokens">
                <IconSwapArrowDown className="shape-icon" />
              </div>
            </div>
          </OrderSellInput>
          <div className={cx("second-section", { "is-focused": buyFocused })}>
            <div className="amount-container">
              <input
                className="amount-text"
                value={buyAmount}
                onChange={onChangeBuyAmount}
                onFocus={() => setBuyFocused(true)}
                onBlur={() => setBuyFocused(false)}
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
              </div>
            </div>
          </div>
          <OrderFieldRow>
            <LimitPriceInput
              value={limitPrice}
              marketPrice={marketPrice}
              changeValue={changeLimitPrice}
              stepPrice={stepPrice}
              applyPreset={applyPreset}
            />
            <LimitExpirySelect expiry={expiry} options={expiryOptions} changeExpiry={changeExpiry} />
          </OrderFieldRow>
        </ContentWrapper>
      )}
      <OrderFormButton
        state={buttonState}
        text={buttonText}
        minTradingText={t("Swap:limit.minTrading")}
        onClick={onClickButton}
      />
    </SwapCardWrapper>
  );
};

export default LimitOrderCard;
