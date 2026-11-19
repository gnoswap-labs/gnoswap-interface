import BigNumber from "bignumber.js";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { MaxNativeAmountParams, useMaxNativeAmount } from "@hooks/gas";
import { OrderButtonState } from "@hooks/order/data/use-order-handler.utils";
import { DcaIntervalUnit } from "@models/order/dca-order-model";
import { SwapCardType } from "@models/order/order-type";
import { DcaOrderSummary } from "@models/order/order-summary";
import { isNativeToken, TokenModel } from "@models/token/token-model";

import OrderCardSkeleton from "../order-form/OrderCardSkeleton";
import { OrderFieldRow, OrderToBuySection } from "../order-form/OrderForm.styles";
import OrderFormButton from "../order-form/OrderFormButton";
import OrderSellInput from "../order-form/OrderSellInput";
import { SwapCardWrapper } from "../swap-card/SwapCard.styles";
import { ContentWrapper } from "../swap-card/swap-card-content/SwapCardContent.styles";
import SwapCardHeader from "../swap-card/swap-card-header/SwapCardHeader";
import DcaCountInput from "./dca-count-input/DcaCountInput";
import DcaIntervalSelect from "./dca-interval-select/DcaIntervalSelect";
import DcaOrderDetail from "./dca-order-detail/DcaOrderDetail";

export interface DcaOrderCardProps {
  swapType: SwapCardType;
  changeSwapType: (type: SwapCardType) => void;
  copied: boolean;
  copyURL: () => void;
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
  /** The order terms the Max estimate is priced for (pair, interval, count, slot). */
  maxAmountDependsOn?: readonly unknown[];
  /** False until the schedule of the current request is loaded; Max on GNOT waits for it. */
  isMaxAmountReady?: boolean;
  sellAmount: string;
  sellAmountUsd: string;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  changeSellAmount: (value: string) => void;
  switchTokens: () => void;

  interval: number;
  intervalOptions: { unit: DcaIntervalUnit; interval: number }[];
  changeInterval: (interval: number) => void;
  executionCountInput: string;
  maxExecutionCount: number;
  changeExecutionCount: (value: string) => void;
  commitExecutionCount: () => void;

  summary: DcaOrderSummary | null;
  buttonState: OrderButtonState;
  buttonText: string;
  /** Shown under an `Amount Too Low` button: the realm's minimum order. */
  minTradingText: string;
  onClickButton: () => void;
}

const DcaOrderCard: React.FC<DcaOrderCardProps> = ({
  swapType,
  changeSwapType,
  copied,
  copyURL,
  themeKey,
  isLoading,
  connectedWallet,
  tokenA,
  tokenB,
  tokenABalance,
  makeMaxAmountMessages,
  maxAmountDependsOn = [],
  isMaxAmountReady = true,
  sellAmount,
  sellAmountUsd,
  changeTokenA,
  changeTokenB,
  changeSellAmount,
  switchTokens,
  interval,
  intervalOptions,
  changeInterval,
  executionCountInput,
  maxExecutionCount,
  changeExecutionCount,
  commitExecutionCount,
  summary,
  buttonState,
  buttonText,
  minTradingText,
  onClickButton,
}) => {
  const { t } = useTranslation();
  const showDetail = !!summary && !!tokenA && !!tokenB && BigNumber(sellAmount || 0).isGreaterThan(0);

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
  // Max on GNOT prices the order's slot, so it waits for the schedule; other tokens need no estimate.
  const waitsForMaxTerms = !isMaxAmountReady && !!tokenA && isNativeToken(tokenA);

  const fillMaxAmount = useCallback(async () => {
    if (waitsForMaxTerms) return;
    const spendable = await getMaxAmount({ balance: tokenABalance, makeMessages: makeMaxAmountMessages });
    if (spendable !== null) changeSellAmount(spendable);
  }, [changeSellAmount, getMaxAmount, makeMaxAmountMessages, tokenABalance, waitsForMaxTerms]);

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
            maxAmountReady={!waitsForMaxTerms}
          >
            <div className="arrow">
              <div className="shape" onClick={switchTokens} role="button" aria-label="Switch tokens">
                <IconSwapArrowDown className="shape-icon" />
              </div>
            </div>
          </OrderSellInput>
          <OrderToBuySection className="second-section">
            <div className="amount-container">
              <span className="buy-label">{t("Swap:dca.toBuy")}</span>
              <div className="token-selector">
                <SelectPairButton token={tokenB} changeToken={changeTokenB} />
              </div>
            </div>
          </OrderToBuySection>
          <OrderFieldRow>
            <DcaIntervalSelect interval={interval} options={intervalOptions} changeInterval={changeInterval} />
            <DcaCountInput
              value={executionCountInput}
              maxExecutionCount={maxExecutionCount}
              changeValue={changeExecutionCount}
              commitValue={commitExecutionCount}
            />
          </OrderFieldRow>
          {showDetail && summary && <DcaOrderDetail summary={summary} />}
        </ContentWrapper>
      )}
      <OrderFormButton
        state={buttonState}
        text={buttonText}
        minTradingText={minTradingText}
        onClick={onClickButton}
        onClickMax={fillMaxAmount}
        loadingMaxAmount={loadingMaxAmount}
        maxAmountReady={!waitsForMaxTerms}
        maxAmountFailed={maxAmountFailed}
      />
    </SwapCardWrapper>
  );
};

export default DcaOrderCard;
