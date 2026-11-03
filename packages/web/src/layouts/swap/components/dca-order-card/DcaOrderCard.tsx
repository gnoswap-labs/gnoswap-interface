import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";

import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { OrderButtonState } from "@hooks/order/data/use-order-handler.utils";
import { DcaIntervalUnit } from "@models/order/dca-order-model";
import { SwapCardType } from "@models/order/order-type";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";

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
  slippage: number;
  changeSlippage: (value: number) => void;
  themeKey: "dark" | "light";
  isLoading: boolean;

  connectedWallet: boolean;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenABalance: string;
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
  onClickButton: () => void;
}

const DcaOrderCard: React.FC<DcaOrderCardProps> = ({
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
  onClickButton,
}) => {
  const { t } = useTranslation();
  const showDetail = !!summary && !!tokenA && !!tokenB && BigNumber(sellAmount || 0).isGreaterThan(0);

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
          <OrderToBuySection className="second-section">
            <div className="amount-container">
              <span className="amount-text">{t("Swap:dca.toBuy")}</span>
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
        minTradingText={t("Swap:dca.minTrading")}
        onClick={onClickButton}
      />
    </SwapCardWrapper>
  );
};

export default DcaOrderCard;
